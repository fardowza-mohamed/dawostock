import { Bell, Menu, Moon, Search, Sun, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useState } from 'react';

export default function Navbar({ onMenu, path }) {
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const { unread } = useNotifications();
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/medicines?search=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <button type="button" className="rounded-lg p-2 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800" onClick={onMenu}>
        <Menu size={20} />
      </button>
      <div className="hidden text-sm font-medium text-slate-500 md:block capitalize">
        {path === '/' ? 'Dashboard' : path.replace('/', '').replace('-', ' ')}
      </div>
      <form onSubmit={onSearch} className="relative mx-auto hidden w-full max-w-md md:block">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          className="input pl-9"
          placeholder="Search medicines, barcode, batch…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </form>
      <div className="ml-auto flex items-center gap-1">
        <button type="button" onClick={toggle} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" title="Toggle theme">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <Link to="/notifications" className="relative rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] text-white">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Link>
        <div className="ml-2 hidden items-center gap-2 sm:flex">
          <div className="h-8 w-8 rounded-full bg-teal-600 text-center text-sm leading-8 text-white">
            {user?.name?.[0] || 'U'}
          </div>
        </div>
        <button type="button" onClick={logout} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" title="Sign out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
