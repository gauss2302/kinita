import { db } from "@/db/client";
import { jobsTable } from "@/db/tables/jobs";
import { companiesTable } from "@/db/tables/companies";
import { eq, ilike, or, and } from "drizzle-orm";
import Header from "@/components/mainBlocks/header";
import { auth } from "@/lib/auth/auth";
import { UserService } from "@/services/userService";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { experienceLevels, employmentTypes } from "@/db/tables/users";
import Link from "next/link";
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
    location ? ilike(jobsTable.location, `%${location}%`) : undefined,
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-8">
            <form
              action="/jobs"
              method="GET"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700"
                >
                  Search
                </label>
                <input
                  type="text"
                  name="search"
                  id="search"
                  defaultValue={search}
                  placeholder="Search by title or company..."
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  defaultValue={location}
                  placeholder="e.g., New York"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="experienceLevel"
                  className="block text-sm font-medium text-gray-700"
                >
                  Experience Level
                </label>
                <select
                  name="experienceLevel"
                  id="experienceLevel"
                  defaultValue={experienceLevel}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Levels</option>
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="employmentType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Employment Type
                </label>
                <select
                  name="employmentType"
                  id="employmentType"
                  defaultValue={employmentType}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {employmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isRemote"
                  id="isRemote"
                  value="true"
                  defaultChecked={isRemote === "true"}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isRemote"
                  className="text-sm font-medium text-gray-700"
                >
                  Remote Only
                </label>
              </div>
              <div className="flex items-end space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors"
                >
                  Apply Filters
                </button>
                <Link
                  href="/jobs"
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </Link>
              </div>
            </form>
          </div>

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
