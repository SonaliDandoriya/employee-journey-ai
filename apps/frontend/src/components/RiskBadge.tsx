interface RiskBadgeProps {
  score: number;
  showLabel?: boolean;
}

const getRiskStyles = (score: number) => {
  if (score >= 70) {
    return { label: 'At Risk', badge: 'bg-red-100 text-red-700', ring: 'stroke-red-600' };
  }
  if (score >= 40) {
    return { label: 'Watchlist', badge: 'bg-amber-100 text-amber-700', ring: 'stroke-amber-500' };
  }
  return { label: 'Healthy', badge: 'bg-emerald-100 text-emerald-700', ring: 'stroke-emerald-500' };
};

export const RiskBadge = ({ score, showLabel = true }: RiskBadgeProps) => {
  const { label, badge } = getRiskStyles(score);

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${badge}`}>
      <span>{score}</span>
      {showLabel && <span>{label}</span>}
    </div>
  );
};

export const RiskGauge = ({ score }: { score: number }) => {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const { label, ring } = getRiskStyles(score);

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg className="-rotate-90" width="120" height="120">
        <circle cx="60" cy="60" r={radius} stroke="#E2E8F0" strokeWidth="10" fill="none" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={ring}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-bold text-slate-900">{score}</div>
        <div className="text-xs font-medium text-slate-500">{label}</div>
      </div>
    </div>
  );
};
