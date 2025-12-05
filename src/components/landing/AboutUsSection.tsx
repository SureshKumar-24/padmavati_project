'use client';

import Link from 'next/link';

export function AboutUsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Image */}
              <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl">
                <img
                  src="/Manufacturing/maxresdefault.jpg"
                  alt="Padmavati Handicrafts Workshop"
                  className="w-full h-56 sm:h-72 md:h-80 lg:h-96 object-cover"
                />
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-4 -right-2 md:-bottom-6 md:-right-6 bg-amber-600 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl hidden sm:block">
                <div className="text-2xl md:text-4xl font-bold">25+</div>
                <div className="text-amber-100 text-xs md:text-sm">Years of Excellence</div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute top-4 -left-4 md:top-8 md:-left-8 w-full h-full bg-amber-100 rounded-xl md:rounded-2xl -z-10 hidden sm:block" />
          </div>

          {/* Content Side */}
          <div>
            {/* Section Header */}
            <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
              Our Story
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
              About <span className="text-amber-600">Padmavati Handicrafts</span>
            </h2>
            
            <p className="text-gray-600 mb-4 md:mb-5 leading-relaxed text-sm md:text-lg">
              We are a family-owned business with over two decades of experience in crafting
              exquisite brass and copper idols. Our journey began in the heart of India&apos;s
              traditional metalworking region.
            </p>
            
            <p className="text-gray-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
              Generations of artisans have perfected the art of creating divine statues that bring 
              peace and prosperity to homes and temples. Every piece we create is a testament to our 
              commitment to quality, authenticity, and the preservation of ancient craftsmanship.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="flex items-start gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm md:text-base">Family Owned</div>
                  <div className="text-xs md:text-sm text-gray-500">3rd Generation</div>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm md:text-base">GST Registered</div>
                  <div className="text-xs md:text-sm text-gray-500">Verified Manufacturer</div>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm md:text-base">PAN India</div>
                  <div className="text-xs md:text-sm text-gray-500">Delivery Available</div>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm md:text-base">Bulk Orders</div>
                  <div className="text-xs md:text-sm text-gray-500">Temple & Business</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link href="/about">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium shadow-lg shadow-amber-600/30 text-sm md:text-base">
                Learn More About Us
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
