import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import api, { getError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import Badge from '../components/Badge';

const empty = { name: '', phone: '', email: '', address: '', city: 'Mogadishu', notes: '' };

export default function Suppliers() {
  const { hasRole } = useAuth();
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/suppliers', { params: { search, page, limit: 10 } }).then((r) => setData(r.data)).catch((e) => setError(getError(e)));
  };

  useEffect(() => { load(); }, [search, page]);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/suppliers/${editId}`, form);
      else await api.post('/suppliers', form);
      setOpen(false);
      setForm(empty);
      setEditId(null);
      load();
    } catch (err) {
      setError(getError(err));
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this supplier?')) return;
    try {
      await api.delete(`/suppliers/${id}`);
      load();
    } catch (err) {
      alert(getError(err));
    }
  };

  return (
    <div>
      <PageHeader
        title="Suppliers"
        subtitle="Wholesalers and distributors serving your pharmacy."
        actions={hasRole('admin', 'pharmacist') && (
          <button className="btn-primary" type="button" onClick={() => { setForm(empty); setEditId(null); setOpen(true); }}>
            <Plus size={16} /> Add supplier
          </button>
        )}
      />
      <input className="input mb-4 max-w-sm" placeholder="Search suppliers" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      {error && !open && <div className="mb-3 text-sm text-rose-600">{error}</div>}
      {!data ? <Spinner /> : (
        <>
          <div className="table-wrap bg-white dark:bg-slate-900">
            <table className="data">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.data.map((s) => (
                  <tr key={s._id}>
                    <td className="font-medium">{s.name}</td>
                    <td>{s.phone}</td>
                    <td>{s.email}</td>
                    <td>{s.city}</td>
                    <td><Badge value={s.isActive ? 'active' : 'inactive'} /></td>
                    <td>
                      <div className="flex gap-2">
                        {hasRole('admin', 'pharmacist') && (
                          <button type="button" onClick={() => { setForm(s); setEditId(s._id); setOpen(true); }}><Pencil size={16} className="text-teal-700" /></button>
                        )}
                        {hasRole('admin') && (
                          <button type="button" onClick={() => remove(s._id)}><Trash2 size={16} className="text-rose-600" /></button>
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
      {open && (
        <Modal title={editId ? 'Edit supplier' : 'Add supplier'} onClose={() => setOpen(false)}>
          <form onSubmit={save} className="space-y-3">
            {error && <div className="text-sm text-rose-600">{error}</div>}
            <div><label className="label">Name</label><input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="label">Phone</label><input className="input" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><label className="label">Email</label><input className="input" type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="label">Address</label><input className="input" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div><label className="label">City</label><input className="input" value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div><label className="label">Notes</label><textarea className="input" rows={3} value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <button className="btn-primary w-full" type="submit">Save</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
