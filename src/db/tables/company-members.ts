import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { companiesTable, usersTable } from "../schema";

export const companyMembersTable = pgTable(
  "company_members",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id")
      .notNull()
      .references(() => companiesTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    // Роль в компании
    role: varchar("role", {
      enum: ["ADMIN", "RECRUITER", "HR_MANAGER", "EMPLOYEE"] as const,
    })
      .notNull()
      .default("EMPLOYEE"),

    // Дополнительные права
    canPostJobs: boolean("can_post_jobs").default(false),
    canManageApplications: boolean("can_manage_applications").default(false),
    canManageMembers: boolean("can_manage_members").default(false),

    invitedBy: text("invited_by").references(() => usersTable.id),
    invitedAt: timestamp("invited_at"),
    joinedAt: timestamp("joined_at").defaultNow(),
    leftAt: timestamp("left_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    companyUserIdx: index("company_members_company_user_idx").on(
      table.companyId,
      table.userId
    ),
    companyIdx: index("company_members_company_idx").on(table.companyId),
    userIdx: index("company_members_user_idx").on(table.userId),
  })
);

export type CompanyMember = typeof companyMembersTable.$inferSelect;
export type NewCompanyMember = typeof companyMembersTable.$inferInsert;
