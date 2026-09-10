const pad = (n) => String(n).padStart(4, '0');

const generateInvoiceNumber = async (Sale) => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const prefix = `INV-${y}${m}${d}-`;

  const last = await Sale.findOne({ invoiceNumber: new RegExp(`^${prefix}`) })
    .sort({ invoiceNumber: -1 })
    .select('invoiceNumber')
    .lean();

  let seq = 1;
  if (last?.invoiceNumber) {
    const parts = last.invoiceNumber.split('-');
    seq = Number(parts[2]) + 1;
  }
  return `${prefix}${pad(seq)}`;
};

module.exports = { generateInvoiceNumber };
