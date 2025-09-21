import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  index,
  decimal,
} from "drizzle-orm/pg-core";
import { applicationStatus } from "./jobs";

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id").notNull(), // FK to jobs
    candidateId: uuid("candidate_id").notNull(), // FK to users

    // Заявка
    coverLetter: text("cover_letter"),
    resumeUrl: varchar("resume_url", { length: 500 }),
    portfolioUrl: varchar("portfolio_url", { length: 500 }),

    // Статус и процесс
    status: varchar("status", { enum: applicationStatus })
      .default("PENDING")
      .notNull(),
    recruiterNotes: text("recruiter_notes"),
    candidateNotes: text("candidate_notes"),

    // Интервью и фидбек
    interviewScheduled: timestamp("interview_scheduled"),
    interviewFeedback: text("interview_feedback"),
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
    candidateIdx: index("applications_candidate_idx").on(table.candidateId),
    statusIdx: index("applications_status_idx").on(table.status),
    createdIdx: index("applications_created_idx").on(table.createdAt),
  })
);

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
