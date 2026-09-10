const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema(
  {
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    sale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sale',
      required: true,
    },
    customerName: { type: String, required: true },
    customerPhone: { type: String, default: '' },
    medicines: [invoiceItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    pharmacyName: { type: String, default: '' },
    pharmacyAddress: { type: String, default: '' },
    pharmacyPhone: { type: String, default: '' },
    currency: { type: String, default: 'USD' },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

invoiceSchema.index({ sale: 1 });
invoiceSchema.index({ date: -1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
