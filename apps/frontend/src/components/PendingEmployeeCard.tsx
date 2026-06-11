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
  const urgency = days <= 7 ? 'text-red-600' : days <= 14 ? 'text-amber-600' : 'text-violet-600';

  return (
    <Link
      to={`/incoming/${pending.id}`}
      className="group relative rounded-3xl border-2 border-dashed border-violet-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-soft"
    >
      {/* "No profile yet" ribbon */}
      <div className="absolute right-4 top-4 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-violet-500">
        Workflow only
      </div>

      <div className="flex items-start gap-4 pr-24">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-lg font-bold text-violet-700">
          {pending.avatar}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{pending.name}</h3>
          <p className="text-sm text-slate-500">{pending.intendedRole}</p>
          <p className="mt-1 text-xs text-slate-400">{pending.department}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <StatusBadge value="pre_boarding" />
        <ArrowRight size={18} className="text-slate-300 transition group-hover:text-violet-400" />
      </div>

      {/* Start date */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-violet-50 px-4 py-3">
        <CalendarCheck size={16} className="shrink-0 text-violet-500" />
        <div className="min-w-0">
          <div className="text-xs text-violet-500">Expected start date</div>
          <div className="text-sm font-semibold text-slate-800">{formatDate(pending.expectedStartDate)}</div>
        </div>
        <div className={`ml-auto shrink-0 text-sm font-bold ${urgency}`}>
          <Clock size={13} className="mr-1 inline" />
          {days > 0 ? `${days}d` : 'Today'}
        </div>
      </div>

      {/* Pre-boarding workflow progress */}
      <div className="mt-4 rounded-2xl bg-slate-50 p-4">
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
          <span>Pre-boarding progress</span>
          <span className="text-slate-500">{pending.preBoardingWorkflow.completedTasks}/{pending.preBoardingWorkflow.totalTasks} tasks</span>
        </div>
        <ProgressBar value={pending.preBoardingWorkflow.progress} size="sm" showLabel={false} tone="info" />
      </div>

      {/* Workflow ID */}
      <div className="mt-3 text-xs text-slate-400">
        Workflow: <span className="font-mono">{pending.workflowId}</span>
      </div>
    </Link>
  );
};
