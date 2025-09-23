/* eslint-disable @typescript-eslint/no-explicit-any */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db/client";

// Import tables directly to avoid circular dependencies
import { usersTable } from "@/db/tables/users";
import { sessionsTable } from "@/db/tables/sessions";
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
      },
      lastName: {
        type: "string",
        required: false,
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
      mapProfileToUser: (profile) => {
        return {
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          first_name: profile.given_name || profile.name?.split(" ")[0] || "",
          lastName: profile.family_name || profile.name?.split(" ")[1] || "",
          role: "AI_ENGINEER",
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
          first_name: names[0] || profile.login || "",
          lastName: names[1] || "",
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
  redirects: {
    // afterSignIn: "/dashboard",

    afterSignUp: "/dashboard",
    afterSignOut: "/login",
    afterSignIn: async (session: any) => {
      // Fetch user details to check role and companyId
      const [user] = await db
        .select({ role: usersTable.role, companyId: usersTable.companyId })
        .from(usersTable)
        .where(eq(usersTable.id, session.user.id))
        .limit(1);

      if (user.role === "ADMIN" && user.companyId) {
        return `/dashboard/company/${user.companyId}`;
      }
      return "/dashboard";
    },
  },
});
