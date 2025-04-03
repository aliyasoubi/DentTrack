import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ required: true, unique: true })
  itemId: string;

  @Prop({ 
    required: true, 
    enum: [
      'Implant & Abutment Components',
      'Consumables & Disposables',
      'Impression & Matrix Materials',
      'Local Anesthetics & Pharmaceuticals',
      'Restorative Materials & Bonding Agents',
      'Endodontic & Irrigation Supplies',
      'Etching, Polishing & Bleaching Agents',
      'Surgical & Sterilization Supplies',
      'Dental Instruments & Accessories',
      'Cleaning, Disinfection & Maintenance Supplies',
      'Office & Miscellaneous Supplies'
    ] 
  })
  category: string;

  @Prop({ required: true })
  subCategory: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  model: string;

  @Prop()
  description: string;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  unitPrice: number;

  @Prop()
  productionDate?: Date;

  @Prop()
  expiryDate?: Date;

  @Prop()
  supplier?: string;

  @Prop()
  storageLocation?: string;

  @Prop({ min: 0 })
  reorderLevel?: number;

  @Prop()
  barcode?: string;

  @Prop()
  notes?: string;

  // Virtual property to check if stock is low
  isLowStock(): boolean {
    if (this.reorderLevel) {
      return this.quantity <= this.reorderLevel;
    }
    return false;
  }

  // Virtual property to check if item is expiring soon
  isExpiringSoon(daysThreshold: number = 30): boolean {
    if (this.expiryDate) {
      const today = new Date();
      const thresholdDate = new Date();
      thresholdDate.setDate(today.getDate() + daysThreshold);
      return this.expiryDate <= thresholdDate && this.expiryDate >= today;
    }
    return false;
  }
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

// Add index for faster queries
InventorySchema.index({ category: 1 });
InventorySchema.index({ subCategory: 1 });
InventorySchema.index({ brand: 1 });
InventorySchema.index({ itemId: 1 }, { unique: true });
InventorySchema.index({ barcode: 1 });

// Add static method to find low stock items
InventorySchema.statics.findLowStock = function(threshold?: number) {
  if (threshold) {
    return this.find({ quantity: { $lte: threshold } });
  }
  return this.find({ 
    $expr: { 
      $lte: ['$quantity', '$reorderLevel'] 
    } 
  });
};

// Add virtual property for days until expiry
InventorySchema.virtual('daysUntilExpiry').get(function() {
  if (this.expiryDate) {
    const today = new Date();
    const diffTime = this.expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return null;
}); 