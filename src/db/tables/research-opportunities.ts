import {
  pgTable,
  varchar,
  text,
  timestamp,
  index,
  decimal,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { companiesTable, usersTable } from "../schema";

export const researchTypes = [
  "ACADEMIC",
  "INDUSTRY",
  "COLLABORATION",
  "GRANT",
  "CONFERENCE",
  "PUBLICATION",
] as const;

export const researchStatus = [
  "OPEN",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

export type ResearchType = (typeof researchTypes)[number];
export type ResearchStatus = (typeof researchStatus)[number];

export const researchOpportunitiesTable = pgTable(
  "research_opportunities",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").references(
      () => companiesTable.id,
      { onDelete: "cascade" }
    ),
    leadResearcherId: text("lead_researcher_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),

    title: varchar("title", { length: 300 }).notNull(),
    description: text("description").notNull(),
    type: varchar("type", { enum: researchTypes }).notNull(),

    researchAreas: jsonb("research_areas").$type<string[]>(),
    keywords: jsonb("keywords").$type<string[]>(),

    requiredQualifications: text("required_qualifications"),
    preferredQualifications: text("preferred_qualifications"),
    timeCommitment: varchar("time_commitment", { length: 100 }),
    duration: varchar("duration", { length: 100 }),

    isFunded: boolean("is_funded").default(false),
    stipend: decimal("stipend", { precision: 10, scale: 2 }),
    stipendCurrency: varchar("stipend_currency", { length: 3 }).default("USD"),

    location: varchar("location", { length: 200 }),
    isRemote: boolean("is_remote").default(true),

    status: varchar("status", { enum: researchStatus })
      .default("OPEN")
      .notNull(),

    applicationDeadline: timestamp("application_deadline"),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),

    publicationsExpected: boolean("publications_expected").default(false),
    conferenceParticipation: boolean("conference_participation").default(false),
    mentorshipProvided: boolean("mentorship_provided").default(true),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    publishedAt: timestamp("published_at"),
  },
  (table) => ({
    typeIdx: index("research_type_idx").on(table.type),
    statusIdx: index("research_status_idx").on(table.status),
    areasIdx: index("research_areas_idx").using("gin", table.researchAreas),
    leadIdx: index("research_lead_idx").on(table.leadResearcherId),
  })
);

export type ResearchOpportunity =
  typeof researchOpportunitiesTable.$inferSelect;
export type NewResearchOpportunity =
  typeof researchOpportunitiesTable.$inferInsert;
