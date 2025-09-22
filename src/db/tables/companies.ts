import { relations } from "drizzle-orm";
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
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

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

export const companiesTable = pgTable(
  "companies",
  {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull(),
    description: text("description"),
    website: varchar("website", { length: 500 }),

    type: varchar("type", { enum: companyTypes }).notNull(),
    size: varchar("size", { enum: companySizes }).notNull(),
    foundedyear: integer("founded_year"),

    headquarters: varchar("headquarters", { length: 200 }),
    locations: jsonb("locations").$type<string[]>(),

    logo: varchar("logo", { length: 500 }),
    linkedinUrl: varchar("linkedin_url", { length: 500 }),
    twitterUrl: varchar("twitter_url", { length: 500 }),
    githubUrl: varchar("github_url", { length: 500 }),
    huggingFaceUrl: varchar("hugging_face_url", { length: 500 }),

    employeeCount: integer("employee_count"),

    creatorId: text("creator_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),

    isVerified: boolean("is_verified").default(false),
    isActive: boolean("is_active").default(true),

    // Time Activity
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("companies_name_idx").on(table.name),
    slugIdx: index("companies_slug_idx").on(table.slug),
    typeIdx: index("companies_type_idx").on(table.type),
    sizeIdx: index("companies_size_idx").on(table.size),
  })
);

export const companiesRelations = relations(companiesTable, ({ one }) => ({
  creator: one(usersTable, {
    fields: [companiesTable.creatorId],
    references: [usersTable.id],
  }),
}));

export type Company = typeof companiesTable.$inferSelect;
export type NewCompany = typeof companiesTable.$inferInsert;
