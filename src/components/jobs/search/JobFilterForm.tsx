"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useEffect, useState, FormEvent } from "react";
import SearchBar from "./SearchBar";
import LocationFilter from "./LocationFilter";
import EmploymentTypeFilter from "./EmploymentTypeFilter";
import ExperienceLevelFilter from "./ExperienceLevelFilter";
import FilterActions from "./FilterActions";
import RemoteFilter from "./RemoteFilter";
// ... other imports

export default function JobFilterForm({
  locations,
  experienceLevels,
  employmentTypes,
  initialSearch = "",
  initialLocation = "",
  initialExperienceLevel = "",
  initialEmploymentType = "",
  initialIsRemote = "",
}: {
  locations: string[];
  experienceLevels: string[];
  employmentTypes: string[];
  initialSearch?: string;
  initialLocation?: string;
  initialExperienceLevel?: string;
  initialEmploymentType?: string;
  initialIsRemote?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Seed from URL once per URL change (stable string dep)
  const currentSearch = useMemo(
    () => searchParams.get("search") ?? initialSearch,
    [searchParams.toString(), initialSearch]
  );

  const [search, setSearch] = useState(currentSearch);

  // ✅ Only update local state when the URL actually changes
  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const qs = new URLSearchParams();

    for (const [k, v] of formData.entries()) {
      if (typeof v === "string" && v.trim() !== "") {
        qs.set(k, v.trim());
      }
    }

    router.push(`/jobs?${qs.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-8">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Make sure the input inside SearchBar has name="search" */}
        <SearchBar value={search} onChange={setSearch} />

        <LocationFilter locations={locations} defaultValue={initialLocation} />
        <ExperienceLevelFilter
          experienceLevels={experienceLevels}
          defaultValue={initialExperienceLevel}
        />
        <EmploymentTypeFilter
          employmentTypes={employmentTypes}
          defaultValue={initialEmploymentType}
        />
        <RemoteFilter defaultChecked={initialIsRemote === "true"} />
        <FilterActions />
      </form>
    </div>
  );
}
