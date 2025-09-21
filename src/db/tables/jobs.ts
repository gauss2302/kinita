import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  decimal,
} from "drizzle-orm/pg-core";
import { employmentTypes, experienceLevels } from "./user";

export const jobStatus = [
  "DRAFT",
  "ACTIVE",
  "PAUSED",
  "CLOSED",
  "FILLED",
] as const;
export const applicationStatus = [
  "PENDING",
  "REVIEWED",
  "INTERVIEWING",
  "OFFERED",
  "REJECTED",
  "ACCEPTED",
  "WITHDRAWN",
] as const;

export type JobStatus = (typeof jobStatus)[number];
export type ApplicationStatus = (typeof applicationStatus)[number];

export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull(), // FK to companies
    recruiterId: uuid("recruiter_id"), // FK to users (recruiter)

    // Основная информация о вакансии
    title: varchar("title", { length: 300 }).notNull(),
    slug: varchar("slug", { length: 300 }).notNull().unique(),
    description: text("description").notNull(),

    // Требования
    requirements: text("requirements"),
    responsibilities: text("responsibilities"),
    niceToHave: text("nice_to_have"),

    // Профессиональная информация
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

    // Технические требования
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

    // AI специфичная информация
    aiDomain: varchar("ai_domain", { length: 100 }), // "NLP", "Computer Vision", "MLOps"
    teamSize: integer("team_size"),
    researchComponent: boolean("research_component").default(false),
    publicationsRequired: boolean("publications_required").default(false),

    // Статус и время
    status: varchar("status", { enum: jobStatus }).default("DRAFT").notNull(),
    applicationDeadline: timestamp("application_deadline"),
    startDate: timestamp("start_date"),

    // Метрики
    viewsCount: integer("views_count").default(0),
    applicationsCount: integer("applications_count").default(0),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    publishedAt: timestamp("published_at"),
    closedAt: timestamp("closed_at"),
  },
  (table) => ({
    companyIdx: index("jobs_company_idx").on(table.companyId),
    statusIdx: index("jobs_status_idx").on(table.status),
    locationIdx: index("jobs_location_idx").on(table.location),
    experienceIdx: index("jobs_experience_idx").on(table.experienceLevel),
    skillsIdx: index("jobs_skills_idx").using("gin", table.requiredSkills),
    aiDomainIdx: index("jobs_ai_domain_idx").on(table.aiDomain),
    publishedIdx: index("jobs_published_idx").on(table.publishedAt),
  })
);

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
