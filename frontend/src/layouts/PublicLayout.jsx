import { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import {
  Pill,
  Phone,
  Mail,
  MapPin,
  Clock,
  Menu,
  X,
  ShieldCheck,
  HeartPulse,
  Sun,
  Moon,
  MessageCircle,
  Truck,
  CreditCard,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });
  const { settings } = useSettings();
  const location = useLocation();

  const phone = settings?.phone || '+252 61 5550000';
  const whatsapp = settings?.whatsappNumber || settings?.phone || '+252 61 5550000';
  const emergencyPhone = settings?.emergencyPhone || '+252 61 5551111';
  const address = settings?.address || 'Maka Al Mukarama Road, Hodan, Muqdisho, Soomaaliya';
  const city = settings?.city || 'Muqdisho';
  const email = settings?.email || 'info@dawostock.so';
  const pharmacyName = settings?.pharmacyName || 'DawoStock Pharmacy';

  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/services', label: 'Services' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 px-4 py-2 text-xs font-medium text-white shadow-inner">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              24/7 Furan
            </span>
            <span className="hidden sm:inline text-slate-300">
              🚑 Adeegga Degdegga ah & Gaarsiinta Dawooyinka ee {city} & Gobollada oo Dhan
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
            >
              <Phone size={13} className="text-emerald-400" />
              <span>{phone}</span>
            </a>
            <span className="hidden md:inline text-slate-600">|</span>
            <div className="hidden md:flex items-center gap-1.5 text-slate-300">
              <MapPin size={13} className="text-emerald-400" />
              <span>{address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Glassmorphism Header (Public Only) */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-nav shadow-lg shadow-slate-900/5 py-3'
            : 'bg-white/95 dark:bg-slate-950/95 py-4 border-b border-slate-200/60 dark:border-slate-800/60'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-lg shadow-teal-500/25 transition-transform duration-300 group-hover:scale-105">
              <Pill size={22} className="rotate-45" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Dawo<span className="text-teal-600 dark:text-teal-400">Stock</span>
                </span>
                <span className="rounded-md bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
                  Pharmacy
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Daryeelka Caafimaadkaaga & Dawooyin Tayo Leh
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Header Actions (Theme Toggle & Direct Call Button) */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle Theme"
              title="Beddel Midabka"
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-bold shadow-md"
            >
              <Phone size={14} />
              <span>Wac Farmashiyaha</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white/95 px-4 pt-3 pb-6 backdrop-blur-xl lg:hidden dark:border-slate-800 dark:bg-slate-950/95">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-teal-700"
              >
                <Phone size={16} />
                <span>Wac Farmashiyaha ({phone})</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Body */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Modern Public Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 dark:border-slate-800 dark:bg-slate-950">
        {/* Top Info Bar */}
        <div className="border-b border-slate-800 bg-slate-950/60 py-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Truck size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Gaarsiin Degdeg Ah</h4>
                <p className="text-xs text-slate-400">{city} & Gobollada oo dhan</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">100% Dawooyin Asal Ah</h4>
                <p className="text-xs text-slate-400">Shirkado Caalami ah & Hubin Tayo</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <HeartPulse size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">La-Talin Farmashiiste</h4>
                <p className="text-xs text-slate-400">Dhakhaatiir & Farmashiistayaal Khibrad Leh</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <CreditCard size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Lacag-Bixinta Soomaaliya</h4>
                <p className="text-xs text-slate-400">EVC Plus, Zaad, Sahal & Cards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Column 1: Brand & Summary */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 text-white font-bold">
                  <Pill size={20} className="rotate-45" />
                </div>
                <div>
                  <span className="text-xl font-extrabold text-white">
                    Dawo<span className="text-teal-400">Stock</span>
                  </span>
                  <span className="ml-2 text-xs text-slate-400">Somalia</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
                {pharmacyName} waa farmashiye casri ah oo bixiya dawooyin tayo sare leh oo asalka ah,
                daryeel caafimaad oo la isku halayn karo, iyo gaarsiin degdeg ah dhammaan gobollada Soomaaliya.
              </p>
              <div className="pt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Hababka Lacag Bixinta ee la Aqbalo:
                </div>
                <div className="flex flex-wrap gap-2">
                  {['EVC Plus', 'ZAAD Service', 'Sahal', 'e-Dahab', 'Premier Bank', 'Mastercard'].map((pm) => (
                    <span
                      key={pm}
                      className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] font-medium text-teal-300"
                    >
                      {pm}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Bogagga Muhiimka ah</h3>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link to="/" className="hover:text-teal-400 transition">Home</Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-teal-400 transition">About Us</Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-teal-400 transition">Services</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-teal-400 transition">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Services Summary */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Adeegyadayada</h3>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
                <li>Bixinta Dawooyinka Dhakhtarka</li>
                <li>Gaarsiinta Guriga ee 24/7</li>
                <li>Daryeelka Sonkorta & Dhiigkarka</li>
                <li>Iibka Jumladada ee Rugaha Caafimaadka</li>
                <li>La-Talinta Farmashiistaha</li>
                <li>Baaritaanka Dhiigkarka ee Bilaashka ah</li>
              </ul>
            </div>

            {/* Column 4: Contact & Hours */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Xarunta & Xiriirka</h3>
              <ul className="mt-4 space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-teal-400 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={16} className="text-teal-400 shrink-0" />
                  <span>{phone} / {emergencyPhone}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={16} className="text-teal-400 shrink-0" />
                  <span>{email}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock size={16} className="text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Saacadaha:</span> 24 Saac (Degdeg) <br />
                    Shaqada Caadiga: 7:00 AM - 11:30 PM
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="mt-10 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p>© {new Date().getFullYear()} {pharmacyName}. Xuquuqda oo dhan way dhowran tahay.</p>
              <p className="text-[11px] text-slate-500">
                Ku shaqeeya shuruucda & shatiyada Wasaaradda Caafimaadka Soomaaliya.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Single Dynamic WhatsApp Floating Action Button */}
      {cleanWhatsapp && (
        <a
          href={`https://wa.me/${cleanWhatsapp}?text=Asc%20${encodeURIComponent(
            pharmacyName
          )},%20waxaan%20rabaa%20in%20aan%20dawo%20weydiiyo.`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl shadow-emerald-500/50 transition-all duration-300 hover:scale-110 hover:bg-emerald-600 focus:outline-none"
          title={`Wadahadal WhatsApp (${whatsapp})`}
          aria-label="WhatsApp Support"
        >
          <MessageCircle size={28} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-400 border-2 border-white"></span>
          </span>
        </a>
      )}
    </div>
  );
}
