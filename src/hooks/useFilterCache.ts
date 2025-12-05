'use client';

import { useRef, useCallback } from 'react';
import { Product, FilterState } from '@/types';
import { generateFilterCacheKey } from '@/lib/filterUtils';

interface CacheEntry {
  products: Product[];
  timestamp: number;
}

interface UseFilterCacheReturn {
  getCached: (filters: FilterState) => Product[] | null;
  setCache: (filters: FilterState, products: Product[]) => void;
  clearCache: () => void;
  hasCache: (filters: FilterState) => boolean;
}

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Hook for caching filter results to prevent redundant API calls
 * Implements Requirements 9.3 - cache results for identical filter combinations
 */
export function useFilterCache(): UseFilterCacheReturn {
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());

  // Check if cache entry is still valid
  const isValidEntry = useCallback((entry: CacheEntry): boolean => {
    return Date.now() - entry.timestamp < CACHE_TTL;
  }, []);

  // Get cached results for a filter state
  const getCached = useCallback(
    (filters: FilterState): Product[] | null => {
      const key = generateFilterCacheKey(filters);
      const entry = cacheRef.current.get(key);

      if (entry && isValidEntry(entry)) {
        return entry.products;
      }

      // Remove stale entry
      if (entry) {
        cacheRef.current.delete(key);
      }

      return null;
    },
    [isValidEntry]
  );

  // Store results in cache
  const setCache = useCallback((filters: FilterState, products: Product[]) => {
    const key = generateFilterCacheKey(filters);
    cacheRef.current.set(key, {
      products,
      timestamp: Date.now(),
    });
  }, []);

  // Clear all cached entries
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  // Check if cache exists for filter state
  const hasCache = useCallback(
    (filters: FilterState): boolean => {
      const key = generateFilterCacheKey(filters);
      const entry = cacheRef.current.get(key);
      return entry !== undefined && isValidEntry(entry);
    },
    [isValidEntry]
  );

  return {
    getCached,
    setCache,
    clearCache,
    hasCache,
  };
}
