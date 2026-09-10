import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill,
  TriangleAlert,
  PackageX,
  CalendarClock,
  Banknote,
  CalendarDays,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';
import Badge from '../components/Badge';
import { paymentLabel } from '../components/paymentMethods';

const COLORS = ['#0d9488', '#0284c7', '#d97706', '#e11d48', '#7c3aed', '#64748b'];

export default function Dashboard() {
  const { money } = useSettings();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard')
      .then((r) => setData(r.data.data))
      .catch(() => setError('Could not load dashboard.'));
  }, []);

  if (error) return <div className="card p-6 text-rose-600">{error}</div>;
  if (!data) return <Spinner />;

  const { totals, sales, recentSales, charts } = data;
  const pie = (charts.paymentBreakdown || []).map((p) => ({
    name: paymentLabel(p._id),
    value: p.value,
  }));

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Live snapshot of stock, expiry, and sales across your pharmacy." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total medicines" value={totals.medicines} icon={Pill} tone="teal" />
        <StatCard title="Low stock" value={totals.lowStock} icon={TriangleAlert} tone="amber" hint="Below minimum level" />
        <StatCard title="Out of stock" value={totals.outOfStock} icon={PackageX} tone="rose" />
        <StatCard title="Expiring in 30 days" value={totals.expiringSoon} icon={CalendarClock} tone="violet" />
        <StatCard title="Daily sales" value={money(sales.daily.total)} hint={`${sales.daily.count || 0} invoices today`} icon={Banknote} tone="sky" />
        <StatCard title="Monthly sales" value={money(sales.monthly.total)} hint={`${sales.monthly.count || 0} invoices this month`} icon={CalendarDays} tone="teal" />
        <StatCard title="Expired lots" value={totals.expired} icon={CalendarClock} tone="slate" />
        <StatCard title="Unread alerts" value={totals.unreadNotifications} icon={TriangleAlert} tone="amber" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="card p-4 xl:col-span-2">
          <div className="mb-3 font-medium">Revenue (last 14 days)</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.revenueByDay || []}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => money(v)} />
                <Area type="monotone" dataKey="revenue" stroke="#0d9488" fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-4">
          <div className="mb-3 font-medium">Payment mix (this month)</div>
          <div className="h-64">
            {pie.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">No sales yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                    {pie.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => money(v)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="card mt-6 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-medium">Recent transactions</div>
          <Link to="/sales" className="text-sm text-teal-700 dark:text-teal-300">View all</Link>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Cashier</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(recentSales || []).map((s) => (
                <tr key={s._id}>
                  <td className="font-medium">{s.invoiceNumber}</td>
                  <td>{s.customerName}</td>
                  <td><Badge value={paymentLabel(s.paymentMethod)} /></td>
                  <td>{money(s.totalAmount)}</td>
                  <td>{s.soldBy?.name}</td>
                  <td>{new Date(s.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
