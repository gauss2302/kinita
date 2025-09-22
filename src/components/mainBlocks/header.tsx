"use client"; // Marking as Client Component for simplicity
import Link from "next/link";
import { authClient } from "@/lib/auth/auth_client"; // Use client-side auth for signOut
import { UserService } from "@/services/userService";

export default function Header({ user }: { user?: any }) {
  // If user is passed from a Server Component, use it; otherwise, rely on client-side session
  const navLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/profile", label: "Profile" },
        { href: "/jobs", label: "Jobs" },
        { href: "/research-opportunities", label: "Research Opportunities" },
        ...(user?.role === "ADMIN"
          ? [
              { href: "/admin", label: "Admin Panel" },
              { href: "/create-company", label: "Create Company" },
            ]
          : []),
        ...(user?.role === "RECRUITER" || user?.role === "COMPANY_HR"
          ? [
              { href: "/jobs/create", label: "Post Job" },
              { href: "/create-company", label: "Create Company" },
            ]
          : []),
      ]
    : [
        { href: "/login", label: "Login" },
        { href: "/signup", label: "Sign Up" },
      ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          AI Talent Hub
        </Link>
        <nav className="flex items-center space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <span>{user?.name || "User"}</span>
                {user?.image || user?.avatar ? (
                  <img
                    src={user.image || user.avatar}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm">
                    {`${user?.first_name?.[0] || ""}${
                      user?.lastName?.[0] || ""
                    }`.toUpperCase() || "U"}
                  </div>
                )}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200/50 hidden group-hover:block">
                <div className="p-2">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    View Profile
                  </Link>
                  <Link
                    href="/profile/edit"
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={async () => {
                      await authClient.signOut({ redirectTo: "/login" });
                    }}
                    className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
