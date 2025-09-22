import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const companyTypes = [
  "STARTUP",
  "SCALE_UP",
  "ENTERPRISE",
  "CONSULTANCY",
  "RESEARCH_LAB",
  "UNIVERSITY",
] as const;

export const companySizes = [
  "1_10",
  "11_50",
  "51_200",
  "201_1000",
  "1001_5000",
  "5000_PLUS",
] as const;

export type CompanyType = (typeof companyTypes)[number];
export type CompanySize = (typeof companySizes)[number];

export const companiesTable = pgTable(
  "companies",
  {
    id: text("id")
      .primaryKey()
      .$default(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    description: text("description"),
    website: varchar("website", { length: 500 }),
    logo: varchar("logo", { length: 500 }),

    // Required fields with defaults
    type: varchar("type", { enum: companyTypes }).notNull().default("STARTUP"),
    size: varchar("size", { enum: companySizes }).notNull().default("1_10"),
    foundedYear: integer("founded_year"),

    headquarters: varchar("headquarters", { length: 200 }),
    locations: jsonb("locations").$type<string[]>(),

    linkedinUrl: varchar("linkedin_url", { length: 500 }),
    twitterUrl: varchar("twitter_url", { length: 500 }),
    githubUrl: varchar("github_url", { length: 500 }),

    employeeCount: integer("employee_count"),

    // Creator of the company (usually ADMIN)
    creatorId: text("creator_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),

    isVerified: boolean("is_verified").default(false),
    isActive: boolean("is_active").default(true),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    nameIdx: index("companies_name_idx").on(table.name),
    slugIdx: index("companies_slug_idx").on(table.slug),
    typeIdx: index("companies_type_idx").on(table.type),
    creatorIdx: index("companies_creator_idx").on(table.creatorId),
  })
);

export type Company = typeof companiesTable.$inferSelect;
export type NewCompany = typeof companiesTable.$inferInsert;
