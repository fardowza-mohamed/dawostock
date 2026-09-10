import { useEffect, useState } from 'react';
import api, { getError } from '../services/api';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import Badge from '../components/Badge';

export default function Inventory() {
  const [tab, setTab] = useState('history');
  const [logs, setLogs] = useState(null);
  const [page, setPage] = useState(1);
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({ medicine: '', quantity: 1, reason: '', location: '', toLocation: '', notes: '' });
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const loadLogs = () => api.get('/inventory/history', { params: { page, limit: 12 } }).then((r) => setLogs(r.data));
  useEffect(() => { loadLogs(); }, [page]);
  useEffect(() => {
    api.get('/medicines', { params: { limit: 100 } }).then((r) => setMedicines(r.data.data));
  }, []);

  const submit = async (type) => {
    setError('');
    setOk('');
    try {
      const path = type === 'in' ? '/inventory/in' : type === 'out' ? '/inventory/out' : '/inventory/transfer';
      await api.post(path, form);
      setOk('Stock movement recorded.');
      setForm({ ...form, quantity: 1, reason: '', notes: '' });
      loadLogs();
    } catch (e) {
      setError(getError(e));
    }
  };

  return (
    <div>
      <PageHeader title="Inventory" subtitle="Stock in, stock out, transfers, and full audit history." />
      <div className="mb-4 flex gap-2">
        {['move', 'history'].map((t) => (
          <button key={t} type="button" className={tab === t ? 'btn-primary' : 'btn-secondary'} onClick={() => setTab(t)}>
            {t === 'move' ? 'Stock movement' : 'Audit log'}
          </button>
        ))}
      </div>
      {tab === 'move' && (
        <div className="card grid gap-4 p-5 md:grid-cols-2">
          {error && <div className="md:col-span-2 text-sm text-rose-600">{error}</div>}
          {ok && <div className="md:col-span-2 text-sm text-emerald-600">{ok}</div>}
          <div className="md:col-span-2">
            <label className="label">Medicine</label>
            <select className="input" value={form.medicine} onChange={(e) => setForm({ ...form, medicine: e.target.value })}>
              <option value="">Select</option>
              {medicines.map((m) => (
                <option key={m._id} value={m._id}>{m.name} — {m.batchNumber} ({m.quantity})</option>
              ))}
            </select>
          </div>
          <div><label className="label">Quantity</label><input className="input" type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div>
          <div><label className="label">Reason</label><input className="input" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
          <div><label className="label">Location / destination</label><input className="input" value={form.toLocation} onChange={(e) => setForm({ ...form, toLocation: e.target.value, location: e.target.value })} placeholder="e.g. Front counter" /></div>
          <div><label className="label">Notes</label><input className="input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          <div className="md:col-span-2 flex flex-wrap gap-2">
            <button className="btn-primary" type="button" onClick={() => submit('in')}>Stock in</button>
            <button className="btn-secondary" type="button" onClick={() => submit('out')}>Stock out</button>
            <button className="btn-secondary" type="button" onClick={() => submit('transfer')}>Transfer</button>
          </div>
        </div>
      )}
      {tab === 'history' && (
        !logs ? <Spinner /> : (
          <>
            <div className="table-wrap bg-white dark:bg-slate-900">
              <table className="data">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Medicine</th>
                    <th>Type</th>
                    <th>Qty</th>
                    <th>Before → After</th>
                    <th>By</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.data.map((l) => (
                    <tr key={l._id}>
                      <td>{new Date(l.createdAt).toLocaleString()}</td>
                      <td>{l.medicine?.name}</td>
                      <td><Badge value={l.type} /></td>
                      <td>{l.quantity}</td>
                      <td>{l.previousQuantity} → {l.newQuantity}</td>
                      <td>{l.performedBy?.name}</td>
                      <td>{l.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination pagination={logs.pagination} onPage={setPage} />
          </>
        )
      )}
    </div>
  );
}
