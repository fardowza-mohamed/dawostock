require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./models/User');
const Supplier = require('./models/Supplier');
const Medicine = require('./models/Medicine');
const Settings = require('./models/Settings');
const Sale = require('./models/Sale');
const Invoice = require('./models/Invoice');
const InventoryLog = require('./models/InventoryLog');
const Notification = require('./models/Notification');

const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Supplier.deleteMany({}),
    Medicine.deleteMany({}),
    Sale.deleteMany({}),
    Invoice.deleteMany({}),
    InventoryLog.deleteMany({}),
    Notification.deleteMany({}),
    Settings.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'Amina Hassan',
    email: 'admin@pharmacy.so',
    password: 'Admin@123',
    role: 'admin',
    phone: '+252 61 5551111',
  });
  const pharmacist = await User.create({
    name: 'Abdiqani Mohamed',
    email: 'pharmacist@pharmacy.so',
    password: 'Pharma@123',
    role: 'pharmacist',
    phone: '+252 61 5552222',
  });
  const staff = await User.create({
    name: 'Hodan Ali',
    email: 'staff@pharmacy.so',
    password: 'Staff@123',
    role: 'staff',
    phone: '+252 61 5553333',
  });

  await Settings.create({
    pharmacyName: 'DawoStock Banadir Pharmacy',
    address: 'Maka Al Mukarama Road, Hodan, Mogadishu, Somalia',
    city: 'Mogadishu',
    phone: '+252 61 5550000',
    email: 'info@dawostock.so',
    taxRate: 0,
    currency: 'USD',
    currencySymbol: '$',
    lowStockThreshold: 10,
    expiryAlertDays: [30, 60, 90],
    receiptFooter: 'Mahadsanid — Waad ku mahadsan tahay. Get well soon.',
  });

  const suppliers = await Supplier.insertMany([
    {
      name: 'Mogadishu Medical Supplies',
      phone: '+252 61 7001001',
      email: 'sales@mms.so',
      address: 'Bakara Market, Mogadishu',
      city: 'Mogadishu',
      notes: 'Primary wholesaler for antibiotics and ORS.',
    },
    {
      name: 'Hargeisa Pharma Dist.',
      phone: '+252 63 4002002',
      email: 'orders@hpd.so',
      address: 'Sha’ab Area, Hargeisa',
      city: 'Hargeisa',
      notes: 'Reliable for antimalarials and vitamins.',
    },
    {
      name: 'Banadir Wholesale Drugs',
      phone: '+252 61 7003003',
      email: 'info@banadirwd.so',
      address: 'KM4, Mogadishu',
      city: 'Mogadishu',
      notes: 'Pediatric and respiratory lines.',
    },
  ]);

  const [mms, hpd, bwd] = suppliers;

  const medicines = await Medicine.insertMany([
    {
      name: 'Paracetamol 500mg',
      genericName: 'Paracetamol',
      brandName: 'Panadol',
      category: 'Analgesic',
      batchNumber: 'PCT-24011',
      supplier: mms._id,
      purchasePrice: 0.04,
      sellingPrice: 0.1,
      quantity: 420,
      minStockLevel: 50,
      unit: 'tablet',
      manufacturingDate: daysFromNow(-200),
      expiryDate: daysFromNow(280),
      barcode: '8901234000011',
      description: 'Pain and fever relief.',
      createdBy: admin._id,
    },
    {
      name: 'Amoxicillin 500mg',
      genericName: 'Amoxicillin',
      brandName: 'Amoxil',
      category: 'Antibiotic',
      batchNumber: 'AMX-1188',
      supplier: mms._id,
      purchasePrice: 0.12,
      sellingPrice: 0.35,
      quantity: 8,
      minStockLevel: 20,
      unit: 'capsule',
      manufacturingDate: daysFromNow(-120),
      expiryDate: daysFromNow(55),
      barcode: '8901234000028',
      description: 'Broad-spectrum penicillin antibiotic.',
      createdBy: pharmacist._id,
    },
    {
      name: 'ORS Sachet',
      genericName: 'Oral Rehydration Salts',
      brandName: 'WHO-ORS',
      category: 'ORS & Electrolyte',
      batchNumber: 'ORS-0901',
      supplier: mms._id,
      purchasePrice: 0.08,
      sellingPrice: 0.25,
      quantity: 0,
      minStockLevel: 40,
      unit: 'sachet',
      manufacturingDate: daysFromNow(-90),
      expiryDate: daysFromNow(400),
      barcode: '8901234000035',
      description: 'WHO formula for diarrhoea and dehydration.',
      createdBy: pharmacist._id,
    },
    {
      name: 'Artemether/Lumefantrine 20/120',
      genericName: 'AL',
      brandName: 'Coartem',
      category: 'Antimalarial',
      batchNumber: 'ALT-5520',
      supplier: hpd._id,
      purchasePrice: 1.1,
      sellingPrice: 2.5,
      quantity: 64,
      minStockLevel: 15,
      unit: 'pack',
      manufacturingDate: daysFromNow(-80),
      expiryDate: daysFromNow(22),
      barcode: '8901234000042',
      description: 'First-line ACT for uncomplicated malaria.',
      createdBy: pharmacist._id,
    },
    {
      name: 'Metformin 500mg',
      genericName: 'Metformin',
      brandName: 'Glucophage',
      category: 'Diabetes',
      batchNumber: 'MET-3302',
      supplier: hpd._id,
      purchasePrice: 0.06,
      sellingPrice: 0.18,
      quantity: 210,
      minStockLevel: 30,
      unit: 'tablet',
      manufacturingDate: daysFromNow(-150),
      expiryDate: daysFromNow(500),
      barcode: '8901234000059',
      createdBy: admin._id,
    },
    {
      name: 'Salbutamol Inhaler 100mcg',
      genericName: 'Salbutamol',
      brandName: 'Ventolin',
      category: 'Respiratory',
      batchNumber: 'SAL-7710',
      supplier: bwd._id,
      purchasePrice: 2.4,
      sellingPrice: 5.0,
      quantity: 18,
      minStockLevel: 10,
      unit: 'inhaler',
      manufacturingDate: daysFromNow(-60),
      expiryDate: daysFromNow(75),
      barcode: '8901234000066',
      createdBy: pharmacist._id,
    },
    {
      name: 'Vitamin D3 1000 IU',
      genericName: 'Cholecalciferol',
      brandName: 'D-Vit',
      category: 'Vitamin & Supplement',
      batchNumber: 'VD3-441',
      supplier: hpd._id,
      purchasePrice: 0.03,
      sellingPrice: 0.12,
      quantity: 300,
      minStockLevel: 40,
      unit: 'capsule',
      manufacturingDate: daysFromNow(-40),
      expiryDate: daysFromNow(-5),
      barcode: '8901234000073',
      createdBy: admin._id,
    },
    {
      name: 'Ibuprofen 400mg',
      genericName: 'Ibuprofen',
      brandName: 'Brufen',
      category: 'Analgesic',
      batchNumber: 'IBU-2209',
      supplier: bwd._id,
      purchasePrice: 0.05,
      sellingPrice: 0.15,
      quantity: 150,
      minStockLevel: 25,
      unit: 'tablet',
      manufacturingDate: daysFromNow(-100),
      expiryDate: daysFromNow(310),
      barcode: '8901234000080',
      createdBy: pharmacist._id,
    },
    {
      name: 'Ciprofloxacin 500mg',
      genericName: 'Ciprofloxacin',
      brandName: 'Cipro',
      category: 'Antibiotic',
      batchNumber: 'CIP-8812',
      supplier: mms._id,
      purchasePrice: 0.14,
      sellingPrice: 0.4,
      quantity: 90,
      minStockLevel: 20,
      unit: 'tablet',
      manufacturingDate: daysFromNow(-70),
      expiryDate: daysFromNow(200),
      barcode: '8901234000097',
      createdBy: pharmacist._id,
    },
    {
      name: 'Pediatric Paracetamol Syrup',
      genericName: 'Paracetamol',
      brandName: 'Calpol',
      category: 'Pediatric',
      batchNumber: 'PPS-1024',
      supplier: bwd._id,
      purchasePrice: 0.9,
      sellingPrice: 2.0,
      quantity: 42,
      minStockLevel: 12,
      unit: 'bottle',
      manufacturingDate: daysFromNow(-30),
      expiryDate: daysFromNow(365),
      barcode: '8901234000103',
      createdBy: staff._id,
    },
  ]);

  const para = medicines.find((m) => m.name.startsWith('Paracetamol 500'));
  const ibu = medicines.find((m) => m.name.startsWith('Ibuprofen'));
  const amox = medicines.find((m) => m.name.startsWith('Amoxicillin'));

  const mkSale = async (invoiceNumber, items, extra = {}) => {
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const sale = await Sale.create({
      invoiceNumber,
      customerName: extra.customerName || 'Walk-in Customer',
      customerPhone: extra.customerPhone || '',
      items,
      subtotal,
      taxRate: 0,
      tax: 0,
      discount: 0,
      totalAmount: subtotal,
      paymentMethod: extra.paymentMethod || 'cash',
      amountPaid: subtotal,
      change: 0,
      soldBy: extra.soldBy || staff._id,
      date: extra.date || new Date(),
    });
    const invoice = await Invoice.create({
      invoiceNumber,
      sale: sale._id,
      customerName: sale.customerName,
      customerPhone: sale.customerPhone,
      medicines: items.map((i) => ({
        medicine: i.medicine,
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        total: i.total,
      })),
      subtotal,
      tax: 0,
      totalAmount: subtotal,
      paymentMethod: sale.paymentMethod,
      pharmacyName: 'DawoStock Banadir Pharmacy',
      pharmacyAddress: 'Maka Al Mukarama Road, Hodan, Mogadishu, Somalia',
      pharmacyPhone: '+252 61 5550000',
      currency: 'USD',
      issuedBy: sale.soldBy,
      date: sale.date,
    });
    sale.invoice = invoice._id;
    await sale.save();
    return sale;
  };

  const today = new Date();
  await mkSale(
    `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-0001`,
    [
      { medicine: para._id, name: para.name, batchNumber: para.batchNumber, quantity: 20, unitPrice: 0.1, total: 2 },
      { medicine: ibu._id, name: ibu.name, batchNumber: ibu.batchNumber, quantity: 10, unitPrice: 0.15, total: 1.5 },
    ],
    { customerName: 'Farah Yusuf', customerPhone: '+252 61 8881001', paymentMethod: 'evc_plus', soldBy: staff._id }
  );

  const y = new Date();
  y.setDate(y.getDate() - 1);
  await mkSale(
    `INV-${y.getFullYear()}${String(y.getMonth() + 1).padStart(2, '0')}${String(y.getDate()).padStart(2, '0')}-0001`,
    [{ medicine: amox._id, name: amox.name, batchNumber: amox.batchNumber, quantity: 14, unitPrice: 0.35, total: 4.9 }],
    { customerName: 'Khadija Omar', customerPhone: '+252 61 8882002', paymentMethod: 'zaad', soldBy: pharmacist._id, date: y }
  );

  await InventoryLog.create({
    medicine: para._id,
    type: 'in',
    quantity: 500,
    previousQuantity: 0,
    newQuantity: 500,
    reason: 'Opening stock',
    performedBy: admin._id,
  });

  await Notification.insertMany([
    {
      type: 'low_stock',
      title: 'Low stock',
      message: 'Amoxicillin 500mg is low on stock (8 remaining).',
      severity: 'warning',
      relatedMedicine: amox._id,
    },
    {
      type: 'out_of_stock',
      title: 'Out of stock',
      message: 'ORS Sachet (ORS-0901) is out of stock.',
      severity: 'critical',
      relatedMedicine: medicines.find((m) => m.name.startsWith('ORS'))._id,
    },
    {
      type: 'expiry',
      title: 'Expiring within 30 days',
      message: 'Artemether/Lumefantrine 20/120 expires in 22 day(s).',
      severity: 'critical',
      relatedMedicine: medicines.find((m) => m.name.startsWith('Artemether'))._id,
    },
  ]);

  console.log('Seed complete.');
  console.log('Admin:       admin@pharmacy.so / Admin@123');
  console.log('Pharmacist:  pharmacist@pharmacy.so / Pharma@123');
  console.log('Staff:       staff@pharmacy.so / Staff@123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
