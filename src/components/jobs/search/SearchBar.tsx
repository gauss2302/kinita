"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";
import { useState, FormEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      newParams.set("search", value.trim());
    } else {
      newParams.delete("search");
    }
    router.push(`/jobs?${newParams.toString()}`);
  };

  return (
    <div>
      <label
        htmlFor="search"
        className="block text-sm font-medium text-gray-700"
      >
        Search
      </label>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          id="search"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          placeholder="Search by title or company..."
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </form>
    </div>
  );
}
