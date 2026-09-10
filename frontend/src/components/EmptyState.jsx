export default function EmptyState({ title = 'Nothing here yet', hint }) {
  return (
    <div className="py-12 text-center text-sm text-slate-500">
      <div className="font-medium text-slate-700 dark:text-slate-200">{title}</div>
      {hint && <div className="mt-1">{hint}</div>}
    </div>
  );
}
