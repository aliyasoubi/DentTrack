import { Model } from 'mongoose';
import { Inventory } from '../schemas/inventory.schema';

export const mockInventory = {
  _id: '507f1f77bcf86cd799439011',
  itemId: 'IMP-001',
  category: 'Implant & Abutment Components',
  subCategory: 'Abutments',
  brand: 'Nobel Biocare',
  model: 'Multi-unit Abutment',
  quantity: 10,
  unitPrice: 150.00,
  storageLocation: 'Shelf A1',
  description: 'Multi-unit abutment for Nobel Biocare implants',
  productionDate: '2023-01-01',
  expiryDate: '2025-01-01',
  supplier: 'Nobel Biocare',
  reorderLevel: 5,
  barcode: '123456789012',
  notes: 'For use with Nobel Biocare implants only',
};

export const mockCreateInventoryDto = {
  itemId: 'IMP-001',
  category: 'Implant & Abutment Components',
  subCategory: 'Abutments',
  brand: 'Nobel Biocare',
  model: 'Multi-unit Abutment',
  quantity: 10,
  unitPrice: 150.00,
  storageLocation: 'Shelf A1',
  description: 'Multi-unit abutment for Nobel Biocare implants',
  productionDate: '2023-01-01',
  expiryDate: '2025-01-01',
  supplier: 'Nobel Biocare',
  reorderLevel: 5,
  barcode: '123456789012',
  notes: 'For use with Nobel Biocare implants only',
};

export const mockUpdateInventoryDto = {
  quantity: 15,
  storageLocation: 'Shelf A2',
};

interface InventoryModel extends Model<Inventory> {
  findLowStock(threshold?: number): Promise<Inventory[]>;
}

export const mockInventoryModel = {
  create: jest.fn().mockResolvedValue(mockInventory),
  findById: jest.fn().mockResolvedValue(mockInventory),
  findByIdAndUpdate: jest.fn().mockResolvedValue(mockInventory),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockInventory),
  find: jest.fn().mockResolvedValue([mockInventory]),
  findLowStock: jest.fn().mockResolvedValue([mockInventory]),
} as unknown as InventoryModel; 