import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserService } from "@/services/userService";

import Link from "next/link";
import Header from "@/components/mainBlocks/header";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header user={userData} /> {/* Pass userData to Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-8">
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
              <h2 className="text-2xl font-semibold text-gray-900">
                {userData.name || `${userData.first_name} ${userData.lastName}`}
              </h2>
              <p className="text-gray-600 mt-1">{userData.email}</p>
              {userData.username && (
                <p className="text-gray-500 text-sm mt-1">
                  @{userData.username}
                </p>
              )}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white mt-2 ${
                  roleColors[userData.role as keyof typeof roleColors] ||
                  "bg-gray-500"
                }`}
              >
                {userData.role.replace("_", " ")}
              </span>
            </div>
            <Link
              href="/profile/edit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userData.bio && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Bio</h3>
                <p className="text-gray-600">{userData.bio}</p>
              </div>
            )}
            {userData.location && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Location</h3>
                <p className="text-gray-600">{userData.location}</p>
              </div>
            )}
            {userData.linkedin && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">LinkedIn</h3>
                <a
                  href={userData.linkedin}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {userData.linkedin}
                </a>
              </div>
            )}
            {userData.github && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">GitHub</h3>
                <a
                  href={userData.github}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {userData.github}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
