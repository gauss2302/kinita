/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { CompanyService } from "@/services/companyService";
import { db } from "@/db/client";
import { usersTable } from "@/db/tables/users";
import { companyMembersTable } from "@/db/tables/company-members";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

const adminDataSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  first_name: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional()
    .or(z.literal("")),
});

export async function registerCompanyAction(formData: FormData) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (session?.user) {
    redirect("/dashboard");
  }

  const companyData = {
    name: formData.get("companyName") as string,
    description: formData.get("companyDescription") as string,
    logo: formData.get("companyLogo") as string,
    website: formData.get("companyWebsite") as string,
  };

  const adminData = {
    email: formData.get("adminEmail") as string,
    password: formData.get("adminPassword") as string,
    first_name: formData.get("adminFirstName") as string,
    lastName: formData.get("adminLastName") as string,
    username: formData.get("adminUsername") as string,
  };

  try {
    const validatedAdminData = adminDataSchema.parse(adminData);
    const name =
      `${validatedAdminData.first_name} ${validatedAdminData.lastName}`.trim();

    console.log("Input to signUpEmail:", {
      email: validatedAdminData.email,
      password: validatedAdminData.password,
      name,
      first_name: validatedAdminData.first_name,
      lastName: validatedAdminData.lastName,
      role: "ADMIN",
      username: validatedAdminData.username || undefined,
    });

    const authResult = await auth.api.signUpEmail({
      body: {
        email: validatedAdminData.email,
        password: validatedAdminData.password,
        name,
        first_name: validatedAdminData.first_name,
        lastName: validatedAdminData.lastName,
        role: "ADMIN",
        username: validatedAdminData.username || undefined,
        companyId: undefined, // Will be set after company creation
      },
    });

    if (!authResult || !authResult.user) {
      throw new Error("Failed to create user");
    }

    console.log("User created successfully:", authResult.user.id);

    const company = await CompanyService.createCompany({
      name: companyData.name,
      description: companyData.description || undefined,
      logo: companyData.logo || undefined,
      website: companyData.website || undefined,
      creatorId: authResult.user.id,
    });

    // Set companyId for the user
    await db
      .update(usersTable)
      .set({ companyId: company.id })
      .where(eq(usersTable.id, authResult.user.id));

    // Add admin to companyMembersTable
    await db.insert(companyMembersTable).values({
      companyId: company.id,
      userId: authResult.user.id,
      role: "ADMIN",
      invitedBy: authResult.user.id,
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Company created successfully:", company.id);

    // Redirect to company dashboard
    redirect(`/dashboard/company/${company.id}`);
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
      error: error.message || "Registration failed",
    };
  }
}
