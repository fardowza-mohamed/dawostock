const { body } = require('express-validator');
const Medicine = require('../models/Medicine');
const { getPagination, paginate } = require('../utils/pagination');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');
const { sendCsv } = require('../utils/export');

const medicineValidators = [
  body('name').trim().notEmpty().withMessage('Medicine name is required'),
  body('genericName').trim().notEmpty().withMessage('Generic name is required'),
  body('batchNumber').trim().notEmpty().withMessage('Batch number is required'),
  body('supplier').notEmpty().withMessage('Supplier is required'),
  body('purchasePrice').isFloat({ min: 0 }).withMessage('Purchase price must be >= 0'),
  body('sellingPrice').isFloat({ min: 0 }).withMessage('Selling price must be >= 0'),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be >= 0'),
  body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
  body('manufacturingDate').isISO8601().withMessage('Valid manufacturing date is required'),
];

const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const {
    search,
    category,
    status,
    supplier,
    stock,
    expiry,
  } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (supplier) filter.supplier = supplier;

  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { genericName: new RegExp(search, 'i') },
      { brandName: new RegExp(search, 'i') },
      { barcode: new RegExp(search, 'i') },
      { batchNumber: new RegExp(search, 'i') },
    ];
  }

  if (stock === 'low') {
    filter.$expr = { $lte: ['$quantity', '$minStockLevel'] };
    filter.quantity = { $gt: 0 };
  } else if (stock === 'out') {
    filter.quantity = { $lte: 0 };
  }

  const now = new Date();
  if (expiry === 'expired') {
    filter.expiryDate = { $lt: now };
  } else if (expiry === '30' || expiry === '60' || expiry === '90') {
    const until = new Date(now.getTime() + Number(expiry) * 86400000);
    filter.expiryDate = { $gte: now, $lte: until };
  }

  const [items, total] = await Promise.all([
    Medicine.find(filter)
      .populate('supplier', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Medicine.countDocuments(filter),
  ]);

  res.json({ success: true, data: items, pagination: paginate(total, page, limit) });
});

const getOne = asyncHandler(async (req, res) => {
  const item = await Medicine.findById(req.params.id).populate('supplier', 'name phone email');
  if (!item) throw new AppError('Medicine not found.', 404);
  res.json({ success: true, data: item });
});

const create = asyncHandler(async (req, res) => {
  const item = await Medicine.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data: item });
});

const update = asyncHandler(async (req, res) => {
  const item = await Medicine.findById(req.params.id);
  if (!item) throw new AppError('Medicine not found.', 404);
  const allowed = [
    'name', 'genericName', 'brandName', 'category', 'batchNumber', 'supplier',
    'purchasePrice', 'sellingPrice', 'quantity', 'minStockLevel', 'unit',
    'expiryDate', 'manufacturingDate', 'barcode', 'description', 'location', 'status',
  ];
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) item[k] = req.body[k];
  });
  await item.save();
  res.json({ success: true, data: item });
});

const remove = asyncHandler(async (req, res) => {
  const item = await Medicine.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError('Medicine not found.', 404);
  res.json({ success: true, message: 'Medicine deleted.' });
});

const exportCsv = asyncHandler(async (req, res) => {
  const items = await Medicine.find().populate('supplier', 'name').lean();
  sendCsv(
    res,
    'medicines.csv',
    ['name', 'genericName', 'brandName', 'category', 'batchNumber', 'supplier', 'quantity', 'purchasePrice', 'sellingPrice', 'expiryDate', 'barcode', 'status'],
    items.map((m) => ({
      name: m.name,
      genericName: m.genericName,
      brandName: m.brandName,
      category: m.category,
      batchNumber: m.batchNumber,
      supplier: m.supplier?.name || '',
      quantity: m.quantity,
      purchasePrice: m.purchasePrice,
      sellingPrice: m.sellingPrice,
      expiryDate: m.expiryDate ? new Date(m.expiryDate).toISOString().slice(0, 10) : '',
      barcode: m.barcode,
      status: m.status,
    }))
  );
});

module.exports = { list, getOne, create, update, remove, exportCsv, medicineValidators };
