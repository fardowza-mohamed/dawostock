const { asyncHandler } = require('../utils/asyncHandler');
const {
  inventoryReport,
  salesReport,
  revenueReport,
  supplierReport,
  expiryReport,
} = require('../services/reportService');
const { sendCsv, sendExcel, sendPdfTable } = require('../utils/export');

const format = (req) => (req.query.format || 'json').toLowerCase();

const inventory = asyncHandler(async (req, res) => {
  const data = await inventoryReport();
  const f = format(req);
  const headers = ['name', 'genericName', 'category', 'batchNumber', 'supplier', 'quantity', 'purchasePrice', 'sellingPrice', 'stockValue', 'status'];
  if (f === 'csv') return sendCsv(res, 'inventory-report.csv', headers, data);
  if (f === 'excel' || f === 'xlsx') {
    return sendExcel(res, 'inventory-report.xlsx', 'Inventory', headers.map((h) => ({ header: h, key: h, width: 18 })), data);
  }
  if (f === 'pdf') return sendPdfTable(res, 'inventory-report.pdf', 'Inventory Report', headers, data);
  res.json({ success: true, data });
});

const sales = asyncHandler(async (req, res) => {
  const data = await salesReport(req.query);
  const f = format(req);
  const headers = ['invoiceNumber', 'customerName', 'items', 'subtotal', 'tax', 'totalAmount', 'paymentMethod', 'soldBy', 'date'];
  const rows = data.map((r) => ({ ...r, date: r.date ? new Date(r.date).toISOString() : '' }));
  if (f === 'csv') return sendCsv(res, 'sales-report.csv', headers, rows);
  if (f === 'excel' || f === 'xlsx') {
    return sendExcel(res, 'sales-report.xlsx', 'Sales', headers.map((h) => ({ header: h, key: h, width: 18 })), rows);
  }
  if (f === 'pdf') return sendPdfTable(res, 'sales-report.pdf', 'Sales Report', headers, rows);
  res.json({ success: true, data });
});

const revenue = asyncHandler(async (req, res) => {
  const data = await revenueReport(req.query);
  res.json({ success: true, data });
});

const suppliers = asyncHandler(async (req, res) => {
  const data = await supplierReport();
  const f = format(req);
  const headers = ['name', 'phone', 'email', 'city', 'medicines', 'stockValue', 'isActive'];
  if (f === 'csv') return sendCsv(res, 'supplier-report.csv', headers, data);
  if (f === 'excel' || f === 'xlsx') {
    return sendExcel(res, 'supplier-report.xlsx', 'Suppliers', headers.map((h) => ({ header: h, key: h, width: 18 })), data);
  }
  if (f === 'pdf') return sendPdfTable(res, 'supplier-report.pdf', 'Supplier Report', headers, data);
  res.json({ success: true, data });
});

const expiry = asyncHandler(async (req, res) => {
  const data = await expiryReport(req.query.days || 90);
  const f = format(req);
  const headers = ['name', 'batchNumber', 'quantity', 'expiryDate', 'daysToExpiry', 'supplier', 'status'];
  const rows = data.map((r) => ({ ...r, expiryDate: r.expiryDate ? new Date(r.expiryDate).toISOString().slice(0, 10) : '' }));
  if (f === 'csv') return sendCsv(res, 'expiry-report.csv', headers, rows);
  if (f === 'excel' || f === 'xlsx') {
    return sendExcel(res, 'expiry-report.xlsx', 'Expiry', headers.map((h) => ({ header: h, key: h, width: 18 })), rows);
  }
  if (f === 'pdf') return sendPdfTable(res, 'expiry-report.pdf', 'Expiry Report', headers, rows);
  res.json({ success: true, data });
});

module.exports = { inventory, sales, revenue, suppliers, expiry };
