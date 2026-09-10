import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill,
  Search,
  CheckCircle2,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Clock,
  PhoneCall,
  Sparkles,
  Activity,
  Star,
  ChevronDown,
  FileText,
  Users,
  Award,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const SAMPLE_MEDICINES = [
  {
    name: 'Amoxicillin 500mg',
    category: 'Antibiotics',
    dosage: 'Capsule',
    inStock: true,
    indication: 'Infekshannada Bakteeriyada, Cuna-xanuunka & Laabta',
    tag: 'Caanka ah',
  },
  {
    name: 'Paracetamol 500mg',
    category: 'Pain Relief',
    dosage: 'Tablet',
    inStock: true,
    indication: 'Qandhada, Madax-xanuunka & Muruqyada',
    tag: 'Aasaasiga ah',
  },
  {
    name: 'Metformin 850mg',
    category: 'Diabetes Care',
    dosage: 'Tablet',
    inStock: true,
    indication: 'Xakamaynta Heerka Sonkorta Dhiigga (Type 2)',
    tag: 'Daryeelka Sonkorta',
  },
  {
    name: 'Amlodipine 5mg',
    category: 'Cardiovascular',
    dosage: 'Tablet',
    inStock: true,
    indication: 'Xakamaynta Dhiigkarka Sare & Wadnaha',
    tag: 'Dhiigkarka',
  },
  {
    name: 'Omeprazole 20mg',
    category: 'Gastrointestinal',
    dosage: 'Capsule',
    inStock: true,
    indication: 'Gaaska, Laab-jeexa & Boogaha Caloosha',
    tag: 'Gaaska & Caloosha',
  },
  {
    name: 'Vitamin C + Zinc 1000mg',
    category: 'Vitamins & Minerals',
    dosage: 'Effervescent',
    inStock: true,
    indication: 'Xoojinta Difaaca Jirka & Tamarta',
    tag: 'Difaaca Jirka',
  },
  {
    name: 'Oral Rehydration Salts (ORS)',
    category: 'Emergency & Pediatric',
    dosage: 'Sachet',
    inStock: true,
    indication: 'Fuuq-baxa, Shubanka & Matagga',
    tag: 'Carruurta & Fuuqbaxa',
  },
  {
    name: 'Azithromycin 500mg',
    category: 'Antibiotics',
    dosage: 'Tablet',
    inStock: true,
    indication: 'Infekshannada Neef-mareenka & Maqaarka',
    tag: 'Antibiotic Sare',
  },
];

