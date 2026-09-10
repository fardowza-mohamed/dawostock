import {
  ShieldCheck,
  Award,
  Heart,
  Target,
  Eye,
  Building2,
  CheckCircle,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export default function About() {
  const { settings } = useSettings();
  const pharmacyName = settings?.pharmacyName || 'DawoStock Pharmacy';
  const phone = settings?.phone || '+252 61 5550000';
  const address = settings?.address || 'Maka Al Mukarama Road, Hodan, Muqdisho, Soomaaliya';

  const values = [
    {
      icon: ShieldCheck,
      title: 'Tayo Sare & Dawooyin Asal Ah',
      desc: 'Waxaan hubinnaa in xabbo kasta oo dawo ah ay tahay mid certified ah oo laga keenay shirkado caalami ah oo sumcad leh.',
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-300',
    },
    {
      icon: Heart,
      title: 'Daryeelka Bukaanada',
      desc: 'Bukaanada iyo qoysaskoodu waa diiradda koowaad ee adeegyadayada. Waxaan u heellannahay xalinta dhibaatooyinka caafimaad.',
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300',
    },
    {
      icon: Award,
      title: 'Xirfad & Khibrad Sare',
      desc: 'Kooxdeenu waxay ka kooban tahay farmashiistayaal iyo dhakhaatiir shatiyo buuxa leh oo muddo dheer ka soo shaqeeyay daryeelka caafimaadka.',
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300',
    },
    {
      icon: Target,
      title: 'Hufnaan & Daacadnimo',
      desc: 'Qiimayaal caddaalad ah, sharraxaad sax ah oo ku saabsan waxyeellada iyo faa’iidada dawada, iyo xog cad oo la siiyo macmiilka.',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300',
    },
  ];

  const team = [
    {
      name: 'Dr. Aamina Xasan',
      role: 'Madaxa Farmashiistayaasha & Maamulaha Guud',
      qualification: 'PharmD, Clinical Pharmacy Specialist',
      experience: '12+ Sano oo Khibrad Caafimaad ah',
    },
    {
      name: 'Dr. Cabdiqani Maxamed',
      role: 'Farmashiiste Sare & Maareeyaha Tayada',
      qualification: 'B.Pharm, Cold-Chain & Drug Safety Expert',
      experience: '9+ Sano oo Khibrad ah',
    },
    {
      name: 'Hodan Cali Cismaan',
      role: 'Madaxa Daryeelka Macaamiisha & Gaarsiinta',
      qualification: 'BSc. Health Sciences & Logistics',
      experience: '6+ Sano oo Khibrad ah',
    },
  ];

  const branches = [
    {
      name: 'Laanta Xarunta Guud — Maka Al-Mukarama',
      address: address,
      phone: phone,
      hours: '24 Saac Furan (Degdeg & Gaarsiin)',
    },
    {
      name: 'Laanta Suuqa Bakaaraha (Jumlad & Tafaariiq)',
      address: 'Agagaarka Suuqa Dawada, Bakaaro, Muqdisho',
      phone: '+252 61 700 1001',
      hours: '6:30 AM - 9:00 PM',
    },
    {
      name: 'Laanta Isgoyska KM4',
      address: 'Isgoyska KM4, Wadada Garoonka, Hodan, Muqdisho',
      phone: '+252 61 700 3003',
      hours: '7:00 AM - 11:30 PM',
    },
  ];

  return (
    <div className="py-12 lg:py-20">
      {/* 🏥 HERO / HEADER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3.5 py-1 text-xs font-bold text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
            <Building2 size={14} />
            <span>About Us</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white leading-tight">
            Waxaan u Taagannahay{' '}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent dark:from-teal-400 dark:to-emerald-400">
              Bedbaadada & Caafimaadka
            </span>{' '}
            Bulshada Soomaaliyeed
          </h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {pharmacyName} waxaa la aasaasay iyadoo la hiigsanayo in la helo farmashiye casri ah oo buuxiya
            baahiyaha dawooyinka asalka ah ee dalka, hagaajiya helitaanka dawooyinka degdegga ah,
            isla markaana bixiya daryeel ku dhisan naxariis iyo aqoon sare.
          </p>
        </div>
      </section>

      {/* 📖 OUR STORY & MISSION / VISION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-center">
          {/* Story */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Sheekadeena (Our Story)
            </span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              Sida {pharmacyName} Ay Ku Bilaabatay
            </h2>
            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                {pharmacyName} waxay ku dhalatay baahi weyn oo ka jirtay suuqa Soomaaliya—taasoo ahayd helitaanka dawooyin 100% tayo ahaan la hubiyey, loona kaydiyey si waafaqsan shuruucda caalamiga ah ee heerkulka dawooyinka (Cold Chain).
              </p>
              <p>
                Maanta, {pharmacyName} waxay u adeegtaa kumanaan bukaan ah bil kasta, waxayna dawooyin siisaa isbitaallada, rugaha caafimaadka, iyo qoysaska ku nool Muqdisho iyo gobollada dalka oo dhan, iyadoo adeegsanaysa nidaam casri ah.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-emerald-500" />
                <span>Shatiga Wasaaradda Caafimaadka</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} className="text-emerald-500" />
                <span>Guddiga Farmashiyada</span>
              </div>
            </div>
          </div>

          {/* Mission & Vision Cards */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-50/70 to-emerald-50/70 p-7 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/80">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white font-bold">
                  <Target size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hadafkayaga (Mission)</h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                In qof kasta oo Soomaali ah uu si fudud, degdeg ah, oo qiimo macquul ah ku helo dawooyin tayo sare leh oo asalka ah, iyadoo la ilaalinayo badqabka iyo sharafta bukaanka.
              </p>
            </div>

            <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-50/70 to-indigo-50/70 p-7 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/80">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
                  <Eye size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Aragtidayada (Vision)</h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Inaan noqonno shabakadda farmashiyada iyo qaybinta dawooyinka ee ugu ballaaran uguna aaminada badan Geeska Afrika, oo adeegsanaysa habraacyada ugu dambeeya ee caafimaadka.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 CORE VALUES (QIIMAYAASHA AASAASIGA AH) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Mabaadi'da Shaqadeena
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Qiimayaasha Asaasiga ah ee {pharmacyName}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${v.color}`}>
                <v.icon size={24} />
              </div>
              <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">{v.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 👥 LEADERSHIP & PHARMACIST TEAM */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Khibrad & Aqoonyahanno
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Kooxda Farmashiistayaasha & Maamulka
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-2xl font-black text-white shadow-md">
                {member.name.split(' ')[1]?.[0] || 'D'}
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">{member.name}</h3>
              <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">{member.role}</p>
              <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <p className="font-medium">{member.qualification}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{member.experience}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 📍 BRANCHES NETWORK */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 to-slate-950 p-8 text-white sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Shabakadda Laamahayaga
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              Laamaha {pharmacyName} ee Magaalada Muqdisho
            </h2>
            <p className="mt-2 text-xs text-slate-300">
              Booqo laanta kuugu dhow ama ka dalbo gaarsiin toos ah oo gurigaaga laguugu keenayo.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {branches.map((b) => (
              <div
                key={b.name}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3"
              >
                <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                  <Building2 size={18} />
                  <span>{b.name}</span>
                </div>
                <p className="text-xs text-slate-300 flex items-start gap-2">
                  <MapPin size={14} className="shrink-0 text-slate-400 mt-0.5" />
                  <span>{b.address}</span>
                </p>
                <p className="text-xs text-slate-300 flex items-center gap-2">
                  <Clock size={14} className="shrink-0 text-slate-400" />
                  <span>{b.hours}</span>
                </p>
                <div className="pt-2 border-t border-slate-800">
                  <a
                    href={`tel:${b.phone.replace(/\s+/g, '')}`}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
                  >
                    <span>Wac: {b.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2 text-xs px-6 py-3">
              <span>Faahfaahinta Laamaha & Xiriirka</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
