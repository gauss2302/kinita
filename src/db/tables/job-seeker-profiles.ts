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
import { usersTable } from "../schema";
import { EmploymentType, experienceLevels } from "./users";

export const jobSeekerProfilesTable = pgTable(
  "job_seeker_profiles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" })
      .unique(),

    // Профессиональная информация
    title: varchar("title", { length: 200 }),
    experienceLevel: varchar("experience_level", { enum: experienceLevels }),
    yearsOfExperience: integer("years_of_experience"),

    // Предпочтения по работе
    remotePreference: boolean("remote_preference").default(true),
    relocationWillingness: boolean("relocation_willingness").default(false),
    preferredEmploymentTypes: jsonb("preferred_employment_types").$type<
      EmploymentType[]
    >(),

    // Зарплатные ожидания
    expectedSalaryMin: decimal("expected_salary_min", {
      precision: 10,
      scale: 2,
    }),
    expectedSalaryMax: decimal("expected_salary_max", {
      precision: 10,
      scale: 2,
    }),
    salaryCurrency: varchar("salary_currency", { length: 3 }).default("USD"),

    // Навыки и технологии
    skills: jsonb("skills").$type<{
      programming: string[];
      frameworks: string[];
      domains: string[];
      tools: string[];
      databases: string[];
      softSkills: string[];
    }>(),

    // Образование
    education: jsonb("education").$type<
      {
        degree: string;
        field: string;
        institution: string;
        graduationYear: number;
      }[]
    >(),

    // Опыт работы
    workExperience: jsonb("work_experience").$type<
      {
        company: string;
        position: string;
        startDate: string;
        endDate: string | null;
        description: string;
      }[]
    >(),

    // Настройки
    profileVisibility: varchar("profile_visibility", { length: 20 }).default(
      "PUBLIC"
    ),
    jobAlerts: boolean("job_alerts").default(true),

    // AI/ML специфичная информация
    aiDomains: jsonb("ai_domains").$type<string[]>(), // ["NLP", "Computer Vision", "MLOps"]
    researchInterests: jsonb("research_interests").$type<string[]>(),
    publications: jsonb("publications").$type<
      {
        title: string;
        venue: string;
        year: number;
        url?: string;
      }[]
    >(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userIdx: index("job_seeker_profiles_user_idx").on(table.userId),
    skillsIdx: index("job_seeker_profiles_skills_idx").using(
      "gin",
      table.skills
    ),
    experienceIdx: index("job_seeker_profiles_experience_idx").on(
      table.experienceLevel
    ),
    locationIdx: index("job_seeker_profiles_remote_idx").on(
      table.remotePreference
    ),
  })
);

export type JobSeekerProfile = typeof jobSeekerProfilesTable.$inferSelect;
export type NewJobSeekerProfile = typeof jobSeekerProfilesTable.$inferInsert;
