import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inventory, InventoryModel } from './schemas/inventory.schema';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name) private inventoryModel: InventoryModel,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    try {
      return await this.inventoryModel.create(createInventoryDto);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Item ID already exists');
      }
      throw error;
    }
  }

  async findAll(filters: any = {}): Promise<Inventory[]> {
    return this.inventoryModel.find(filters);
  }

  async findOne(id: string): Promise<Inventory> {
    const inventory = await this.inventoryModel.findById(id);
    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
    return inventory;
  }

  async update(id: string, updateInventoryDto: Partial<CreateInventoryDto>): Promise<Inventory> {
    const updatedInventory = await this.inventoryModel
      .findByIdAndUpdate(id, updateInventoryDto, { new: true });
    if (!updatedInventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
    return updatedInventory;
  }

  async remove(id: string): Promise<void> {
    const result = await this.inventoryModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
  }

  async findLowStock(threshold?: number): Promise<Inventory[]> {
    return this.inventoryModel.findLowStock(threshold);
  }

  async updateQuantity(id: string, quantity: number): Promise<Inventory> {
    if (quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    const updatedInventory = await this.inventoryModel.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );
    
    if (!updatedInventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
    
    return updatedInventory;
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
    });
  }
} 