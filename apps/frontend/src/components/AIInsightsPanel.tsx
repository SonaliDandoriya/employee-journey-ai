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
  <div className="space-y-2.5 animate-pulse">
    <div className="h-3 rounded-full bg-brand-100" />
    <div className="h-3 w-10/12 rounded-full bg-brand-100" />
    <div className="h-3 w-8/12 rounded-full bg-brand-100" />
  </div>
);

export const AIInsightsPanel = ({
  title, placeholder, quickQuestions,
  response, loading, error, recommendedActions, onAsk
}: AIInsightsPanelProps) => {
  const [question, setQuestion] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!question.trim()) return;
    await onAsk(question.trim());
    setQuestion('');
  };

  return (
    <div className="rounded-co-xl border border-warm-400 bg-white shadow-e2">
      {/* Header — brand purple strip */}
      <div className="flex items-center gap-3 rounded-t-co-xl bg-brand-800 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-co bg-brand-600">
          <Sparkles size={15} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <p className="text-[11px] text-brand-300">Manager-ready AI guidance</p>
        </div>
      </div>

      <div className="p-4">
        {/* Input */}
        <form onSubmit={submit} className="space-y-3">
          <div className="flex items-center gap-2.5 rounded-co-md border border-warm-400 bg-beige-500 px-3 py-2 transition focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100">
            <MessageSquareText size={15} className="shrink-0 text-warm-700" />
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={placeholder}
              className="w-full border-0 bg-transparent text-xs text-warm-900 outline-none placeholder:text-warm-600"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-co-md bg-brand-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-800 active:scale-95"
          >
            Ask AI
          </button>
        </form>

        {/* Quick prompts */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {quickQuestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onAsk(item)}
              className="rounded-full border border-warm-400 bg-beige-500 px-2.5 py-1 text-[11px] font-medium text-warm-800 transition hover:border-brand-600 hover:bg-brand-50 hover:text-brand-700"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Response area */}
        <div className="mt-4 min-h-[80px] rounded-co-md bg-beige-600 p-3.5">
          {loading ? (
            <ResponseSkeleton />
          ) : error ? (
            <div className="text-xs text-danger">{error}</div>
          ) : response ? (
            <div className="space-y-3">
              <p className="text-xs leading-relaxed text-warm-900">{response}</p>
              {recommendedActions && recommendedActions.length > 0 && (
                <div>
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-warm-700">Recommended actions</div>
                  <ul className="space-y-1.5 text-xs text-warm-900">
                    {recommendedActions.map((action) => (
                      <li key={action} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-warm-700">Try a quick prompt to surface risks, overdue learning, or onboarding progress.</p>
          )}
        </div>
      </div>
    </div>
  );
};
