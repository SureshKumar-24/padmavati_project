'use client';

export interface MultiSelectFilterProps<T extends string> {
  label: string;
  options: T[];
  selectedValues: T[];
  onChange: (values: T[]) => void;
  disabled?: boolean;
}

export function MultiSelectFilter<T extends string>({
  label,
  options,
  selectedValues,
  onChange,
  disabled = false,
}: MultiSelectFilterProps<T>) {
  const handleToggle = (value: T) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option}
            className={`flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={() => handleToggle(option)}
              disabled={disabled}
              className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
