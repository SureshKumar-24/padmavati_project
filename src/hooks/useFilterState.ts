'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  FilterState,
  FilterMetadata,
  MetalType,
  CategoryType,
  FinishType,
  DEFAULT_FILTER_STATE,
} from '@/types';
import { getCategoriesForMetal } from '@/lib/filterUtils';

export interface UseFilterStateReturn {
  filters: FilterState;
  setMetal: (metal: MetalType | null) => void;
  setCategory: (category: CategoryType | null) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setWeightRange: (min: number | null, max: number | null) => void;
  setHeightRange: (min: number | null, max: number | null) => void;
  setFinishTypes: (types: FinishType[]) => void;
  resetFilters: () => void;
  metadata: FilterMetadata;
  isLoading: boolean;
}

/**
 * Hook for managing filter state with metal-category hierarchy
 * When metal changes, resets all other filters (Requirements 4.2)
 * Reset preserves metal selection (Requirements 4.10)
 */
export function useFilterState(initialFilters?: Partial<FilterState>): UseFilterStateReturn {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTER_STATE,
    ...initialFilters,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Set metal type - resets all other filters when metal changes
  const setMetal = useCallback((metal: MetalType | null) => {
    setIsLoading(true);
    setFilters({
      ...DEFAULT_FILTER_STATE,
      metal,
    });
    // Simulate async category loading
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  // Set category
  const setCategory = useCallback((category: CategoryType | null) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  // Set price range
  const setPriceRange = useCallback((priceMin: number | null, priceMax: number | null) => {
    setFilters((prev) => ({ ...prev, priceMin, priceMax }));
  }, []);

  // Set weight range
  const setWeightRange = useCallback((weightMin: number | null, weightMax: number | null) => {
    setFilters((prev) => ({ ...prev, weightMin, weightMax }));
  }, []);

  // Set height range
  const setHeightRange = useCallback((heightMin: number | null, heightMax: number | null) => {
    setFilters((prev) => ({ ...prev, heightMin, heightMax }));
  }, []);

  // Set finish types
  const setFinishTypes = useCallback((finishTypes: FinishType[]) => {
    setFilters((prev) => ({ ...prev, finishTypes }));
  }, []);

  // Reset filters - preserves metal selection (Requirements 4.10)
  const resetFilters = useCallback(() => {
    setFilters((prev) => ({
      ...DEFAULT_FILTER_STATE,
      metal: prev.metal, // Preserve metal selection
    }));
  }, []);

  // Compute metadata based on current metal selection
  const metadata: FilterMetadata = useMemo(() => {
    const availableCategories = getCategoriesForMetal(filters.metal);
    return {
      availableCategories,
      priceRange: { min: 0, max: 50000 },
      weightRange: { min: 0, max: 20 },
      heightRange: { min: 0, max: 48 },
    };
  }, [filters.metal]);

  return {
    filters,
    setMetal,
    setCategory,
    setPriceRange,
    setWeightRange,
    setHeightRange,
    setFinishTypes,
    resetFilters,
    metadata,
    isLoading,
  };
}
