"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerCompanyAction } from "@/app/(auth)/(company)/register-company/actions";

export default function RegisterCompanyForm() {
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setIsLoading(true);

    const result = await registerCompanyAction(formData);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
      <h2 className="mb-6 text-2xl font-bold text-center">Register Company</h2>

      {error && (
        <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700"
          >
            Company Name
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            placeholder="Acme Inc."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="companyDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Description (optional)
          </label>
          <textarea
            id="companyDescription"
            name="companyDescription"
            placeholder="Tell us about your company"
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="companyLogo"
            className="block text-sm font-medium text-gray-700"
          >
            Logo URL (optional)
          </label>
          <input
            id="companyLogo"
            name="companyLogo"
            type="url"
            placeholder="https://example.com/logo.png"
            value={companyLogo}
            onChange={(e) => setCompanyLogo(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="companyWebsite"
            className="block text-sm font-medium text-gray-700"
          >
            Website (optional)
          </label>
          <input
            id="companyWebsite"
            name="companyWebsite"
            type="url"
            placeholder="https://example.com"
            value={companyWebsite}
            onChange={(e) => setCompanyWebsite(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div className="border-t border-gray-300 pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Admin User (Company Owner)
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="adminFirstName"
              className="block text-sm font-medium text-gray-700"
            >
              Admin First Name
            </label>
            <input
              id="adminFirstName"
              name="adminFirstName"
              type="text"
              placeholder="John"
              value={adminFirstName}
              onChange={(e) => setAdminFirstName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="adminLastName"
              className="block text-sm font-medium text-gray-700"
            >
              Admin Last Name
            </label>
            <input
              id="adminLastName"
              name="adminLastName"
              type="text"
              placeholder="Doe"
              value={adminLastName}
              onChange={(e) => setAdminLastName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="adminUsername"
            className="block text-sm font-medium text-gray-700"
          >
            Admin Username (optional)
          </label>
          <input
            id="adminUsername"
            name="adminUsername"
            type="text"
            placeholder="admin@acme"
            value={adminUsername}
            onChange={(e) => setAdminUsername(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="adminEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Admin Email
          </label>
          <input
            id="adminEmail"
            name="adminEmail"
            type="email"
            placeholder="admin@acme.com"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="adminPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Admin Password
          </label>
          <input
            id="adminPassword"
            name="adminPassword"
            type="password"
            placeholder="••••••••"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            minLength={8}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Creating Company..." : "Register Company"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
