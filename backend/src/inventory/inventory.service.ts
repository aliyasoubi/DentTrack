import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory } from './schemas/inventory.schema';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    const createdInventory = new this.inventoryModel(createInventoryDto);
    return createdInventory.save();
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryModel.find().exec();
  }

  async findOne(id: string): Promise<Inventory> {
    const inventory = await this.inventoryModel.findById(id).exec();
    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
    return inventory;
  }

  async update(id: string, updateInventoryDto: Partial<CreateInventoryDto>): Promise<Inventory> {
    const updatedInventory = await this.inventoryModel
      .findByIdAndUpdate(id, updateInventoryDto, { new: true })
      .exec();
    if (!updatedInventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
    return updatedInventory;
  }

  async remove(id: string): Promise<void> {
    const result = await this.inventoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
  }

  async findLowStock(threshold: number = 10): Promise<Inventory[]> {
    return this.inventoryModel.findLowStock(threshold);
  }

  async updateQuantity(id: string, quantity: number): Promise<Inventory> {
    const inventory = await this.findOne(id);
    inventory.quantity = quantity;
    return inventory.save();
  }

  async findExpiringItems(daysThreshold: number = 30): Promise<Inventory[]> {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);
    
    return this.inventoryModel.find({
      expiryDate: {
        $gte: today,
        $lte: thresholdDate
      }
    }).exec();
  }
} 