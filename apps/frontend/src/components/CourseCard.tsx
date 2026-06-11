import { CalendarDays } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';
import { Employee } from '../types';

interface CourseCardProps {
  course: Employee['learning']['courses'][number];
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const tone = course.status === 'overdue' ? 'danger' : course.status === 'completed' ? 'success' : 'default';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{course.name}</h3>
          <div className="mt-2">
            <StatusBadge value={course.status} />
          </div>
        </div>
      </div>
      <ProgressBar value={course.progress} tone={tone} />
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <CalendarDays size={16} />
        <span>{course.completedDate ? `Completed ${new Date(course.completedDate).toLocaleDateString()}` : `Due ${course.dueDate ? new Date(course.dueDate).toLocaleDateString() : 'TBD'}`}</span>
      </div>
    </div>
  );
};
