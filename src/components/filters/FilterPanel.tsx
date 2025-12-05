'use client';

import { FilterState, FilterMetadata, MetalType, CategoryType, FinishType, FINISH_TYPES } from '@/types';
import { MetalSelect } from './MetalSelect';
import { CategorySelect } from './CategorySelect';
import { RangeFilter } from './RangeFilter';
import { MultiSelectFilter } from './MultiSelectFilter';
import { ResetButton } from './ResetButton';

export interface FilterPanelProps {
  filters: FilterState;
  metadata: FilterMetadata;
  onMetalChange: (metal: MetalType | null) => void;
  onCategoryChange: (category: CategoryType | null) => void;
  onPriceRangeChange: (min: number | null, max: number | null) => void;
  onWeightRangeChange: (min: number | null, max: number | null) => void;
  onHeightRangeChange: (min: number | null, max: number | null) => void;
  onFinishTypesChange: (types: FinishType[]) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function FilterPanel({
  filters,
  metadata,
  onMetalChange,
  onCategoryChange,
  onPriceRangeChange,
  onWeightRangeChange,
  onHeightRangeChange,
  onFinishTypesChange,
  onReset,
  isLoading = false,
}: FilterPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <ResetButton onClick={onReset} disabled={isLoading} />
      </div>

      <div className="space-y-5">
        <MetalSelect value={filters.metal} onChange={onMetalChange} disabled={isLoading} />

        <CategorySelect
          value={filters.category}
          onChange={onCategoryChange}
          availableCategories={metadata.availableCategories}
          disabled={isLoading}
        />

        <RangeFilter
          label="Price"
          minValue={filters.priceMin}
          maxValue={filters.priceMax}
          onChange={onPriceRangeChange}
          unit="₹"
          step={100}
          disabled={isLoading}
        />

        <RangeFilter
          label="Weight"
          minValue={filters.weightMin}
          maxValue={filters.weightMax}
          onChange={onWeightRangeChange}
          unit="kg"
          step={0.1}
          disabled={isLoading}
        />

        <RangeFilter
          label="Height"
          minValue={filters.heightMin}
          maxValue={filters.heightMax}
          onChange={onHeightRangeChange}
          unit="inches"
          step={1}
          disabled={isLoading}
        />

        <MultiSelectFilter
          label="Finish Type"
          options={FINISH_TYPES}
          selectedValues={filters.finishTypes}
          onChange={onFinishTypesChange}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
