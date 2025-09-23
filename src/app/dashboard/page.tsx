import { UserService } from "@/services/userService";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/mainBlocks/header";
import Footer from "@/components/mainBlocks/footer";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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
      name: session.user.name || "User",
      email: session.user.email || "No email",
      first_name: session.user.first_name || "",
      lastName: session.user.lastName || "",
      role: session.user.role || "Unknown",
      image: session.user.image || null,
      avatar: session.user.avatar || null,
    };
  }

  const userAvatar = userData.image || userData.avatar;
  const userInitials =
    `${userData.first_name?.[0] || ""}${
      userData.lastName?.[0] || ""
    }`.toUpperCase() || "U";

  const roleColors = {
    AI_ENGINEER: "bg-gradient-to-r from-violet-500 to-purple-600",
    RECRUITER: "bg-gradient-to-r from-blue-500 to-cyan-600",
    RESEARCHER: "bg-gradient-to-r from-emerald-500 to-teal-600",
    COMPANY_HR: "bg-gradient-to-r from-orange-500 to-amber-600",
    ADMIN: "bg-gradient-to-r from-red-500 to-rose-600",
  };

  const roleIcons = {
    AI_ENGINEER: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    RECRUITER: (
      <svg
        className="w-5 h-5"
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
    RESEARCHER: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
    COMPANY_HR: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    ADMIN: (
      <svg
        className="w-5 h-5"
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
    ),
  };

  const quickActions = [
    {
      title: "Edit Profile",
      description: "Update your personal information",
      href: "/profile/edit",
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
      title: "Settings",
      description: "Manage your account settings",
      href: "/settings",
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      color: "hover:border-gray-400 hover:shadow-gray-100",
    },
    ...(userData.role === "AI_ENGINEER"
      ? [
          {
            title: "Browse Jobs",
            description: "Find your next opportunity",
            href: "/jobs",
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
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            ),
            color: "hover:border-green-400 hover:shadow-green-100",
          },
        ]
      : []),
    ...(userData.role === "RECRUITER" || userData.role === "COMPANY_HR"
      ? [
          {
            title: "Post a Job",
            description: "Create a new job listing",
            href: "/jobs/create",
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
            color: "hover:border-purple-400 hover:shadow-purple-100",
          },
        ]
      : []),
  ];

  const stats = [
    { label: "Profile Views", value: "0", change: "+0%", trend: "neutral" },
    { label: "Applications", value: "0", change: "+0%", trend: "neutral" },
    { label: "Messages", value: "0", change: "+0%", trend: "neutral" },
    { label: "Saved Jobs", value: "0", change: "+0%", trend: "neutral" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header user={userData} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back,{" "}
            {userData.first_name || userData.name?.split(" ")[0] || "there"}!
          </h2>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-8 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start space-x-4">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userData.name}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {userInitials}
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900">
                {userData.name || `${userData.first_name} ${userData.lastName}`}
              </h3>
              <p className="text-gray-600 mt-1">{userData.email}</p>
              <div className="flex items-center mt-3 space-x-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${
                    roleColors[userData.role as keyof typeof roleColors] ||
                    "bg-gray-500"
                  }`}
                >
                  <span className="mr-1.5">
                    {roleIcons[userData.role as keyof typeof roleIcons]}
                  </span>
                  {userData.role?.replace("_", " ")}
                </span>
                {userData.username && (
                  <span className="text-sm text-gray-500">
                    @{userData.username}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Member since</p>
              <p className="text-sm font-medium text-gray-900">
                {userData.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "Recently joined"}
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

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm font-medium">No recent activity</p>
            <p className="text-sm mt-1">Your activity will appear here</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
