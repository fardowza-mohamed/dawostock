const Medicine = require('../models/Medicine');
const Sale = require('../models/Sale');
const Notification = require('../models/Notification');
const { asyncHandler } = require('../utils/asyncHandler');

const startOfDay = (d = new Date()) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const startOfMonth = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), 1);

const getDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 86400000);

  const [
    totalMedicines,
    lowStock,
    outOfStock,
    expiringSoon,
    expired,
    dailyAgg,
    monthlyAgg,
    recentSales,
    unread,
    revenueByDay,
  ] = await Promise.all([
    Medicine.countDocuments(),
    Medicine.countDocuments({ $expr: { $and: [{ $gt: ['$quantity', 0] }, { $lte: ['$quantity', '$minStockLevel'] }] } }),
    Medicine.countDocuments({ quantity: { $lte: 0 } }),
    Medicine.countDocuments({ expiryDate: { $gte: now, $lte: in30 } }),
    Medicine.countDocuments({ expiryDate: { $lt: now } }),
    Sale.aggregate([
      { $match: { date: { $gte: startOfDay() }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
    ]),
    Sale.aggregate([
      { $match: { date: { $gte: startOfMonth() }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
    ]),
    Sale.find({ status: 'completed' }).populate('soldBy', 'name').sort({ date: -1 }).limit(8),
    Notification.countDocuments({ isRead: false }),
    Sale.aggregate([
      {
        $match: {
          status: 'completed',
          date: { $gte: new Date(now.getTime() - 13 * 86400000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const paymentBreakdown = await Sale.aggregate([
    { $match: { date: { $gte: startOfMonth() }, status: 'completed' } },
    { $group: { _id: '$paymentMethod', value: { $sum: '$totalAmount' } } },
  ]);

  res.json({
    success: true,
    data: {
      totals: {
        medicines: totalMedicines,
        lowStock,
        outOfStock,
        expiringSoon,
        expired,
        unreadNotifications: unread,
      },
      sales: {
        daily: dailyAgg[0] || { total: 0, count: 0 },
        monthly: monthlyAgg[0] || { total: 0, count: 0 },
      },
      recentSales,
      charts: {
        revenueByDay,
        paymentBreakdown,
      },
    },
  });
});

module.exports = { getDashboard };
