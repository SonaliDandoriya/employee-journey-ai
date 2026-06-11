interface ProgressBarProps {
  value: number;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const toneMap = {
  default: 'bg-brand-500',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-sky-500'
};

export const ProgressBar = ({ value, tone = 'default', size = 'md', showLabel = true }: ProgressBarProps) => {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Progress</span>
          <span>{safeValue}%</span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-slate-200 ${size === 'sm' ? 'h-2' : 'h-3'}`}>
        <div className={`${toneMap[tone]} h-full rounded-full transition-all duration-500`} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
};
