'use client';

import { useRouter } from 'next/navigation';
import { deityCategories, getDeityUrl } from '@/data/categories';

export interface DeityCollectionsProps {
  id?: string;
}

export function DeityCollections({ id }: DeityCollectionsProps) {
  const router = useRouter();

  return (
    <section id={id} className="py-12 md:py-20 bg-amber-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-14">
          <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
            Divine Idols
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Popular <span className="text-amber-600">Deity Collections</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-lg px-2">
            Bring divine blessings to your home with our handcrafted deity idols, each made with devotion and precision.
          </p>
        </div>

        {/* Deity Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {deityCategories.map((deity) => (
            <div
              key={deity.id}
              onClick={() => router.push(getDeityUrl(deity))}
              className="group cursor-pointer"
            >
              <div className="relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={deity.image}
                    alt={deity.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Hover Text */}
                  <div className="absolute inset-0 flex items-end justify-center pb-3 sm:pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-semibold text-xs sm:text-sm flex items-center gap-1">
                      View Collection
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
                
                {/* Deity Name */}
                <div className="p-2 sm:p-3 lg:p-4 text-center">
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm lg:text-lg group-hover:text-amber-600 transition-colors">
                    {deity.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 md:mt-12 text-center">
          <p className="text-gray-500 text-xs md:text-sm mb-3 md:mb-4 px-2">
            🙏 Each idol is blessed and crafted by experienced artisans
          </p>
          <button 
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm md:text-base"
          >
            View All Collections
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
