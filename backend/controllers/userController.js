const User = require('../models/User');
const { getPagination, paginate } = require('../utils/pagination');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');

const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    filter.$or = [
      { name: new RegExp(req.query.search, 'i') },
      { email: new RegExp(req.query.search, 'i') },
    ];
  }
  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  res.json({
    success: true,
    data: items.map((u) => u.toSafeObject()),
    pagination: paginate(total, page, limit),
  });
});

const create = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: req.body.email?.toLowerCase() });
  if (exists) throw new AppError('Email is already registered.', 409);
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || 'staff',
    phone: req.body.phone || '',
  });
  res.status(201).json({ success: true, data: user.toSafeObject() });
});

const update = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('+password');
  if (!user) throw new AppError('User not found.', 404);
  if (req.body.name) user.name = req.body.name;
  if (req.body.phone !== undefined) user.phone = req.body.phone;
  if (req.body.role) user.role = req.body.role;
  if (req.body.isActive !== undefined) user.isActive = req.body.isActive;
  if (req.body.password) user.password = req.body.password;
  await user.save();
  res.json({ success: true, data: user.toSafeObject() });
});

const remove = asyncHandler(async (req, res) => {
  if (String(req.user._id) === req.params.id) {
    throw new AppError('You cannot delete your own account.', 400);
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new AppError('User not found.', 404);
  res.json({ success: true, message: 'User deleted.' });
});

module.exports = { list, create, update, remove };
