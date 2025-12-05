'use client';

import Link from 'next/link';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/Button';
import { getFeaturedProducts } from '@/data/products';

export function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
          Featured Products
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Discover our most popular handcrafted idols and statues
        </p>

        <ProductGrid products={featuredProducts} />

        <div className="text-center mt-10">
          <Link href="/products">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
