import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { InventoryService } from '../inventory.service';
import { Inventory } from '../schemas/inventory.schema';
import { NotFoundException } from '@nestjs/common';
import { mockInventory, mockInventoryModel, mockCreateInventoryDto, mockUpdateInventoryDto } from './setup';

describe('InventoryService', () => {
  let service: InventoryService;
  let model: typeof mockInventoryModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getModelToken(Inventory.name),
          useValue: mockInventoryModel,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    model = module.get<typeof mockInventoryModel>(getModelToken(Inventory.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new inventory item', async () => {
      const result = await service.create(mockCreateInventoryDto);
      expect(result).toEqual(mockInventory);
      expect(model.create).toHaveBeenCalledWith(mockCreateInventoryDto);
    });

    it('should handle validation errors', async () => {
      const invalidDto = {
        ...mockCreateInventoryDto,
        quantity: -1, // Invalid quantity
      };

      jest.spyOn(model, 'create').mockRejectedValueOnce(new Error('Validation failed'));

      await expect(service.create(invalidDto)).rejects.toThrow('Validation failed');
    });

    it('should handle duplicate itemId', async () => {
      jest.spyOn(model, 'create').mockRejectedValueOnce({
        code: 11000, // MongoDB duplicate key error code
        message: 'Duplicate key error',
      });

      await expect(service.create(mockCreateInventoryDto)).rejects.toThrow('Item ID already exists');
    });
  });

  describe('update', () => {
    it('should update an existing inventory item', async () => {
      const result = await service.update(mockInventory._id, mockUpdateInventoryDto);
      expect(result).toEqual(mockInventory);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockInventory._id,
        mockUpdateInventoryDto,
        { new: true },
      );
    });

    it('should throw NotFoundException when item not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(null);

      await expect(service.update('nonexistent-id', mockUpdateInventoryDto))
        .rejects.toThrow(NotFoundException);
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { quantity: 20 };
      await service.update(mockInventory._id, partialUpdate);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockInventory._id,
        partialUpdate,
        { new: true },
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing inventory item', async () => {
      await service.remove(mockInventory._id);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockInventory._id);
    });

    it('should throw NotFoundException when item not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValueOnce(null);

      await expect(service.remove('nonexistent-id'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should find an inventory item by id', async () => {
      const result = await service.findOne(mockInventory._id);
      expect(result).toEqual(mockInventory);
      expect(model.findById).toHaveBeenCalledWith(mockInventory._id);
    });

    it('should throw NotFoundException when item not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(null);

      await expect(service.findOne('nonexistent-id'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all inventory items', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockInventory]);
      expect(model.find).toHaveBeenCalledWith({});
    });

    it('should apply filters when provided', async () => {
      const filters = { category: 'Implant & Abutment Components' };
      await service.findAll(filters);
      expect(model.find).toHaveBeenCalledWith(filters);
    });
  });

  describe('findLowStock', () => {
    it('should find items with low stock', async () => {
      const result = await service.findLowStock();
      expect(result).toEqual([mockInventory]);
      expect(model.findLowStock).toHaveBeenCalled();
    });

    it('should use custom threshold when provided', async () => {
      const threshold = 15;
      await service.findLowStock(threshold);
      expect(model.findLowStock).toHaveBeenCalledWith(threshold);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', async () => {
      const newQuantity = 20;
      const result = await service.updateQuantity(mockInventory._id, newQuantity);
      expect(result).toEqual(mockInventory);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockInventory._id,
        { quantity: newQuantity },
        { new: true },
      );
    });

    it('should throw NotFoundException when item not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(null);

      await expect(service.updateQuantity('nonexistent-id', 20))
        .rejects.toThrow(NotFoundException);
    });

    it('should prevent negative quantities', async () => {
      const negativeQuantity = -1;
      await expect(service.updateQuantity(mockInventory._id, negativeQuantity))
        .rejects.toThrow('Quantity cannot be negative');
    });
  });
}); 