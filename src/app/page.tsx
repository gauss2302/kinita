import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";

import { UserService } from "@/services/userService";
import Header from "@/components/mainBlocks/header";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  let userData;
  if (session && session.user) {
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
  }

  const features = [
    {
      title: "Find AI Jobs",
      description:
        "Explore cutting-edge AI roles from top companies and research labs.",
      icon: (
        <svg
          className="w-8 h-8"
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
      href: "/jobs",
      color: "hover:border-green-400 hover:shadow-green-100",
    },
    {
      title: "Research Opportunities",
      description:
        "Join groundbreaking AI research projects and collaborations.",
      icon: (
        <svg
          className="w-8 h-8"
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
      href: "/research-opportunities",
      color: "hover:border-blue-400 hover:shadow-blue-100",
    },
    {
      title: "Connect with Talent",
      description: "Recruit top AI professionals for your company or project.",
      icon: (
        <svg
          className="w-8 h-8"
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
      href: "/jobs/create",
      color: "hover:border-purple-400 hover:shadow-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {userData
              ? `Welcome, ${userData.first_name || "AI Professional"}!`
              : "Discover Your AI Career"}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {userData
              ? `Explore opportunities tailored for ${userData.role
                  .replace("_", " ")
                  .toLowerCase()}s like you.`
              : "Join the leading platform for AI professionals to find jobs, research opportunities, and connect with top companies."}
          </p>
          <div className="flex justify-center gap-4">
            {userData ? (
              <>
                {userData.role === "AI_ENGINEER" ||
                userData.role === "RESEARCHER" ? (
                  <Link
                    href="/jobs"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Browse Jobs
                  </Link>
                ) : null}
                {userData.role === "RECRUITER" ||
                userData.role === "COMPANY_HR" ? (
                  <Link
                    href="/jobs/create"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Post a Job
                  </Link>
                ) : null}
                {userData.role === "ADMIN" ? (
                  <Link
                    href="/admin"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Admin Panel
                  </Link>
                ) : null}
                <Link
                  href="/dashboard"
                  className="inline-block px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="inline-block px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Why Choose AI Talent Hub?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                className={`group bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${feature.color}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-center text-white mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {userData
              ? "Take the Next Step in Your Career"
              : "Ready to Join the AI Revolution?"}
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            {userData
              ? "Update your profile, explore opportunities, or connect with the AI community today."
              : "Sign up now to access exclusive AI job listings, research projects, and networking opportunities."}
          </p>
          <Link
            href={userData ? "/profile/edit" : "/signup"}
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            {userData ? "Update Profile" : "Sign Up Now"}
          </Link>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200/50 py-8 text-center text-gray-600">
          <p className="text-sm mb-4">
            &copy; 2025 AI Talent Hub. All rights reserved.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/about"
              className="text-sm hover:text-blue-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-sm hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm hover:text-blue-600 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-sm hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
