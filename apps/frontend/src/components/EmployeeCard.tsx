import { ArrowRight, BookOpen, BriefcaseBusiness } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Employee } from '../types';
import { ProgressBar } from './ProgressBar';
import { RiskBadge } from './RiskBadge';
import { StatusBadge } from './StatusBadge';

export const EmployeeCard = ({ employee }: { employee: Employee }) => (
  <Link
    to={`/employee/${employee.id}`}
    className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-soft"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-lg font-bold text-slate-700">
          {employee.avatar}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{employee.name}</h3>
          <p className="text-sm text-slate-500">{employee.role}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <BriefcaseBusiness size={14} />
            <span>{employee.department}</span>
          </div>
        </div>
      </div>
      <ArrowRight className="text-slate-300 transition group-hover:text-slate-500" />
    </div>

    <div className="mt-5 flex items-center justify-between gap-3">
      <StatusBadge value={employee.status} />
      <RiskBadge score={employee.riskScore} />
    </div>

    <div className="mt-5 rounded-2xl bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between text-sm font-medium text-slate-600">
        <span>Onboarding completion</span>
        <span>{employee.onboarding.progress}%</span>
      </div>
      <ProgressBar value={employee.onboarding.progress} size="sm" showLabel={false} tone={employee.status === 'onboarding' ? 'info' : 'success'} />
    </div>

    <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
      <div className="rounded-2xl bg-slate-50 p-3">
        <div className="text-slate-400">Enrolled</div>
        <div className="mt-1 text-lg font-semibold text-slate-900">{employee.learning.enrolledCourses}</div>
      </div>
      <div className="rounded-2xl bg-slate-50 p-3">
        <div className="text-slate-400">Completed</div>
        <div className="mt-1 text-lg font-semibold text-slate-900">{employee.learning.completedCourses}</div>
      </div>
      <div className="rounded-2xl bg-slate-50 p-3">
        <div className="flex items-center gap-1 text-slate-400">
          <BookOpen size={14} />
          <span>Overdue</span>
        </div>
        <div className="mt-1 text-lg font-semibold text-red-600">{employee.learning.overdueCourses}</div>
      </div>
    </div>
  </Link>
);
