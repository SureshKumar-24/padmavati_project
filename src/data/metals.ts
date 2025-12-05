import { MetalType, CategoryType, MetalCategory } from '@/types';

// Metal to category mapping - defines which categories are available for each metal
export const metalCategoryMap: Record<MetalType, CategoryType[]> = {
  Brass: ['Ganesh', 'Laxmi', 'Buddha', 'Diyas', 'Brackets', 'Hanuman'],
  Copper: ['Yantra', 'Temple Items'],
  Panchdhatu: ['Ganesh', 'Laxmi', 'Hanuman', 'Buddha'],
  Custom: ['Ganesh', 'Laxmi', 'Hanuman', 'Buddha', 'Yantra', 'Diyas', 'Brackets', 'Temple Items'],
};

// Metal category cards data for ShopByMetal section
export const metalCategories: MetalCategory[] = [
  {
    type: 'Brass',
    title: 'Brass Collection',
    description: 'Traditional brass idols with timeless appeal',
    itemTypes: ['Ganesha', 'Laxmi', 'Buddha', 'Diyas', 'Brackets'],
    image: '/Ganesha/Beautifully_Crafted_Brass_Ganesha_Idol_720x.webp',
  },
  {
    type: 'Copper',
    title: 'Copper Collection',
    description: 'Pure copper items for spiritual practices',
    itemTypes: ['Yantras', 'Pooja Accessories'],
    image: '/Diyas/61YqwQDiZDL.jpg',
  },
  {
    type: 'Panchdhatu',
    title: 'Panchdhatu Collection',
    description: 'Premium deity idols',
    itemTypes: ['Premium deity idols'],
    image: '/Hanuman/Hanuman-Ji-Center-Panchdhatu-Murti-1.png',
  },
  {
    type: 'Custom',
    title: 'Custom Metal Work',
    description: 'Upload your design — tailored orders',
    itemTypes: ['Custom designs', 'Bulk orders'],
    image: '/Manufacturing/maxresdefault.jpg',
  },
];

// Get categories available for a specific metal type
export function getCategoriesForMetal(metal: MetalType): CategoryType[] {
  return metalCategoryMap[metal] || [];
}
