// src/db/schema/tables/user.ts
import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  jsonb,
  integer,
  decimal,
  index,
} from "drizzle-orm/pg-core";
import { companiesTable } from "./companies";
import { relations } from "drizzle-orm";
import { sessionsTable } from "./session";
import { accountsTable } from "./accounts";
import { verificationsTable } from "./verifications";

export const userRoles = [
  "AI_ENGINEER",
  "RECRUITER",
  "RESEARCHER",
  "COMPANY_HR",
  "ADMIN",
] as const;
export const experienceLevels = [
  "JUNIOR",
  "MIDDLE",
  "SENIOR",
  "LEAD",
  "PRINCIPAL",
] as const;
export const employmentTypes = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "FREELANCE",
  "INTERNSHIP",
] as const;

export type UserRole = (typeof userRoles)[number];
export type ExperienceLevel = (typeof experienceLevels)[number];
export type EmploymentType = (typeof employmentTypes)[number];

export const usersTable = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    username: varchar("username", { length: 100 }).unique(),
    name: varchar("name", { length: 255 }), // For Better Auth (populated from first_name + lastName)
    image: varchar("image", { length: 500 }), // For Better Auth (maps to avatar)
    first_name: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    avatar: varchar("avatar", { length: 500 }),
    bio: text("bio"),
    role: varchar("role", { enum: userRoles }).notNull(),
    title: varchar("title", { length: 200 }),
    experienceLevel: varchar("experience_level", { enum: experienceLevels }),
    yearsOfExperience: integer("years_of_experience"),
    location: varchar("location", { length: 200 }),
    timezone: varchar("timezone", { length: 100 }),
    remotePreference: boolean("remote_preference").default(true),
    relocationWillingness: boolean("relocation_willingness").default(false),
    expectedSalaryMin: decimal("expected_salary_min", {
      precision: 10,
      scale: 2,
    }),
    expectedSalaryMax: decimal("expected_salary_max", {
      precision: 10,
      scale: 2,
    }),
    salaryCurrency: varchar("salary_currency", { length: 3 }).default("USD"),
    skills: jsonb("skills").$type<{
      programming: string[];
      frameworks: string[];
      domains: string[];
      tools: string[];
      databases: string[];
    }>(),
    jobAlerts: boolean("job_alerts").default(true),
    profileVisibility: varchar("profile_visibility", { length: 20 }).default(
      "PUBLIC"
    ),
    githubUrl: varchar("github_url", { length: 500 }),
    linkedinUrl: varchar("linkedin_url", { length: 500 }),
    huggingFaceUrl: varchar("hugging_url", { length: 500 }),
    twitterUrl: varchar("twitter_url", { length: 500 }),
    personalWebsite: varchar("personal_website", { length: 500 }),
    passwordHash: varchar("password_hash", { length: 255 }), // Used by Better Auth
    emailVerified: boolean("email_verified").default(false), // Used by Better Auth
    isActive: boolean("is_active").default(true),

    // Company Relation
    companyId: text("company_id").references(() => companiesTable.id),

    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    roleIdx: index("users_role_idx").on(table.role),
    skillsIdx: index("users_skills_idx").using("gin", table.skills),
    locationIdx: index("users_location_idx").on(table.location),
  })
);

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  company: one(companiesTable, {
    fields: [usersTable.companyId],
    references: [companiesTable.id],
  }),
  sessions: many(sessionsTable),
  accounts: many(accountsTable),
  verifications: many(verificationsTable),
}));

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
