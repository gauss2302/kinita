// export * from "./tables/user";
// export * from "./tables/session";
// export * from "./tables/companies";
// export * from "./tables/accounts";
// export * from "./tables/verifications";

// import { usersTable } from "./tables/user";
// import { sessionsTable } from "./tables/session";
// import { companiesTable } from "./tables/companies";
// import { accountsTable } from "./tables/accounts";
// import { verificationsTable } from "./tables/verifications";
// export const schema = {
//   usersTable,
//   sessionsTable,
//   companiesTable,
//   accountsTable,
//   verificationsTable,
// };

import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table with companyId
export const usersTable = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    email: text("email").notNull().unique(),
    username: text("username").unique(),
    first_name: text("first_name"),
    lastName: text("lastName"),
    role: text("role").$type<
      "AI_ENGINEER" | "RECRUITER" | "RESEARCHER" | "COMPANY_HR" | "ADMIN"
    >(),
    image: text("image"),
    avatar: text("avatar"),
    bio: text("bio"),
    linkedin: text("linkedin"),
    github: text("github"),
    location: text("location"),
    companyId: text("company_id").references(() => companiesTable.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    usernameIdx: uniqueIndex("users_username_idx").on(table.username),
  })
);

// Companies table
export const companiesTable = pgTable(
  "companies",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    logo: text("logo"),
    website: text("website"),
    creatorId: text("creator_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    nameIdx: uniqueIndex("companies_name_idx").on(table.name),
  })
);

// Sessions table
export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  expires_at: timestamp("expires_at").notNull(),
});

// Accounts table
export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  provider: text("provider").notNull(),
  provider_account_id: text("provider_account_id").notNull(),
  access_token: text("access_token"),
  refresh_token: text("refresh_token"),
  expires_at: timestamp("expires_at"),
});

// Verifications table
export const verificationsTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  token: text("token").notNull(),
  expires_at: timestamp("expires_at").notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  company: one(companiesTable, {
    fields: [usersTable.companyId],
    references: [companiesTable.id],
    relationName: "userToCompany",
  }),
  companiesCreated: many(companiesTable, { relationName: "creator" }),
  sessions: many(sessionsTable),
  accounts: many(accountsTable),
  verifications: many(verificationsTable),
}));

export const companiesRelations = relations(
  companiesTable,
  ({ one, many }) => ({
    creator: one(usersTable, {
      fields: [companiesTable.creatorId],
      references: [usersTable.id],
      relationName: "creator",
    }),
    users: many(usersTable, { relationName: "userToCompany" }),
  })
);

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.user_id],
    references: [usersTable.id],
  }),
}));

export const accountsRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.user_id],
    references: [usersTable.id],
  }),
}));

export const verificationsRelations = relations(
  verificationsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [verificationsTable.user_id],
      references: [usersTable.id],
    }),
  })
);

// Export schema
export const schema = {
  usersTable,
  companiesTable,
  sessionsTable,
  accountsTable,
  verificationsTable,
  usersRelations,
  companiesRelations,
  sessionsRelations,
  accountsRelations,
  verificationsRelations,
};
