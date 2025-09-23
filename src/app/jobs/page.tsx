import { db } from "@/db/client";
import { jobsTable } from "@/db/tables/jobs";
import { companiesTable } from "@/db/tables/companies";
import { eq } from "drizzle-orm";
import Header from "@/components/mainBlocks/header";
import { auth } from "@/lib/auth/auth";
import { UserService } from "@/services/userService";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import JobCard from "@/components/jobs/JobCard";

export const dynamic = "force-dynamic";

export default async function JobDashBoard() {
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
    .where(eq(jobsTable.status, "ACTIVE"));

  return (
    <>
      <Header user={userData} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Hello, {userData.first_name || "User"}! Explore Jobs
          </h1>
          {jobs.length === 0 ? (
            <p className="text-gray-600">
              No active jobs available at the moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
