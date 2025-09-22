// src/lib/auth/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db/client";

import { usersTable } from "@/db/tables/user";
import { sessionsTable } from "@/db/tables/session";
import { accountsTable } from "@/db/tables/accounts";
import { verificationsTable } from "@/db/tables/verifications";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: usersTable,
      session: sessionsTable,
      account: accountsTable,
      verification: verificationsTable,
    },
  }),
  user: {
    additionalFields: {
      first_name: {
        type: "string",
        required: false,
        defaultValue: "User",
      },
      lastName: {
        type: "string",
        required: false,
        defaultValue: "Name",
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "AI_ENGINEER",
      },
      username: {
        type: "string",
        required: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Update if older than 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Map Google profile fields to your user fields
      mapProfileToUser: (profile) => {
        return {
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          // Split name for first_name and lastName
          first_name:
            profile.given_name || profile.name?.split(" ")[0] || "User",
          lastName:
            profile.family_name || profile.name?.split(" ")[1] || "Name",
          role: "AI_ENGINEER", // Default role for OAuth users
          emailVerified: profile.email_verified || false,
        };
      },
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      enabled: !!(
        process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ),
      mapProfileToUser: (profile) => {
        const names = profile.name?.split(" ") || [];
        return {
          email: profile.email,
          name: profile.name,
          image: profile.avatar_url,
          first_name: names[0] || profile.login || "User",
          lastName: names[1] || "Name",
          role: "AI_ENGINEER",
          username: profile.login,
          githubUrl: profile.html_url,
        };
      },
    },
  },
  trustedOrigins: ["http://localhost:3000"],
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,
  plugins: [nextCookies()],
  // Add redirect configuration
  redirects: {
    afterSignIn: "/dashboard",
    afterSignUp: "/dashboard",
    afterSignOut: "/login",
  },
});
