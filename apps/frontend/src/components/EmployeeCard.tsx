import { ArrowRight, BookOpen, BriefcaseBusiness } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Employee } from '../types';
import { ProgressBar } from './ProgressBar';
import { RiskBadge } from './RiskBadge';
import { StatusBadge } from './StatusBadge';

export const EmployeeCard = ({ employee }: { employee: Employee }) => (
  <Link
    to={`/employee/${employee.id}`}
    className="group flex flex-col rounded-co-xl border border-warm-400 bg-white shadow-e2 transition-shadow duration-200 hover:shadow-e4"
  >
    {/* Top stripe — brand colour based on status */}
    <div className={`h-1 w-full rounded-t-co-xl ${employee.status === 'offboarding' ? 'bg-warm-500' : employee.status === 'onboarding' ? 'bg-cobalt-500' : 'bg-brand-600'}`} />

    <div className="flex flex-col gap-4 p-5">
      {/* Avatar + name */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-co-lg bg-brand-100 text-sm font-bold text-brand-700">
            {employee.avatar}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-warm-900">{employee.name}</h3>
            <p className="truncate text-xs text-warm-700">{employee.role}</p>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-warm-600">
              <BriefcaseBusiness size={11} />
              <span className="truncate">{employee.department}</span>
            </div>
          </div>
        </div>
        <ArrowRight size={16} className="mt-0.5 shrink-0 text-warm-500 transition group-hover:text-brand-600" />
      </div>

      {/* Status + Risk */}
      <div className="flex items-center justify-between gap-2">
        <StatusBadge value={employee.status} />
        <RiskBadge score={employee.riskScore} showLabel={false} />
      </div>

      {/* Onboarding progress */}
      <div className="rounded-co bg-beige-600 px-3 py-3">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-warm-700">
          <span>Onboarding</span>
          <span className="font-semibold text-warm-900">{employee.onboarding.progress}%</span>
        </div>
        <ProgressBar
          value={employee.onboarding.progress}
          size="sm"
          showLabel={false}
          tone={employee.status === 'onboarding' ? 'info' : 'success'}
        />
      </div>

      {/* Learning stats */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-co bg-beige-500 py-2">
          <div className="text-warm-600">Enrolled</div>
          <div className="mt-0.5 text-base font-bold text-warm-900">{employee.learning.enrolledCourses}</div>
        </div>
        <div className="rounded-co bg-beige-500 py-2">
          <div className="text-warm-600">Done</div>
          <div className="mt-0.5 text-base font-bold text-warm-900">{employee.learning.completedCourses}</div>
        </div>
        <div className="rounded-co bg-beige-500 py-2">
          <div className="flex items-center justify-center gap-0.5 text-warm-600">
            <BookOpen size={10} /><span>Late</span>
          </div>
          <div className={`mt-0.5 text-base font-bold ${employee.learning.overdueCourses > 0 ? 'text-danger' : 'text-warm-900'}`}>
            {employee.learning.overdueCourses}
          </div>
        </div>
      </div>
    </div>
  </Link>
);