const CATEGORIES = [
  'Dhammaan',
  'Antibiotics',
  'Pain Relief',
  'Diabetes Care',
  'Cardiovascular',
  'Gastrointestinal',
  'Vitamins & Minerals',
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Dhammaan');
  const [openFaq, setOpenFaq] = useState(0);
  const { settings } = useSettings();

  const phone = settings?.phone || '+252 61 5550000';
  const pharmacyName = settings?.pharmacyName || 'DawoStock Pharmacy';
  const city = settings?.city || 'Muqdisho';

  const filteredMedicines = SAMPLE_MEDICINES.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.indication.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      activeCategory === 'Dhammaan' || med.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const faqs = [
    {
      q: 'Sideen dawo ugu dalban karaa gurigayga ama goobta shaqada?',
      a: `Waxaad si toos ah noola soo xiriiri kartaa adigoo wacaya ${phone} ama foomka xiriirka buuxinaya. Waxaan dawada kugu gaarsiineynaa 15 ilaa 30 daqiiqo gudahood magaalada ${city}, gobolladana gaadiid degdeg ah.`,
    },
    {
      q: 'Ma soo diri karaa sawirka warqadda dhakhtarka (Prescription)?',
      a: 'Haa, dhab ahaan! Waxaad noo soo diri kartaa sawirka warqadda dhakhtarka (Rikoodhada). Farmashiistayaasheenna ayaa isla markiiba dib u eegi doona oo kuu diyaarin doona dawooyinkaaga.',
    },
    {
      q: 'Waa kuwee hababka lacag bixinta ee aad aqbashaan?',
      a: 'Waxaan aqbalnaa dhammaan adeegyada mobaylka ee Soomaaliya sida EVC Plus (Hormuud), ZAAD Service (Telesom), Sahal (Golis), Somtel e-Dahab, iyo sidoo kale xisaabaadka bangiyada sida Premier Bank, Salaam Somali Bank, & Kaararka Mastercard/Visa.',
    },
    {
      q: 'Dawooyinka aad iibisaan ma yihiin kuwo 100% tayo ahaan la hubiyey?',
      a: 'Haa. Dawooyinkayaga oo dhan waxaa laga keenaa shirkado caalami ah oo shatiyo buuxa haysta, waxaana la dhowraa shuruucda tayada & kaydinta heerkulka qabow (Cold-Chain) iyadoo la waafajinayo heerarka Wasaaradda Caafimaadka Soomaaliya.',
    },
    {
      q: 'Ma bixisaan baaritaanno bilaash ah xarumahaaga?',
      a: 'Haa, dhammaan laamahayaga waxaad ka heli kartaa baaritaanka dhiigkarka iyo cabbirka heerka sonkorta dhiigga oo bilaash ah oo ay fulinayaan kalkaaliyeyaal iyo farmashiistayaal khibrad leh.',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* 🌟 HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900/10 via-slate-50 to-white pt-12 pb-20 dark:from-teal-950/30 dark:via-slate-950 dark:to-slate-950 lg:pt-20 lg:pb-28">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-bold text-teal-700 dark:text-teal-300">
                <Sparkles size={14} className="text-teal-500" />
                <span>Farmashiyaha #1 ee La Isku Halayn Karo ee Soomaaliya</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white leading-[1.15]">
                Daryeel Caafimaad oo{' '}
                <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent dark:from-teal-400 dark:to-emerald-400">
                  La Isku Halayn Karo
                </span>{' '}
                & Dawooyin Tayo Leh
              </h1>

              <p className="mx-auto lg:mx-0 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300 leading-relaxed">
                {pharmacyName} waxay kuu keeneysaa dawooyin tayo sare leh oo asalka ah, la-talin
                toos ah oo farmashiiste, iyo gaarsiin degdeg ah oo gurigaaga ah 24 saac gudahood.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/contact"
                  className="btn-primary px-6 py-3.5 text-sm font-bold shadow-teal-500/25 inline-flex items-center gap-2"
                >
                  <PhoneCall size={18} />
                  <span>La Xiriir / Dalbo Hadda</span>
                </Link>

                <a
                  href="#check-medicine"
                  className="btn-secondary px-6 py-3.5 text-sm font-bold inline-flex items-center gap-2"
                >
                  <Search size={18} className="text-teal-600 dark:text-teal-400" />
                  <span>Baar Dawooyinka Yaalla</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>100% Dawooyin Asal Ah</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Gaarsiin Degdeg ah (15-30 daqiiqo)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>EVC Plus & Zaad La Aqbalo</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Hero Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl border border-teal-500/20 bg-gradient-to-br from-white via-teal-50/40 to-emerald-50/60 p-6 shadow-2xl shadow-teal-900/10 backdrop-blur-xl dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-850">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white font-bold">
                        <Pill size={20} className="rotate-45" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{pharmacyName}</h3>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">● 24/7 Adeeggu Waa Furan Yahay</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Diyaar Ah
                    </span>
                  </div>

                  {/* Prescription Upload Card Promo */}
                  <div className="mt-5 rounded-2xl bg-teal-600/10 border border-teal-500/20 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-teal-600 p-2 text-white shrink-0 mt-0.5">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Warqadaha Dhakhtarka & Dawooyinka</h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          Ma u baahan tahay dawooyinka dhakhtarku qoray? La xiriir farmashiistayaasheenna si laguu diyaariyo isla markiiba.
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/contact"
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-2 text-xs font-bold text-white shadow hover:bg-teal-700 transition"
                    >
                      <PhoneCall size={14} />
                      <span>La Xiriir Farmashiyaha</span>
                    </Link>
                  </div>

                  {/* Quick Feature Stats */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
                      <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                        <Clock size={16} />
                        <span className="text-xs font-bold">15 - 30 Mins</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Gaarsiin Degdeg Ah</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck size={16} />
                        <span className="text-xs font-bold">100% Asal Ah</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Dawooyin La Hubiyey</p>
                    </div>
                  </div>

                  {/* Direct Contact Bar */}
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-100 px-4 py-2.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <PhoneCall size={14} className="text-teal-600 dark:text-teal-400" />
                      <span className="font-semibold">{phone}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">Bilaash La-tashiga</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 NUMBERS & IMPACT COUNTER SECTION */}
      <section className="border-y border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400">100,000+</div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                Bukaan oo Loo Adeegay
              </p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">1,500+</div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                Nooc oo Dawooyin Asal ah
              </p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">24/7</div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                Adeeg Degdeg & Gaarsiin
              </p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-amber-500">99.8%</div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                Qanacsanaanta Macaamiisha
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔍 INTERACTIVE MEDICINE SEARCH & AVAILABILITY CHECKER */}
      <section id="check-medicine" className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
              <Pill size={13} />
              <span>Helitaanka Dawooyinka (Medicine Availability)</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Baar Dawooyinka Yaalla & Dalbo Toos
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Raadi dawada aad u baahan tahay si aad u xaqiijiso in ay noo taallo oo aad noola soo xiriirto.
            </p>
          </div>

          {/* Search Box & Filters */}
          <div className="mx-auto max-w-3xl mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Raadi magaca dawada (tusaale: Amoxicillin, Paracetamol, Metformin, Omeprazole...)"
                className="w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-4 py-3.5 text-sm shadow-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Tirtir
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                    activeCategory === cat
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Medicine Results Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredMedicines.map((med) => (
              <div
                key={med.name}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {med.category}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Diyaar Ah
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                    {med.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Nooca: <span className="font-medium text-slate-700 dark:text-slate-300">{med.dosage}</span>
                  </p>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {med.indication}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    to="/contact"
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-teal-50 py-2 text-xs font-bold text-teal-700 hover:bg-teal-600 hover:text-white transition dark:bg-teal-950/50 dark:text-teal-300 dark:hover:bg-teal-600 dark:hover:text-white"
                  >
                    <PhoneCall size={14} />
                    <span>Dalbo / Weydii Dawadan</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredMedicines.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
              <Pill className="mx-auto text-slate-400" size={32} />
              <h3 className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-200">Dawada aad raadisay lama helin</h3>
              <p className="text-xs text-slate-500 mt-1">
                Waxaan haysanaa in ka badan 1,500+ dawooyin. Fadlan nala soo xiriir toos si aan kuugu hubinno.
              </p>
              <Link
                to="/contact"
                className="btn-primary mt-4 inline-flex items-center gap-2 text-xs"
              >
                <PhoneCall size={14} />
                <span>La Xiriir Kooxda Farmashiyaha</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 💎 WHY CHOOSE US (MAXAA NOO DOORTAY?) */}
      <section className="py-16 lg:py-24 bg-white dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Tayada & Daryeelka
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Maxaa {pharmacyName} Ka Dhigay Farmashiyaha 1-aad?
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Waxaan u heellannahay ilaalinta caafimaadkaaga iyo qoyskaaga annagoo bixinna dawooyin certified ah iyo daryeel hufan.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-7 transition-all duration-300 hover:border-teal-500/30 hover:bg-white hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <ShieldCheck size={24} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">100% Dawooyin Asal Ah</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Dawooyinkayaga waxaa si toos ah looga keenaa shirkadaha ugu waaweyn caalamka, waxaana la maraa habraaca hubinta tayada si looga hortago dawooyinka tayada daran.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-7 transition-all duration-300 hover:border-teal-500/30 hover:bg-white hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Truck size={24} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">Gaarsiin Degdeg Ah Gurigaaga</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Kaddib markaad dalbato, kooxdayada gaarsiinta degdegga ah waxay dawada kuugu keenayaan gurigaaga ama goobtaada shaqada 15 ilaa 30 daqiiqo gudahood.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-7 transition-all duration-300 hover:border-teal-500/30 hover:bg-white hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Users size={24} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">Farmashiistayaal Khibrad Leh</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Waxaa laguu diyaariyey farmashiistayaal iyo dhakhaatiir shati leh oo kugu caawiya sharraxaadda qaadashada dawada iyo xiriirka dawooyinka kale.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-7 transition-all duration-300 hover:border-teal-500/30 hover:bg-white hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Activity size={24} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">Kaydinta Heerkulka (Cold-Chain)</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Dawooyinka u baahan qaboojiyaha (sida Insulin-ta, Talaallada, & Drop-yada qaarkood) waxaa lagu kaydiyaa qaboojiyeyaal casri ah oo 24 saac koronto joogto ah leh.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-7 transition-all duration-300 hover:border-teal-500/30 hover:bg-white hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <HeartHandshake size={24} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">Daryeelka Cudurada Guurguura</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Bukaanada qaba cudurada sida Sonkorta iyo Dhiigkarka waxaan u samaynaa qorshe billo ah oo joogto ah oo dawooyinkooda loogu geeyo waqtiga saxda ah.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-7 transition-all duration-300 hover:border-teal-500/30 hover:bg-white hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Award size={24} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">Qiimo Macquul ah & Daacadnimo</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Qiimayaal caddaalad ah oo ku habboon bulshada Soomaaliyeed, iyadoo aan wax faa'iido xad-dhaaf ah ama qiimo kordhin aan loo meel-dayin lagu darin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 CLEAN CTA BANNER */}
      <section className="py-12 bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                Daryeelka Caafimaadka & Dawooyinka
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                Ma U Baahan Tahay Dawooyin ama La-Talin Farmashiiste?
              </h2>
              <p className="text-sm text-teal-100 max-w-xl">
                Khadkeenna tooska ah ee taleefanka waa <span className="font-bold underline">{phone}</span> ama foomka xiriirka nagala soo hadal.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/contact"
                className="btn bg-white text-teal-900 hover:bg-teal-50 px-6 py-3.5 text-sm font-extrabold shadow-xl"
              >
                <span>La Xiriir Farmashiyaha</span>
              </Link>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="btn border border-teal-300 text-white hover:bg-white/10 px-5 py-3.5 text-sm font-bold"
              >
                <PhoneCall size={16} />
                <span>{phone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 💬 TESTIMONIALS (ARAGTIDA DADWEYNAHA) */}
      <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Qanacsanaanta Macaamiisha
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Maxay Macaamiishu Ka Yiraahdeen {pharmacyName}?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Review 1 */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 italic">
                  "Dawooyinka hooyadeey oo sonkor iyo dhiigkar qabta ayaan ka dalbadaa bil kasta. Gaarsiintoodu waa mid aad u degdeg badan, dawooyinkooduna waa kuwo tayo sare leh."
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                  AW
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Axmed Cali Warsame</h4>
                  <p className="text-[11px] text-slate-500">Maka Al-Mukarama, Muqdisho</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 italic">
                  "Sida ay ugu dadaalayaan ilaalinta dawooyinka qabowga u baahan sida Insulin-ta waa mid aan ku bogaadinayo. Waa farmashiyaha aan ugu kalsoonida badanahay."
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                  Dr. F
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Dr. Faadumo Xasan</h4>
                  <p className="text-[11px] text-slate-500">Dhakhtar Guud, Muqdisho</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 italic">
                  "Waxaan dhex joogay gurigeyga markii aan dalbaday dawada. 20 daqiiqo gudahood ayay albaabka iigu keeneen anigoo ku bixiyay EVC Plus. Aad baad u mahadsan tihiin!"
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-200">
                  SM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sahra Maxamed Cumar</h4>
                  <p className="text-[11px] text-slate-500">Hodan, Muqdisho</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ❓ FAQ SECTION */}
      <section className="py-16 lg:py-20 bg-white dark:bg-slate-900/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Su'aalaha Badanaa La Isweydiiyo
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              Jawaabaha Su'aalahaaga
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-slate-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
