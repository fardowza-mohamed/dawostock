import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Download, Plus, Pencil, Trash2, Printer } from 'lucide-react';
import api, { getError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import useDebounce from '../hooks/useDebounce';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';

const CATEGORIES = [
  '',
  'Analgesic',
  'Antibiotic',
  'Antimalarial',
  'Antiviral',
  'Antifungal',
  'Cardiovascular',
  'Diabetes',
  'Gastrointestinal',
  'Respiratory',
  'Vitamin & Supplement',
  'Dermatology',
  'Pediatric',
  'ORS & Electrolyte',
  'Vaccine',
  'Other',
];

export default function Medicines() {
  const { hasRole } = useAuth();
  const { money } = useSettings();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const debounced = useDebounce(search);
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [expiry, setExpiry] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = { page, limit: 10 };
    if (debounced) q.search = debounced;
    if (category) q.category = category;
    if (stock) q.stock = stock;
    if (expiry) q.expiry = expiry;
    api
      .get('/medicines', { params: q })
      .then((r) => setData(r.data))
      .catch((e) => setError(getError(e)));
  }, [debounced, category, stock, expiry, page]);

  useEffect(() => {
    const s = params.get('search');
    if (s) setSearch(s);
  }, [params]);

  const remove = async (id) => {
    if (!window.confirm('Delete this medicine?')) return;
    await api.delete(`/medicines/${id}`);
    setData((d) => ({ ...d, data: d.data.filter((m) => m._id !== id) }));
  };

  const printList = () => window.print();

  if (error) return <div className="card p-6 text-rose-600">{error}</div>;

  return (
    <div>
      <PageHeader
        title="Medicines"
        subtitle="Search, filter, and manage inventory lots."
        actions={
          <>
            {hasRole('admin', 'pharmacist') && (
              <button type="button" className="btn-secondary" onClick={() => {
                api.get('/medicines/export/csv', { responseType: 'blob' }).then((res) => {
                  const url = URL.createObjectURL(res.data);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'medicines.csv';
                  a.click();
                });
              }}>
                <Download size={16} /> CSV
              </button>
            )}
            <button type="button" className="btn-secondary no-print" onClick={printList}>
              <Printer size={16} /> Print
            </button>
            {hasRole('admin', 'pharmacist') && (
              <Link to="/medicines/new" className="btn-primary">
                <Plus size={16} /> Add medicine
              </Link>
            )}
          </>
        }
      />
      <div className="card mb-4 grid gap-3 p-4 md:grid-cols-4">
        <input className="input" placeholder="Search name, generic, barcode, batch" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); setParams({}); }} />
        <select className="input" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          {CATEGORIES.map((c) => (
            <option key={c || 'all'} value={c}>{c || 'All categories'}</option>
          ))}
        </select>
        <select className="input" value={stock} onChange={(e) => { setStock(e.target.value); setPage(1); }}>
          <option value="">All stock</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>
        <select className="input" value={expiry} onChange={(e) => { setExpiry(e.target.value); setPage(1); }}>
          <option value="">All expiry</option>
          <option value="30">Expires in 30 days</option>
          <option value="60">Expires in 60 days</option>
          <option value="90">Expires in 90 days</option>
          <option value="expired">Expired</option>
        </select>
      </div>
      {!data ? <Spinner /> : (
        <>
          <div className="table-wrap bg-white dark:bg-slate-900">
            <table className="data">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Category</th>
                  <th>Batch</th>
                  <th>Qty</th>
                  <th>Sell</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th className="no-print" />
                </tr>
              </thead>
              <tbody>
                {data.data.map((m) => (
                  <tr key={m._id}>
                    <td>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-slate-500">{m.genericName} · {m.brandName}</div>
                    </td>
                    <td>{m.category}</td>
                    <td>{m.batchNumber}</td>
                    <td>{m.quantity}</td>
                    <td>{money(m.sellingPrice)}</td>
                    <td>{m.expiryDate ? new Date(m.expiryDate).toLocaleDateString() : '—'}</td>
                    <td><Badge value={m.stockStatus || m.status} /></td>
                    <td className="no-print">
                      <div className="flex gap-2">
                        {hasRole('admin', 'pharmacist') && (
                          <Link to={`/medicines/${m._id}/edit`} className="text-teal-700 dark:text-teal-300"><Pencil size={16} /></Link>
                        )}
                        {hasRole('admin') && (
                          <button type="button" onClick={() => remove(m._id)} className="text-rose-600"><Trash2 size={16} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pagination={data.pagination} onPage={setPage} />
        </>
      )}
    </div>
  );
}
