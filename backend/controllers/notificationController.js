const Notification = require('../models/Notification');
const { getPagination, paginate } = require('../utils/pagination');
const { asyncHandler } = require('../utils/asyncHandler');
const { scanExpiryAlerts } = require('../services/notificationService');

const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.unread === 'true') filter.isRead = false;
  if (req.query.type) filter.type = req.query.type;

  const [items, total, unread] = await Promise.all([
    Notification.find(filter)
      .populate('relatedMedicine', 'name batchNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ isRead: false }),
  ]);
  res.json({ success: true, data: items, unread, pagination: paginate(total, page, limit) });
});

const markRead = asyncHandler(async (req, res) => {
  const item = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  res.json({ success: true, data: item });
});

const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ isRead: false }, { isRead: true });
  res.json({ success: true, message: 'All notifications marked as read.' });
});

const scan = asyncHandler(async (req, res) => {
  const created = await scanExpiryAlerts();
  res.json({ success: true, created });
});

module.exports = { list, markRead, markAllRead, scan };
