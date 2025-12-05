'use client';

import { useRouter } from 'next/navigation';
import { Card, CardImage, CardContent } from '@/components/ui/Card';
import { deityCategories, getDeityUrl } from '@/data/categories';

export interface DeityCollectionsProps {
  id?: string;
}

export function DeityCollections({ id }: DeityCollectionsProps) {
  const router = useRouter();

  return (
    <section id={id} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
          Popular Deity Collections
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Explore our curated collections of divine idols for your home and temple
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {deityCategories.map((deity) => (
            <Card
              key={deity.id}
              variant="elevated"
              hoverable
              onClick={() => router.push(getDeityUrl(deity))}
            >
              <CardImage src={deity.image} alt={deity.name} aspectRatio="square" />
              <CardContent className="text-center">
                <h3 className="font-semibold text-gray-900">{deity.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
