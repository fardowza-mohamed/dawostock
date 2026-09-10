import { useEffect, useState } from 'react';
import { Plus, Printer, Search } from 'lucide-react';
import api, { getError } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import Badge from '../components/Badge';
import METHODS, { paymentLabel } from '../components/paymentMethods';

export default function Sales() {
  const { money, settings } = useSettings();
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pos, setPos] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [history, setHistory] = useState([]);

  const load = () => {
    api.get('/sales', { params: { search, page, limit: 10 } }).then((r) => setData(r.data));
  };
  useEffect(() => { load(); }, [search, page]);

  const lookupCustomer = async (q) => {
    if (!q) return setHistory([]);
    const { data: res } = await api.get('/sales/customer', { params: { q } });
    setHistory(res.data || []);
  };

  return (
    <div>
      <PageHeader
        title="Sales"
        subtitle="Create invoices, print receipts, and review customer history."
        actions={
          <button className="btn-primary" type="button" onClick={() => setPos(true)}>
            <Plus size={16} /> New sale
          </button>
        }
      />
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input className="input pl-9" placeholder="Invoice, customer, phone" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>
      {!data ? <Spinner /> : (
        <>
          <div className="table-wrap bg-white dark:bg-slate-900">
            <table className="data">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.data.map((s) => (
                  <tr key={s._id}>
                    <td className="font-medium">{s.invoiceNumber}</td>
                    <td>
                      <div>{s.customerName}</div>
                      <div className="text-xs text-slate-500">{s.customerPhone}</div>
                    </td>
                    <td>{s.items?.length}</td>
                    <td><Badge value={paymentLabel(s.paymentMethod)} /></td>
                    <td>{money(s.totalAmount)}</td>
                    <td>{new Date(s.date).toLocaleString()}</td>
                    <td>
                      <button type="button" className="text-teal-700" onClick={() => setReceipt(s)}>
                        <Printer size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={data.pagination} onPage={setPage} />
        </>
      )}
      {pos && (
        <PosModal
          onClose={() => setPos(false)}
          onDone={(sale) => { setPos(false); setReceipt(sale); load(); }}
          lookupCustomer={lookupCustomer}
          history={history}
        />
      )}
      {receipt && (
        <Receipt sale={receipt} settings={settings} money={money} onClose={() => setReceipt(null)} />
      )}
    </div>
  );
}

function PosModal({ onClose, onDone, lookupCustomer, history }) {
  const { money, settings } = useSettings();
  const [medicines, setMedicines] = useState([]);
  const [q, setQ] = useState('');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/medicines', { params: { limit: 100, search: q } }).then((r) => setMedicines(r.data.data));
  }, [q]);

  const add = (m) => {
    setCart((c) => {
      const i = c.findIndex((x) => x.medicine === m._id);
      if (i >= 0) {
        const next = [...c];
        next[i] = { ...next[i], quantity: next[i].quantity + 1 };
        return next;
      }
      return [...c, { medicine: m._id, name: m.name, unitPrice: m.sellingPrice, quantity: 1, max: m.quantity }];
    });
  };

  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const taxRate = settings?.taxRate || 0;
  const tax = ((subtotal - Number(discount || 0)) * taxRate) / 100;
  const total = subtotal - Number(discount || 0) + tax;

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { data } = await api.post('/sales', {
        customerName,
        customerPhone,
        paymentMethod,
        discount: Number(discount || 0),
        items: cart.map((i) => ({ medicine: i.medicine, quantity: i.quantity, unitPrice: i.unitPrice })),
      });
      onDone(data.data);
    } catch (err) {
      setError(getError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="New sale" wide onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        {error && <div className="md:col-span-2 text-sm text-rose-600">{error}</div>}
        <div>
          <label className="label">Customer name</label>
          <input className="input" value={customerName} onChange={(e) => { setCustomerName(e.target.value); lookupCustomer(e.target.value); }} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" value={customerPhone} onChange={(e) => { setCustomerPhone(e.target.value); lookupCustomer(e.target.value); }} />
        </div>
        {history.length > 0 && (
          <div className="md:col-span-2 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-800">
            <div className="mb-1 font-medium">Customer history</div>
            {history.slice(0, 4).map((h) => (
              <div key={h._id}>{h.invoiceNumber} · {money(h.totalAmount)} · {new Date(h.date).toLocaleDateString()}</div>
            ))}
          </div>
        )}
        <div className="md:col-span-2">
          <label className="label">Add medicine</label>
          <input className="input mb-2" placeholder="Search stock" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="max-h-32 overflow-auto rounded-lg border border-slate-200 dark:border-slate-700">
            {medicines.filter((m) => m.quantity > 0).slice(0, 8).map((m) => (
              <button key={m._id} type="button" className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => add(m)}>
                <span>{m.name} <span className="text-slate-400">({m.quantity} in stock)</span></span>
                <span>{money(m.sellingPrice)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 table-wrap">
          <table className="data">
            <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th><th /></tr></thead>
            <tbody>
              {cart.map((i, idx) => (
                <tr key={i.medicine}>
                  <td>{i.name}</td>
                  <td>
                    <input className="input w-20" type="number" min={1} max={i.max} value={i.quantity} onChange={(e) => {
                      const next = [...cart];
                      next[idx].quantity = Number(e.target.value);
                      setCart(next);
                    }} />
                  </td>
                  <td>{money(i.unitPrice)}</td>
                  <td>{money(i.unitPrice * i.quantity)}</td>
                  <td><button type="button" className="text-rose-600" onClick={() => setCart(cart.filter((x) => x.medicine !== i.medicine))}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <label className="label">Payment method</label>
          <select className="input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            {Object.entries(METHODS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Discount</label>
          <input className="input" type="number" min={0} value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </div>
        <div className="md:col-span-2 flex items-center justify-between rounded-xl bg-teal-50 px-4 py-3 dark:bg-teal-500/10">
          <div className="text-sm text-slate-500">Tax {taxRate}% · Subtotal {money(subtotal)}</div>
          <div className="text-lg font-semibold">Total {money(total)}</div>
        </div>
        <button className="btn-primary md:col-span-2" disabled={!cart.length || saving} type="submit">
          {saving ? 'Saving…' : 'Complete sale & generate invoice'}
        </button>
      </form>
    </Modal>
  );
}

function Receipt({ sale, settings, money, onClose }) {
  return (
    <Modal title="Invoice / Receipt" onClose={onClose}>
      <div id="receipt" className="space-y-2 text-sm">
        <div className="text-center">
          <div className="text-lg font-semibold">{settings?.pharmacyName || 'DawoStock Pharmacy'}</div>
          <div className="text-slate-500">{settings?.address}</div>
          <div className="text-slate-500">{settings?.phone}</div>
        </div>
        <div className="flex justify-between border-t border-dashed pt-2">
          <span>{sale.invoiceNumber}</span>
          <span>{new Date(sale.date).toLocaleString()}</span>
        </div>
        <div>Customer: {sale.customerName} {sale.customerPhone && `· ${sale.customerPhone}`}</div>
        <table className="data">
          <thead><tr><th>Medicine</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
          <tbody>
            {sale.items.map((i, n) => (
              <tr key={n}>
                <td>{i.name}</td>
                <td>{i.quantity}</td>
                <td>{money(i.unitPrice)}</td>
                <td>{money(i.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right font-semibold">Total {money(sale.totalAmount)}</div>
        <div>Payment: {paymentLabel(sale.paymentMethod)}</div>
        <div className="text-center text-xs text-slate-500">{settings?.receiptFooter}</div>
      </div>
      <button className="btn-primary mt-4 w-full" type="button" onClick={() => window.print()}>
        <Printer size={16} /> Print receipt
      </button>
    </Modal>
  );
}
