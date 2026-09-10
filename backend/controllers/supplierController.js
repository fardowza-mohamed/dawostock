const { body } = require('express-validator');
const Supplier = require('../models/Supplier');
const Medicine = require('../models/Medicine');
const { getPagination, paginate } = require('../utils/pagination');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');

const supplierValidators = [
  body('name').trim().notEmpty().withMessage('Supplier name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
];

const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.search) {
    filter.$or = [
      { name: new RegExp(req.query.search, 'i') },
      { phone: new RegExp(req.query.search, 'i') },
      { email: new RegExp(req.query.search, 'i') },
      { city: new RegExp(req.query.search, 'i') },
    ];
  }
  if (req.query.active === 'true') filter.isActive = true;
  if (req.query.active === 'false') filter.isActive = false;

  const [items, total] = await Promise.all([
    Supplier.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
    Supplier.countDocuments(filter),
  ]);
  res.json({ success: true, data: items, pagination: paginate(total, page, limit) });
});

const getOne = asyncHandler(async (req, res) => {
  const item = await Supplier.findById(req.params.id);
  if (!item) throw new AppError('Supplier not found.', 404);
  const medicines = await Medicine.find({ supplier: item._id }).select('name quantity sellingPrice');
  res.json({ success: true, data: { ...item.toObject(), medicines } });
});

const create = asyncHandler(async (req, res) => {
  const item = await Supplier.create(req.body);
  res.status(201).json({ success: true, data: item });
});

const update = asyncHandler(async (req, res) => {
  const item = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) throw new AppError('Supplier not found.', 404);
  res.json({ success: true, data: item });
});

const remove = asyncHandler(async (req, res) => {
  const inUse = await Medicine.countDocuments({ supplier: req.params.id });
  if (inUse > 0) {
    throw new AppError('Cannot delete a supplier that still has medicines. Reassign or deactivate instead.', 400);
  }
  const item = await Supplier.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError('Supplier not found.', 404);
  res.json({ success: true, message: 'Supplier deleted.' });
});

module.exports = { list, getOne, create, update, remove, supplierValidators };
