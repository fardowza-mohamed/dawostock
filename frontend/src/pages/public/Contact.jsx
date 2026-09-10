import { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Building2,
  PhoneCall,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function Contact() {
  const { settings } = useSettings();
  const phone = settings?.phone || '+252 61 5550000';
  const whatsapp = settings?.whatsappNumber || settings?.phone || '+252 61 5550000';
  const emergencyPhone = settings?.emergencyPhone || '+252 61 5551111';
  const email = settings?.email || 'info@dawostock.so';
  const address = settings?.address || 'Maka Al Mukarama Road, Hodan, Muqdisho, Soomaaliya';
  const city = settings?.city || 'Muqdisho';
  const pharmacyName = settings?.pharmacyName || 'DawoStock Pharmacy';
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Dalab Dawo ama Baaris',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 500);
  };

  const branches = [
    {
      name: 'Laanta Xarunta Guud — Maka Al-Mukarama',
      address: address,
      phone: phone,
      hours: '24 Saac Furan (Degdeg & Gaarsiin)',
      status: 'Xarunta Guud',
    },
    {
      name: 'Laanta Suuqa Bakaaraha',
      address: 'Agagaarka Suuqa Dawada, Bakaaro, Muqdisho',
      phone: '+252 61 700 1001',
      hours: '6:30 AM - 9:00 PM',
      status: 'Jumlad & Tafaariiq',
    },
    {
      name: 'Laanta Isgoyska KM4',
      address: 'Isgoyska KM4, Wadada Garoonka, Hodan, Muqdisho',
      phone: '+252 61 700 3003',
      hours: '7:00 AM - 11:30 PM',
      status: 'Tafaariiq & Daryeel',
    },
  ];

  return (
    <div className="py-12 lg:py-20">
      {/* 📞 HERO HEADER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3.5 py-1 text-xs font-bold text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
            <PhoneCall size={14} />
            <span>Contact</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white leading-tight">
            Waxaan Diyaar u Nahay{' '}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent dark:from-teal-400 dark:to-emerald-400">
              Inaan Ku Caawinno
            </span>{' '}
            24/7
          </h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Haddii aad qabto su'aal ku saabsan helitaanka dawooyinka, dalab cusub, ama aad u baahan tahay la-talin farmashiiste,
            fadlan nagala soo xiriir khadadka tooska ah ama foomka hoose.
          </p>
        </div>
      </section>

      {/* 💬 CONTACT CARDS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Main Helpline */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
              <Phone size={24} />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Khadka Taleefanka</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Wacitaanka & Dalabaadka</p>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="mt-3 block text-sm font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400"
            >
              {phone}
            </a>
          </div>

          {/* Card 2: Emergency 24/7 */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <PhoneCall size={24} />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Khadka Degdegga ah (24/7)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Xaaladaha Degdegga ah</p>
            <a
              href={`tel:${emergencyPhone.replace(/\s+/g, '')}`}
              className="mt-3 block text-sm font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400"
            >
              {emergencyPhone}
            </a>
          </div>

          {/* Card 3: Official Email */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Mail size={24} />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Email Rasmi Ah</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Jumlad & Iskaashi</p>
            <a
              href={`mailto:${email}`}
              className="mt-3 block text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {email}
            </a>
          </div>

          {/* Card 4: Location */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <MapPin size={24} />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Goobta</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{city}, Soomaaliya</p>
            <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2">
              {address}
            </p>
          </div>
        </div>
      </section>

      {/* 📝 CONTACT FORM & BRANCHES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Noo Soo Dir Farriin (Send Us a Message)
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Fadlan buuxi xogtaada hoose, waxaan kugu soo jawaabi doonnaa waqti aad u kooban.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-2xl bg-emerald-50 p-6 text-center border border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300">
                    <CheckCircle2 size={30} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-emerald-900 dark:text-emerald-200">
                    Waad ku mahadsan tahay farriintaada!
                  </h3>
                  <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                    Farriintaadii si guul leh ayaa loo diray. Farmashiistaha {pharmacyName} ayaa kula soo xiriiri doona taleefanka aad noo reebtay ({formData.phone}).
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        subject: 'Dalab Dawo ama Baaris',
                        message: '',
                      });
                    }}
                    className="btn-primary mt-6 text-xs px-5 py-2.5"
                  >
                    Dir Farriin Kale
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Magacaaga oo Buuxa *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Tusaale: Axmed Maxamed Cali"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="label">Taleefan / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+252 61 XXX XXXX"
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Email (Haddii aad leedahay)</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="magac@email.com"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="label">Mawduuca / Ujeedada</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="input"
                      >
                        <option value="Dalab Dawo">Dalab Dawo (Medicine Order)</option>
                        <option value="La-Talin Farmashiiste">La-Talin Farmashiiste (Consultation)</option>
                        <option value="Iibka Jumladada Isbitaalada">Iibka Jumladada Isbitaalada (Wholesale)</option>
                        <option value="Su'aal Guud">Su'aal Guud (General Inquiry)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label">Farriintaada ama Faahfaahinta Dawada *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Qor magacyada dawooyinka aad rabto, cinwaankaaga gaarsiinta, ama su'aashaada caafimaad..."
                      className="input resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    <span>{loading ? 'Diraya farriinta...' : 'Dir Farriinta Hadda'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Info: Branches & WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2.5 text-teal-600 dark:text-teal-400 font-bold text-base">
                <Building2 size={20} />
                <span>Laamaha Farmashiyaha ee Muqdisho</span>
              </div>

              <div className="mt-5 space-y-4">
                {branches.map((b) => (
                  <div
                    key={b.name}
                    className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{b.name}</h4>
                      <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
                        {b.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                      <MapPin size={13} className="shrink-0 mt-0.5 text-slate-400" />
                      <span>{b.address}</span>
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <Clock size={13} className="shrink-0 text-slate-400" />
                      <span>{b.hours}</span>
                    </p>
                    <div className="pt-1.5 flex items-center gap-2">
                      <a
                        href={`tel:${b.phone.replace(/\s+/g, '')}`}
                        className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        {b.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Box with Dynamic Settings Number */}
            {cleanWhatsapp && (
              <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-lg shadow-emerald-700/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Wadahadalka Tooska ah ee WhatsApp</h3>
                    <p className="text-xs text-emerald-100">{whatsapp}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-emerald-50 leading-relaxed">
                  Waxaad toos WhatsApp ugala hadli kartaa farmashiistaha heeganka ah si laguu siiyo talo caafimaad ama laguu soo diro dawo degdeg ah.
                </p>
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=Asc%20${encodeURIComponent(
                    pharmacyName
                  )},%20waxaan%20rabaa%20in%20aan%20dawo%20weydiiyo.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-xs font-bold text-emerald-900 hover:bg-emerald-50 transition shadow"
                >
                  <MessageCircle size={15} className="text-emerald-600" />
                  <span>Fur WhatsApp Chat ({whatsapp})</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
