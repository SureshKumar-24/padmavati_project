'use client';

import { useRouter } from 'next/navigation';
import { metalCategories } from '@/data/metals';
import { MetalType } from '@/types';

export interface ShopByMetalProps {
  id?: string;
}

export function ShopByMetal({ id }: ShopByMetalProps) {
  const router = useRouter();

  const handleMetalClick = (metalType: MetalType) => {
    router.push(`/?metal=${metalType}`);
  };

  return (
    <section id={id} className="py-12 md:py-20 bg-amber-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-14">
          <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
            Our Collections
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Shop by <span className="text-amber-600">Metal Type</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-lg px-2">
            Each metal carries its own spiritual significance. Choose the perfect material for your divine idols.
          </p>
        </div>

        {/* Metal Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {metalCategories.map((metal) => (
            <div
              key={metal.type}
              onClick={() => handleMetalClick(metal.type)}
              className="group cursor-pointer"
            >
              <div className="relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative h-36 sm:h-48 lg:h-64 overflow-hidden">
                  <img
                    src={metal.image}
                    alt={metal.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  {/* Metal Name on Image */}
                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 lg:bottom-4 lg:left-4 lg:right-4">
                    <h3 className="text-base sm:text-lg lg:text-2xl font-bold text-white mb-0.5 sm:mb-1">{metal.title}</h3>
                    <p className="text-white/90 text-[10px] sm:text-xs lg:text-sm line-clamp-1 sm:line-clamp-2">{metal.description}</p>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-2 sm:p-3 lg:p-5">
                  {/* Item Types */}
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 lg:gap-2 mb-2 sm:mb-3 lg:mb-4">
                    {metal.itemTypes.slice(0, 2).map((item) => (
                      <span
                        key={item}
                        className="text-[10px] sm:text-xs bg-amber-50 text-amber-700 px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 lg:py-1.5 rounded-full font-medium"
                      >
                        {item}
                      </span>
                    ))}
                    {metal.itemTypes.length > 2 && (
                      <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 lg:py-1.5 rounded-full">
                        +{metal.itemTypes.length - 2} more
                      </span>
                    )}
                  </div>
                  
                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-amber-600 font-semibold group-hover:text-amber-700 transition-colors text-[10px] sm:text-xs lg:text-base">
                      Explore
                    </span>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-600 transition-colors">
                      <svg 
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-amber-600 group-hover:text-white transition-colors" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-8 md:mt-12 text-center">
          <p className="text-gray-500 text-xs md:text-sm px-2">
            💡 <span className="font-medium">Pro tip:</span> Panchdhatu idols are considered most auspicious for home temples
          </p>
        </div>
      </div>
    </section>
  );
}
