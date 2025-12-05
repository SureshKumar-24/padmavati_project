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
      <div className="absolute top-5 left-5 sm:top-10 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-amber-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-5 right-5 sm:bottom-10 sm:right-10 w-24 h-24 sm:w-40 sm:h-40 bg-orange-500/20 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4 py-12 sm:py-16 lg:py-28">
        <div className="max-w-4xl mx-auto text-center">
          {/* Brand Name */}
          <div className="mb-4 sm:mb-6">
            <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-200 text-xs sm:text-sm font-medium tracking-wide">
              ✨ Since 1985 • Traditional Artisans
            </span>
          </div>
          
          {/* Logo/Brand */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
            <span className="text-amber-400">Padmavati</span> Handicrafts
          </h1>
          
          {/* Tagline */}
          <p className="text-lg sm:text-xl md:text-2xl text-amber-100 font-light mb-3 sm:mb-4">
            Divine Artistry in Metal
          </p>
          
          <p className="text-sm sm:text-base md:text-lg text-amber-200/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Premium handcrafted brass, copper & panchdhatu idols for homes, temples & spiritual spaces. 
            Each piece crafted with devotion by master artisans.
          </p>

          {/* Metal Indicators */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-2">
            {metalIndicators.map((metal) => (
              <span 
                key={metal} 
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs sm:text-sm font-medium hover:bg-white/20 transition-colors cursor-default"
              >
                {metal}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4 sm:px-0">
            <Button 
              size="lg" 
              onClick={onShopByMetal}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg shadow-lg shadow-amber-500/30"
            >
              Shop by Metal
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onBrowseCollections}
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-amber-900 px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg"
            >
              Browse Collections
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 px-2">
            {trustBadges.map((badge) => (
              <Badge 
                key={badge.label} 
                variant="success" 
                icon={<span>{badge.icon}</span>}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs sm:text-sm"
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
