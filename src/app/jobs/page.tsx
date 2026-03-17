import { db } from "@/db/client";
import { jobsTable } from "@/db/tables/jobs";
import { companiesTable } from "@/db/tables/companies";
import { eq, ilike, or, and, not } from "drizzle-orm";
import Header from "@/components/mainBlocks/header";
import { auth } from "@/lib/auth/auth";
import { UserService } from "@/services/user/userService";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { experienceLevels, employmentTypes } from "@/db/tables/users";
import Link from "next/link";
import JobFilterForm from "@/components/jobs/search/JobFilterForm";
import JobCard from "@/components/jobs/JobCard";

export const dynamic = "force-dynamic";

export default async function JobDashBoard({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session || !session.user) {
    redirect("/login");
  }

  let userData;
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

  const { search, location, experienceLevel, employmentType, isRemote } =
    await searchParams;

  // Fetch distinct locations for ACTIVE jobs, excluding null
  const locations = await db
    .selectDistinct({ location: jobsTable.location })
    .from(jobsTable)
    .where(
      and(eq(jobsTable.status, "ACTIVE"), not(eq(jobsTable.location, null)))
    )
    .then((rows) =>
      rows
        .map((row) => row.location)
        .filter((loc): loc is string => !!loc)
        .sort()
    );

  // Build dynamic query conditions
  const conditions = [
    eq(jobsTable.status, "ACTIVE"),
    search
      ? or(
          ilike(jobsTable.title, `%${search}%`),
          ilike(companiesTable.name, `%${search}%`),
          ilike(jobsTable.description, `%${search}%`)
        )
      : undefined,
    location ? eq(jobsTable.location, location) : undefined,
    experienceLevel
      ? eq(jobsTable.experienceLevel, experienceLevel)
      : undefined,
    employmentType ? eq(jobsTable.employmentType, employmentType) : undefined,
    isRemote === "true" ? eq(jobsTable.isRemote, true) : undefined,
  ].filter((c): c is NonNullable<typeof c> => c !== undefined);

  const jobs = await db
    .select({
      id: jobsTable.id,
      title: jobsTable.title,
      slug: jobsTable.slug,
      description: jobsTable.description,
      location: jobsTable.location,
      isRemote: jobsTable.isRemote,
      experienceLevel: jobsTable.experienceLevel,
      employmentType: jobsTable.employmentType,
      salaryMin: jobsTable.salaryMin,
      salaryMax: jobsTable.salaryMax,
      salaryCurrency: jobsTable.salaryCurrency,
      status: jobsTable.status,
      companyName: companiesTable.name,
    })
    .from(jobsTable)
    .innerJoin(companiesTable, eq(jobsTable.companyId, companiesTable.id))
    .where(and(...conditions));

  return (
    <>
      <Header user={userData} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Hello, {userData.first_name || "User"}! Explore Jobs
            </h1>
            <p className="text-gray-600 mt-2">
              Find your next opportunity with our job listings.
            </p>
          </div>

          {/* Search and Filters */}
          <JobFilterForm
            locations={locations}
            experienceLevels={experienceLevels}
            employmentTypes={employmentTypes}
            initialSearch={search}
            initialLocation={location}
            initialExperienceLevel={experienceLevel}
            initialEmploymentType={employmentType}
            initialIsRemote={isRemote}
          />

          {/* Job List */}
          <div>
            {jobs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 text-center">
                <p className="text-gray-600">No jobs match your criteria.</p>
                <Link
                  href="/jobs"
                  className="mt-4 inline-block text-sm text-blue-600 hover:underline"
                >
                  Clear filters to see all jobs
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
