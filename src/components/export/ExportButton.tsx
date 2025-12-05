'use client';

import Link from 'next/link';

export function ExportButton() {
  return (
    <Link
      href="/export"
      className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:from-amber-700 hover:to-amber-800 transition-all flex items-center gap-2 z-40"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export Products
    </Link>
  );
}
