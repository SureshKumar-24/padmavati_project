'use client';

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
    <section className="relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center">
          {/* Brand Name */}
          <div className="mb-6">
            <span className="inline-block px-4 py-1.5 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-200 text-sm font-medium tracking-wide">
              ✨ Since 1985 • Traditional Artisans
            </span>
          </div>
          
          {/* Logo/Brand */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            <span className="text-amber-400">Padmavati</span> Handicrafts
          </h1>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl text-amber-100 font-light mb-4">
            Divine Artistry in Metal
          </p>
          
          <p className="text-base md:text-lg text-amber-200/80 mb-8 max-w-2xl mx-auto">
            Premium handcrafted brass, copper & panchdhatu idols for homes, temples & spiritual spaces. 
            Each piece crafted with devotion by master artisans.
          </p>

          {/* Metal Indicators */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {metalIndicators.map((metal) => (
              <span 
                key={metal} 
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-colors cursor-default"
              >
                {metal}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              onClick={onShopByMetal}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 text-lg shadow-lg shadow-amber-500/30"
            >
              Shop by Metal
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onBrowseCollections}
              className="border-2 border-white text-white hover:bg-white hover:text-amber-900 px-8 py-3 text-lg"
            >
              Browse Collections
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4">
            {trustBadges.map((badge) => (
              <Badge 
                key={badge.label} 
                variant="success" 
                icon={<span>{badge.icon}</span>}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white"
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#fffbeb"/>
        </svg>
      </div>
    </section>
  );
}
