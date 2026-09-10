import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';

export default function Notifications() {
  const { refresh } = useNotifications();
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');

  const load = () => {
    const params = { page, limit: 15 };
    if (type) params.type = type;
    api.get('/notifications', { params }).then((r) => setData(r.data));
  };

  useEffect(() => { load(); }, [page, type]);

  const mark = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    load();
    refresh();
  };

  const markAll = async () => {
    await api.patch('/notifications/read-all');
    load();
    refresh();
  };

  const scan = async () => {
    await api.post('/notifications/scan');
    load();
    refresh();
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Low stock, out of stock, expiry (30/60/90 days), and sales alerts."
        actions={
          <>
            <button className="btn-secondary" type="button" onClick={scan}>Scan expiry</button>
            <button className="btn-primary" type="button" onClick={markAll}>Mark all read</button>
          </>
        }
      />
      <select className="input mb-4 max-w-xs" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
        <option value="">All types</option>
        <option value="low_stock">Low stock</option>
        <option value="out_of_stock">Out of stock</option>
        <option value="expiry">Expiry</option>
        <option value="sales">Sales</option>
      </select>
      {!data ? <Spinner /> : (
        <>
          <div className="space-y-2">
            {data.data.map((n) => (
              <div key={n._id} className={`card flex items-start justify-between gap-3 p-4 ${n.isRead ? 'opacity-70' : ''}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{n.title}</div>
                    <Badge value={n.severity} />
                    <Badge value={n.type} />
                  </div>
                  <div className="mt-1 text-sm text-slate-500">{n.message}</div>
                  <div className="mt-1 text-xs text-slate-400">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {!n.isRead && (
                  <button className="btn-secondary" type="button" onClick={() => mark(n._id)}>Read</button>
                )}
              </div>
            ))}
          </div>
          <Pagination pagination={data.pagination} onPage={setPage} />
        </>
      )}
    </div>
  );
}
