'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FilterState,
  MetalType,
  CategoryType,
  FinishType,
  METAL_TYPES,
  CATEGORY_TYPES,
  FINISH_TYPES,
} from '@/types';

export interface UseURLSyncReturn {
  syncToURL: (filters: FilterState) => void;
  getFiltersFromURL: () => Partial<FilterState>;
}

/**
 * Serialize filter state to URL query parameters
 */
export function serializeFiltersToParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.metal) params.set('metal', filters.metal);
  if (filters.category) params.set('category', filters.category);
  if (filters.priceMin !== null) params.set('price_min', filters.priceMin.toString());
  if (filters.priceMax !== null) params.set('price_max', filters.priceMax.toString());
  if (filters.weightMin !== null) params.set('weight_min', filters.weightMin.toString());
  if (filters.weightMax !== null) params.set('weight_max', filters.weightMax.toString());
  if (filters.heightMin !== null) params.set('height_min', filters.heightMin.toString());
  if (filters.heightMax !== null) params.set('height_max', filters.heightMax.toString());
  if (filters.finishTypes.length > 0) params.set('finish', filters.finishTypes.join(','));

  return params;
}

/**
 * Parse URL query parameters to filter state
 */
export function parseParamsToFilters(params: URLSearchParams): Partial<FilterState> {
  const filters: Partial<FilterState> = {};

  const metal = params.get('metal');
  if (metal && METAL_TYPES.includes(metal as MetalType)) {
    filters.metal = metal as MetalType;
  }

  const category = params.get('category');
  if (category && CATEGORY_TYPES.includes(category as CategoryType)) {
    filters.category = category as CategoryType;
  }

  const priceMin = params.get('price_min');
  if (priceMin) {
    const parsed = parseFloat(priceMin);
    if (!isNaN(parsed)) filters.priceMin = parsed;
  }

  const priceMax = params.get('price_max');
  if (priceMax) {
    const parsed = parseFloat(priceMax);
    if (!isNaN(parsed)) filters.priceMax = parsed;
  }

  const weightMin = params.get('weight_min');
  if (weightMin) {
    const parsed = parseFloat(weightMin);
    if (!isNaN(parsed)) filters.weightMin = parsed;
  }

  const weightMax = params.get('weight_max');
  if (weightMax) {
    const parsed = parseFloat(weightMax);
    if (!isNaN(parsed)) filters.weightMax = parsed;
  }

  const heightMin = params.get('height_min');
  if (heightMin) {
    const parsed = parseFloat(heightMin);
    if (!isNaN(parsed)) filters.heightMin = parsed;
  }

  const heightMax = params.get('height_max');
  if (heightMax) {
    const parsed = parseFloat(heightMax);
    if (!isNaN(parsed)) filters.heightMax = parsed;
  }

  const finish = params.get('finish');
  if (finish) {
    const finishTypes = finish
      .split(',')
      .filter((f) => FINISH_TYPES.includes(f as FinishType)) as FinishType[];
    if (finishTypes.length > 0) filters.finishTypes = finishTypes;
  }

  return filters;
}

/**
 * Hook for synchronizing filter state with URL query parameters
 * Enables shareable/bookmarkable filter states (Requirements 8.1, 8.2)
 */
export function useURLSync(): UseURLSyncReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync filter state to URL
  const syncToURL = useCallback(
    (filters: FilterState) => {
      const params = serializeFiltersToParams(filters);
      const queryString = params.toString();
      const newURL = queryString ? `?${queryString}` : window.location.pathname;
      router.push(newURL, { scroll: false });
    },
    [router]
  );

  // Get filter state from current URL
  const getFiltersFromURL = useCallback((): Partial<FilterState> => {
    return parseParamsToFilters(searchParams);
  }, [searchParams]);

  return {
    syncToURL,
    getFiltersFromURL,
  };
}
