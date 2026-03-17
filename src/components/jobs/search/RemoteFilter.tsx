interface RemoteFilterProps {
  defaultChecked?: boolean;
}

export default function RemoteFilter({ defaultChecked }: RemoteFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        name="isRemote"
        id="isRemote"
        value="true"
        defaultChecked={defaultChecked}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label htmlFor="isRemote" className="text-sm font-medium text-gray-700">
        Remote Only
      </label>
    </div>
  );
}
