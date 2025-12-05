'use client';

import { CategoryType } from '@/types';

export interface CategorySelectProps {
  value: CategoryType | null;
  onChange: (category: CategoryType | null) => void;
  availableCategories: CategoryType[];
  disabled?: boolean;
}

export function CategorySelect({
  value,
  onChange,
  availableCategories,
  disabled = false,
}: CategorySelectProps) {
  const isDisabled = disabled || availableCategories.length === 0;

  return (
    <div className="space-y-2">
      <label htmlFor="category-select" className="block text-sm font-medium text-gray-700">
        Category
      </label>
      <select
        id="category-select"
        value={value || ''}
        onChange={(e) => onChange(e.target.value ? (e.target.value as CategoryType) : null)}
        disabled={isDisabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">All Categories</option>
        {availableCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      {availableCategories.length === 0 && (
        <p className="text-xs text-gray-500">Select a metal type first</p>
      )}
    </div>
  );
}
