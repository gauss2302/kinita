import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { companiesTable, usersTable } from "../schema";
import { employmentTypes, experienceLevels } from "./users";

export const jobStatus = [
  "DRAFT",
  "ACTIVE",
  "PAUSED",
  "CLOSED",
  "FILLED",
] as const;
export type JobStatus = (typeof jobStatus)[number];

export const jobsTable = pgTable(
  "jobs",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id")
      .notNull()
      .references(() => companiesTable.id, { onDelete: "cascade" }),
    createdBy: text("created_by")
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),

    // Основная информация
    title: varchar("title", { length: 300 }).notNull(),
    slug: varchar("slug", { length: 300 }).notNull().unique(),
    description: text("description").notNull(),
    requirements: text("requirements"),
    responsibilities: text("responsibilities"),
    benefits: text("benefits"),

    // Профессиональные требования
    experienceLevel: varchar("experience_level", {
      enum: experienceLevels,
    }).notNull(),
    employmentType: varchar("employment_type", {
      enum: employmentTypes,
    }).notNull(),

    // Локация и работа
    location: varchar("location", { length: 200 }),
    isRemote: boolean("is_remote").default(false),
    visaSponsorship: boolean("visa_sponsorship").default(false),

    // Зарплата
    salaryMin: decimal("salary_min", { precision: 10, scale: 2 }),
    salaryMax: decimal("salary_max", { precision: 10, scale: 2 }),
    salaryCurrency: varchar("salary_currency", { length: 3 }).default("USD"),
    equityOffered: boolean("equity_offered").default(false),

    // Навыки
    requiredSkills: jsonb("required_skills").$type<{
      programming: string[];
      frameworks: string[];
      domains: string[];
      tools: string[];
      minYearsExperience: number;
    }>(),

    preferredSkills: jsonb("preferred_skills").$type<{
      programming: string[];
      frameworks: string[];
      domains: string[];
      certifications: string[];
    }>(),

    // AI специфика
    aiDomains: jsonb("ai_domains").$type<string[]>(),
    researchComponent: boolean("research_component").default(false),
    publicationsRequired: boolean("publications_required").default(false),

    // Статус и метрики
    status: varchar("status", { enum: jobStatus }).default("DRAFT").notNull(),
    viewsCount: integer("views_count").default(0),
    applicationsCount: integer("applications_count").default(0),

    // Временные рамки
    applicationDeadline: timestamp("application_deadline"),
    startDate: timestamp("start_date"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    publishedAt: timestamp("published_at"),
    closedAt: timestamp("closed_at"),
  },
  (table) => ({
    companyIdx: index("jobs_company_idx").on(table.companyId),
    creatorIdx: index("jobs_creator_idx").on(table.createdBy),
    statusIdx: index("jobs_status_idx").on(table.status),
    skillsIdx: index("jobs_skills_idx").using("gin", table.requiredSkills),
    publishedIdx: index("jobs_published_idx").on(table.publishedAt),
  })
);

export type Job = typeof jobsTable.$inferSelect;
export type NewJob = typeof jobsTable.$inferInsert;
