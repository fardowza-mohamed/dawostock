const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema(
  {
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true,
    },
    name: { type: String, required: true },
    batchNumber: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      trim: true,
      default: 'Walk-in Customer',
    },
    customerPhone: {
      type: String,
      trim: true,
      default: '',
    },
    items: {
      type: [saleItemSchema],
      validate: [(v) => v.length > 0, 'At least one medicine is required'],
    },
    subtotal: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'evc_plus', 'zaad', 'sahal', 'bank_transfer'],
      default: 'cash',
    },
    amountPaid: { type: Number, default: 0, min: 0 },
    change: { type: Number, default: 0, min: 0 },
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
    },
    notes: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['completed', 'voided'],
      default: 'completed',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

saleSchema.index({ date: -1 });
saleSchema.index({ customerPhone: 1 });
saleSchema.index({ customerName: 1 });
saleSchema.index({ soldBy: 1 });
saleSchema.index({ paymentMethod: 1 });

module.exports = mongoose.model('Sale', saleSchema);
