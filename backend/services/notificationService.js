const Notification = require('../models/Notification');
const Medicine = require('../models/Medicine');
const Settings = require('../models/Settings');

const createNotification = async (payload) => {
  // Avoid flooding: skip duplicate unread alerts for the same medicine + type in 12h
  if (payload.relatedMedicine && payload.type) {
    const since = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const existing = await Notification.findOne({
      type: payload.type,
      relatedMedicine: payload.relatedMedicine,
      isRead: false,
      createdAt: { $gte: since },
    });
    if (existing) return existing;
  }
  return Notification.create(payload);
};

/**
 * Scan inventory for expiry windows (30 / 60 / 90 days) and expired lots.
 */
const scanExpiryAlerts = async () => {
  const settings = await Settings.getSingleton();
  const windows = settings.expiryAlertDays?.length ? settings.expiryAlertDays : [30, 60, 90];
  const now = new Date();
  const medicines = await Medicine.find({
    status: { $ne: 'inactive' },
    expiryDate: { $exists: true },
  }).select('name batchNumber expiryDate quantity');

  let created = 0;
  for (const med of medicines) {
    const days = Math.ceil((med.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) {
      med.status = 'expired';
      await Medicine.updateOne({ _id: med._id }, { status: 'expired' });
      await createNotification({
        type: 'expiry',
        title: 'Medicine expired',
        message: `${med.name} (batch ${med.batchNumber}) expired ${Math.abs(days)} day(s) ago.`,
        severity: 'critical',
        relatedMedicine: med._id,
        meta: { days, window: 0 },
      });
      created += 1;
      continue;
    }
    const matched = windows.filter((w) => days <= w).sort((a, b) => a - b)[0];
    if (matched != null) {
      await createNotification({
        type: 'expiry',
        title: `Expiring within ${matched} days`,
        message: `${med.name} (batch ${med.batchNumber}) expires in ${days} day(s).`,
        severity: days <= 30 ? 'critical' : 'warning',
        relatedMedicine: med._id,
        meta: { days, window: matched },
      });
      created += 1;
    }
  }
  return created;
};

module.exports = { createNotification, scanExpiryAlerts };
