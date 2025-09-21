// src/lib/auth/auth.ts
import { client } from "@/db/client";
import { schema } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(client, {
    provider: "pg",
    usePlural: true, // Matches table name "users", "sessions"
    schema: {
      user: schema.usersTable,
      session: schema.sessionsTable,
      account: schema.accountsTable,
      verification: schema.verificationsTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
    additionalFields: {
      first_name: {
        type: "string",
        required: true,
      },
      lastName: {
        type: "string",
        required: true,
      },
      role: {
        type: "string",
        required: true,
        enum: ["AI_ENGINEER", "RECRUITER", "RESEARCHER", "COMPANY_HR", "ADMIN"],
      },
      username: {
        type: "string",
        required: false,
      },
      name: {
        type: "string",
        required: false, // Populated from first_name + lastName
        default: ({ first_name, lastName }) => `${first_name} ${lastName}`,
      },
      image: {
        type: "string",
        required: false, // Maps to avatar
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [nextCookies()],
});
