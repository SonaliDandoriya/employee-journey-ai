import { Sparkles } from 'lucide-react';

interface JourneySummaryProps {
  summary?: string;
  loading?: boolean;
  error?: string | null;
}

const SummarySkeleton = () => (
  <div className="space-y-3 animate-pulse">
    <div className="h-4 rounded-full bg-slate-200" />
    <div className="h-4 w-11/12 rounded-full bg-slate-200" />
    <div className="h-4 w-10/12 rounded-full bg-slate-200" />
    <div className="h-4 w-8/12 rounded-full bg-slate-200" />
  </div>
);

export const JourneySummary = ({ summary, loading, error }: JourneySummaryProps) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center gap-2">
      <Sparkles className="text-brand-500" size={18} />
      <h3 className="text-lg font-semibold text-slate-900">AI Journey Summary</h3>
    </div>
    {loading ? (
      <SummarySkeleton />
    ) : error ? (
      <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
    ) : summary ? (
      <p className="text-sm leading-7 text-slate-600">{summary}</p>
    ) : (
      <p className="text-sm text-slate-500">Generate a manager-ready summary to highlight risk, progress, and next steps.</p>
    )}
  </div>
);
