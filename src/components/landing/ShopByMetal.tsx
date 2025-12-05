'use client';

import { useRouter } from 'next/navigation';
import { Card, CardImage, CardContent } from '@/components/ui/Card';
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
    <section id={id} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
          Shop by Metal
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Choose from our premium collection of brass, copper, and panchdhatu idols
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metalCategories.map((metal) => (
            <Card
              key={metal.type}
              variant="bordered"
              hoverable
              onClick={() => handleMetalClick(metal.type)}
            >
              <CardImage src={metal.image} alt={metal.title} aspectRatio="video" />
              <CardContent>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{metal.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{metal.description}</p>
                <div className="flex flex-wrap gap-1">
                  {metal.itemTypes.map((item) => (
                    <span
                      key={item}
                      className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
