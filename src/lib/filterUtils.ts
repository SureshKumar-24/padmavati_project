import { Product, FilterState, MetalType, CategoryType } from '@/types';
import { metalCategoryMap } from '@/data/metals';

/**
 * Swap min and max values if min > max
 */
export function swapRangeIfInvalid(
  min: number | null,
  max: number | null
): { min: number | null; max: number | null } {
  if (min !== null && max !== null && min > max) {
    return { min: max, max: min };
  }
  return { min, max };
}

/**
 * Get categories available for a specific metal type
 */
export function getCategoriesForMetal(metal: MetalType | null): CategoryType[] {
  if (!metal) return [];
  return metalCategoryMap[metal] || [];
}

/**
 * Check if a product matches a single filter condition
 */
function matchesMetal(product: Product, metal: MetalType | null): boolean {
  return metal === null || product.metal === metal;
}

function matchesCategory(product: Product, category: CategoryType | null): boolean {
  return category === null || product.category === category;
}

function matchesPriceRange(
  product: Product,
  priceMin: number | null,
  priceMax: number | null
): boolean {
  const { min, max } = swapRangeIfInvalid(priceMin, priceMax);
  if (min !== null && product.price < min) return false;
  if (max !== null && product.price > max) return false;
  return true;
}

function matchesWeightRange(
  product: Product,
  weightMin: number | null,
  weightMax: number | null
): boolean {
  const { min, max } = swapRangeIfInvalid(weightMin, weightMax);
  if (min !== null && product.weightKg < min) return false;
  if (max !== null && product.weightKg > max) return false;
  return true;
}


function matchesHeightRange(
  product: Product,
  heightMin: number | null,
  heightMax: number | null
): boolean {
  const { min, max } = swapRangeIfInvalid(heightMin, heightMax);
  if (min !== null && product.heightInch < min) return false;
  if (max !== null && product.heightInch > max) return false;
  return true;
}

function matchesFinishTypes(
  product: Product,
  finishTypes: FilterState['finishTypes']
): boolean {
  // If no finish types selected, match all
  if (finishTypes.length === 0) return true;
  return finishTypes.includes(product.finishType);
}

/**
 * Apply all filters to a list of products using AND logic
 * All specified filter conditions must be satisfied for a product to be included
 */
export function applyFilters(products: Product[], filters: FilterState): Product[] {
  return products.filter((product) => {
    // AND logic: all conditions must be true
    return (
      matchesMetal(product, filters.metal) &&
      matchesCategory(product, filters.category) &&
      matchesPriceRange(product, filters.priceMin, filters.priceMax) &&
      matchesWeightRange(product, filters.weightMin, filters.weightMax) &&
      matchesHeightRange(product, filters.heightMin, filters.heightMax) &&
      matchesFinishTypes(product, filters.finishTypes)
    );
  });
}

/**
 * Generate a cache key from filter state for result caching
 */
export function generateFilterCacheKey(filters: FilterState): string {
  return JSON.stringify({
    metal: filters.metal,
    category: filters.category,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    weightMin: filters.weightMin,
    weightMax: filters.weightMax,
    heightMin: filters.heightMin,
    heightMax: filters.heightMax,
    finishTypes: [...filters.finishTypes].sort(),
  });
}

/**
 * Check if two filter states are equivalent
 */
export function areFiltersEqual(a: FilterState, b: FilterState): boolean {
  return generateFilterCacheKey(a) === generateFilterCacheKey(b);
}
