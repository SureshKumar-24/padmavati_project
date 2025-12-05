'use client';

import Link from 'next/link';

export function AboutUsSection() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Image */}
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/Manufacturing/maxresdefault.jpg"
                  alt="Padmavati Handicrafts Workshop"
                  className="w-full h-80 lg:h-96 object-cover"
                />
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 bg-amber-600 text-white p-6 rounded-2xl shadow-xl hidden md:block">
                <div className="text-4xl font-bold">25+</div>
                <div className="text-amber-100 text-sm">Years of Excellence</div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute top-8 -left-8 w-full h-full bg-amber-100 rounded-2xl -z-10" />
          </div>

          {/* Content Side */}
          <div>
            {/* Section Header */}
            <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About <span className="text-amber-600">Padmavati Handicrafts</span>
            </h2>
            
            <p className="text-gray-600 mb-5 leading-relaxed text-lg">
              We are a family-owned business with over two decades of experience in crafting
              exquisite brass and copper idols. Our journey began in the heart of India&apos;s
              traditional metalworking region.
            </p>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Generations of artisans have perfected the art of creating divine statues that bring 
              peace and prosperity to homes and temples. Every piece we create is a testament to our 
              commitment to quality, authenticity, and the preservation of ancient craftsmanship.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Family Owned</div>
                  <div className="text-sm text-gray-500">3rd Generation</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">GST Registered</div>
                  <div className="text-sm text-gray-500">Verified Manufacturer</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">PAN India</div>
                  <div className="text-sm text-gray-500">Delivery Available</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Bulk Orders</div>
                  <div className="text-sm text-gray-500">Temple & Business</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link href="/about">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium shadow-lg shadow-amber-600/30">
                Learn More About Us
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
