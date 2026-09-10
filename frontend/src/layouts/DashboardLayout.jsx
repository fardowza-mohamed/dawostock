import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Pill,
  Truck,
  ShoppingCart,
  Warehouse,
  BarChart3,
  Bell,
  Settings,
  Users,
  X,
  Globe,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/medicines', label: 'Medicines', icon: Pill },
  { to: '/suppliers', label: 'Suppliers', icon: Truck },
  { to: '/sales', label: 'Sales', icon: ShoppingCart },
  { to: '/inventory', label: 'Inventory', icon: Warehouse, roles: ['admin', 'pharmacist'] },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'pharmacist'] },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/users', label: 'Users', icon: Users, roles: ['admin'] },
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

export default function DashboardLayout() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const items = NAV.filter((i) => !i.roles || i.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-900
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md">
            <Pill size={20} className="rotate-45" />
          </div>
          <div>
            <div className="font-bold leading-tight">DawoStock</div>
            <div className="text-[11px] text-slate-500">Somalia Pharmacy IMS</div>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setOpen(false)} type="button">
            <X size={18} />
          </button>
        </div>
        <nav className="space-y-1 p-3">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Public Website Switcher & User Profile */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 p-3.5 space-y-2 dark:border-slate-800">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl border border-teal-500/20 bg-teal-50/70 px-3 py-2 text-xs font-bold text-teal-800 hover:bg-teal-100 transition dark:border-slate-700 dark:bg-teal-950/30 dark:text-teal-300 dark:hover:bg-teal-950/60"
          >
            <Globe size={15} />
            <span>Bogga Dadweynaha (Website)</span>
          </Link>
          <div className="px-1 text-xs text-slate-500 dark:text-slate-400">
            <div className="font-semibold text-slate-700 dark:text-slate-200">{user?.name}</div>
            <div className="capitalize">{user?.role}</div>
          </div>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="lg:pl-64">
        <Navbar onMenu={() => setOpen(true)} path={location.pathname} />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
