const Medicine = require('../models/Medicine');
const Sale = require('../models/Sale');
const Supplier = require('../models/Supplier');

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const endOfDay = (d) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};

const dateRange = (query) => {
  const from = query.from ? startOfDay(query.from) : startOfDay(new Date(Date.now() - 30 * 86400000));
  const to = query.to ? endOfDay(query.to) : endOfDay(new Date());
  return { from, to };
};

const inventoryReport = async () => {
  const medicines = await Medicine.find().populate('supplier', 'name phone').sort({ name: 1 }).lean({ virtuals: true });
  const now = new Date();
  return medicines.map((m) => ({
    name: m.name,
    genericName: m.genericName,
    brandName: m.brandName,
    category: m.category,
    batchNumber: m.batchNumber,
    supplier: m.supplier?.name || '',
    quantity: m.quantity,
    purchasePrice: m.purchasePrice,
    sellingPrice: m.sellingPrice,
    stockValue: Number((m.quantity * m.purchasePrice).toFixed(2)),
    expiryDate: m.expiryDate,
    status: m.quantity <= 0 ? 'out_of_stock' : m.expiryDate < now ? 'expired' : m.quantity <= (m.minStockLevel || 10) ? 'low_stock' : 'in_stock',
  }));
};

const salesReport = async (query) => {
  const { from, to } = dateRange(query);
  const sales = await Sale.find({ date: { $gte: from, $lte: to }, status: 'completed' })
    .populate('soldBy', 'name')
    .sort({ date: -1 })
    .lean();
  return sales.map((s) => ({
    invoiceNumber: s.invoiceNumber,
    customerName: s.customerName,
    items: s.items.length,
    subtotal: s.subtotal,
    tax: s.tax,
    totalAmount: s.totalAmount,
    paymentMethod: s.paymentMethod,
    soldBy: s.soldBy?.name || '',
    date: s.date,
  }));
};

const revenueReport = async (query) => {
  const { from, to } = dateRange(query);
  const match = { date: { $gte: from, $lte: to }, status: 'completed' };

  const [totals] = await Sale.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        revenue: { $sum: '$totalAmount' },
        tax: { $sum: '$tax' },
        count: { $sum: 1 },
        discount: { $sum: '$discount' },
      },
    },
  ]);

  const byDay = await Sale.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        revenue: { $sum: '$totalAmount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const byPayment = await Sale.aggregate([
    { $match: match },
    { $group: { _id: '$paymentMethod', revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
  ]);

  const topMedicines = await Sale.aggregate([
    { $match: match },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.name',
        quantity: { $sum: '$items.quantity' },
        revenue: { $sum: '$items.total' },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 },
  ]);

  return {
    from,
    to,
    revenue: totals?.revenue || 0,
    tax: totals?.tax || 0,
    count: totals?.count || 0,
    discount: totals?.discount || 0,
    byDay,
    byPayment,
    topMedicines,
  };
};

const supplierReport = async () => {
  const suppliers = await Supplier.find().lean();
  const counts = await Medicine.aggregate([
    { $group: { _id: '$supplier', medicines: { $sum: 1 }, stockValue: { $sum: { $multiply: ['$quantity', '$purchasePrice'] } } } },
  ]);
  const map = Object.fromEntries(counts.map((c) => [String(c._id), c]));
  return suppliers.map((s) => ({
    name: s.name,
    phone: s.phone,
    email: s.email,
    city: s.city,
    medicines: map[String(s._id)]?.medicines || 0,
    stockValue: Number((map[String(s._id)]?.stockValue || 0).toFixed(2)),
    isActive: s.isActive,
  }));
};

const expiryReport = async (days = 90) => {
  const now = new Date();
  const until = new Date(now.getTime() + Number(days) * 86400000);
  const medicines = await Medicine.find({
    expiryDate: { $lte: until },
  })
    .populate('supplier', 'name')
    .sort({ expiryDate: 1 })
    .lean();

  return medicines.map((m) => {
    const d = Math.ceil((new Date(m.expiryDate) - now) / 86400000);
    return {
      name: m.name,
      batchNumber: m.batchNumber,
      quantity: m.quantity,
      expiryDate: m.expiryDate,
      daysToExpiry: d,
      supplier: m.supplier?.name || '',
      status: d < 0 ? 'expired' : d <= 30 ? 'critical' : d <= 60 ? 'warning' : 'watch',
    };
  });
};

module.exports = {
  inventoryReport,
  salesReport,
  revenueReport,
  supplierReport,
  expiryReport,
  dateRange,
};
