'use client';

import { Suspense } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { ShopByMetal } from '@/components/landing/ShopByMetal';
import { DeityCollections } from '@/components/landing/DeityCollections';
import { FeaturedProducts } from '@/components/landing/FeaturedProducts';
import { CustomOrderForm } from '@/components/landing/CustomOrderForm';
import { WhyChooseUs } from '@/components/landing/WhyChooseUs';
import { AboutUsSection } from '@/components/landing/AboutUsSection';
import { FinalCTA } from '@/components/landing/FinalCTA';

function LandingPageContent() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen">
      <HeroSection
        onShopByMetal={() => scrollToSection('shop-by-metal')}
        onBrowseCollections={() => scrollToSection('deity-collections')}
      />
      <ShopByMetal id="shop-by-metal" />
      <DeityCollections id="deity-collections" />
      <FeaturedProducts />
      <CustomOrderForm />
      <WhyChooseUs />
      <AboutUsSection />
      <FinalCTA />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LandingPageContent />
    </Suspense>
  );
}
