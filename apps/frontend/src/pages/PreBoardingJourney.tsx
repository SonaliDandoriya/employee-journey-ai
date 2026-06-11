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
  hr: 'border-teal-200 bg-teal-50',
  it: 'border-warning-100 bg-warning-50',
  candidate: 'border-brand-200 bg-brand-50'
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
    <div className="rounded-co-lg border border-danger-200 bg-danger-50 px-6 py-5 text-xs text-danger">
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
        <div className="flex items-start gap-3 rounded-3xl border border-brand-200 bg-brand-50 px-6 py-4">
          <Info size={18} className="mt-0.5 shrink-0 text-brand-600" />
          <div className="text-sm text-brand-800">
            <span className="font-semibold">No employee profile yet.</span>{' '}
            {pending.name} exists in the system as a workflow candidate only. Their profile will be created in CatalystOne upon joining.
            Workflow reference: <span className="font-mono font-medium">{pending.workflowId}</span>
          </div>
        </div>

        {/* ── Hero header ── */}
        <section className="rounded-co-xl border border-warm-300 bg-white p-6 shadow-e3">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-co-xl bg-brand-100 text-2xl font-bold text-brand-700">
                {pending.avatar}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-warm-900">{pending.name}</h1>
                  <StatusBadge value="pre_boarding" />
                </div>
                <p className="mt-2 text-base text-warm-800">{pending.intendedRole} · {pending.department}</p>
                <div className="mt-4 flex flex-wrap gap-5 text-xs text-warm-700">
                  <span className="flex items-center gap-1.5">
                    <User size={14} />
                    Manager: {pending.manager}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarCheck size={14} />
                    Joining: {formatDate(pending.expectedStartDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className={days <= 7 ? 'text-danger' : days <= 14 ? 'text-warning-DEFAULT' : 'text-slate-400'} />
                    <span className={days <= 7 ? 'font-semibold text-danger' : days <= 14 ? 'font-semibold text-warning-DEFAULT' : ''}>
                      {days > 0 ? `${days} days away` : 'Starts today'}
                    </span>
                  </span>
                </div>
                {pending.notes && (
                  <div className="mt-3 flex items-start gap-2 text-xs text-warm-700">
                    <Info size={14} className="mt-0.5 shrink-0" />
                    <span>{pending.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress + AI Summary */}
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-brand-200 bg-brand-50 p-5">
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-700">{pending.preBoardingWorkflow.progress}%</div>
                <div className="mt-1 text-sm text-brand-600">Pre-boarding complete</div>
                <div className="mt-1 text-xs text-warm-700">{pending.preBoardingWorkflow.completedTasks}/{pending.preBoardingWorkflow.totalTasks} tasks done</div>
              </div>
              <ProgressBar value={pending.preBoardingWorkflow.progress} size="sm" showLabel={false} tone="info" />
              <button
                type="button"
                onClick={refreshSummary}
                className="inline-flex items-center gap-2 rounded-co-md bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800"
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
          <div className="flex items-start gap-3 rounded-co-lg border border-danger-200 bg-danger-50 px-6 py-4">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-danger" />
            <div className="text-xs text-danger">
              <span className="font-semibold">Attention needed — </span>
              {days <= 7 && <span>Start date is in {days} day{days !== 1 ? 's' : ''}. </span>}
              {blockedTasks.length > 0 && <span>{blockedTasks.length} task{blockedTasks.length !== 1 ? 's are' : ' is'} overdue: {blockedTasks.map((t) => t.name).join(', ')}.</span>}
            </div>
          </div>
        )}

        {/* ── Pre-boarding workflow ── */}
        <section className="rounded-co-xl border border-warm-400 bg-white p-5 shadow-e2">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-warm-900">Pre-Boarding Workflow</h2>
              <p className="text-xs text-warm-700">{pending.preBoardingWorkflow.name}</p>
            </div>
            <StatusBadge value={pending.preBoardingWorkflow.progress === 100 ? 'completed' : 'in_progress'} />
          </div>
          <ProgressBar value={pending.preBoardingWorkflow.progress} size="md" tone="info" />

          {/* Pending tasks by owner */}
          {pendingTasks.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-warm-600">Pending actions</h3>
              {Object.entries(tasksByOwner).map(([owner, tasks]) => (
                <div key={owner} className={`mb-4 rounded-2xl border p-4 ${ownerColor[owner] ?? 'border-warm-400 bg-beige-600'}`}>
                  <div className="mb-3 flex items-center gap-2">
                    <OwnerBadge owner={owner} />
                    <span className="text-xs text-warm-700">{tasks.length} action{tasks.length !== 1 ? 's' : ''} required</span>
                  </div>
                  <div className="space-y-2">
                    {tasks.map((task) => {
                      const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
                      return (
                        <div key={task.name} className="flex items-start justify-between gap-3 rounded-xl bg-white/70 px-3 py-2.5">
                          <div className="flex items-start gap-2.5">
                            <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${isOverdue ? 'bg-danger-100 text-danger-600' : 'bg-warning-100 text-warning-600'}`}>
                              {isOverdue ? '⚠' : '⏳'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-warm-900">{task.name}</div>
                              {task.notes && <div className="mt-0.5 text-xs text-warm-600">{task.notes}</div>}
                            </div>
                          </div>
                          {task.dueDate && (
                            <div className={`shrink-0 text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-warm-700'}`}>
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
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-warm-600">Completed</h3>
              <div className="grid gap-2">
                {completedTasks.map((task) => (
                  <div key={task.name} className="flex items-center gap-3 rounded-co-md border border-warm-400 px-3 py-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success-100 text-success-800">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="flex-1 text-sm text-warm-800">{task.name}</div>
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
          <div className="rounded-3xl border border-warm-400 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-warm-600">AI highlights</div>
            <ul className="mt-4 space-y-3 text-sm text-warm-800">
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
        <div className="rounded-3xl border border-warm-400 bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-warm-600">Candidate info</div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-warm-700">Email</span>
              <span className="font-medium text-slate-800">{pending.candidateEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-700">Offer accepted</span>
              <span className="font-medium text-slate-800">{formatDate(pending.offerAcceptedDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-700">Workflow ID</span>
              <span className="font-mono text-xs text-warm-800">{pending.workflowId}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
