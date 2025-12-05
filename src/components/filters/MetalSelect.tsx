'use client';

import { MetalType, METAL_TYPES } from '@/types';

export interface MetalSelectProps {
  value: MetalType | null;
  onChange: (metal: MetalType | null) => void;
  disabled?: boolean;
}

export function MetalSelect({ value, onChange, disabled = false }: MetalSelectProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="metal-select" className="block text-sm font-medium text-gray-700">
        Metal Type
      </label>
      <select
        id="metal-select"
        value={value || ''}
        onChange={(e) => onChange(e.target.value ? (e.target.value as MetalType) : null)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">All Metals</option>
        {METAL_TYPES.map((metal) => (
          <option key={metal} value={metal}>
            {metal}
          </option>
        ))}
      </select>
    </div>
  );
}
