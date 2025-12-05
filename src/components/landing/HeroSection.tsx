import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export interface HeroSectionProps {
  onShopByMetal?: () => void;
  onBrowseCollections?: () => void;
}

const metalIndicators = ['Brass', 'Copper', 'Panchdhatu', 'Custom Orders'];

const trustBadges = [
  { label: 'PAN India Delivery', icon: '🚚' },
  { label: 'GST Registered Manufacturer', icon: '✓' },
  { label: '100% Handcrafted Quality', icon: '🏆' },
];

export function HeroSection({ onShopByMetal, onBrowseCollections }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Handcrafted Brass & Copper Idols for Every Home & Temple
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Experience premium artisan-made statues with authentic polish, perfect detailing, and
            long life.
          </p>

          {/* Metal Indicators */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {metalIndicators.map((metal) => (
              <Badge key={metal} variant="warning">
                {metal}
              </Badge>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Button size="lg" onClick={onShopByMetal}>
              Shop by Metal
            </Button>
            <Button variant="outline" size="lg" onClick={onBrowseCollections}>
              Browse Collections
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4">
            {trustBadges.map((badge) => (
              <Badge key={badge.label} variant="success" icon={<span>{badge.icon}</span>}>
                {badge.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
