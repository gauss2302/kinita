/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { usersTable } from "@/db/tables/users";
import { eq } from "drizzle-orm";

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function loginCompanyAction(formData: FormData) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });

  // if (!session?.user) {
  //   redirect("/");
  // }

  if (session?.user) {
    if (session.user.role == "ADMIN" && session.user.id) {
      redirect(`/dashboard/company/${session.user.companyId}`);
    } else {
      redirect("/dashboard");
    }
  }

  const adminData = {
    email: formData.get("adminEmail") as string,
    password: formData.get("adminPassword") as string,
  };

  try {
    const validatedAdminData = adminLoginSchema.parse(adminData);

    const loginResult = await auth.api.signInEmail({
      body: {
        email: validatedAdminData.email,
        password: validatedAdminData.password,
      },
    });

    if (!loginResult || !loginResult.user) {
      throw new Error("Failed to login for company");
    }

    console.log("Company login successful with email:", loginResult.user.email);

    // Fetch user to get companyId and role after login
    const [user] = await db
      .select({ companyId: usersTable.companyId, role: usersTable.role })
      .from(usersTable)
      .where(eq(usersTable.email, loginResult.user.email))
      .limit(1);

    // Redirect based on role and companyId
    if (user.role === "ADMIN" && user.companyId) {
      redirect(`/dashboard/company/${user.companyId}`);
    } else {
      redirect("/dashboard");
    }
  } catch (error: any) {
    // Ignore NEXT_REDIRECT errors
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      return { success: true };
    }
    console.error(
      "Detailed error:",
      JSON.stringify(error.body || error, null, 2)
    );
    return {
      success: false,
      error: error.message || "Login failed",
    };
  }
}
