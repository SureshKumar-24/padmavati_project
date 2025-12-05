'use client';

const keyPoints = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Manufacturing Excellence',
    description: 'Over 25 years of expertise in brass and copper craftsmanship with state-of-the-art facilities',
    stat: '25+',
    statLabel: 'Years Experience',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Master Artisans',
    description: 'Skilled craftsmen with generations of traditional knowledge passed down through families',
    stat: '50+',
    statLabel: 'Expert Artisans',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Premium Materials',
    description: 'Only high-grade brass, copper, and authentic panchdhatu alloys for lasting quality',
    stat: '100%',
    statLabel: 'Pure Materials',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: 'Durable Polish',
    description: 'Long-lasting finish with authentic patina that maintains its divine shine for years',
    stat: '10+',
    statLabel: 'Years Durability',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Quality Certified',
    description: 'Rigorous quality control meeting international standards with GST registered manufacturing',
    stat: 'ISO',
    statLabel: 'Certified',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-amber-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-14">
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            Our Promise
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            Why Choose <span className="text-amber-600">Padmavati Handicrafts</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-2">
            Trusted by thousands of customers, temples, and businesses across India for authentic handcrafted idols
          </p>
        </div>


        {/* Key Points Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {keyPoints.map((point) => (
            <div 
              key={point.title} 
              className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-amber-100 rounded-full -translate-y-8 sm:-translate-y-10 lg:-translate-y-12 translate-x-8 sm:translate-x-10 lg:translate-x-12 group-hover:scale-150 transition-transform duration-500" />
              
              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-amber-100 rounded-lg sm:rounded-xl flex items-center justify-center text-amber-600 mb-2 sm:mb-3 lg:mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 lg:[&>svg]:w-8 lg:[&>svg]:h-8">
                  {point.icon}
                </div>
                
                {/* Title */}
                <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 group-hover:text-amber-600 transition-colors">
                  {point.title}
                </h3>
                
                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 lg:mb-4 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {point.description}
                </p>
                
                {/* Stat */}
                <div className="pt-2 sm:pt-3 lg:pt-4 border-t border-gray-100">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-600">{point.stat}</span>
                  <span className="text-[10px] sm:text-xs text-gray-500 ml-1 sm:ml-2">{point.statLabel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
