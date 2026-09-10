const mongoose = require('mongoose');

const TYPES = ['low_stock', 'out_of_stock', 'expiry', 'sales', 'system'];
const SEVERITIES = ['info', 'warning', 'critical'];

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: TYPES,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      enum: SEVERITIES,
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedMedicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      default: null,
    },
    relatedSale: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sale',
      default: null,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

notificationSchema.index({ isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
module.exports.TYPES = TYPES;
