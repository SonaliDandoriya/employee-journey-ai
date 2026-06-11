import { ArrowRight, CalendarCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PendingEmployee } from '../types';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' });

const daysUntil = (dateStr: string) =>
  Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);

export const PendingEmployeeCard = ({ pending }: { pending: PendingEmployee }) => {
  const days = daysUntil(pending.expectedStartDate);
  const urgencyClass = days <= 7 ? 'text-danger' : days <= 14 ? 'text-warning-DEFAULT' : 'text-brand-600';

  return (
    <Link
      to={`/incoming/${pending.id}`}
      className="group flex flex-col rounded-co-xl border-2 border-dashed border-brand-200 bg-white shadow-e1 transition-shadow duration-200 hover:border-brand-400 hover:shadow-e3"
    >
      {/* Top stripe — brand purple for pre-boarding */}
      <div className="h-1 w-full rounded-t-co-xl bg-brand-500" />

      <div className="flex flex-col gap-3.5 p-5">
        {/* "Workflow only" chip */}
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-700">
            Workflow only · no profile yet
          </span>
          <ArrowRight size={15} className="text-warm-500 transition group-hover:text-brand-600" />
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-co-lg bg-brand-100 text-sm font-bold text-brand-700">
            {pending.avatar}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-warm-900">{pending.name}</h3>
            <p className="truncate text-xs text-warm-700">{pending.intendedRole}</p>
            <p className="text-[11px] text-warm-600">{pending.department}</p>
          </div>
        </div>

        <StatusBadge value="pre_boarding" />

        {/* Start date */}
        <div className="flex items-center gap-3 rounded-co-md bg-brand-50 px-3 py-2.5">
          <CalendarCheck size={14} className="shrink-0 text-brand-600" />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-medium text-brand-600">Expected start</div>
            <div className="text-xs font-semibold text-warm-900">{formatDate(pending.expectedStartDate)}</div>
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold ${urgencyClass}`}>
            <Clock size={12} />
            {days > 0 ? `${days}d` : 'Today'}
          </div>
        </div>

        {/* Pre-boarding progress */}
        <div className="rounded-co bg-beige-600 px-3 py-2.5">
          <div className="mb-1.5 flex justify-between text-xs font-medium text-warm-700">
            <span>Pre-boarding</span>
            <span className="font-semibold text-warm-900">{pending.preBoardingWorkflow.completedTasks}/{pending.preBoardingWorkflow.totalTasks} tasks</span>
          </div>
          <ProgressBar value={pending.preBoardingWorkflow.progress} size="sm" showLabel={false} tone="info" />
        </div>

        {/* Workflow ref */}
        <div className="text-[11px] text-warm-600">
          <span className="font-medium">WF:</span>{' '}
          <span className="font-mono">{pending.workflowId}</span>
        </div>
      </div>
    </Link>
  );
};
