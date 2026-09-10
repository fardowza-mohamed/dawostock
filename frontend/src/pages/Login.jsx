import { useState } from 'react';
import { Pill, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getError } from '../services/api';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@pharmacy.so');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(getError(err));
    }
  };

  const autofill = (em, pw) => {
    setEmail(em);
    setPassword(pw);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-700/40 via-slate-950 to-slate-950" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
        <div className="hidden w-1/2 pr-12 text-white lg:block">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-teal-300 hover:bg-white/10 transition"
          >
            <ArrowLeft size={16} />
            <span>Ku Noqo Bogga Dadweynaha (Back to Home)</span>
          </Link>

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white shadow-lg">
              <Pill size={24} className="rotate-45" />
            </div>
            <div>
              <div className="text-2xl font-bold">DawoStock</div>
              <div className="text-xs text-teal-300 font-medium">Pharmacy Inventory & Management System</div>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight">
            Nidaamka Maamulka & Kaydka Dawooyinka ee Soomaaliya
          </h1>
          <p className="mt-4 max-w-md text-sm text-slate-300 leading-relaxed">
            La soco dawooyinka, iibka POS, lacag-bixinta EVC Plus / Zaad / Sahal, dawooyinka dhici raba,
            iyo xisaabaadka maalinlaha ah laga bilaabo Muqdisho ilaa Hargeysa.
          </p>
          <ul className="mt-8 space-y-2.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-teal-400" />
              <span>Maamul shaqo oo ku dhisan doorar (Admin, Pharmacist, Staff)</span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-teal-400" />
              <span>Iibka tooska ah ee POS & bixinta qaansheegta (Invoices)</span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-teal-400" />
              <span>Digniinaha tooska ah ee dawooyinka gabaabsi noqday ama dhacaya</span>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-md lg:ml-auto">
          {/* Mobile Back Link */}
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 hover:text-teal-200 lg:hidden"
          >
            <ArrowLeft size={14} />
            <span>Ku Noqo Bogga Hore</span>
          </Link>

          <form onSubmit={submit} className="card p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gal Nidaamka</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Geli xogta akoonkaaga DawoStock</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Pill size={20} className="rotate-45" />
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
                {error}
              </div>
            )}

            <label className="label mt-6">Email-ka *</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pharmacy.so"
              required
            />

            <label className="label mt-4">Password-ka *</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <button className="btn-primary mt-6 w-full py-3 text-sm font-bold shadow-md" disabled={loading} type="submit">
              {loading ? 'Gelaya nidaamka…' : 'Gal Nidaamka (Sign In)'}
            </button>

            {/* Demo Quick Fill Accounts */}
            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300">
              <div className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                <Sparkles size={14} className="text-teal-500" />
                <span>Akoonnada Tijaabada (Demo Click-to-Fill):</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <button
                  type="button"
                  onClick={() => autofill('admin@pharmacy.so', 'Admin@123')}
                  className="rounded-lg border border-teal-200 bg-teal-50 py-1.5 text-[11px] font-bold text-teal-800 hover:bg-teal-100 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-300"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => autofill('pharmacist@pharmacy.so', 'Pharma@123')}
                  className="rounded-lg border border-blue-200 bg-blue-50 py-1.5 text-[11px] font-bold text-blue-800 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300"
                >
                  Pharmacist
                </button>
                <button
                  type="button"
                  onClick={() => autofill('staff@pharmacy.so', 'Staff@123')}
                  className="rounded-lg border border-purple-200 bg-purple-50 py-1.5 text-[11px] font-bold text-purple-800 hover:bg-purple-100 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-300"
                >
                  Staff
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
