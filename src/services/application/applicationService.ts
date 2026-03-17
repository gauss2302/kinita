import { db } from "@/db/client";
import {
  Application,
  applicationsTable,
  applicationStatus,
  ApplicationStatus,
} from "@/db/tables/applications";
import { jobsTable } from "@/db/tables/jobs";
import { usersTable } from "@/db/tables/users";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const createApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  applicantId: z.string().min(1, "Applicant ID is required"),
  coverLetter: z
    .string()
    .max(2000, "Cover letter must be 2000 characters or less")
    .optional()
    .or(z.literal("")),
  resumeUrl: z
    .string()
    .url("Invalid resume URL")
    .optional()
    .or(z.literal("")),
  portfolioUrl: z
    .string()
    .url("Invalid portfolio URL")
    .optional()
    .or(z.literal("")),
});

const updateApplicationStatusSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  status: z.enum(applicationStatus),
});

export class ApplicationService {
  static async applyForAPosition(data: {
    jobId: string;
    applicantId: string;
    coverLetter?: string;
    resumeUrl?: string;
    portfolioUrl?: string;
  }): Promise<Application> {
    const validated = createApplicationSchema.parse(data);

    const [job] = await db
      .select({
        id: jobsTable.id,
        status: jobsTable.status,
        applicationDeadline: jobsTable.applicationDeadline,
        applicationsCount: jobsTable.applicationsCount,
      })
      .from(jobsTable)
      .where(eq(jobsTable.id, validated.jobId))
      .limit(1);

    if (!job) {
      throw new Error("Job not found");
    }

    if (job.status !== "ACTIVE") {
      throw new Error("This position is not accepting applications");
    }

    if (job.applicationDeadline && job.applicationDeadline < new Date()) {
      throw new Error("Application deadline has passed");
    }

    const [applicant] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.id, validated.applicantId))
      .limit(1);

    if (!applicant) {
      throw new Error("Applicant not found");
    }

    const existingApplication = await db
      .select({ id: applicationsTable.id })
      .from(applicationsTable)
      .where(
        and(
          eq(applicationsTable.jobId, validated.jobId),
          eq(applicationsTable.applicantId, validated.applicantId)
        )
      )
      .limit(1);

    if (existingApplication.length > 0) {
      throw new Error("You have already applied for this position");
    }

    const [application] = await db
      .insert(applicationsTable)
      .values({
        id: crypto.randomUUID(),
        jobId: validated.jobId,
        applicantId: validated.applicantId,
        coverLetter: validated.coverLetter?.trim() || null,
        resumeUrl: validated.resumeUrl?.trim() || null,
        portfolioUrl: validated.portfolioUrl?.trim() || null,
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    await db
      .update(jobsTable)
      .set({
        applicationsCount: (job.applicationsCount ?? 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(jobsTable.id, validated.jobId));

    return application;
  }

  static async getApplicationById(
    applicationId: string
  ): Promise<Application | null> {
    const [application] = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.id, applicationId))
      .limit(1);

    return application ?? null;
  }

  static async getApplicationsForApplicant(
    applicantId: string
  ): Promise<Application[]> {
    return db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.applicantId, applicantId));
  }

  static async getApplicationsForJob(
    jobId: string
  ): Promise<Application[]> {
    return db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.jobId, jobId));
  }

  static async updateApplicationStatus(data: {
    applicationId: string;
    status: ApplicationStatus;
  }): Promise<Application> {
    const validated = updateApplicationStatusSchema.parse(data);

    const [updatedApplication] = await db
      .update(applicationsTable)
      .set({
        status: validated.status,
        updatedAt: new Date(),
        reviewedAt: validated.status === "PENDING" ? null : new Date(),
      })
      .where(eq(applicationsTable.id, validated.applicationId))
      .returning();

    if (!updatedApplication) {
      throw new Error("Application not found");
    }

    return updatedApplication;
  }

  static async withdrawApplication(applicationId: string): Promise<void> {
    const [application] = await db
      .select({ id: applicationsTable.id })
      .from(applicationsTable)
      .where(eq(applicationsTable.id, applicationId))
      .limit(1);

    if (!application) {
      throw new Error("Application not found");
    }

    await db
      .update(applicationsTable)
      .set({
        status: "WITHDRAWN" as ApplicationStatus,
        updatedAt: new Date(),
        respondedAt: new Date(),
      })
      .where(eq(applicationsTable.id, applicationId));
  }
}
