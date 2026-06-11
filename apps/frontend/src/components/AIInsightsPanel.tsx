import { FormEvent, useState } from 'react';
import { MessageSquareText, Sparkles } from 'lucide-react';

interface AIInsightsPanelProps {
  title: string;
  placeholder: string;
  quickQuestions: string[];
  response?: string;
  loading?: boolean;
  error?: string | null;
  recommendedActions?: string[];
  onAsk: (question: string) => Promise<void> | void;
}

const ResponseSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    <div className="h-4 rounded-full bg-slate-200" />
    <div className="h-4 w-11/12 rounded-full bg-slate-200" />
    <div className="h-4 w-8/12 rounded-full bg-slate-200" />
  </div>
);

export const AIInsightsPanel = ({
  title,
  placeholder,
  quickQuestions,
  response,
  loading,
  error,
  recommendedActions,
  onAsk
}: AIInsightsPanelProps) => {
  const [question, setQuestion] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!question.trim()) {
      return;
    }
    await onAsk(question.trim());
    setQuestion('');
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-brand-900/5 p-3 text-brand-500">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">Ask for quick manager-ready guidance.</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-2xl border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <MessageSquareText size={18} className="text-slate-400" />
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={placeholder}
              className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-2xl bg-brand-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
        >
          Ask AI
        </button>
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        {quickQuestions.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onAsk(item)}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-500"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        {loading ? (
          <ResponseSkeleton />
        ) : error ? (
          <div className="text-sm text-red-700">{error}</div>
        ) : response ? (
          <div className="space-y-4">
            <p className="text-sm leading-7 text-slate-600">{response}</p>
            {recommendedActions && recommendedActions.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Recommended actions</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {recommendedActions.map((action) => (
                    <li key={action} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-500" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Try a quick prompt to surface risks, overdue learning, or onboarding progress.</p>
        )}
      </div>
    </div>
  );
};
