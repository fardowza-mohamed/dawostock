const path = require('path');
const Settings = require('../models/Settings');
const { asyncHandler } = require('../utils/asyncHandler');

const get = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton();
  res.json({ success: true, data: settings });
});

const getPublic = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton();
  res.json({
    success: true,
    data: {
      pharmacyName: settings.pharmacyName,
      logo: settings.logo,
      address: settings.address,
      city: settings.city,
      phone: settings.phone,
      whatsappNumber: settings.whatsappNumber,
      emergencyPhone: settings.emergencyPhone,
      email: settings.email,
      currency: settings.currency,
      currencySymbol: settings.currencySymbol,
      receiptFooter: settings.receiptFooter,
    },
  });
});

const update = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton();
  const fields = [
    'pharmacyName', 'address', 'city', 'phone', 'whatsappNumber', 'emergencyPhone', 'email',
    'taxRate', 'currency', 'currencySymbol', 'lowStockThreshold',
    'expiryAlertDays', 'receiptFooter',
  ];
  fields.forEach((k) => {
    if (req.body[k] !== undefined) settings[k] = req.body[k];
  });
  if (settings.currency === 'SOS' && !req.body.currencySymbol) settings.currencySymbol = 'Ssh';
  if (settings.currency === 'USD' && !req.body.currencySymbol) settings.currencySymbol = '$';
  await settings.save();
  res.json({ success: true, data: settings });
});

const uploadLogo = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton();
  if (req.file) {
    settings.logo = `/uploads/logos/${path.basename(req.file.filename)}`;
    await settings.save();
  }
  res.json({ success: true, data: settings });
});

module.exports = { get, getPublic, update, uploadLogo };
