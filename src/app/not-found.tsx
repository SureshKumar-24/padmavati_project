'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 relative overflow-hidden flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 bg-amber-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 sm:w-64 sm:h-64 bg-orange-500/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 text-center px-4 py-8 sm:py-12">
        {/* 404 Number */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-bold text-white/10 leading-none select-none">
            404
          </h1>
        </div>
        
        {/* Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-500/20 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        {/* Badge */}
        <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-200 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
          🙏 Page Not Found
        </span>
        
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
          Oops! This page has <span className="text-amber-400">wandered off</span>
        </h2>
        
        {/* Description */}
        <p className="text-amber-100/80 max-w-md mx-auto text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 px-2">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let us guide you back to our divine collection.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4 sm:px-0">
          <Link href="/">
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-all shadow-lg shadow-black/20 flex items-center justify-center gap-2 text-sm sm:text-base">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </button>
          </Link>
          <Link href="/#deity-collections">
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-amber-500/20 border-2 border-amber-400/50 text-white font-semibold rounded-xl hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
              Browse Collections
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Link>
        </div>
        
        {/* Helpful Links */}
        <div className="border-t border-amber-400/20 pt-6 sm:pt-8">
          <p className="text-amber-200/60 text-xs sm:text-sm mb-4">Popular destinations</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <Link href="/#shop-by-metal" className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-full text-amber-100 text-xs sm:text-sm transition-colors">
              Shop by Metal
            </Link>
            <Link href="/#deity-collections" className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-full text-amber-100 text-xs sm:text-sm transition-colors">
              Deity Collections
            </Link>
            <Link href="/export" className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-full text-amber-100 text-xs sm:text-sm transition-colors">
              Export Catalog
            </Link>
          </div>
        </div>
        
        {/* Brand Footer */}
        <div className="mt-10 sm:mt-12">
          <p className="text-amber-300/80 font-semibold text-sm sm:text-base">
            <span className="text-amber-400">Padmavati</span> Handicrafts
          </p>
          <p className="text-amber-200/50 text-xs sm:text-sm mt-1">
            Divine Artistry in Metal • Since 1985
          </p>
        </div>
      </div>
    </div>
  );
}
