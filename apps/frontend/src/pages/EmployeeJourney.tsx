import { AlertCircle, CalendarClock, CalendarDays, Sparkles, Star, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AIInsightsPanel } from '../components/AIInsightsPanel';
import { CourseCard } from '../components/CourseCard';
import { JourneySummary } from '../components/JourneySummary';
import { ProgressBar } from '../components/ProgressBar';
import { RiskGauge } from '../components/RiskBadge';
import { StatusBadge, toLabel } from '../components/StatusBadge';
import { WorkflowItem } from '../components/WorkflowItem';
import { api } from '../services/api';
import { AIInsights, AskAIResponse, Employee } from '../types';

const tabs = ['Onboarding', 'Learning Journey', 'Workflows', 'Feedback & Performance'] as const;

const feedbackTone: Record<Employee['feedback']['sentiment'], string> = {
  positive: 'text-success-800 bg-success-100',
  neutral: 'text-warning-600 bg-warning-100',
  needs_attention: 'text-danger bg-danger-100'
};

const ratingStars: Record<NonNullable<Employee['performance']['rating']>, number> = {
  exceeds: 5,
  meets: 4,
  below: 2,
  not_reviewed: 0
};

export const EmployeeJourney = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Onboarding');
  const [summary, setSummary] = useState<string | undefined>();
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [askResponse, setAskResponse] = useState<AskAIResponse | null>(null);
  const [aiLoading, setAILoading] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployee = async () => {
      if (!id) {
        setError('Employee not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [employeeResult, insightResult] = await Promise.all([api.getEmployee(id), api.getAIInsights(id)]);
        setEmployee(employeeResult);
        setInsights(insightResult);
        setSummary(insightResult.summary);
        setError(null);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load employee journey');
      } finally {
        setLoading(false);
      }
    };

    void loadEmployee();
  }, [id]);

  const fetchSummary = async () => {
    if (!employee) {
      return;
    }

    try {
      setSummaryLoading(true);
      setSummaryError(null);
      const response = await api.getJourneySummary(employee.id);
      setSummary(response.summary);
    } catch (requestError) {
      setSummaryError(requestError instanceof Error ? requestError.message : 'Unable to load journey summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  const askAI = async (question: string) => {
    if (!employee) {
      return;
    }

    try {
      setAILoading(true);
      setAIError(null);
      const response = await api.askAI({ question, employeeId: employee.id });
      setAskResponse(response);
    } catch (requestError) {
      setAIError(requestError instanceof Error ? requestError.message : 'Unable to get AI response');
    } finally {
      setAILoading(false);
    }
  };

  const completedGoals = useMemo(() => employee?.performance.goals.filter((goal) => goal.status === 'completed').length ?? 0, [employee]);

  if (loading) {
    return <div className="h-[70vh] animate-pulse rounded-3xl bg-white shadow-sm" />;
  }

  if (error || !employee) {
    return <div className="rounded-co-lg border border-danger-200 bg-danger-50 px-6 py-5 text-xs text-danger">{error ?? 'Employee not found'}</div>;
  }

  return (
    <div className="grid gap-8 2xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-8">
        <section className="rounded-co-xl border border-warm-300 bg-white p-6 shadow-e3">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-co-xl bg-brand-100 text-xl font-bold text-brand-700">{employee.avatar}</div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-warm-900">{employee.name}</h1>
                  <StatusBadge value={employee.status} />
                </div>
                <p className="mt-2 text-sm text-warm-700">{employee.role} · {employee.department}</p>
                <div className="mt-4 flex flex-wrap gap-5 text-xs text-warm-700">
                  <span>Hired {new Date(employee.hireDate).toLocaleDateString()}</span>
                  <span>Manager {employee.manager}</span>
                  <span>Next review {employee.performance.nextReviewDate ? new Date(employee.performance.nextReviewDate).toLocaleDateString() : 'TBD'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-3xl border border-warm-400 bg-beige-600 p-5">
              <RiskGauge score={employee.riskScore} />
              <button
                type="button"
                onClick={fetchSummary}
                className="inline-flex items-center gap-2 rounded-co-md bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                <Sparkles size={16} />
                AI Summary
              </button>
            </div>
          </div>
        </section>

        <JourneySummary summary={summary} loading={summaryLoading} error={summaryError} />

        <section className="rounded-co-xl border border-warm-400 bg-white p-3 shadow-e1">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-co-md px-3.5 py-2 text-xs font-semibold transition ${activeTab === tab ? 'bg-brand-700 text-white' : 'bg-beige-600 text-warm-800 hover:bg-beige-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {activeTab === 'Onboarding' && (
          <section className="rounded-co-xl border border-warm-400 bg-white p-5 shadow-e2">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-base font-bold text-warm-900">Onboarding progress</h2>
                <p className="text-xs text-warm-700">Due {new Date(employee.onboarding.dueDate).toLocaleDateString()}</p>
              </div>
              <StatusBadge value={employee.onboarding.status} />
            </div>
            <ProgressBar value={employee.onboarding.progress} size="md" tone={employee.onboarding.progress === 100 ? 'success' : 'info'} />
            <div className="mt-6 grid gap-3">
              {employee.onboarding.tasks.map((task) => (
                <div key={task.name} className="flex items-center justify-between rounded-2xl border border-warm-400 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${task.completed ? 'bg-success-100 text-success-800' : task.dueDate && new Date(task.dueDate) < new Date() ? 'bg-danger-100 text-danger-600' : 'bg-warning-100 text-warning-600'}`}>
                      {task.completed ? '✓' : task.dueDate && new Date(task.dueDate) < new Date() ? '⚠' : '⏳'}
                    </div>
                    <div>
                      <div className="font-medium text-warm-900">{task.name}</div>
                      {task.dueDate && <div className="text-xs text-warm-700">Due {new Date(task.dueDate).toLocaleDateString()}</div>}
                    </div>
                  </div>
                  <StatusBadge value={task.completed ? 'completed' : 'in_progress'} />
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'Learning Journey' && (
          <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: 'Completed', value: employee.learning.completedCourses, icon: TrendingUp },
                { label: 'In Progress', value: employee.learning.inProgressCourses, icon: CalendarClock },
                { label: 'Overdue', value: employee.learning.overdueCourses, icon: AlertCircle }
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-co-lg border border-warm-400 bg-white p-4 shadow-e1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-warm-700">{label}</div>
                      <div className="mt-3 text-2xl font-bold text-warm-900">{value}</div>
                    </div>
                    <div className="rounded-2xl bg-beige-600 p-3 text-warm-700">
                      <Icon size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {employee.learning.courses.map((course) => (
                <CourseCard key={course.name} course={course} />
              ))}
            </div>
          </section>
        )}

        {activeTab === 'Workflows' && (
          <section className="space-y-4">
            {employee.workflows.map((workflow) => (
              <WorkflowItem key={workflow.name} workflow={workflow} />
            ))}
          </section>
        )}

        {activeTab === 'Feedback & Performance' && (
          <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="space-y-6">
              <div className="rounded-co-xl border border-warm-400 bg-white p-5 shadow-e2">
                <h3 className="text-sm font-semibold text-warm-900">Feedback pulse</h3>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-co-md bg-beige-600 p-3">
                    <div className="text-sm text-warm-600">Given</div>
                    <div className="mt-2 text-2xl font-bold text-warm-900">{employee.feedback.given}</div>
                  </div>
                  <div className="rounded-co-md bg-beige-600 p-3">
                    <div className="text-sm text-warm-600">Received</div>
                    <div className="mt-2 text-2xl font-bold text-warm-900">{employee.feedback.received}</div>
                  </div>
                </div>
                <div className={`mt-4 rounded-2xl px-4 py-3 text-sm font-medium ${feedbackTone[employee.feedback.sentiment]}`}>
                  Sentiment: {toLabel(employee.feedback.sentiment)}
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-warm-700">
                  <CalendarDays size={16} />
                  <span>Last feedback {employee.feedback.lastFeedbackDate ? new Date(employee.feedback.lastFeedbackDate).toLocaleDateString() : 'Not available'}</span>
                </div>
              </div>

              <div className="rounded-co-xl border border-warm-400 bg-white p-5 shadow-e2">
                <h3 className="text-sm font-semibold text-warm-900">Review status</h3>
                <div className="mt-4 flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={20} className={index < ratingStars[employee.performance.rating ?? 'not_reviewed'] ? 'fill-warning-DEFAULT text-warning-DEFAULT' : 'text-warm-500'} />
                  ))}
                </div>
                <div className="mt-4">
                  <StatusBadge value={employee.performance.rating ?? 'not_reviewed'} />
                </div>
                <div className="mt-4 space-y-2 text-xs text-warm-700">
                  <div>Last review: {employee.performance.lastReviewDate ? new Date(employee.performance.lastReviewDate).toLocaleDateString() : 'Not recorded'}</div>
                  <div>Next review: {employee.performance.nextReviewDate ? new Date(employee.performance.nextReviewDate).toLocaleDateString() : 'TBD'}</div>
                  <div>Completed goals: {completedGoals}/{employee.performance.goals.length}</div>
                </div>
              </div>
            </div>

            <div className="rounded-co-xl border border-warm-400 bg-white p-5 shadow-e2">
              <h3 className="text-sm font-semibold text-warm-900">Performance goals</h3>
              <div className="mt-6 space-y-5">
                {employee.performance.goals.map((goal) => (
                  <div key={goal.name} className="rounded-co-md border border-warm-400 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-medium text-warm-900">{goal.name}</div>
                        <div className="mt-2">
                          <StatusBadge value={goal.status} />
                        </div>
                      </div>
                      <div className="min-w-40 text-right text-sm font-semibold text-warm-700">{goal.progress}% complete</div>
                    </div>
                    <div className="mt-4">
                      <ProgressBar value={goal.progress} tone={goal.status === 'completed' ? 'success' : goal.status === 'at_risk' ? 'danger' : 'default'} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <aside className="space-y-6 2xl:sticky 2xl:top-8 2xl:self-start">
        <AIInsightsPanel
          title="AI Assistant"
          placeholder={`Ask about ${employee.name.split(' ')[0]}'s journey...`}
          quickQuestions={['What needs attention most?', 'Summarize learning status', 'When is the next review?']}
          response={askResponse?.answer ?? insights?.riskAnalysis}
          loading={aiLoading}
          error={aiError}
          recommendedActions={askResponse?.recommendedActions ?? insights?.recommendedActions}
          onAsk={askAI}
        />

        {insights && (
          <div className="rounded-3xl border border-warm-400 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-600">AI highlights</div>
            <ul className="mt-4 space-y-3 text-sm text-warm-800">
              {insights.keyHighlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-brand-500" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
};
