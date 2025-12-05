'use client';

export interface RangeFilterProps {
  label: string;
  minValue: number | null;
  maxValue: number | null;
  onChange: (min: number | null, max: number | null) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  unit?: string;
  step?: number;
  disabled?: boolean;
}

export function RangeFilter({
  label,
  minValue,
  maxValue,
  onChange,
  minPlaceholder = 'Min',
  maxPlaceholder = 'Max',
  unit,
  step = 1,
  disabled = false,
}: RangeFilterProps) {
  const handleMinChange = (value: string) => {
    const parsed = value === '' ? null : parseFloat(value);
    onChange(parsed, maxValue);
  };

  const handleMaxChange = (value: string) => {
    const parsed = value === '' ? null : parseFloat(value);
    onChange(minValue, parsed);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {unit && <span className="text-gray-500">({unit})</span>}
      </label>
      <div className="flex gap-2 items-center">
        <input
          type="number"
          value={minValue ?? ''}
          onChange={(e) => handleMinChange(e.target.value)}
          placeholder={minPlaceholder}
          step={step}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100"
          aria-label={`Minimum ${label}`}
        />
        <span className="text-gray-400">–</span>
        <input
          type="number"
          value={maxValue ?? ''}
          onChange={(e) => handleMaxChange(e.target.value)}
          placeholder={maxPlaceholder}
          step={step}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100"
          aria-label={`Maximum ${label}`}
        />
      </div>
    </div>
  );
}
