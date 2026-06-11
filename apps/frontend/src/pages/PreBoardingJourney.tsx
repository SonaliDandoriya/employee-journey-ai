import { AlertTriangle, CalendarCheck, CheckCircle2, Clock, Info, Sparkles, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AIInsightsPanel } from '../components/AIInsightsPanel';
import { JourneySummary } from '../components/JourneySummary';
import { OwnerBadge, StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { api } from '../services/api';
import { PendingEmployee, PendingHireInsights } from '../types';

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' });

const daysUntil = (dateStr: string) =>
  Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);

const ownerColor: Record<string, string> = {
  manager: 'border-indigo-200 bg-indigo-50',
  hr: 'border-sky-200 bg-sky-50',
  it: 'border-amber-200 bg-amber-50',
  candidate: 'border-violet-200 bg-violet-50'
};

export const PreBoardingJourney = () => {
  const { id } = useParams();
  const [pending, setPending] = useState<PendingEmployee | null>(null);
  const [insights, setInsights] = useState<PendingHireInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | undefined>();

  useEffect(() => {
    if (!id) { setError('Not found'); setLoading(false); return; }
    const load = async () => {
      try {
        setLoading(true);
        const [data, insightData] = await Promise.all([
          api.getPendingHire(id),
          api.getPendingHireInsights(id)
        ]);
        setPending(data);
        setInsights(insightData);
        setSummary(insightData.summary);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const refreshSummary = async () => {
    if (!id) return;
    try {
      setSummaryLoading(true);
      setSummaryError(null);
      const data = await api.getPendingHireInsights(id);
      setSummary(data.summary);
    } catch (err) {
      setSummaryError(err instanceof Error ? err.message : 'Failed to load summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  if (loading) return <div className="h-[70vh] animate-pulse rounded-3xl bg-white shadow-sm" />;
  if (error || !pending) return (
    <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
      {error ?? 'Pending hire not found'}
    </div>
  );

  const days = daysUntil(pending.expectedStartDate);
  const pendingTasks = pending.preBoardingWorkflow.tasks.filter((t) => !t.completed);
  const completedTasks = pending.preBoardingWorkflow.tasks.filter((t) => t.completed);
  const blockedTasks = pendingTasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date(pending.expectedStartDate) && new Date(t.dueDate) < new Date());

  // Group pending tasks by owner
  const tasksByOwner = pendingTasks.reduce<Record<string, typeof pendingTasks>>((acc, t) => {
    acc[t.owner] = [...(acc[t.owner] ?? []), t];
    return acc;
  }, {});

  return (
    <div className="grid gap-8 2xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-8">

        {/* ── Pre-boarding banner ── */}
        <div className="flex items-start gap-3 rounded-3xl border border-violet-200 bg-violet-50 px-6 py-4">
          <Info size={18} className="mt-0.5 shrink-0 text-violet-500" />
          <div className="text-sm text-violet-800">
            <span className="font-semibold">No employee profile yet.</span>{' '}
            {pending.name} exists in the system as a workflow candidate only. Their profile will be created in CatalystOne upon joining.
            Workflow reference: <span className="font-mono font-medium">{pending.workflowId}</span>
          </div>
        </div>

        {/* ── Hero header ── */}
        <section className="rounded-[28px] bg-white p-8 shadow-soft">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-violet-100 text-2xl font-bold text-violet-700">
                {pending.avatar}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-900">{pending.name}</h1>
                  <StatusBadge value="pre_boarding" />
                </div>
                <p className="mt-2 text-base text-slate-600">{pending.intendedRole} · {pending.department}</p>
                <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <User size={14} />
                    Manager: {pending.manager}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarCheck size={14} />
                    Joining: {formatDate(pending.expectedStartDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className={days <= 7 ? 'text-red-500' : days <= 14 ? 'text-amber-500' : 'text-slate-400'} />
                    <span className={days <= 7 ? 'font-semibold text-red-600' : days <= 14 ? 'font-semibold text-amber-600' : ''}>
                      {days > 0 ? `${days} days away` : 'Starts today'}
                    </span>
                  </span>
                </div>
                {pending.notes && (
                  <div className="mt-3 flex items-start gap-2 text-sm text-slate-500">
                    <Info size={14} className="mt-0.5 shrink-0" />
                    <span>{pending.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress + AI Summary */}
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-violet-200 bg-violet-50 p-5">
              <div className="text-center">
                <div className="text-4xl font-bold text-violet-700">{pending.preBoardingWorkflow.progress}%</div>
                <div className="mt-1 text-sm text-violet-600">Pre-boarding complete</div>
                <div className="mt-1 text-xs text-slate-500">{pending.preBoardingWorkflow.completedTasks}/{pending.preBoardingWorkflow.totalTasks} tasks done</div>
              </div>
              <ProgressBar value={pending.preBoardingWorkflow.progress} size="sm" showLabel={false} tone="info" />
              <button
                type="button"
                onClick={refreshSummary}
                className="inline-flex items-center gap-2 rounded-2xl bg-brand-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                <Sparkles size={16} />
                AI Summary
              </button>
            </div>
          </div>
        </section>

        {/* ── AI Journey summary ── */}
        <JourneySummary summary={summary} loading={summaryLoading} error={summaryError} />

        {/* ── Urgency alerts ── */}
        {(blockedTasks.length > 0 || days <= 7) && (
          <div className="flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 px-6 py-4">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-500" />
            <div className="text-sm text-red-700">
              <span className="font-semibold">Attention needed — </span>
              {days <= 7 && <span>Start date is in {days} day{days !== 1 ? 's' : ''}. </span>}
              {blockedTasks.length > 0 && <span>{blockedTasks.length} task{blockedTasks.length !== 1 ? 's are' : ' is'} overdue: {blockedTasks.map((t) => t.name).join(', ')}.</span>}
            </div>
          </div>
        )}

        {/* ── Pre-boarding workflow ── */}
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Pre-Boarding Workflow</h2>
              <p className="text-sm text-slate-500">{pending.preBoardingWorkflow.name}</p>
            </div>
            <StatusBadge value={pending.preBoardingWorkflow.progress === 100 ? 'completed' : 'in_progress'} />
          </div>
          <ProgressBar value={pending.preBoardingWorkflow.progress} size="md" tone="info" />

          {/* Pending tasks by owner */}
          {pendingTasks.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Pending actions</h3>
              {Object.entries(tasksByOwner).map(([owner, tasks]) => (
                <div key={owner} className={`mb-4 rounded-2xl border p-4 ${ownerColor[owner] ?? 'border-slate-200 bg-slate-50'}`}>
                  <div className="mb-3 flex items-center gap-2">
                    <OwnerBadge owner={owner} />
                    <span className="text-xs text-slate-500">{tasks.length} action{tasks.length !== 1 ? 's' : ''} required</span>
                  </div>
                  <div className="space-y-2">
                    {tasks.map((task) => {
                      const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
                      return (
                        <div key={task.name} className="flex items-start justify-between gap-3 rounded-xl bg-white/70 px-3 py-2.5">
                          <div className="flex items-start gap-2.5">
                            <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                              {isOverdue ? '⚠' : '⏳'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-800">{task.name}</div>
                              {task.notes && <div className="mt-0.5 text-xs text-slate-400">{task.notes}</div>}
                            </div>
                          </div>
                          {task.dueDate && (
                            <div className={`shrink-0 text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
                              Due {formatDate(task.dueDate)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed tasks */}
          {completedTasks.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Completed</h3>
              <div className="grid gap-2">
                {completedTasks.map((task) => (
                  <div key={task.name} className="flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="flex-1 text-sm text-slate-700">{task.name}</div>
                    <OwnerBadge owner={task.owner} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ── AI Sidebar ── */}
      <aside className="space-y-6 2xl:sticky 2xl:top-8 2xl:self-start">
        <AIInsightsPanel
          title="AI Pre-Boarding Assistant"
          placeholder={`Ask about ${pending.name.split(' ')[0]}'s readiness...`}
          quickQuestions={['What needs to be done before start?', 'Any blocked tasks?', 'Is IT setup on track?']}
          response={insights?.preparationStatus}
          loading={false}
          error={null}
          recommendedActions={insights?.recommendedActions}
          onAsk={async () => {}} // AI Q&A for pending hires uses preparationStatus
        />

        {insights && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">AI highlights</div>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {insights.keyHighlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-violet-400" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Candidate info */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Candidate info</div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Email</span>
              <span className="font-medium text-slate-800">{pending.candidateEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Offer accepted</span>
              <span className="font-medium text-slate-800">{formatDate(pending.offerAcceptedDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Workflow ID</span>
              <span className="font-mono text-xs text-slate-600">{pending.workflowId}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
