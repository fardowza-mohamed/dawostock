import { useEffect, useState } from 'react';
import api, { getError } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';

export default function Settings() {
  const { settings, setSettings, refresh } = useSettings();
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      setForm({
        ...settings,
        whatsappNumber: settings.whatsappNumber || '+252 61 5550000',
        emergencyPhone: settings.emergencyPhone || '+252 61 5551111',
        expiryAlertDays: (settings.expiryAlertDays || [30, 60, 90]).join(','),
      });
    }
  }, [settings]);

  const save = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        taxRate: Number(form.taxRate),
        lowStockThreshold: Number(form.lowStockThreshold),
        expiryAlertDays: String(form.expiryAlertDays)
          .split(',')
          .map((n) => Number(n.trim()))
          .filter(Boolean),
      };
      const { data } = await api.put('/settings', payload);
      setSettings(data.data);
      setMsg('Settings saved successfully.');
    } catch (err) {
      setError(getError(err));
    }
  };

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('logo', file);
    const { data } = await api.post('/settings/logo', fd);
    setSettings(data.data);
    await refresh();
    setMsg('Logo uploaded.');
  };

  if (!form) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Pharmacy profile, contacts, WhatsApp integration, tax, currency, and alert windows."
      />
      <form onSubmit={save} className="card grid gap-4 p-5 md:grid-cols-2">
        {msg && <div className="md:col-span-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">{msg}</div>}
        {error && <div className="md:col-span-2 text-sm font-semibold text-rose-600 dark:text-rose-400">{error}</div>}

        <div>
          <label className="label">Pharmacy Name</label>
          <input
            className="input"
            value={form.pharmacyName || ''}
            onChange={(e) => setForm({ ...form, pharmacyName: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Official Email</label>
          <input
            className="input"
            type="email"
            value={form.email || ''}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Main Phone Number</label>
          <input
            className="input"
            value={form.phone || ''}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+252 61 5550000"
          />
        </div>

        <div>
          <label className="label">WhatsApp Number (For Website Chat & Ordering)</label>
          <input
            className="input"
            value={form.whatsappNumber || ''}
            onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
            placeholder="+252 61 5550000"
          />
        </div>

        <div>
          <label className="label">Emergency Hotline (24/7)</label>
          <input
            className="input"
            value={form.emergencyPhone || ''}
            onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })}
            placeholder="+252 61 5551111"
          />
        </div>

        <div>
          <label className="label">City</label>
          <input
            className="input"
            value={form.city || ''}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Physical Address</label>
          <input
            className="input"
            value={form.address || ''}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Currency</label>
          <select
            className="input"
            value={form.currency}
            onChange={(e) =>
              setForm({
                ...form,
                currency: e.target.value,
                currencySymbol: e.target.value === 'SOS' ? 'Ssh' : '$',
              })
            }
          >
            <option value="USD">USD</option>
            <option value="SOS">SOS — Somali Shilling</option>
          </select>
        </div>

        <div>
          <label className="label">Currency Symbol</label>
          <input
            className="input"
            value={form.currencySymbol || ''}
            onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Tax Rate (%)</label>
          <input
            className="input"
            type="number"
            value={form.taxRate}
            onChange={(e) => setForm({ ...form, taxRate: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Low Stock Threshold (Units)</label>
          <input
            className="input"
            type="number"
            value={form.lowStockThreshold}
            onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Expiry Alert Windows (Days, comma-separated)</label>
          <input
            className="input"
            value={form.expiryAlertDays}
            onChange={(e) => setForm({ ...form, expiryAlertDays: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Receipt Footer Note</label>
          <input
            className="input"
            value={form.receiptFooter || ''}
            onChange={(e) => setForm({ ...form, receiptFooter: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Pharmacy Logo</label>
          {form.logo && <img src={form.logo} alt="Logo" className="mb-2 h-16 rounded-lg object-contain" />}
          <input type="file" accept="image/*" onChange={upload} />
        </div>

        <div className="md:col-span-2 pt-2">
          <button className="btn-primary" type="submit">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
