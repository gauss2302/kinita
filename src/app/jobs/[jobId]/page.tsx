import { db } from "@/db/client";
import { jobsTable } from "@/db/tables/jobs";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface JobDetailsPageProps {
  params: Promise<{ jobId: string }>;
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { jobId } = await params; // Await params to access jobId

  const [job] = await db
    .select({
      id: jobsTable.id,
      title: jobsTable.title,
      slug: jobsTable.slug,
      description: jobsTable.description,
      requirements: jobsTable.requirements,
      responsibilities: jobsTable.responsibilities,
      benefits: jobsTable.benefits,
      experienceLevel: jobsTable.experienceLevel,
      employmentType: jobsTable.employmentType,
      location: jobsTable.location,
      isRemote: jobsTable.isRemote,
      visaSponsorship: jobsTable.visaSponsorship,
      status: jobsTable.status,
      createdAt: jobsTable.createdAt,
    })
    .from(jobsTable)
    .where(eq(jobsTable.id, jobId))
    .limit(1);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Job Details</h2>
            <p>
              <strong>Description:</strong> {job.description}
            </p>
            <p>
              <strong>Requirements:</strong> {job.requirements || "N/A"}
            </p>
            <p>
              <strong>Responsibilities:</strong> {job.responsibilities || "N/A"}
            </p>
            <p>
              <strong>Benefits:</strong> {job.benefits || "N/A"}
            </p>
            <p>
              <strong>Experience Level:</strong>{" "}
              {job.experienceLevel.replace("_", " ")}
            </p>
            <p>
              <strong>Employment Type:</strong>{" "}
              {job.employmentType.replace("_", " ")}
            </p>
            <p>
              <strong>Location:</strong> {job.location || "N/A"}
            </p>
            <p>
              <strong>Remote:</strong> {job.isRemote ? "Yes" : "No"}
            </p>
            <p>
              <strong>Visa Sponsorship:</strong>{" "}
              {job.visaSponsorship ? "Yes" : "No"}
            </p>
            <p>
              <strong>Status:</strong> {job.status}
            </p>
            <p>
              <strong>Created At:</strong> {job.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
