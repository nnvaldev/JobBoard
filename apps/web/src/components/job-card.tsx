import Link from 'next/link';
import {
  JOB_SENIORITY_LABELS,
  JOB_TYPE_LABELS,
  JobSeniority,
  JobType,
} from '@jobboard/shared';
import { ArrowUpRight, MapPin, Wifi } from 'lucide-react';
import type { Job } from '@/lib/types';
import { formatSalary } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function JobCard({ job }: { job: Job }) {
  const excerpt =
    job.description.length > 140
      ? `${job.description.slice(0, 140).trim()}…`
      : job.description;

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-teal-800">{job.company.name}</p>
          <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-xl font-semibold text-slate-900 group-hover:text-teal-900">
            {job.title}
          </h3>
        </div>
        {job.isRemote && (
          <Badge className="shrink-0">
            <Wifi className="mr-1 h-3 w-3" />
            Remoto
          </Badge>
        )}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{excerpt}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </span>
        <span className="rounded-lg bg-slate-50 px-2 py-1">
          {JOB_TYPE_LABELS[job.type as JobType] || job.type}
        </span>
        <span className="rounded-lg bg-slate-50 px-2 py-1">
          {JOB_SENIORITY_LABELS[job.seniority as JobSeniority] || job.seniority}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <p className="text-sm font-semibold text-slate-800">
          {formatSalary(job.salaryMin, job.salaryMax)}
        </p>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-800">
          Ver oferta
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
