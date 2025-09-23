import { db } from "@/db/client";
import { Job, jobsTable } from "@/db/tables/jobs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  experienceLevels,
  employmentTypes,
  ExperienceLevel,
  EmploymentType,
} from "@/db/tables/users";

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
  companyId: z.string(),
  createdBy: z.string(),
});

export class JobService {
  static async createJobPosition(data: {
    title: string;
    description: string;
    requirements?: string;
    responsibilities?: string;
    benefits?: string;
    experienceLevel: ExperienceLevel;
    employmentType: EmploymentType;
    location?: string;
    isRemote: boolean;
    visaSponsorship?: boolean;
    companyId: string;
    createdBy: string;
  }): Promise<Job> {
    const validated = createJobPositionSchema.parse(data);

    const slug =
      validated.slug ||
      validated.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const existingJobPosition = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.title, validated.title))
      .limit(1);

    if (existingJobPosition.length > 0) {
      throw new Error("This Job Position already exists");
    }

    const [jobPosition] = await db
      .insert(jobsTable)
      .values({
        id: crypto.randomUUID(),
        companyId: validated.companyId,
        createdBy: validated.createdBy,
        title: validated.title,
        slug,
        description: validated.description,
        requirements: validated.requirements ?? null,
        responsibilities: validated.responsibilities ?? null,
        benefits: validated.benefits ?? null,
        experienceLevel: validated.experienceLevel,
        employmentType: validated.employmentType,
        location: validated.location ?? null,
        isRemote: validated.isRemote,
        visaSponsorship: validated.visaSponsorship,
        status: "DRAFT",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: jobsTable.id });

    return jobPosition as Job;
  }
}
