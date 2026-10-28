import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
  REVIEWING: 'bg-sky-50 text-sky-800 border-sky-200',
  REJECTED: 'bg-red-50 text-red-800 border-red-200',
  ACCEPTED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
  PUBLISHED: 'bg-teal-50 text-teal-800 border-teal-200',
  CLOSED: 'bg-slate-200 text-slate-600 border-slate-300',
};

export function Badge({
  children,
  status,
  className,
}: {
  children: React.ReactNode;
  status?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        status ? statusStyles[status] || 'bg-slate-50 text-slate-700 border-slate-200' : 'bg-slate-50 text-slate-700 border-slate-200',
        className,
      )}
    >
      {children}
    </span>
  );
}
