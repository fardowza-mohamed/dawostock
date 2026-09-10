const Medicine = require('../models/Medicine');
const InventoryLog = require('../models/InventoryLog');
const { AppError } = require('../middleware/errorHandler');
const { createNotification } = require('./notificationService');

/**
 * Apply a stock movement, persist an audit log, and emit alerts.
 */
const applyStockChange = async ({
  medicineId,
  type,
  quantity,
  userId,
  fromLocation = '',
  toLocation = '',
  reason = '',
  notes = '',
  referenceId = null,
  session = null,
}) => {
  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty <= 0) {
    throw new AppError('Quantity must be a positive number.', 400);
  }

  let query = Medicine.findById(medicineId);
  if (session) query = query.session(session);
  const medicine = await query;
  if (!medicine) throw new AppError('Medicine not found.', 404);

  const previousQuantity = medicine.quantity;
  let newQuantity = previousQuantity;

  if (type === 'in' || type === 'return') {
    newQuantity = previousQuantity + qty;
  } else if (type === 'out' || type === 'sale') {
    if (previousQuantity < qty) {
      throw new AppError(`Insufficient stock for ${medicine.name}. Available: ${previousQuantity}`, 400);
    }
    newQuantity = previousQuantity - qty;
  } else if (type === 'adjustment') {
    newQuantity = qty;
  } else if (type === 'transfer') {
    medicine.location = toLocation || medicine.location;
    newQuantity = previousQuantity;
  } else {
    throw new AppError('Invalid inventory movement type.', 400);
  }

  medicine.quantity = newQuantity;
  if (toLocation && type !== 'transfer') medicine.location = toLocation;
  await medicine.save(session ? { session } : undefined);

  const logDoc = {
    medicine: medicine._id,
    type,
    quantity: type === 'adjustment' ? Math.abs(newQuantity - previousQuantity) || qty : qty,
    previousQuantity,
    newQuantity,
    fromLocation: fromLocation || medicine.location,
    toLocation: toLocation || medicine.location,
    reason,
    notes,
    referenceId,
    performedBy: userId,
  };

  const log = session
    ? (await InventoryLog.create([logDoc], { session }))[0]
    : await InventoryLog.create(logDoc);

  if (!session) {
    await maybeAlertStock(medicine);
  }

  return { medicine, log };
};

const maybeAlertStock = async (medicine) => {
  if (medicine.quantity <= 0) {
    await createNotification({
      type: 'out_of_stock',
      title: 'Out of stock',
      message: `${medicine.name} (${medicine.batchNumber}) is out of stock.`,
      severity: 'critical',
      relatedMedicine: medicine._id,
    });
  } else if (medicine.quantity <= medicine.minStockLevel) {
    await createNotification({
      type: 'low_stock',
      title: 'Low stock',
      message: `${medicine.name} is low on stock (${medicine.quantity} remaining).`,
      severity: 'warning',
      relatedMedicine: medicine._id,
    });
  }
};

module.exports = { applyStockChange };
