import { Product, FilterState } from '@/types';
import { serializeFiltersToParams } from '@/hooks/useURLSync';

interface ProductsResponse {
  products: Product[];
  total: number;
  filters: FilterState;
}

/**
 * Fetch products from API with filter parameters
 */
export async function fetchProducts(filters: FilterState): Promise<ProductsResponse> {
  const params = serializeFiltersToParams(filters);
  const queryString = params.toString();
  const url = `/api/products${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create a debounced version of fetchProducts
 */
export function createDebouncedFetch(delay: number = 300) {
  let timeoutId: NodeJS.Timeout | null = null;

  return (filters: FilterState): Promise<ProductsResponse> => {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(async () => {
        try {
          const result = await fetchProducts(filters);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}
