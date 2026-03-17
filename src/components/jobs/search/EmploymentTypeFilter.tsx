interface EmploymentTypeFilterProps {
  employmentTypes: string[];
  defaultValue?: string;
}

export default function EmploymentTypeFilter({
  employmentTypes,
  defaultValue,
}: EmploymentTypeFilterProps) {
  return (
    <div>
      <label
        htmlFor="employmentType"
        className="block text-sm font-medium text-gray-700"
      >
        Employment Type
      </label>
      <select
        name="employmentType"
        id="employmentType"
        defaultValue={defaultValue}
        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Types</option>
        {employmentTypes.map((type) => (
          <option key={type} value={type}>
            {type.replace("_", " ")}
          </option>
        ))}
      </select>
    </div>
  );
}
