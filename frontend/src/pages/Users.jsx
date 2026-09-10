import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api, { getError } from '../services/api';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import Badge from '../components/Badge';

const empty = { name: '', email: '', password: '', role: 'staff', phone: '', isActive: true };

export default function Users() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/users', { params: { page, limit: 10 } }).then((r) => setData(r.data));
  useEffect(() => { load(); }, [page]);

  const save = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form };
      if (editId && !payload.password) delete payload.password;
      if (editId) await api.put(`/users/${editId}`, payload);
      else await api.post('/users', payload);
      setOpen(false);
      load();
    } catch (err) {
      setError(getError(err));
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      load();
    } catch (err) {
      alert(getError(err));
    }
  };

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Admin, pharmacist, and staff accounts with role-based access."
        actions={
          <button className="btn-primary" type="button" onClick={() => { setForm(empty); setEditId(null); setOpen(true); }}>
            <Plus size={16} /> Add user
          </button>
        }
      />
      {!data ? <Spinner /> : (
        <>
          <div className="table-wrap bg-white dark:bg-slate-900">
            <table className="data">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Last login</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.data.map((u) => (
                  <tr key={u.id}>
                    <td className="font-medium">{u.name}</td>
                    <td>{u.email}</td>
                    <td><Badge value={u.role} /></td>
                    <td>{u.phone}</td>
                    <td><Badge value={u.isActive ? 'active' : 'inactive'} /></td>
                    <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : '—'}</td>
                    <td>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => { setForm({ ...u, password: '' }); setEditId(u.id); setOpen(true); }}><Pencil size={16} className="text-teal-700" /></button>
                        <button type="button" onClick={() => remove(u.id)}><Trash2 size={16} className="text-rose-600" /></button>
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
        <Modal title={editId ? 'Edit user' : 'Add user'} onClose={() => setOpen(false)}>
          <form onSubmit={save} className="space-y-3">
            {error && <div className="text-sm text-rose-600">{error}</div>}
            <div><label className="label">Name</label><input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="label">Email</label><input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="label">Password {editId && '(leave blank to keep)'}</label><input className="input" type="password" value={form.password || ''} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editId} minLength={8} /></div>
            <div>
              <label className="label">Role</label>
              <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="admin">Admin</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div><label className="label">Phone</label><input className="input" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            {editId && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                Active
              </label>
            )}
            <button className="btn-primary w-full" type="submit">Save</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
