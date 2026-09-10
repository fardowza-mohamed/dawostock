import {
  Pill,
  Truck,
  HeartPulse,
  Building,
  Activity,
  UserCheck,
  PhoneCall,
  CheckCircle2,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export default function Services() {
  const { settings } = useSettings();
  const phone = settings?.phone || '+252 61 5550000';
  const pharmacyName = settings?.pharmacyName || 'DawoStock Pharmacy';
  const city = settings?.city || 'Muqdisho';

  const servicesList = [
    {
      id: 'prescription',
      icon: Pill,
      title: 'Bixinta Dawooyinka Dhakhtarka',
      subtitle: 'Prescription Dispensing & Review',
      desc: 'Waxaan hubinnaa oo bixinnaa dhammaan dawooyinka dhakhaatiirtu qoraan (Prescriptions) iyadoo la marayo baaris adag oo dhanka qiyaasta (dosage) iyo badqabka bukaanka ah.',
      features: [
        'Hubinta isku-dhaca dawooyinka (Drug interactions)',
        'Sharraxaad faahfaahsan oo af-Soomaali ah',
        'Dawooyin 100% asalka ah oo shirkado caalami ah ka yimid',
      ],
      color: 'from-teal-500 to-emerald-600',
    },
    {
      id: 'delivery',
      icon: Truck,
      title: '24/7 Gaarsiinta Degdegga ah ee Guriga',
      subtitle: 'Express Home & Hospital Delivery',
      desc: `Haddii aadan awoodin inaad timaado farmashiyaha ama ay xaalad degdeg ah tahay, kooxdayada gaarsiinta ayaa dawada kuugu keenaysa gurigaaga 15-30 daqiiqo gudahood ${city}.`,
      features: [
        `Gaarsiinta dhammaan degmooyinka magaalada ${city}`,
        'Shixnadaha gobollada dalka oo lagu diro gaadiid degdeg ah',
        'Ilaalinta dawooyinka heerkulka qabow u baahan inta lagu jiro safarka',
      ],
      color: 'from-emerald-500 to-teal-700',
    },
    {
      id: 'chronic',
      icon: HeartPulse,
      title: 'Daryeelka Sonkorta & Dhiigkarka',
      subtitle: 'Chronic Disease Care & Refills',
      desc: 'Bukaanada qaba cudurada joogtada ah (Diabetes, Hypertension, Asthma) waxaan u heynaa qorshe gaar ah oo dawooyinkooda loogu xusuusiyo lana gaarsiiyo bil kasta.',
      features: [
        'Kayd joogto ah oo loogu talagalay dawooyinka sonkorta & dhiigkarka',
        'Xusuusinta xilliga daawadaadu dhammaanayso (Refill Reminder)',
        'Qalabka cabbiraada sonkorta & strips-ka asalka ah',
      ],
      color: 'from-rose-500 to-red-600',
    },
    {
      id: 'wholesale',
      icon: Building,
      title: 'Iibka Jumladada ah ee Isbitaalada',
      subtitle: 'Wholesale & Hospital Supply',
      desc: 'Waxaan jumlad ahaan dawooyin tayo sare leh u siinnaa isbitaallada, xarumaha MCH-yada, rugaha caafimaadka, iyo farmashiyeyaasha kale ee gobollada dalka.',
      features: [
        'Qiimayaal jumlad ah oo tartan galaya',
        'Bixinta qoraallada xisaabaadka & Invoices rasmi ah',
        'Shixnado ballaaran oo leh shahaadooyinka tayada (COA)',
      ],
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'screenings',
      icon: Activity,
      title: 'Baaritaanno Bilaash ah',
      subtitle: 'Free Blood Pressure & Glucose Checks',
      desc: 'Qof kasta oo booqda laamahayaga wuxuu heli karaa cabbirka dhiigkarka iyo baaritaanka heerka sonkorta dhiigga oo bilaash ah oo ay fulinayaan xirfadlayaal caafimaad.',
      features: [
        'Baaritaan degdeg ah oo 2 daqiiqo qaadanaya',
        'Talooyin ku saabsan cunnada iyo qaab-nololeedka caafimaadka leh',
        'Diiwaangelinta xogta bukaanka si dib loogu eego',
      ],
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'consultation',
      icon: UserCheck,
      title: 'La-Talinta Farmashiistaha',
      subtitle: 'Licensed Pharmacist Consultation',
      desc: 'Kala tasho farmashiistayaasheenna su’aalaha aad ka qabto dawooyinkaaga, xasaasiyadda, xilliga saxda ah ee qaadashada cuntada ka hor ama kadib.',
      features: [
        'La-tashiga tooska ah ee xarunta ama taleefanka',
        'Talooyin ku habboon haweenka uurka leh iyo carruurta',
        'Ilaalinta sirta caafimaad ee bukaanka',
      ],
      color: 'from-purple-500 to-violet-600',
    },
  ];

  const orderSteps = [
    {
      step: '01',
      title: 'Soo Dir Dalabkaaga',
      desc: 'Noo sheeg magaca dawada aad u baahan tahay ama warqadda dhakhtarka.',
    },
    {
      step: '02',
      title: 'Hubinta Farmashiistaha',
      desc: 'Farmashiistaha ayaa hubinaya helitaanka, qiyaasta saxda ah, waxaana laguu sheegayaa qiimaha.',
    },
    {
      step: '03',
      title: 'Lacag Bixin Fudud',
      desc: 'Ku bixi lacagta adeegga aad doorbidayso sida EVC Plus, ZAAD, Sahal, ama Kaarka Bangiga.',
    },
    {
      step: '04',
      title: 'Gaarsiin Degdeg Ah',
      desc: 'Waxaannu dawada kuugu keenaynaa goobtaada 15 ilaa 30 daqiiqo gudahood.',
    },
  ];

  return (
    <div className="py-12 lg:py-20">
      {/* 🚀 SERVICES HERO */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3.5 py-1 text-xs font-bold text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
            <Sparkles size={14} />
            <span>Services</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white leading-tight">
            Adeegyo Caafimaad oo{' '}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent dark:from-teal-400 dark:to-emerald-400">
              Casri Ah & Gaarsiin 24/7 Ah
            </span>
          </h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Waxaan bixinnaa adeegyo dhameystiran oo loogu talagalay bukaanka, qoysaska, rugaha caafimaadka,
            iyo isbitaallada ku yaalla magaalada {city} iyo dhammaan gobollada Soomaaliya.
          </p>
        </div>
      </section>

      {/* 🏥 SERVICES CARDS GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {servicesList.map((service) => (
            <div
              key={service.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-500/40 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr ${service.color} text-white shadow-lg`}
                >
                  <service.icon size={26} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">{service.title}</h3>
                <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">{service.subtitle}</p>
                <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{service.desc}</p>

                {/* Features List */}
                <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/contact"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-slate-800 hover:bg-teal-600 hover:text-white transition dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-teal-600 dark:hover:text-white"
                >
                  <PhoneCall size={14} />
                  <span>Weydii / Dalbo Adeeggan</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🧭 ORDERING PROCESS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 p-8 text-white sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Habka Dalabka (How It Works)
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              Sida Dawo Looga Dalbado {pharmacyName} 4 Tallaabo
            </h2>
            <p className="mt-2 text-xs text-slate-300">
              Dalabkaagu wuxuu kugu qaadanayaa daqiiqado kooban oo kaliya.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {orderSteps.map((s) => (
              <div
                key={s.step}
                className="relative rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3 backdrop-blur-sm"
              >
                <div className="text-2xl font-black text-teal-400/80">{s.step}</div>
                <h3 className="text-base font-bold text-white">{s.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/contact"
              className="btn-primary inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-bold shadow-xl"
            >
              <PhoneCall size={18} />
              <span>La Xiriir {pharmacyName} ({phone})</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 💳 SOMALIA MOBILE PAYMENT ACCEPTED */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400">
                <CreditCard size={16} />
                <span>Lacag-Bixinta Fudud</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Aqbalaadda Dhammaan Adeegyada Lacag-Bixinta ee Soomaaliya
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
                Uma baahnid inaad lacag caddaan ah sidato. Waxaad si toos ah ugu bixin kartaa EVC Plus, ZAAD, Sahal, e-Dahab, ama xisaabaadka bangiyada.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {['Hormuud EVC Plus', 'Telesom ZAAD', 'Golis SAHAL', 'Somtel e-Dahab', 'Premier Bank', 'Salaam Bank'].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-xl border border-teal-500/20 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-700/40"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
