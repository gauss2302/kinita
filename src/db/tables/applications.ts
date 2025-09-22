import {
  pgTable,
  varchar,
  text,
  integer,
  timestamp,
  index,
  decimal,
} from "drizzle-orm/pg-core";
import { jobsTable } from "./jobs";
import { usersTable } from "../schema";

export const applicationStatus = [
  "PENDING",
  "REVIEWED",
  "INTERVIEWING",
  "OFFERED",
  "REJECTED",
  "ACCEPTED",
  "WITHDRAWN",
] as const;

export type ApplicationStatus = (typeof applicationStatus)[number];

export const applicationsTable = pgTable(
  "applications",
  {
    id: text("id").primaryKey(),
    jobId: text("job_id")
      .notNull()
      .references(() => jobsTable.id, { onDelete: "cascade" }),
    applicantId: text("applicant_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    // Заявка
    coverLetter: text("cover_letter"),
    resumeUrl: varchar("resume_url", { length: 500 }),
    portfolioUrl: varchar("portfolio_url", { length: 500 }),

    // Статус и процесс
    status: varchar("status", { enum: applicationStatus })
      .default("PENDING")
      .notNull(),
    recruiterNotes: text("recruiter_notes"),

    // Интервью
    interviewScheduledAt: timestamp("interview_scheduled_at"),
    interviewFeedback: text("interview_feedback"),

    // Техническое задание
    technicalTestUrl: varchar("technical_test_url", { length: 500 }),
    technicalTestScore: integer("technical_test_score"),

    // Предложение
    offerSalary: decimal("offer_salary", { precision: 10, scale: 2 }),
    offerCurrency: varchar("offer_currency", { length: 3 }),
    offerDeadline: timestamp("offer_deadline"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    reviewedAt: timestamp("reviewed_at"),
    respondedAt: timestamp("responded_at"),
  },
  (table) => ({
    jobIdx: index("applications_job_idx").on(table.jobId),
    applicantIdx: index("applications_applicant_idx").on(table.applicantId),
    statusIdx: index("applications_status_idx").on(table.status),
    createdIdx: index("applications_created_idx").on(table.createdAt),
  })
);

export type Application = typeof applicationsTable.$inferSelect;
export type NewApplication = typeof applicationsTable.$inferInsert;
