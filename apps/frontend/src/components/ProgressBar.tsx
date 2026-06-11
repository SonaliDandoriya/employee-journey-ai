interface ProgressBarProps {
  value: number;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

// CatalystOne UI Lift tone → fill colour
const fillMap = {
  default: 'bg-brand-600',
  success: 'bg-success',
  warning: 'bg-warning-DEFAULT',
  danger:  'bg-danger-DEFAULT',
  info:    'bg-cobalt-500',
};

export const ProgressBar = ({ value, tone = 'default', size = 'md', showLabel = true }: ProgressBarProps) => {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-warm-700">
          <span>Progress</span>
          <span className="font-semibold text-warm-900">{safeValue}%</span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-warm-300 ${size === 'sm' ? 'h-1.5' : 'h-2'}`}>
        <div
          className={`${fillMap[tone]} h-full rounded-full transition-all duration-500`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
};
