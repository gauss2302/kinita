/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

interface EditCompanyPageProps {
  params: Promise<{ companyId: string }>;
}

export default function EditCompanyPage({ params }: EditCompanyPageProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Resolve params using React's use hook
  const { companyId } = use(params);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setIsLoading(true);

    const data = {
      id: companyId,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      logo: formData.get("logo") as string,
      website: formData.get("website") as string,
    };

    try {
      const response = await fetch(`/api/company/${companyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          (await response.json()).error || "Failed to update company"
        );
      }

      router.push(`/dashboard/company/${companyId}`);
    } catch (err: any) {
      setError(err.message || "Failed to update company");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Company</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            {error && (
              <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label
                  htmlFor="logo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Logo URL
                </label>
                <input
                  id="logo"
                  name="logo"
                  type="url"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <a
                  href={`/dashboard/company/${companyId}`}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
