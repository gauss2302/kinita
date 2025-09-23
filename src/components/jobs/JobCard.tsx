// components/jobs/JobCard.tsx
"use client";
import Link from "next/link";

export type JobCardJob = {
  id: string;
  title: string;
  description: string;
  companyName: string;
  location: string | null;
  isRemote: boolean | null;
  experienceLevel: string; // e.g., MID_LEVEL
  employmentType: string; // e.g., FULL_TIME
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null; // e.g., USD
  status: string; // e.g., OPEN
  createdAt?: Date | string;
};

interface JobCardProps {
  job: JobCardJob;
}

const statusStyles: Record<string, string> = {
  OPEN: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-gray-100 text-gray-600",
  DRAFT: "bg-amber-100 text-amber-700",
};

function toTitle(s: string) {
  return s
    ?.replace(/_/g, " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (t) => t.toUpperCase());
}

function formatSalary(
  min?: number | null,
  max?: number | null,
  currency?: string | null
) {
  if (!min && !max) return null;
  const cur = currency || "USD";
  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: cur,
  });
  if (min && max) return `${fmt.format(min)} – ${fmt.format(max)}`;
  if (min) return `${fmt.format(min)}+`;
  return `${fmt.format(max as number)}`;
}

export default function JobCard({ job }: JobCardProps) {
  const salary = formatSalary(
    job.salaryMin ?? undefined,
    job.salaryMax ?? undefined,
    job.salaryCurrency ?? undefined
  );
  const statusClass = statusStyles[job.status] || "bg-gray-100 text-gray-600";

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group block rounded-2xl border border-gray-200/50 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Top row: title + status */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
          {job.title}
        </h3>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
        >
          {toTitle(job.status)}
        </span>
      </div>

      {/* Company & meta chips */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center rounded-lg bg-gray-50 px-2.5 py-1 text-gray-700">
          <svg
            className="mr-1.5 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7h18M5 21h14a2 2 0 0 0 2-2V7H3v12a2 2 0 0 0 2 2Zm3-4h8V9H8v8Z"
            />
          </svg>
          {job.companyName}
        </span>
        {job.location && (
          <span className="inline-flex items-center rounded-lg bg-gray-50 px-2.5 py-1 text-gray-700">
            <svg
              className="mr-1.5 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z"
              />
              <circle cx="12" cy="11" r="2" />
            </svg>
            {job.location}
          </span>
        )}
        {job.isRemote ? (
          <span className="inline-flex items-center rounded-lg bg-gray-50 px-2.5 py-1 text-gray-700">
            Remote
          </span>
        ) : null}
        <span className="inline-flex items-center rounded-lg bg-gray-50 px-2.5 py-1 text-gray-700">
          {toTitle(job.experienceLevel)}
        </span>
        <span className="inline-flex items-center rounded-lg bg-gray-50 px-2.5 py-1 text-gray-700">
          {toTitle(job.employmentType)}
        </span>
        {salary && (
          <span className="inline-flex items-center rounded-lg bg-gray-50 px-2.5 py-1 text-gray-700">
            {salary}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="mt-3 line-clamp-3 text-sm text-gray-600">
        {job.description}
      </p>

      {/* Subtle CTA chevron */}
      <div className="mt-4 flex items-center text-sm font-medium text-gray-900">
        View details
        <svg
          className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10.293 15.707a1 1 0 0 1 0-1.414L12.586 12H4a1 1 0 1 1 0-2h8.586l-2.293-2.293a1 1 0 0 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0Z" />
        </svg>
      </div>
    </Link>
  );
}
