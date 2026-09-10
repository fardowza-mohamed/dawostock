import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';
import Badge from '../components/Badge';

const download = async (url, filename) => {
  const res = await api.get(url, { responseType: 'blob' });
  const blobUrl = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  a.click();
};

export default function Reports() {
  const { money } = useSettings();
  const [tab, setTab] = useState('revenue');
  const [from, setFrom] = useState(() => new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [revenue, setRevenue] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [sales, setSales] = useState(null);
  const [suppliers, setSuppliers] = useState(null);
  const [expiry, setExpiry] = useState(null);

  useEffect(() => {
    api.get('/reports/revenue', { params: { from, to } }).then((r) => setRevenue(r.data.data));
  }, [from, to]);

  useEffect(() => {
    if (tab === 'inventory') api.get('/reports/inventory').then((r) => setInventory(r.data.data));
    if (tab === 'sales') api.get('/reports/sales', { params: { from, to } }).then((r) => setSales(r.data.data));
    if (tab === 'suppliers') api.get('/reports/suppliers').then((r) => setSuppliers(r.data.data));
    if (tab === 'expiry') api.get('/reports/expiry', { params: { days: 90 } }).then((r) => setExpiry(r.data.data));
  }, [tab, from, to]);

  const tabs = [
    ['revenue', 'Revenue'],
    ['inventory', 'Inventory'],
    ['sales', 'Sales'],
    ['suppliers', 'Suppliers'],
    ['expiry', 'Expiry'],
  ];

  const exports = {
    inventory: [['/reports/inventory?format=csv', 'inventory.csv'], ['/reports/inventory?format=excel', 'inventory.xlsx'], ['/reports/inventory?format=pdf', 'inventory.pdf']],
    sales: [[`/reports/sales?format=csv&from=${from}&to=${to}`, 'sales.csv'], [`/reports/sales?format=excel&from=${from}&to=${to}`, 'sales.xlsx'], [`/reports/sales?format=pdf&from=${from}&to=${to}`, 'sales.pdf']],
    suppliers: [['/reports/suppliers?format=csv', 'suppliers.csv'], ['/reports/suppliers?format=excel', 'suppliers.xlsx'], ['/reports/suppliers?format=pdf', 'suppliers.pdf']],
    expiry: [['/reports/expiry?format=csv', 'expiry.csv'], ['/reports/expiry?format=excel', 'expiry.xlsx'], ['/reports/expiry?format=pdf', 'expiry.pdf']],
  };

  return (
    <div>
      <PageHeader title="Reports" subtitle="Inventory, sales, supplier, revenue, and expiry — export PDF, Excel, or CSV." />
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map(([k, l]) => (
          <button key={k} type="button" className={tab === k ? 'btn-primary' : 'btn-secondary'} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-3">
        <input className="input w-auto" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input className="input w-auto" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        {(exports[tab] || []).map(([url, name]) => (
          <button key={name} type="button" className="btn-secondary" onClick={() => download(url, name)}>
            {name.split('.')[1].toUpperCase()}
          </button>
        ))}
      </div>

      {tab === 'revenue' && (!revenue ? <Spinner /> : (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card p-4"><div className="text-sm text-slate-500">Revenue</div><div className="text-2xl font-semibold">{money(revenue.revenue)}</div></div>
            <div className="card p-4"><div className="text-sm text-slate-500">Invoices</div><div className="text-2xl font-semibold">{revenue.count}</div></div>
            <div className="card p-4"><div className="text-sm text-slate-500">Tax collected</div><div className="text-2xl font-semibold">{money(revenue.tax)}</div></div>
          </div>
          <div className="card p-4">
            <div className="mb-3 font-medium">Daily revenue</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenue.byDay || []}>
                  <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => money(v)} />
                  <Bar dataKey="revenue" fill="#0d9488" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card p-4">
            <div className="mb-3 font-medium">Top medicines</div>
            <div className="table-wrap">
              <table className="data">
                <thead><tr><th>Medicine</th><th>Qty</th><th>Revenue</th></tr></thead>
                <tbody>
                  {(revenue.topMedicines || []).map((m) => (
                    <tr key={m._id}><td>{m._id}</td><td>{m.quantity}</td><td>{money(m.revenue)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}

      {tab === 'inventory' && (!inventory ? <Spinner /> : <SimpleTable rows={inventory} cols={['name', 'category', 'batchNumber', 'quantity', 'stockValue', 'status']} />)}
      {tab === 'sales' && (!sales ? <Spinner /> : <SimpleTable rows={sales} cols={['invoiceNumber', 'customerName', 'totalAmount', 'paymentMethod', 'soldBy']} />)}
      {tab === 'suppliers' && (!suppliers ? <Spinner /> : <SimpleTable rows={suppliers} cols={['name', 'phone', 'city', 'medicines', 'stockValue']} />)}
      {tab === 'expiry' && (!expiry ? <Spinner /> : (
        <div className="table-wrap bg-white dark:bg-slate-900">
          <table className="data">
            <thead><tr><th>Medicine</th><th>Batch</th><th>Qty</th><th>Days</th><th>Status</th></tr></thead>
            <tbody>
              {expiry.map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td>{r.batchNumber}</td>
                  <td>{r.quantity}</td>
                  <td>{r.daysToExpiry}</td>
                  <td><Badge value={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function SimpleTable({ rows, cols }) {
  return (
    <div className="table-wrap bg-white dark:bg-slate-900">
      <table className="data">
        <thead><tr>{cols.map((c) => <th key={c} className="capitalize">{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{cols.map((c) => <td key={c}>{String(r[c] ?? '')}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
