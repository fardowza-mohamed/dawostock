const mongoose = require('mongoose');

const CATEGORIES = [
  'Analgesic',
  'Antibiotic',
  'Antimalarial',
  'Antiviral',
  'Antifungal',
  'Cardiovascular',
  'Diabetes',
  'Gastrointestinal',
  'Respiratory',
  'Vitamin & Supplement',
  'Dermatology',
  'Pediatric',
  'ORS & Electrolyte',
  'Vaccine',
  'Other',
];

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true,
      maxlength: 200,
    },
    genericName: {
      type: String,
      required: [true, 'Generic name is required'],
      trim: true,
    },
    brandName: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: 'Other',
    },
    batchNumber: {
      type: String,
      required: [true, 'Batch number is required'],
      trim: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: [true, 'Supplier is required'],
    },
    purchasePrice: {
      type: Number,
      required: [true, 'Purchase price is required'],
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    minStockLevel: {
      type: Number,
      default: 10,
      min: 0,
    },
    unit: {
      type: String,
      default: 'unit',
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    manufacturingDate: {
      type: Date,
      required: [true, 'Manufacturing date is required'],
    },
    barcode: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 2000,
    },
    location: {
      type: String,
      trim: true,
      default: 'Main Store',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired', 'out_of_stock'],
      default: 'active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

medicineSchema.index({ name: 'text', genericName: 'text', brandName: 'text', barcode: 'text' });
medicineSchema.index({ expiryDate: 1 });
medicineSchema.index({ quantity: 1 });
medicineSchema.index({ category: 1 });
medicineSchema.index({ supplier: 1 });
medicineSchema.index({ barcode: 1 });
medicineSchema.index({ batchNumber: 1 });

medicineSchema.virtual('stockStatus').get(function stockStatus() {
  if (this.quantity <= 0) return 'out_of_stock';
  if (this.expiryDate && this.expiryDate < new Date()) return 'expired';
  if (this.quantity <= this.minStockLevel) return 'low_stock';
  return 'in_stock';
});

medicineSchema.virtual('daysToExpiry').get(function daysToExpiry() {
  if (!this.expiryDate) return null;
  const diff = this.expiryDate.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

medicineSchema.set('toJSON', { virtuals: true });
medicineSchema.set('toObject', { virtuals: true });

/** Keep status in sync with quantity and expiry before save. */
medicineSchema.pre('save', function syncStatus(next) {
  if (this.expiryDate && this.expiryDate < new Date()) {
    this.status = 'expired';
  } else if (this.quantity <= 0) {
    this.status = 'out_of_stock';
  } else if (this.status === 'expired' || this.status === 'out_of_stock') {
    this.status = 'active';
  }
  next();
});

module.exports = mongoose.model('Medicine', medicineSchema);
module.exports.CATEGORIES = CATEGORIES;
