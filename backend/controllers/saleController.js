const { body } = require('express-validator');
const Sale = require('../models/Sale');
const Invoice = require('../models/Invoice');
const Medicine = require('../models/Medicine');
const Settings = require('../models/Settings');
const { applyStockChange } = require('../services/stockService');
const { createNotification } = require('../services/notificationService');
const { generateInvoiceNumber } = require('../utils/invoiceNumber');
const { runInTransaction } = require('../utils/transaction');
const { getPagination, paginate } = require('../utils/pagination');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../middleware/errorHandler');

const saleValidators = [
  body('items').isArray({ min: 1 }).withMessage('At least one medicine is required'),
  body('paymentMethod').optional().isIn(['cash', 'card', 'evc_plus', 'zaad', 'sahal', 'bank_transfer']),
];

const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.search) {
    filter.$or = [
      { invoiceNumber: new RegExp(req.query.search, 'i') },
      { customerName: new RegExp(req.query.search, 'i') },
      { customerPhone: new RegExp(req.query.search, 'i') },
    ];
  }
  if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;
  if (req.query.from || req.query.to) {
    filter.date = {};
    if (req.query.from) filter.date.$gte = new Date(req.query.from);
    if (req.query.to) {
      const t = new Date(req.query.to);
      t.setHours(23, 59, 59, 999);
      filter.date.$lte = t;
    }
  }

  const [items, total] = await Promise.all([
    Sale.find(filter).populate('soldBy', 'name role').sort({ date: -1 }).skip(skip).limit(limit),
    Sale.countDocuments(filter),
  ]);
  res.json({ success: true, data: items, pagination: paginate(total, page, limit) });
});

const getOne = asyncHandler(async (req, res) => {
  const item = await Sale.findById(req.params.id)
    .populate('soldBy', 'name role')
    .populate('invoice');
  if (!item) throw new AppError('Sale not found.', 404);
  res.json({ success: true, data: item });
});

const customerHistory = asyncHandler(async (req, res) => {
  const q = req.query.q || req.params.phone;
  if (!q) throw new AppError('Customer name or phone is required.', 400);
  const sales = await Sale.find({
    $or: [{ customerPhone: new RegExp(q, 'i') }, { customerName: new RegExp(q, 'i') }],
    status: 'completed',
  })
    .sort({ date: -1 })
    .limit(50);
  res.json({ success: true, data: sales });
});

const create = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton();
  const itemsInput = req.body.items || [];
  if (!itemsInput.length) throw new AppError('Add at least one medicine.', 400);

  const populated = await runInTransaction(async (session) => {
    const lineItems = [];
    let subtotal = 0;
    const findMed = (id) => {
      const q = Medicine.findById(id);
      return session ? q.session(session) : q;
    };

    for (const line of itemsInput) {
      const med = await findMed(line.medicine);
      if (!med) throw new AppError('Medicine not found.', 404);
      const qty = Number(line.quantity);
      if (!qty || qty < 1) throw new AppError('Invalid quantity.', 400);
      if (med.quantity < qty) {
        throw new AppError(`Insufficient stock for ${med.name}. Available: ${med.quantity}`, 400);
      }
      if (med.expiryDate < new Date()) {
        throw new AppError(`${med.name} is expired and cannot be sold.`, 400);
      }
      const unitPrice = Number(line.unitPrice ?? med.sellingPrice);
      const total = Number((unitPrice * qty).toFixed(2));
      subtotal += total;
      lineItems.push({
        medicine: med._id,
        name: med.name,
        batchNumber: med.batchNumber,
        quantity: qty,
        unitPrice,
        total,
      });
    }

    const taxRate = Number(req.body.taxRate ?? settings.taxRate ?? 0);
    const discount = Number(req.body.discount || 0);
    const tax = Number(((subtotal - discount) * (taxRate / 100)).toFixed(2));
    const totalAmount = Number((subtotal - discount + tax).toFixed(2));
    const amountPaid = Number(req.body.amountPaid ?? totalAmount);
    const invoiceNumber = await generateInvoiceNumber(Sale);

    const saleDoc = {
      invoiceNumber,
      customerName: req.body.customerName || 'Walk-in Customer',
      customerPhone: req.body.customerPhone || '',
      items: lineItems,
      subtotal,
      taxRate,
      tax,
      discount,
      totalAmount,
      paymentMethod: req.body.paymentMethod || 'cash',
      amountPaid,
      change: Math.max(0, amountPaid - totalAmount),
      soldBy: req.user._id,
      notes: req.body.notes || '',
      date: req.body.date || new Date(),
    };

    const sale = session
      ? (await Sale.create([saleDoc], { session }))[0]
      : await Sale.create(saleDoc);

    const invoiceDoc = {
      invoiceNumber,
      sale: sale._id,
      customerName: sale.customerName,
      customerPhone: sale.customerPhone,
      medicines: lineItems.map((i) => ({
        medicine: i.medicine,
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        total: i.total,
      })),
      subtotal,
      tax,
      totalAmount,
      paymentMethod: sale.paymentMethod,
      pharmacyName: settings.pharmacyName,
      pharmacyAddress: settings.address,
      pharmacyPhone: settings.phone,
      currency: settings.currency,
      issuedBy: req.user._id,
      date: sale.date,
    };

    const invoice = session
      ? (await Invoice.create([invoiceDoc], { session }))[0]
      : await Invoice.create(invoiceDoc);

    sale.invoice = invoice._id;
    await sale.save(session ? { session } : undefined);

    for (const line of lineItems) {
      await applyStockChange({
        medicineId: line.medicine,
        type: 'sale',
        quantity: line.quantity,
        userId: req.user._id,
        reason: `Sale ${invoiceNumber}`,
        referenceId: sale._id,
        session,
      });
    }

    await createNotification({
      type: 'sales',
      title: 'New sale',
      message: `Invoice ${invoiceNumber} — ${settings.currencySymbol || '$'}${totalAmount.toFixed(2)} (${sale.customerName})`,
      severity: 'info',
      relatedSale: sale._id,
    });

    return Sale.findById(sale._id).populate('soldBy', 'name').populate('invoice');
  });

  res.status(201).json({ success: true, data: populated });
});

module.exports = { list, getOne, create, customerHistory, saleValidators };
