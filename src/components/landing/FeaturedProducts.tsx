'use client';

import Link from 'next/link';
import { getFeaturedProducts } from '@/data/products';

export function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts();

  return (
    <section className="py-12 md:py-20 bg-amber-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-14">
          <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
            Best Sellers
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Featured <span className="text-amber-600">Products</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-lg px-2">
            Discover our most popular handcrafted idols loved by customers across India
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="bg-amber-50 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative h-44 sm:h-52 lg:h-64 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Badges */}
                  <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 flex flex-col gap-1 sm:gap-1.5 lg:gap-2">
                    <span className="px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 bg-amber-600 text-white text-[10px] sm:text-xs font-semibold rounded-full">
                      {product.metal}
                    </span>
                    <span className="px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] sm:text-xs font-medium rounded-full">
                      {product.category}
                    </span>
                  </div>
                  {/* Stock Badge */}
                  {product.stock < 10 && (
                    <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4">
                      <span className="px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 bg-red-500 text-white text-[10px] sm:text-xs font-semibold rounded-full">
                        Only {product.stock} left
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 lg:p-5 bg-white">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg mb-1 sm:mb-1.5 lg:mb-2 group-hover:text-amber-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-2.5 lg:mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Specs */}
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 lg:gap-2 mb-2 sm:mb-3 lg:mb-4">
                    <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                      {product.weightKg} kg
                    </span>
                    <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                      {product.heightInch}&quot; height
                    </span>
                    <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                      {product.finishType}
                    </span>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-600">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <button className="px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-amber-600 text-white text-[10px] sm:text-xs lg:text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 md:mt-12">
          <Link href="/products">
            <button className="inline-flex items-center gap-2 px-6 py-2.5 md:px-8 md:py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold text-base md:text-lg shadow-lg shadow-amber-600/30">
              View All Products
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Link>
          <p className="text-gray-500 text-xs md:text-sm mt-3 md:mt-4">
            🚚 Free shipping on orders above ₹2,000
          </p>
        </div>
      </div>
    </section>
  );
}
