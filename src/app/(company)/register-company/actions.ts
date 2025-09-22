"use server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { UserService } from "@/services/userService";
import { CompanyService } from "@/services/companyService";
import { redirect } from "next/navigation";

export async function registerCompanyAction(formData: FormData) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (session?.user) {
    redirect("/dashboard"); // Already logged in
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
    // Create company first
    const company = await CompanyService.createCompany(companyData);

    // Create admin user for the company
    const adminUser = await UserService.createAdminUserForCompany({
      ...adminData,
      companyId: company.id,
    });

    // Register user with Better Auth
    await auth.api.signUpEmail({
      email: adminData.email,
      password: adminData.password,
      name: `${adminData.first_name} ${adminData.lastName}`,
      first_name: adminData.first_name,
      lastName: adminData.lastName,
      role: "ADMIN",
      companyId: company.id,
    });

    return { success: true, company, adminUser };
  } catch (error: any) {
    console.error("Register company error:", error);
    return {
      success: false,
      error: error.message || "Failed to register company",
    };
  }
}
