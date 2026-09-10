const map = {
  active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  in_stock: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  low_stock: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  out_of_stock: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  expired: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  inactive: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  critical: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  info: 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  admin: 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  pharmacist: 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
  staff: 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
};

export default function Badge({ value }) {
  const key = String(value || '').toLowerCase();
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${map[key] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
      {String(value || '').replaceAll('_', ' ')}
    </span>
  );
}
