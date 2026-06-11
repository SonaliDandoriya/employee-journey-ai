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
    <div className={`rounded-co-lg border bg-white p-4 shadow-e1 ${course.status === 'overdue' ? 'border-danger-200' : 'border-warm-400'}`}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-snug text-warm-900">{course.name}</h3>
        <StatusBadge value={course.status} />
      </div>
      <ProgressBar value={course.progress} tone={tone} size="sm" />
      <div className="mt-3 flex items-center gap-1.5 text-xs text-warm-700">
        <CalendarDays size={13} className="shrink-0" />
        <span>
          {course.completedDate
            ? `Completed ${new Date(course.completedDate).toLocaleDateString()}`
            : `Due ${course.dueDate ? new Date(course.dueDate).toLocaleDateString() : 'TBD'}`}
        </span>
      </div>
    </div>
  );
};
