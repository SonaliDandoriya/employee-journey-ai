import { CalendarClock } from 'lucide-react';
import { Employee } from '../types';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';

const typeColors: Record<Employee['workflows'][number]['type'], string> = {
  onboarding: 'bg-sky-100 text-sky-700',
  performance: 'bg-violet-100 text-violet-700',
  feedback: 'bg-emerald-100 text-emerald-700',
  offboarding: 'bg-slate-200 text-slate-700',
  compliance: 'bg-red-100 text-red-700'
};

export const WorkflowItem = ({ workflow }: { workflow: Employee['workflows'][number] }) => {
  const tone = workflow.status === 'overdue' ? 'danger' : workflow.status === 'completed' ? 'success' : 'default';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900">{workflow.name}</h3>
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${typeColors[workflow.type]}`}>{workflow.type}</span>
            <StatusBadge value={workflow.status} />
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <CalendarClock size={16} />
            <span>Due {workflow.dueDate ? new Date(workflow.dueDate).toLocaleDateString() : 'TBD'}</span>
          </div>
        </div>
        <div className="w-full md:max-w-sm">
          <ProgressBar value={workflow.progress} tone={tone} />
        </div>
      </div>
    </div>
  );
};
