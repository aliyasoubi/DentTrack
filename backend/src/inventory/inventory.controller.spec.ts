import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Inventory } from './schemas/inventory.schema';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mockInventory, mockCreateInventoryDto, mockUpdateInventoryDto } from './tests/setup';

describe('InventoryController', () => {
  let controller: InventoryController;
  let service: InventoryService;

  const mockService = {
    create: jest.fn().mockResolvedValue(mockInventory),
    findAll: jest.fn().mockResolvedValue([mockInventory]),
    findOne: jest.fn().mockResolvedValue(mockInventory),
    update: jest.fn().mockResolvedValue(mockInventory),
    remove: jest.fn().mockResolvedValue(undefined),
    findLowStock: jest.fn().mockResolvedValue([mockInventory]),
    updateQuantity: jest.fn().mockResolvedValue(mockInventory),
    findExpiringItems: jest.fn().mockResolvedValue([mockInventory]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: InventoryService,
          useValue: mockService,
        },
        {
          provide: getModelToken(Inventory.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockInventory),
            findById: jest.fn().mockResolvedValue(mockInventory),
            findByIdAndUpdate: jest.fn().mockResolvedValue(mockInventory),
            findByIdAndDelete: jest.fn().mockResolvedValue(mockInventory),
            find: jest.fn().mockResolvedValue([mockInventory]),
            findLowStock: jest.fn().mockResolvedValue([mockInventory]),
          },
        },
      ],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
    service = module.get<InventoryService>(InventoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new inventory item', async () => {
      const result = await controller.create(mockCreateInventoryDto);
      expect(result).toEqual(mockInventory);
      expect(mockService.create).toHaveBeenCalledWith(mockCreateInventoryDto);
    });

    it('should handle validation errors', async () => {
      const invalidDto = {
        ...mockCreateInventoryDto,
        quantity: -1,
      };

      mockService.create.mockRejectedValueOnce(new BadRequestException('Validation failed'));

      await expect(controller.create(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should handle duplicate itemId', async () => {
      mockService.create.mockRejectedValueOnce(new BadRequestException('Item ID already exists'));

      await expect(controller.create(mockCreateInventoryDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all inventory items', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockInventory]);
      expect(mockService.findAll).toHaveBeenCalledWith({});
    });

    it('should apply filters when provided', async () => {
      const filters = {
        category: 'Implant & Abutment Components',
        brand: 'Nobel Biocare',
      };

      await controller.findAll(
        filters.category,
        undefined,
        filters.brand,
      );

      expect(mockService.findAll).toHaveBeenCalledWith({
        category: filters.category,
        brand: filters.brand,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single inventory item', async () => {
      const result = await controller.findOne(mockInventory._id);
      expect(result).toEqual(mockInventory);
      expect(mockService.findOne).toHaveBeenCalledWith(mockInventory._id);
    });

    it('should throw NotFoundException when item not found', async () => {
      mockService.findOne.mockRejectedValueOnce(new NotFoundException());

      await expect(controller.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an inventory item', async () => {
      const result = await controller.update(mockInventory._id, mockUpdateInventoryDto);
      expect(result).toEqual(mockInventory);
      expect(mockService.update).toHaveBeenCalledWith(mockInventory._id, mockUpdateInventoryDto);
    });

    it('should throw NotFoundException when item not found', async () => {
      mockService.update.mockRejectedValueOnce(new NotFoundException());

      await expect(controller.update('nonexistent-id', mockUpdateInventoryDto))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an inventory item', async () => {
      await controller.remove(mockInventory._id);
      expect(mockService.remove).toHaveBeenCalledWith(mockInventory._id);
    });

    it('should throw NotFoundException when item not found', async () => {
      mockService.remove.mockRejectedValueOnce(new NotFoundException());

      await expect(controller.remove('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findLowStock', () => {
    it('should return items with low stock', async () => {
      const result = await controller.findLowStock();
      expect(result).toEqual([mockInventory]);
      expect(mockService.findLowStock).toHaveBeenCalled();
    });

    it('should use custom threshold when provided', async () => {
      const threshold = 15;
      await controller.findLowStock(threshold);
      expect(mockService.findLowStock).toHaveBeenCalledWith(threshold);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', async () => {
      const newQuantity = 20;
      const result = await controller.updateQuantity(mockInventory._id, newQuantity);
      expect(result).toEqual(mockInventory);
      expect(mockService.updateQuantity).toHaveBeenCalledWith(mockInventory._id, newQuantity);
    });

    it('should throw NotFoundException when item not found', async () => {
      mockService.updateQuantity.mockRejectedValueOnce(new NotFoundException());

      await expect(controller.updateQuantity('nonexistent-id', 20))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for negative quantity', async () => {
      mockService.updateQuantity.mockRejectedValueOnce(
        new BadRequestException('Quantity cannot be negative')
      );

      await expect(controller.updateQuantity(mockInventory._id, -1))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('findExpiringItems', () => {
    it('should return items expiring soon', async () => {
      const result = await controller.findExpiringItems();
      expect(result).toEqual([mockInventory]);
      expect(mockService.findExpiringItems).toHaveBeenCalled();
    });

    it('should use custom days threshold when provided', async () => {
      const days = 60;
      await controller.findExpiringItems(days);
      expect(mockService.findExpiringItems).toHaveBeenCalledWith(days);
    });
  });
}); 