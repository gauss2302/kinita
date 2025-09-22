import {
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const userRoles = [
  "JOB_SEEKER", // Соискатель работы - обычный пользователь
  "RECRUITER", // Рекрутер
  "COMPANY_ADMIN", // Админ компании
  "RESEARCHER", // Исследователь
  "PLATFORM_ADMIN", // Админ платформы
] as const;

export const experienceLevels = [
  "INTERN",
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

// Минимальная таблица пользователей для Better Auth
export const usersTable = pgTable(
  "users",
  {
    // Better Auth обязательные поля
    id: text("id").primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").default(false),
    image: varchar("image", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),

    // Основные поля пользователя
    username: varchar("username", { length: 100 }).unique(),
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    avatar: varchar("avatar", { length: 500 }),
    bio: text("bio"),

    // Тип пользователя - ключевое поле
    role: varchar("role", { enum: userRoles }).notNull().default("JOB_SEEKER"),

    // Контакты
    location: varchar("location", { length: 200 }),
    timezone: varchar("timezone", { length: 100 }),
    githubUrl: varchar("github_url", { length: 500 }),
    linkedinUrl: varchar("linkedin_url", { length: 500 }),
    personalWebsite: varchar("personal_website", { length: 500 }),

    // Системные поля
    isActive: boolean("is_active").default(true),
    lastLoginAt: timestamp("last_login_at"),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    usernameIdx: index("users_username_idx").on(table.username),
    roleIdx: index("users_role_idx").on(table.role),
  })
);

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
