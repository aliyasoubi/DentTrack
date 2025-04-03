import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true })
export class SpecificParameters {
  @Prop({ required: true })
  d: string;

  @Prop({ required: true })
  g: string;

  @Prop({ required: true })
  h: string;
}

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ 
    required: true, 
    enum: ['IMPLANT', 'ABUTMENT', 'COMPOSITE', 'LAMINATE'],
    index: true 
  })
  category: string;

  @Prop({ required: true, trim: true, index: true })
  brand: string;

  @Prop({ required: true, trim: true })
  model: string;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop({ required: true, type: Date })
  productionDate: Date;

  @Prop({ required: true, type: Date, index: true })
  expiryDate: Date;

  @Prop({ 
    required: function() { return this.category === 'IMPLANT'; },
    type: String 
  })
  size?: string;

  @Prop({ 
    type: SpecificParameters,
    required: function() { return this.category === 'ABUTMENT'; }
  })
  specificParameters?: SpecificParameters;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

// Indexes
InventorySchema.index({ category: 1 });
InventorySchema.index({ brand: 1 });
InventorySchema.index({ expiryDate: 1 });

// Pre-save middleware
InventorySchema.pre('save', function(next) {
  if (this.expiryDate < this.productionDate) {
    next(new Error('Expiry date cannot be before production date'));
  }
  next();
});

// Instance methods
InventorySchema.methods.isLowStock = function() {
  return this.quantity <= 5;
};

// Static methods
InventorySchema.statics.findLowStock = function() {
  return this.find({ quantity: { $lte: 5 } });
};

// Virtual for age (days until expiry)
InventorySchema.virtual('daysUntilExpiry').get(function() {
  const today = new Date();
  const diffTime = this.expiryDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}); 