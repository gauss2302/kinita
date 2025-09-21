import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
  index,
  decimal,
} from "drizzle-orm/pg-core";

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

export const researchOpportunities = pgTable(
  "research_opportunities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id"), // FK to companies or research institutions
    leadResearcherId: uuid("lead_researcher_id"), // FK to users

    // Основная информация
    title: varchar("title", { length: 300 }).notNull(),
    description: text("description").notNull(),
    type: varchar("type", { enum: researchTypes }).notNull(),

    // Исследовательские области
    researchAreas: jsonb("research_areas").$type<string[]>(), // ["NLP", "Computer Vision"]
    keywords: jsonb("keywords").$type<string[]>(),

    // Требования
    requiredQualifications: text("required_qualifications"),
    preferredQualifications: text("preferred_qualifications"),
    timeCommitment: varchar("time_commitment", { length: 100 }), // "Full-time", "Part-time", "Flexible"
    duration: varchar("duration", { length: 100 }), // "3 months", "1 year", "Ongoing"

    // Финансирование
    isFunded: boolean("is_funded").default(false),
    stipend: decimal("stipend", { precision: 10, scale: 2 }),
    stipendCurrency: varchar("stipend_currency", { length: 3 }).default("USD"),

    // Локация
    location: varchar("location", { length: 200 }),
    isRemote: boolean("is_remote").default(true),

    // Статус и временные рамки
    status: varchar("status", { enum: researchStatus })
      .default("OPEN")
      .notNull(),
    applicationDeadline: timestamp("application_deadline"),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),

    // Дополнительная информация
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
    locationIdx: index("research_location_idx").on(table.location),
    deadlineIdx: index("research_deadline_idx").on(table.applicationDeadline),
  })
);

export type ResearchOpportunity = typeof researchOpportunities.$inferSelect;
export type NewResearchOpportunity = typeof researchOpportunities.$inferInsert;
