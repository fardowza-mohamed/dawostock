const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    pharmacyName: {
      type: String,
      default: 'DawoStock Pharmacy',
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: 'Maka Al Mukarama Road, Mogadishu, Somalia',
    },
    city: {
      type: String,
      default: 'Mogadishu',
    },
    phone: {
      type: String,
      default: '+252 61 5550000',
    },
    whatsappNumber: {
      type: String,
      default: '+252 61 5550000',
    },
    emergencyPhone: {
      type: String,
      default: '+252 61 5551111',
    },
    email: {
      type: String,
      default: 'info@dawostock.so',
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    currency: {
      type: String,
      enum: ['USD', 'SOS'],
      default: 'USD',
    },
    currencySymbol: {
      type: String,
      default: '$',
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },
    expiryAlertDays: {
      type: [Number],
      default: [30, 60, 90],
    },
    receiptFooter: {
      type: String,
      default: 'Mahadsanid — Thank you for choosing DawoStock.',
    },
  },
  { timestamps: true }
);

/** Singleton helper — pharmacies typically have one settings document. */
settingsSchema.statics.getSingleton = async function getSingleton() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

module.exports = mongoose.model('Settings', settingsSchema);
