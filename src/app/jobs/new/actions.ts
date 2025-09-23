/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { experienceLevels, employmentTypes } from "@/db/tables/users";
import { JobService } from "@/services/jobs/jobsService";

const createJobPositionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(300),
  slug: z.string().max(300).nullable(),
  description: z.string().max(1000),
  requirements: z.string().max(1000).optional(),
  responsibilities: z.string().max(1000).optional(),
  benefits: z.string().max(255).optional(),
  experienceLevel: z.enum(experienceLevels),
  employmentType: z.enum(employmentTypes),
  location: z.string().max(200).optional(),
  isRemote: z.boolean().default(false),
  visaSponsorship: z.boolean().default(false),
});

export async function createJobPositionAction(formData: FormData) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session?.user) {
    redirect("/login-company");
  }

  const user = session.user;
  if (user.role !== "ADMIN" || !user.companyId) {
    throw new Error("Unauthorized: Only admins can create job positions");
  }

  try {
    const validatedData = createJobPositionSchema.parse({
      title: formData.get("title") as string,
      slug: formData.get("slug") as string | undefined,
      description: formData.get("description") as string,
      requirements: formData.get("requirements") as string | undefined,
      responsibilities: formData.get("responsibilities") as string | undefined,
      benefits: formData.get("benefits") as string | undefined,
      experienceLevel: formData.get("experienceLevel") as string,
      employmentType: formData.get("employmentType") as string,
      location: formData.get("location") as string | undefined,
      isRemote: formData.get("isRemote") === "on",
      visaSponsorship: formData.get("visaSponsorship") === "on",
    });

    const job = await JobService.createJobPosition({
      ...validatedData,
      companyId: user.companyId,
      createdBy: user.id,
    });

    redirect(`/jobs/${job.id}`);
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      return { success: true };
    }
    console.error(
      "Error creating job:",
      JSON.stringify(error.body || error, null, 2)
    );
    return {
      success: false,
      error: error.message || "Failed to create job position",
    };
  }
}
