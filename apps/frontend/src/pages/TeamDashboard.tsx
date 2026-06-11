import { AlertTriangle, GraduationCap, ShieldAlert, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AIInsightsPanel } from '../components/AIInsightsPanel';
import { EmployeeCard } from '../components/EmployeeCard';
import { api } from '../services/api';
import { AskAIResponse, Employee } from '../types';

interface LayoutContext {
  searchQuery: string;
}

const summaryCardStyles = [
  'from-slate-900 to-slate-800 text-white',
  'from-sky-500 to-cyan-500 text-white',
  'from-amber-400 to-orange-500 text-white',
  'from-red-500 to-rose-500 text-white'
];

export const TeamDashboard = () => {
  const { searchQuery } = useOutletContext<LayoutContext>();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAIResponse] = useState<AskAIResponse | null>(null);
  const [aiLoading, setAILoading] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        const result = await api.getEmployees();
        setEmployees(result);
        setError(null);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load team dashboard');
      } finally {
        setLoading(false);
      }
    };

    void loadEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const normalized = searchQuery.toLowerCase();
    return employees.filter((employee) =>
      [employee.name, employee.role, employee.department].some((value) => value.toLowerCase().includes(normalized))
    );
  }, [employees, searchQuery]);

  const summaryCards = useMemo(
    () => [
      {
        label: 'Total Employees',
        value: employees.length,
        trend: '+2 this quarter',
        icon: Users
      },
      {
        label: 'Onboarding in Progress',
        value: employees.filter((employee) => employee.status === 'onboarding').length,
        trend: '1 new hire this month',
        icon: GraduationCap
      },
      {
        label: 'Overdue Courses',
        value: employees.reduce((total, employee) => total + employee.learning.overdueCourses, 0),
        trend: 'Compliance focus needed',
        icon: ShieldAlert
      },
      {
        label: 'At-Risk Employees',
        value: employees.filter((employee) => employee.riskScore >= 70).length,
        trend: 'Immediate intervention advised',
        icon: AlertTriangle
      }
    ],
    [employees]
  );

  const askAI = async (question: string) => {
    try {
      setAILoading(true);
      setAIError(null);
      const response = await api.askAI({ question, managerId: 'mgr-001' });
      setAIResponse(response);
    } catch (requestError) {
      setAIError(requestError instanceof Error ? requestError.message : 'Unable to get AI insight');
    } finally {
      setAILoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`rounded-3xl bg-gradient-to-br ${summaryCardStyles[index]} p-6 shadow-soft`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium text-white/80">{card.label}</div>
                  <div className="mt-4 text-4xl font-bold">{card.value}</div>
                </div>
                <div className="rounded-2xl bg-white/15 p-3">
                  <Icon size={22} />
                </div>
              </div>
              <div className="mt-6 text-sm text-white/80">{card.trend}</div>
            </div>
          );
        })}
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Team members</h3>
              <p className="text-sm text-slate-500">Live view of onboarding, learning, and risk across your team.</p>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-3xl bg-white shadow-sm" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">{error}</div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {filteredEmployees.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} />
              ))}
              {filteredEmployees.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">
                  No employees match your search.
                </div>
              )}
            </div>
          )}
        </section>

        <aside className="xl:sticky xl:top-8 xl:self-start">
          <AIInsightsPanel
            title="AI Team Insights"
            placeholder="Which employees have overdue compliance training?"
            quickQuestions={['Who needs attention?', 'Show onboarding progress', 'Any compliance risks?']}
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
