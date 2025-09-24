import { db } from "@/db/client";
import { jobsTable } from "@/db/tables/jobs";
import { companiesTable } from "@/db/tables/companies";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Header from "@/components/mainBlocks/header";
import Footer from "@/components/mainBlocks/footer";
import { auth } from "@/lib/auth/auth";
import { UserService } from "@/services/userService";
import { headers } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface JobDetailsPageProps {
  params: Promise<{ jobId: string }>;
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  let userData;
  if (session?.user) {
    try {
      userData = await UserService.getUserById(session.user.id);
    } catch (error) {
      console.error("Error fetching user data:", error);
      userData = {
        id: session.user.id,
        name: session.user.name || "User",
        email: session.user.email || "No email",
        first_name: session.user.first_name || "",
        lastName: session.user.lastName || "",
        username: session.user.username || "",
        role: session.user.role || "Unknown",
        image: session.user.image || null,
        avatar: session.user.avatar || null,
        bio: "",
        linkedin: "",
        github: "",
        location: "",
        createdAt: new Date(),
      };
    }
  }

  const { jobId } = await params;

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
      salaryMin: jobsTable.salaryMin,
      salaryMax: jobsTable.salaryMax,
      salaryCurrency: jobsTable.salaryCurrency,
      companyName: companiesTable.name,
    })
    .from(jobsTable)
    .innerJoin(companiesTable, eq(jobsTable.companyId, companiesTable.id))
    .where(eq(jobsTable.id, jobId))
    .limit(1);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header user={userData} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {job.title}
              </h1>
              <p className="text-lg text-gray-600 mt-1">{job.companyName}</p>
              <div className="flex items-center mt-2 space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-blue-600 bg-blue-100">
                  {job.status}
                </span>
                <span className="text-sm text-gray-500">
                  Posted on{" "}
                  {job.createdAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors"
            >
              Back to Jobs
            </Link>
          </div>
        </div>

        {/* Job Details Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Responsibilities
              </h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {job.responsibilities || "Not specified"}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Requirements
              </h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {job.requirements || "Not specified"}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Benefits
              </h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {job.benefits || "Not specified"}
              </p>
            </div>
          </div>

          {/* Sidebar with Key Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Job Overview
              </h2>
              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium text-gray-900">
                    Experience Level:
                  </span>{" "}
                  {job.experienceLevel.replace("_", " ")}
                </div>
                <div>
                  <span className="font-medium text-gray-900">
                    Employment Type:
                  </span>{" "}
                  {job.employmentType.replace("_", " ")}
                </div>
                <div>
                  <span className="font-medium text-gray-900">Location:</span>{" "}
                  {job.location || "Not specified"} {job.isRemote && "(Remote)"}
                </div>
                <div>
                  <span className="font-medium text-gray-900">
                    Visa Sponsorship:
                  </span>{" "}
                  {job.visaSponsorship ? "Yes" : "No"}
                </div>
                {job.salaryMin && job.salaryMax && (
                  <div>
                    <span className="font-medium text-gray-900">
                      Salary Range:
                    </span>{" "}
                    {job.salaryMin} - {job.salaryMax} {job.salaryCurrency}
                  </div>
                )}
              </div>
              <button
                className="mt-6 w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors"
                disabled
              >
                Apply Now (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
