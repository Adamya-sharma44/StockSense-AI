const mongoose = require('mongoose');

const salesHistorySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true
    },
    quantitySold: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const inventoryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    currentStock: {
      type: Number,
      required: true,
      min: 0
    },
    reorderLevel: {
      type: Number,
      required: true,
      min: 0
    },
    reorderQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    salesHistory: [salesHistorySchema],
    lastRestockedAt: Date,
    notes: String
  },
  { timestamps: true }
);

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

module.exports = InventoryItem;

