"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginCompanyAction } from "@/app/(auth)/(company)/login-company/company-login-actions";

export default function LoginCompanyForm() {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setIsLoading(true);

    const result = await loginCompanyAction(formData);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
      <h2 className="mb-6 text-2xl font-bold text-center">Company Login</h2>

      {error && (
        <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
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
            minLength={6}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link
          href="/register-company"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Register a company
        </Link>
      </p>
    </div>
  );
}
