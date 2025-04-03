const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['IMPLANT', 'ABUTMENT', 'COMPOSITE', 'LAMINATE'],
    required: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  productionDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  // Optional fields based on category
  size: {
    type: String,
    required: function() {
      return this.category === 'IMPLANT';
    }
  },
  specificParameters: {
    d: String,
    g: String,
    h: String,
    required: function() {
      return this.category === 'ABUTMENT';
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
inventorySchema.index({ category: 1 });
inventorySchema.index({ brand: 1 });
inventorySchema.index({ expiryDate: 1 });

// Validation middleware
inventorySchema.pre('save', function(next) {
  if (this.expiryDate < this.productionDate) {
    next(new Error('Expiry date cannot be before production date'));
  }
  next();
});

// Instance methods
inventorySchema.methods.isLowStock = function() {
  return this.quantity <= 5; // Customize threshold as needed
};

// Static methods
inventorySchema.statics.findLowStock = function() {
  return this.find({ quantity: { $lte: 5 } });
};

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory; 