interface LocationFilterProps {
  locations: string[];
  defaultValue?: string;
}

export default function LocationFilter({
  locations,
  defaultValue,
}: LocationFilterProps) {
  return (
    <div>
      <label
        htmlFor="location"
        className="block text-sm font-medium text-gray-700"
      >
        Location
      </label>
      <select
        name="location"
        id="location"
        defaultValue={defaultValue}
        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Locations</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>
    </div>
  );
}
