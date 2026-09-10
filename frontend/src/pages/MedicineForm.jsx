import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getError } from '../services/api';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';

const CATEGORIES = [
  'Analgesic', 'Antibiotic', 'Antimalarial', 'Antiviral', 'Antifungal',
  'Cardiovascular', 'Diabetes', 'Gastrointestinal', 'Respiratory',
  'Vitamin & Supplement', 'Dermatology', 'Pediatric', 'ORS & Electrolyte', 'Vaccine', 'Other',
];

const empty = {
  name: '',
  genericName: '',
  brandName: '',
  category: 'Other',
  batchNumber: '',
  supplier: '',
  purchasePrice: '',
  sellingPrice: '',
  quantity: '',
  minStockLevel: 10,
  unit: 'unit',
  expiryDate: '',
  manufacturingDate: '',
  barcode: '',
  description: '',
  location: 'Main Store',
  status: 'active',
};

export default function MedicineForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(Boolean(id));
  const isEdit = Boolean(id);

  useEffect(() => {
    api.get('/suppliers', { params: { limit: 100 } }).then((r) => setSuppliers(r.data.data));
    if (id) {
      api.get(`/medicines/${id}`).then((r) => {
        const m = r.data.data;
        setForm({
          ...empty,
          ...m,
          supplier: m.supplier?._id || m.supplier,
          expiryDate: m.expiryDate?.slice(0, 10) || '',
          manufacturingDate: m.manufacturingDate?.slice(0, 10) || '',
        });
      }).catch((e) => setError(getError(e))).finally(() => setLoading(false));
    }
  }, [id]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, purchasePrice: Number(form.purchasePrice), sellingPrice: Number(form.sellingPrice), quantity: Number(form.quantity), minStockLevel: Number(form.minStockLevel) };
      if (isEdit) await api.put(`/medicines/${id}`, payload);
      else await api.post('/medicines', payload);
      navigate('/medicines');
    } catch (err) {
      setError(getError(err));
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title={isEdit ? 'Edit medicine' : 'Add medicine'} subtitle="Lot-level inventory record." />
      <form onSubmit={submit} className="card grid gap-4 p-5 md:grid-cols-2">
        {error && <div className="md:col-span-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
        <div><label className="label">Medicine name</label><input className="input" required value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
        <div><label className="label">Generic name</label><input className="input" required value={form.genericName} onChange={(e) => set('genericName', e.target.value)} /></div>
        <div><label className="label">Brand name</label><input className="input" value={form.brandName} onChange={(e) => set('brandName', e.target.value)} /></div>
        <div>
          <label className="label">Category</label>
          <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div><label className="label">Batch number</label><input className="input" required value={form.batchNumber} onChange={(e) => set('batchNumber', e.target.value)} /></div>
        <div>
          <label className="label">Supplier</label>
          <select className="input" required value={form.supplier} onChange={(e) => set('supplier', e.target.value)}>
            <option value="">Select supplier</option>
            {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
        <div><label className="label">Purchase price</label><input className="input" type="number" step="0.01" required value={form.purchasePrice} onChange={(e) => set('purchasePrice', e.target.value)} /></div>
        <div><label className="label">Selling price</label><input className="input" type="number" step="0.01" required value={form.sellingPrice} onChange={(e) => set('sellingPrice', e.target.value)} /></div>
        <div><label className="label">Quantity</label><input className="input" type="number" required value={form.quantity} onChange={(e) => set('quantity', e.target.value)} /></div>
        <div><label className="label">Min stock level</label><input className="input" type="number" value={form.minStockLevel} onChange={(e) => set('minStockLevel', e.target.value)} /></div>
        <div><label className="label">Manufacturing date</label><input className="input" type="date" required value={form.manufacturingDate} onChange={(e) => set('manufacturingDate', e.target.value)} /></div>
        <div><label className="label">Expiry date</label><input className="input" type="date" required value={form.expiryDate} onChange={(e) => set('expiryDate', e.target.value)} /></div>
        <div><label className="label">Barcode</label><input className="input" value={form.barcode} onChange={(e) => set('barcode', e.target.value)} /></div>
        <div><label className="label">Location</label><input className="input" value={form.location} onChange={(e) => set('location', e.target.value)} /></div>
        <div className="md:col-span-2"><label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
        <div className="md:col-span-2 flex gap-2">
          <button className="btn-primary" type="submit">{isEdit ? 'Save changes' : 'Create medicine'}</button>
          <button className="btn-secondary" type="button" onClick={() => navigate('/medicines')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
