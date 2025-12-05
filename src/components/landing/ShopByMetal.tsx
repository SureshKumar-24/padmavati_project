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
    <section id={id} className="py-20 bg-amber-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
            Our Collections
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by <span className="text-amber-600">Metal Type</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Each metal carries its own spiritual significance. Choose the perfect material for your divine idols.
          </p>
        </div>

        {/* Metal Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metalCategories.map((metal) => (
            <div
              key={metal.type}
              onClick={() => handleMetalClick(metal.type)}
              className="group cursor-pointer"
            >
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={metal.image}
                    alt={metal.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  {/* Metal Name on Image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{metal.title}</h3>
                    <p className="text-white/90 text-sm">{metal.description}</p>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5">
                  {/* Item Types */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {metal.itemTypes.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full font-medium"
                      >
                        {item}
                      </span>
                    ))}
                    {metal.itemTypes.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                        +{metal.itemTypes.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-amber-600 font-semibold group-hover:text-amber-700 transition-colors">
                      Explore Collection
                    </span>
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-600 transition-colors">
                      <svg 
                        className="w-4 h-4 text-amber-600 group-hover:text-white transition-colors" 
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
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            💡 <span className="font-medium">Pro tip:</span> Panchdhatu idols are considered most auspicious for home temples
          </p>
        </div>
      </div>
    </section>
  );
}
