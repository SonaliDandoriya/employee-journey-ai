// CatalystOne UI Lift badge tokens
const styles: Record<string, string> = {
  active:          'bg-success-100 text-success-800',
  onboarding:      'bg-cobalt-100 text-cobalt-600',
  offboarding:     'bg-warm-200 text-warm-800',
  pre_boarding:    'bg-brand-100 text-brand-700',
  completed:       'bg-success-100 text-success-800',
  in_progress:     'bg-warning-100 text-warning-600',
  not_started:     'bg-warm-200 text-warm-700',
  overdue:         'bg-danger-100 text-danger-600',
  pending:         'bg-brand-100 text-brand-700',
  positive:        'bg-success-100 text-success-800',
  neutral:         'bg-warm-200 text-warm-800',
  needs_attention: 'bg-danger-100 text-danger-600',
  exceeds:         'bg-success-100 text-success-800',
  meets:           'bg-cobalt-100 text-cobalt-600',
  below:           'bg-danger-100 text-danger-600',
  not_reviewed:    'bg-warm-200 text-warm-700',
  on_track:        'bg-success-100 text-success-800',
  at_risk:         'bg-danger-100 text-danger-600',
};

const ownerStyles: Record<string, string> = {
  manager:   'bg-brand-100 text-brand-700',
  hr:        'bg-teal-100 text-teal-700',
  it:        'bg-warning-100 text-warning-600',
  candidate: 'bg-cobalt-100 text-cobalt-600',
};

export const toLabel = (value: string) =>
  value === 'pre_boarding' ? 'Pre-Boarding' : value.replace(/_/g, ' ');

export const StatusBadge = ({ value }: { value: string }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[value] ?? 'bg-warm-200 text-warm-700'}`}>
    {toLabel(value)}
  </span>
);

export const OwnerBadge = ({ owner }: { owner: string }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${ownerStyles[owner] ?? 'bg-warm-200 text-warm-700'}`}>
    {owner}
  </span>
);
