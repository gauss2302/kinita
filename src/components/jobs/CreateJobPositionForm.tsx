"use client";
import { useState, useTransition } from "react";
import { createJobPositionAction } from "@/app/jobs/new/actions";
import {
  experienceLevels,
  employmentTypes,
  ExperienceLevel,
  EmploymentType,
} from "@/db/tables/users";

export default function CreateJobPositionForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [benefits, setBenefits] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    experienceLevels[0]
  );
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    employmentTypes[0]
  );
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [visaSponsorship, setVisaSponsorship] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await createJobPositionAction(formData);
      if (!result.success) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
      <h2 className="mb-6 text-2xl font-bold text-center">
        Create Job Position
      </h2>

      {error && (
        <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Job Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isPending}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label
            htmlFor="requirements"
            className="block text-sm font-medium text-gray-700"
          >
            Requirements
          </label>
          <textarea
            id="requirements"
            name="requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            disabled={isPending}
          />
        </div>
        <div>
          <label
            htmlFor="responsibilities"
            className="block text-sm font-medium text-gray-700"
          >
            Responsibilities
          </label>
          <textarea
            id="responsibilities"
            name="responsibilities"
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            disabled={isPending}
          />
        </div>
        <div>
          <label
            htmlFor="benefits"
            className="block text-sm font-medium text-gray-700"
          >
            Benefits
          </label>
          <input
            id="benefits"
            name="benefits"
            type="text"
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isPending}
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
            id="experienceLevel"
            name="experienceLevel"
            value={experienceLevel}
            onChange={(e) =>
              setExperienceLevel(e.target.value as ExperienceLevel)
            }
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isPending}
          >
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
            id="employmentType"
            name="employmentType"
            value={employmentType}
            onChange={(e) =>
              setEmploymentType(e.target.value as EmploymentType)
            }
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isPending}
          >
            {employmentTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isPending}
          />
        </div>
        <div>
          <label
            htmlFor="isRemote"
            className="block text-sm font-medium text-gray-700"
          >
            Remote
          </label>
          <input
            id="isRemote"
            name="isRemote"
            type="checkbox"
            checked={isRemote}
            onChange={(e) => setIsRemote(e.target.checked)}
            className="mt-1"
            disabled={isPending}
          />
        </div>
        <div>
          <label
            htmlFor="visaSponsorship"
            className="block text-sm font-medium text-gray-700"
          >
            Visa Sponsorship
          </label>
          <input
            id="visaSponsorship"
            name="visaSponsorship"
            type="checkbox"
            checked={visaSponsorship}
            onChange={(e) => setVisaSponsorship(e.target.checked)}
            className="mt-1"
            disabled={isPending}
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}
