const InventoryLog = require('../models/InventoryLog');
const { applyStockChange } = require('../services/stockService');
const { getPagination, paginate } = require('../utils/pagination');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');

const stockIn = asyncHandler(async (req, res) => {
  const result = await applyStockChange({
    medicineId: req.body.medicine,
    type: 'in',
    quantity: req.body.quantity,
    userId: req.user._id,
    reason: req.body.reason || 'Stock in',
    notes: req.body.notes || '',
    toLocation: req.body.location || '',
  });
  res.status(201).json({ success: true, data: result });
});

const stockOut = asyncHandler(async (req, res) => {
  const result = await applyStockChange({
    medicineId: req.body.medicine,
    type: 'out',
    quantity: req.body.quantity,
    userId: req.user._id,
    reason: req.body.reason || 'Stock out',
    notes: req.body.notes || '',
  });
  res.status(201).json({ success: true, data: result });
});

const transfer = asyncHandler(async (req, res) => {
  if (!req.body.toLocation) throw new AppError('Destination location is required.', 400);
  const result = await applyStockChange({
    medicineId: req.body.medicine,
    type: 'transfer',
    quantity: req.body.quantity || 1,
    userId: req.user._id,
    fromLocation: req.body.fromLocation || '',
    toLocation: req.body.toLocation,
    reason: req.body.reason || 'Transfer',
    notes: req.body.notes || '',
  });
  res.status(201).json({ success: true, data: result });
});

const history = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.medicine) filter.medicine = req.query.medicine;
  if (req.query.type) filter.type = req.query.type;

  const [items, total] = await Promise.all([
    InventoryLog.find(filter)
      .populate('medicine', 'name batchNumber')
      .populate('performedBy', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    InventoryLog.countDocuments(filter),
  ]);
  res.json({ success: true, data: items, pagination: paginate(total, page, limit) });
});

module.exports = { stockIn, stockOut, transfer, history };
