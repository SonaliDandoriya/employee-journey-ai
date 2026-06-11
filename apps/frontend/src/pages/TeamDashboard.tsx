import { AlertTriangle, GraduationCap, ShieldAlert, UserPlus, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AIInsightsPanel } from '../components/AIInsightsPanel';
import { EmployeeCard } from '../components/EmployeeCard';
import { PendingEmployeeCard } from '../components/PendingEmployeeCard';
import { api } from '../services/api';
import { AskAIResponse, Employee, PendingEmployee } from '../types';

interface LayoutContext { searchQuery: string }

// CatalystOne-toned summary cards
const summaryCards = (employees: Employee[], pendingHires: PendingEmployee[]) => [
  {
    label: 'Total Employees',
    value: employees.length,
    sub: '+2 this quarter',
    icon: Users,
    bg: 'bg-brand-800',
    iconBg: 'bg-brand-700',
  },
  {
    label: 'Incoming Hires',
    value: pendingHires.length,
    sub: `${pendingHires.filter(p => Math.ceil((new Date(p.expectedStartDate).getTime() - Date.now()) / 86_400_000) <= 14).length} joining ≤ 2 weeks`,
    icon: UserPlus,
    bg: 'bg-brand-600',
    iconBg: 'bg-brand-500',
  },
  {
    label: 'Overdue Courses',
    value: employees.reduce((t, e) => t + e.learning.overdueCourses, 0),
    sub: 'Compliance focus needed',
    icon: ShieldAlert,
    bg: 'bg-warning-600',
    iconBg: 'bg-warning-DEFAULT',
  },
  {
    label: 'Onboarding Active',
    value: employees.filter(e => e.status === 'onboarding').length,
    sub: `${employees.filter(e => e.onboarding.status === 'in_progress').length} ramp in progress`,
    icon: GraduationCap,
    bg: 'bg-teal-700',
    iconBg: 'bg-teal-500',
  },
  {
    label: 'At-Risk Employees',
    value: employees.filter(e => e.riskScore >= 70).length,
    sub: 'Immediate intervention',
    icon: AlertTriangle,
    bg: 'bg-danger-600',
    iconBg: 'bg-danger-DEFAULT',
  },
];

export const TeamDashboard = () => {
  const { searchQuery } = useOutletContext<LayoutContext>();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pendingHires, setPendingHires] = useState<PendingEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAIResponse] = useState<AskAIResponse | null>(null);
  const [aiLoading, setAILoading] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        const [employeeResult, pendingResult] = await Promise.all([api.getEmployees(), api.getPendingHires()]);
        setEmployees(employeeResult);
        setPendingHires(pendingResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load team dashboard');
      } finally {
        setLoading(false);
      }
    };
    void loadAll();
  }, []);

  const filteredEmployees = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return employees.filter(e => [e.name, e.role, e.department].some(v => v.toLowerCase().includes(q)));
  }, [employees, searchQuery]);

  const filteredPending = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return pendingHires.filter(p => [p.name, p.intendedRole, p.department].some(v => v.toLowerCase().includes(q)));
  }, [pendingHires, searchQuery]);

  const cards = useMemo(() => summaryCards(employees, pendingHires), [employees, pendingHires]);

  const askAI = async (question: string) => {
    try {
      setAILoading(true);
      setAIError(null);
      const response = await api.askAI({ question, managerId: 'mgr-001' });
      setAIResponse(response);
    } catch (err) {
      setAIError(err instanceof Error ? err.message : 'Unable to get AI insight');
    } finally {
      setAILoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Summary cards ── */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`${card.bg} flex flex-col justify-between rounded-co-xl p-4 shadow-e2`}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">{card.label}</p>
                <div className={`${card.iconBg} flex h-7 w-7 shrink-0 items-center justify-center rounded-co`}>
                  <Icon size={14} className="text-white" />
                </div>
              </div>
              <div className="mt-3 text-3xl font-black text-white">{card.value}</div>
              <p className="mt-2 text-[11px] text-white/70">{card.sub}</p>
            </div>
          );
        })}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">

          {/* ── Incoming Hires ── */}
          {(loading || filteredPending.length > 0) && (
            <section>
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-co bg-brand-100">
                  <UserPlus size={13} className="text-brand-700" />
                </div>
                <h3 className="text-base font-bold text-warm-900">Incoming Hires</h3>
                {!loading && (
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-bold text-brand-700">
                    {filteredPending.length}
                  </span>
                )}
                <span className="text-xs text-warm-600">— workflow candidates, no profile yet</span>
              </div>
              {loading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[...Array(2)].map((_, i) => <div key={i} className="h-52 animate-pulse rounded-co-xl bg-white shadow-e1" />)}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {filteredPending.map(p => <PendingEmployeeCard key={p.id} pending={p} />)}
                </div>
              )}
            </section>
          )}

          {/* ── Team Members ── */}
          <section>
            <div className="mb-4">
              <h3 className="text-base font-bold text-warm-900">Team members</h3>
              <p className="text-xs text-warm-700">Live view of onboarding, learning, and risk across your team.</p>
            </div>
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(4)].map((_, i) => <div key={i} className="h-64 animate-pulse rounded-co-xl bg-white shadow-e1" />)}
              </div>
            ) : error ? (
              <div className="rounded-co-lg border border-danger-200 bg-danger-50 px-5 py-4 text-sm text-danger">{error}</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {filteredEmployees.map(e => <EmployeeCard key={e.id} employee={e} />)}
                {filteredEmployees.length === 0 && (
                  <div className="rounded-co-xl border border-dashed border-warm-400 bg-white px-6 py-12 text-center text-sm text-warm-700">
                    No employees match your search.
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* ── AI Panel ── */}
        <aside className="xl:sticky xl:top-6 xl:self-start">
          <AIInsightsPanel
            title="AI Team Insights"
            placeholder="Which employees have overdue compliance training?"
            quickQuestions={['Who needs attention?', 'Show onboarding progress', 'Any compliance risks?', 'Who is joining soon?']}
            response={aiResponse?.answer}
            loading={aiLoading}
            error={aiError}
            recommendedActions={aiResponse?.recommendedActions}
            onAsk={askAI}
          />
        </aside>
      </div>
    </div>
  );
};
