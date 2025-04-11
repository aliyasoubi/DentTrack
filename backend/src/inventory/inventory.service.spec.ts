import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { getModelToken } from '@nestjs/mongoose';
import { Inventory, InventoryModel } from './schemas/inventory.schema';
import { CreateInventoryDto } from './dto/create-inventory.dto';

describe('InventoryService', () => {
  let service: InventoryService;
  let inventoryModel: InventoryModel;

  const mockInventory = {
    _id: '507f1f77bcf86cd799439011',
    itemId: 'IMP-018',
    category: 'Implant & Abutment Components',
    subCategory: 'Abutments',
    brand: 'Nobel Biocare',
    model: 'Multi-unit Abutment',
    quantity: 10,
    unitPrice: 150,
    storageLocation: 'Cabinet A-1',
    description: 'Titanium multi-unit abutment for implant restoration',
    productionDate: '2024-01-01',
    expiryDate: '2025-01-10',
    supplier: 'Nobel Biocare',
    reorderLevel: 5,
    barcode: '123456789012',
    notes: 'Standard size',
    createdAt: new Date('2025-04-11T21:16:41.741Z'),
    updatedAt: new Date('2025-04-11T21:16:41.741Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
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

    service = module.get<InventoryService>(InventoryService);
    inventoryModel = module.get<InventoryModel>(getModelToken(Inventory.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new inventory item', async () => {
      const createDto: CreateInventoryDto = {
        itemId: 'IMP-018',
        category: 'Implant & Abutment Components',
        subCategory: 'Abutments',
        brand: 'Nobel Biocare',
        model: 'Multi-unit Abutment',
        quantity: 10,
        unitPrice: 150,
        storageLocation: 'Cabinet A-1',
      };

      const result = await service.create(createDto);
      expect(result).toEqual(mockInventory);
      expect(inventoryModel.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findOne', () => {
    it('should return an inventory item', async () => {
      const result = await service.findOne('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockInventory);
      expect(inventoryModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('update', () => {
    it('should update an inventory item', async () => {
      const updateDto = { quantity: 15 };
      const result = await service.update('507f1f77bcf86cd799439011', updateDto);
      expect(result).toEqual(mockInventory);
      expect(inventoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateDto,
        { new: true },
      );
    });
  });

  describe('remove', () => {
    it('should remove an inventory item', async () => {
      await service.remove('507f1f77bcf86cd799439011');
      expect(inventoryModel.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('findLowStock', () => {
    it('should return items with low stock', async () => {
      const result = await service.findLowStock(5);
      expect(result).toEqual([mockInventory]);
      expect(inventoryModel.findLowStock).toHaveBeenCalledWith(5);
    });
  });
}); 