import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/data/products';
import { applyFilters } from '@/lib/filterUtils';
import { parseParamsToFilters } from '@/hooks/useURLSync';
import { DEFAULT_FILTER_STATE } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Parse filter parameters from URL
  const parsedFilters = parseParamsToFilters(searchParams);
  
  // Merge with defaults
  const filters = {
    ...DEFAULT_FILTER_STATE,
    ...parsedFilters,
  };
  
  // Get all products and apply filters
  const allProducts = getAllProducts();
  const filteredProducts = applyFilters(allProducts, filters);
  
  return NextResponse.json({
    products: filteredProducts,
    total: filteredProducts.length,
    filters: filters,
  });
}
