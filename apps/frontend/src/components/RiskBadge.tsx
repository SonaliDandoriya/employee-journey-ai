// CatalystOne UI Lift — risk scoring uses semantic red/orange/green tokens
const getRiskStyles = (score: number) => {
  if (score >= 70) return { label: 'At Risk',   badge: 'bg-danger-100 text-danger-600',   ring: '#e42354', track: '#fad3dd' };
  if (score >= 40) return { label: 'Watchlist', badge: 'bg-warning-100 text-warning-600', ring: '#ff8d4b', track: '#ffe8db' };
  return              { label: 'Healthy',    badge: 'bg-success-100 text-success-800',  ring: '#198754', track: '#dae7d9' };
};

export const RiskBadge = ({ score, showLabel = true }: { score: number; showLabel?: boolean }) => {
  const { label, badge } = getRiskStyles(score);
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${badge}`}>
      <span className="font-bold">{score}</span>
      {showLabel && <span className="font-medium opacity-80">— {label}</span>}
    </div>
  );
};

export const RiskGauge = ({ score }: { score: number }) => {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const { label, ring, track } = getRiskStyles(score);

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg className="-rotate-90" width="112" height="112">
        <circle cx="56" cy="56" r={radius} stroke={track} strokeWidth="8" fill="none" />
        <circle
          cx="56" cy="56" r={radius}
          strokeWidth="8" fill="none" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke={ring}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-warm-900">{score}</div>
        <div className="text-[10px] font-semibold uppercase tracking-wide text-warm-700">{label}</div>
      </div>
    </div>
  );
};
