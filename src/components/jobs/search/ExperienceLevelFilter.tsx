interface ExperienceLevelFilterProps {
  experienceLevels: string[];
  defaultValue?: string;
}

export default function ExperienceLevelFilter({
  experienceLevels,
  defaultValue,
}: ExperienceLevelFilterProps) {
  return (
    <div>
      <label
        htmlFor="experienceLevel"
        className="block text-sm font-medium text-gray-700"
      >
        Experience Level
      </label>
      <select
        name="experienceLevel"
        id="experienceLevel"
        defaultValue={defaultValue}
        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Levels</option>
        {experienceLevels.map((level) => (
          <option key={level} value={level}>
            {level.replace("_", " ")}
          </option>
        ))}
      </select>
    </div>
  );
}
