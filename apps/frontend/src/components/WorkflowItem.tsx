import { CalendarClock } from 'lucide-react';
import { Employee } from '../types';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';

// CatalystOne module-colour mapping
const typeColors: Record<Employee['workflows'][number]['type'], string> = {
  onboarding:  'bg-cobalt-100 text-cobalt-600',
  performance: 'bg-brand-100 text-brand-700',
  feedback:    'bg-teal-100 text-teal-700',
  offboarding: 'bg-warm-200 text-warm-800',
  compliance:  'bg-danger-100 text-danger-600',
};

export const WorkflowItem = ({ workflow }: { workflow: Employee['workflows'][number] }) => {
  const tone = workflow.status === 'overdue' ? 'danger' : workflow.status === 'completed' ? 'success' : 'default';

  return (
    <div className={`rounded-co-lg border bg-white p-4 shadow-e1 ${workflow.status === 'overdue' ? 'border-danger-200' : 'border-warm-400'}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="text-sm font-semibold text-warm-900">{workflow.name}</h3>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider capitalize ${typeColors[workflow.type]}`}>
              {workflow.type}
            </span>
            <StatusBadge value={workflow.status} />
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-warm-700">
            <CalendarClock size={13} className="shrink-0" />
            <span>Due {workflow.dueDate ? new Date(workflow.dueDate).toLocaleDateString() : 'TBD'}</span>
          </div>
        </div>
        <div className="w-full md:max-w-xs">
          <ProgressBar value={workflow.progress} tone={tone} size="sm" />
        </div>
      </div>
    </div>
  );
};
