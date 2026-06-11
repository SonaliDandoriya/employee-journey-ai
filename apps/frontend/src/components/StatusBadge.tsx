const styles: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  onboarding: 'bg-sky-100 text-sky-700',
  offboarding: 'bg-slate-200 text-slate-700',
  pre_boarding: 'bg-violet-100 text-violet-700',
  completed: 'bg-emerald-100 text-emerald-700',
  in_progress: 'bg-amber-100 text-amber-700',
  not_started: 'bg-slate-100 text-slate-600',
  overdue: 'bg-red-100 text-red-700',
  pending: 'bg-violet-100 text-violet-700',
  positive: 'bg-emerald-100 text-emerald-700',
  neutral: 'bg-amber-100 text-amber-700',
  needs_attention: 'bg-red-100 text-red-700',
  exceeds: 'bg-emerald-100 text-emerald-700',
  meets: 'bg-sky-100 text-sky-700',
  below: 'bg-red-100 text-red-700',
  not_reviewed: 'bg-slate-100 text-slate-600',
  on_track: 'bg-emerald-100 text-emerald-700',
  at_risk: 'bg-red-100 text-red-700'
};

const ownerStyles: Record<string, string> = {
  manager: 'bg-indigo-100 text-indigo-700',
  hr: 'bg-sky-100 text-sky-700',
  it: 'bg-amber-100 text-amber-700',
  candidate: 'bg-violet-100 text-violet-700'
};

export const toLabel = (value: string) =>
  value === 'pre_boarding' ? 'Pre-Boarding' : value.replace(/_/g, ' ');

export const StatusBadge = ({ value }: { value: string }) => (
  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[value] ?? 'bg-slate-100 text-slate-700'}`}>
    {toLabel(value)}
  </span>
);

export const OwnerBadge = ({ owner }: { owner: string }) => (
  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${ownerStyles[owner] ?? 'bg-slate-100 text-slate-600'}`}>
    {owner}
  </span>
);
