// Metal type union - base material categories
export type MetalType = 'Brass' | 'Copper' | 'Panchdhatu' | 'Custom';

// Finish type union - surface finish options
export type FinishType = 'Antique' | 'Glossy' | 'Matte' | 'Gold-plated';

// Category type union - deity/item classifications
export type CategoryType =
  | 'Ganesh'
  | 'Laxmi'
  | 'Hanuman'
  | 'Buddha'
  | 'Yantra'
  | 'Diyas'
  | 'Brackets'
  | 'Temple Items';

// Product interface - represents a store product
export interface Product {
  id: string;
  name: string;
  metal: MetalType;
  category: CategoryType;
  price: number;
  weightKg: number;
  heightInch: number;
  finishType: FinishType;
  stock: number;
  images: string[];
  description: string;
  createdAt: Date;
}

// Filter state interface - current filter selections
export interface FilterState {
  metal: MetalType | null;
  category: CategoryType | null;
  priceMin: number | null;
  priceMax: number | null;
  weightMin: number | null;
  weightMax: number | null;
  heightMin: number | null;
  heightMax: number | null;
  finishTypes: FinishType[];
}

// Filter metadata interface - available filter options
export interface FilterMetadata {
  availableCategories: CategoryType[];
  priceRange: { min: number; max: number };
  weightRange: { min: number; max: number };
  heightRange: { min: number; max: number };
}


// Custom order request interface - form submission data
export interface CustomOrderRequest {
  designFile: File | null;
  size: string;
  material: MetalType;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string;
}

// Metal category interface - metal collection card data
export interface MetalCategory {
  type: MetalType;
  title: string;
  description: string;
  itemTypes: string[];
  image: string;
}

// Deity category interface - deity collection card data
export interface DeityCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
}

// Default filter state - initial/reset values
export const DEFAULT_FILTER_STATE: FilterState = {
  metal: null,
  category: null,
  priceMin: null,
  priceMax: null,
  weightMin: null,
  weightMax: null,
  heightMin: null,
  heightMax: null,
  finishTypes: [],
};

// All metal types array
export const METAL_TYPES: MetalType[] = ['Brass', 'Copper', 'Panchdhatu', 'Custom'];

// All finish types array
export const FINISH_TYPES: FinishType[] = ['Antique', 'Glossy', 'Matte', 'Gold-plated'];

// All category types array
export const CATEGORY_TYPES: CategoryType[] = [
  'Ganesh',
  'Laxmi',
  'Hanuman',
  'Buddha',
  'Yantra',
  'Diyas',
  'Brackets',
  'Temple Items',
];
