import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CompanyService } from "@/services/companyService";
import { db } from "@/db/client";
import { usersTable, jobsTable, companyMembersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Header from "@/components/mainBlocks/header";

export const dynamic = "force-dynamic";

interface CompanyDashboardPageProps {
  params: Promise<{ companyId: string }>;
}

export default async function CompanyDashboardPage({
  params,
}: CompanyDashboardPageProps) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login");
  }

  // Resolve params
  const { companyId } = await params;

  // Fetch the user's details to check role and companyId
  const [user] = await db
    .select({
      id: usersTable.id,
      role: usersTable.role,
      companyId: usersTable.companyId,
      name: usersTable.name,
      email: usersTable.email,
      first_name: usersTable.first_name,
      lastName: usersTable.lastName,
      image: usersTable.image,
      avatar: usersTable.avatar,
    })
    .from(usersTable)
    .where(eq(usersTable.id, session.user.id))
    .limit(1);

  // Ensure the user is an admin and belongs to the company
  if (user.role !== "ADMIN" || user.companyId !== companyId) {
    redirect("/dashboard");
  }

  // Fetch company details
  const company = await CompanyService.getCompanyById(companyId);

  if (!company) {
    redirect("/dashboard");
  }

  // Fetch company jobs
  const jobs = await db
    .select({
      id: jobsTable.id,
      title: jobsTable.title,
      location: jobsTable.location,
      employmentType: jobsTable.employmentType,
      createdAt: jobsTable.createdAt,
    })
    .from(jobsTable)
    .where(eq(jobsTable.companyId, companyId));

  // Fetch company members
  const members = await db
    .select({
      id: companyMembersTable.id,
      userId: companyMembersTable.userId,
      role: companyMembersTable.role,
      userName: usersTable.name,
      userEmail: usersTable.email,
    })
    .from(companyMembersTable)
    .innerJoin(usersTable, eq(companyMembersTable.userId, usersTable.id))
    .where(eq(companyMembersTable.companyId, companyId));

  // Stats for the company
  const stats = [
    {
      label: "Total Jobs",
      value: jobs.length.toString(),
      change: "+0%",
      trend: "neutral",
    },
    {
      label: "Team Members",
      value: members.length.toString(),
      change: "+0%",
      trend: "neutral",
    },
    { label: "Applications", value: "0", change: "+0%", trend: "neutral" },
    {
      label: "Active Listings",
      value: jobs.length.toString(),
      change: "+0%",
      trend: "neutral",
    },
  ];

  // Quick actions for company admin
  const quickActions = [
    {
      title: "Edit Company",
      description: "Update company information",
      href: `/dashboard/company/${company.id}/edit`,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      color: "hover:border-blue-400 hover:shadow-blue-100",
    },
    {
      title: "Post New Job",
      description: "Create a new job listing",
      href: `/dashboard/company/${company.id}/jobs/new`,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
      color: "hover:border-green-400 hover:shadow-green-100",
    },
    {
      title: "Invite Member",
      description: "Add new team members",
      href: `/dashboard/company/${company.id}/members/invite`,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: "hover:border-purple-400 hover:shadow-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header user={user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {company.name} Admin Dashboard
          </h2>
          <p className="text-gray-600 mt-2">
            Manage your company, jobs, and team members.
          </p>
        </div>

        {/* Company Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-8 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start space-x-4">
            {company.logo ? (
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {company.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900">
                {company.name}
              </h3>
              {company.website && (
                <a
                  href={company.website}
                  className="text-blue-600 hover:underline mt-1 inline-block"
                >
                  {company.website}
                </a>
              )}
              {company.description && (
                <p className="text-gray-600 mt-2 max-w-2xl">
                  {company.description}
                </p>
              )}
              <div className="flex items-center mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r from-red-500 to-rose-600">
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  ADMIN
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Company since</p>
              <p className="text-sm font-medium text-gray-900">
                {company.createdAt
                  ? new Date(company.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "Recently created"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`text-sm font-medium ${
                    stat.trend === "up"
                      ? "text-green-600"
                      : stat.trend === "down"
                      ? "text-red-600"
                      : "text-gray-400"
                  }`}
                >
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className={`group bg-white rounded-xl border-2 border-gray-200 p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${action.color}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                    {action.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Jobs Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Posted Jobs ({jobs.length})
              </h3>
              <a
                href={`/dashboard/company/${company.id}/jobs/new`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all →
              </a>
            </div>
            {jobs.length > 0 ? (
              <div className="space-y-3">
                {jobs.slice(0, 5).map((job) => (
                  <div
                    key={job.id}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {job.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {job.location} • {job.employmentType}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <a
                        href={`/dashboard/company/${company.id}/jobs/${job.id}`}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium ml-4"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
                {jobs.length > 5 && (
                  <p className="text-sm text-gray-500 text-center pt-2">
                    And {jobs.length - 5} more jobs...
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <svg
                  className="w-12 h-12 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm font-medium">No jobs posted yet</p>
                <p className="text-sm mt-1">Create your first job listing</p>
              </div>
            )}
          </div>

          {/* Members Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Team Members ({members.length})
              </h3>
              <a
                href={`/dashboard/company/${company.id}/members/invite`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Invite →
              </a>
            </div>
            {members.length > 0 ? (
              <div className="space-y-3">
                {members.slice(0, 5).map((member) => (
                  <div
                    key={member.id}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {member.userName || member.userEmail}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {member.userEmail}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                          {member.role}
                        </span>
                      </div>
                      {member.role !== "ADMIN" && (
                        <form
                          action={`/api/company/${company.id}/members/${member.id}/remove`}
                          method="POST"
                          className="ml-4"
                        >
                          <button
                            type="submit"
                            className="text-xs px-3 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
                {members.length > 5 && (
                  <p className="text-sm text-gray-500 text-center pt-2">
                    And {members.length - 5} more members...
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <svg
                  className="w-12 h-12 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-sm font-medium">No team members yet</p>
                <p className="text-sm mt-1">Invite your first team member</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
