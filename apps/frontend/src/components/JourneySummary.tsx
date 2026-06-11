import { Sparkles } from 'lucide-react';

interface JourneySummaryProps {
  summary?: string;
  loading?: boolean;
  error?: string | null;
}

const SummarySkeleton = () => (
  <div className="space-y-2.5 animate-pulse">
    {[1, 0.9, 0.8, 0.65].map((w, i) => (
      <div key={i} className="h-3 rounded-full bg-brand-100" style={{ width: `${w * 100}%` }} />
    ))}
  </div>
);

export const JourneySummary = ({ summary, loading, error }: JourneySummaryProps) => (
  <div className="rounded-co-xl border border-brand-200 bg-brand-50 p-5 shadow-e1">
    <div className="mb-3 flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-co bg-brand-700">
        <Sparkles size={13} className="text-white" />
      </div>
      <h3 className="text-sm font-bold text-brand-800">AI Journey Summary</h3>
    </div>
    {loading ? (
      <SummarySkeleton />
    ) : error ? (
      <div className="rounded-co bg-danger-100 px-3 py-2.5 text-xs text-danger-600">{error}</div>
    ) : summary ? (
      <p className="text-sm leading-relaxed text-brand-800">{summary}</p>
    ) : (
      <p className="text-xs text-brand-600">Generate a manager-ready summary to highlight risk, progress, and next steps.</p>
    )}
  </div>
);
