import { DeityCategory } from '@/types';

// Deity categories for Popular Deity Collections section
export const deityCategories: DeityCategory[] = [
  {
    id: 'ganesh',
    name: 'Lord Ganesha Idols',
    slug: 'ganesh',
    image: '/Ganesha/AA2790YA-Photoroom.webp',
  },
  {
    id: 'laxmi',
    name: 'Goddess Laxmi Idols',
    slug: 'laxmi',
    image: '/Laxmi/811Nf8Dko6L.jpg',
  },
  {
    id: 'hanuman',
    name: 'Hanuman Ji Statues',
    slug: 'hanuman',
    image: '/Hanuman/81ugO2iR3lL.jpg',
  },
  {
    id: 'buddha',
    name: 'Buddha Collection',
    slug: 'buddha',
    image: '/Buddha/81CdBhzXnNL._AC_UF894,1000_QL80_.jpg',
  },
  {
    id: 'yantra',
    name: 'Yantras & Temple Essentials',
    slug: 'yantra',
    image: '/Diyas/39733345-15721618.webp',
  },
];

// Get deity category by slug
export function getDeityBySlug(slug: string): DeityCategory | undefined {
  return deityCategories.find((deity) => deity.slug === slug);
}

// Get deity landing page URL
export function getDeityUrl(deity: DeityCategory): string {
  return `/collections/${deity.slug}`;
}
