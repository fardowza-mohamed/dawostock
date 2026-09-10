const mongoose = require('mongoose');

const LOG_TYPES = ['in', 'out', 'transfer', 'adjustment', 'sale', 'return'];

const inventoryLogSchema = new mongoose.Schema(
  {
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true,
    },
    type: {
      type: String,
      enum: LOG_TYPES,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    previousQuantity: {
      type: Number,
      required: true,
    },
    newQuantity: {
      type: Number,
      required: true,
    },
    fromLocation: {
      type: String,
      trim: true,
      default: '',
    },
    toLocation: {
      type: String,
      trim: true,
      default: '',
    },
    reason: {
      type: String,
      trim: true,
      default: '',
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

inventoryLogSchema.index({ medicine: 1, createdAt: -1 });
inventoryLogSchema.index({ type: 1, createdAt: -1 });
inventoryLogSchema.index({ performedBy: 1 });

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);
module.exports.LOG_TYPES = LOG_TYPES;
