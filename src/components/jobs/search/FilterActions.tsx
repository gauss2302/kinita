import Link from "next/link";

export default function FilterActions() {
  return (
    <div className="flex items-end space-x-2">
      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors"
      >
        Apply Filters
      </button>
      <Link
        href="/jobs"
        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Clear Filters
      </Link>
    </div>
  );
}
