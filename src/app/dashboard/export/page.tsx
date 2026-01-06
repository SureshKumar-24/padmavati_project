'use client';

import { useState, useMemo } from 'react';
import { FilterState, DEFAULT_FILTER_STATE, METAL_TYPES, FINISH_TYPES } from '@/types';
import { products } from '@/data/products';
import { applyFilters, getCategoriesForMetal } from '@/lib/filterUtils';
import Link from 'next/link';

export default function ExportPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfPassword, setPdfPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Get filtered products
  const filteredProducts = useMemo(() => {
    return applyFilters(products, filters);
  }, [filters]);

  // Get available categories based on selected metal
  const availableCategories = useMemo(() => {
    return getCategoriesForMetal(filters.metal);
  }, [filters.metal]);

  const handleMetalChange = (metal: string) => {
    setFilters(prev => ({
      ...prev,
      metal: metal === '' ? null : (metal as FilterState['metal']),
      category: null,
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: category === '' ? null : (category as FilterState['category']),
    }));
  };

  const handleFinishToggle = (finish: string) => {
    setFilters(prev => ({
      ...prev,
      finishTypes: prev.finishTypes.includes(finish as FilterState['finishTypes'][number])
        ? prev.finishTypes.filter(f => f !== finish)
        : [...prev.finishTypes, finish as FilterState['finishTypes'][number]],
    }));
  };

  const handleRangeChange = (field: string, value: string, isMin: boolean) => {
    const numValue = value === '' ? null : parseFloat(value);
    setFilters(prev => ({
      ...prev,
      [`${field}${isMin ? 'Min' : 'Max'}`]: numValue,
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTER_STATE);
  };


  const generatePDF = async () => {
    if (!pdfPassword.trim()) {
      alert('Please enter a password for the PDF');
      return;
    }

    setIsGenerating(true);
    try {
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default;
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF({
        encryption: {
          userPassword: pdfPassword,
          ownerPassword: pdfPassword,
          userPermissions: ['print'],
        },
      });

      doc.setFontSize(20);
      doc.setTextColor(139, 69, 19);
      doc.text('Padmavati Handicrafts - Product Catalog', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 28);
      doc.text(`Total Products: ${filteredProducts.length}`, 14, 34);

      // Load images and convert to base64
      const loadImage = (src: string): Promise<string> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 50;
            canvas.height = 50;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, 50, 50);
              resolve(canvas.toDataURL('image/jpeg', 0.7));
            } else {
              resolve('');
            }
          };
          img.onerror = () => resolve('');
          img.src = src;
        });
      };

      // Load all product images
      const imagePromises = filteredProducts.map(p => loadImage(p.images[0]));
      const imageDataUrls = await Promise.all(imagePromises);

      const tableData = filteredProducts.map((product, index) => [
        index + 1,
        '', // Placeholder for image
        product.id,
        product.name,
        product.metal,
        product.category,
        `Rs.${product.price.toLocaleString('en-IN')}`,
        `${product.weightKg} kg`,
        `${product.heightInch}"`,
        product.finishType,
      ]);

      autoTable(doc, {
        head: [['#', 'Image', 'ID', 'Name', 'Metal', 'Category', 'Price', 'Weight', 'Height', 'Finish']],
        body: tableData,
        startY: 42,
        styles: { fontSize: 7, cellPadding: 2, minCellHeight: 18 },
        headStyles: { fillColor: [139, 69, 19], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 220] },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 18 },
          2: { cellWidth: 18 },
          3: { cellWidth: 35 },
        },
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index === 1) {
            const imgData = imageDataUrls[data.row.index];
            if (imgData) {
              doc.addImage(imgData, 'JPEG', data.cell.x + 1, data.cell.y + 1, 15, 15);
            }
          }
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageCount = (doc as any).getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (doc as any).setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount} | Password Protected | Padmavati Handicrafts`,
          14,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (doc as any).internal.pageSize.height - 10
        );
      }

      // Download the PDF
      const timestamp = new Date().toISOString().split('T')[0];
      doc.save(`Padmavati_Products_${timestamp}.pdf`);

      setGeneratedPassword(pdfPassword);
      setShowSuccessModal(true);
      setShowPasswordInput(false);
      setPdfPassword('');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };


  // Main Export Page
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white p-3 sm:p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold truncate">Product Export Center</h1>
              <p className="text-amber-200/70 text-xs hidden sm:block">Filter and export product catalog</p>
            </div>
          </div>
          <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-200 text-xs sm:text-sm whitespace-nowrap hidden md:block">
            Padmavati Handicrafts
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-24 border border-amber-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <h2 className="font-bold text-gray-800">Filters</h2>
              </div>
              <button onClick={resetFilters} className="text-sm text-amber-600 hover:text-amber-700 font-medium">Reset All</button>
            </div>

            {/* Metal Select */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Metal Type</label>
              <select
                value={filters.metal || ''}
                onChange={e => handleMetalChange(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-300 transition-colors"
              >
                <option value="">All Metals</option>
                {METAL_TYPES.map(metal => (
                  <option key={metal} value={metal}>{metal}</option>
                ))}
              </select>
            </div>

            {/* Category Select */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={filters.category || ''}
                onChange={e => handleCategoryChange(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!filters.metal}
              >
                <option value="">All Categories</option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range (₹)</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={filters.priceMin || ''} onChange={e => handleRangeChange('price', e.target.value, true)} className="w-1/2 border-2 border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-300 transition-colors" />
                <input type="number" placeholder="Max" value={filters.priceMax || ''} onChange={e => handleRangeChange('price', e.target.value, false)} className="w-1/2 border-2 border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-300 transition-colors" />
              </div>
            </div>

            {/* Weight Range */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
              <div className="flex gap-2">
                <input type="number" step="0.1" placeholder="Min" value={filters.weightMin || ''} onChange={e => handleRangeChange('weight', e.target.value, true)} className="w-1/2 border-2 border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-300 transition-colors" />
                <input type="number" step="0.1" placeholder="Max" value={filters.weightMax || ''} onChange={e => handleRangeChange('weight', e.target.value, false)} className="w-1/2 border-2 border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-300 transition-colors" />
              </div>
            </div>

            {/* Height Range */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Height (inches)</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={filters.heightMin || ''} onChange={e => handleRangeChange('height', e.target.value, true)} className="w-1/2 border-2 border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-300 transition-colors" />
                <input type="number" placeholder="Max" value={filters.heightMax || ''} onChange={e => handleRangeChange('height', e.target.value, false)} className="w-1/2 border-2 border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-300 transition-colors" />
              </div>
            </div>

            {/* Finish Types */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Finish Type</label>
              <div className="space-y-2">
                {FINISH_TYPES.map(finish => (
                  <label key={finish} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-amber-50 transition-colors">
                    <input type="checkbox" checked={filters.finishTypes.includes(finish)} onChange={() => handleFinishToggle(finish)} className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-2 border-gray-300" />
                    <span className="text-sm text-gray-700">{finish}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>


        {/* Main Content */}
        <main className="flex-1">
          {/* Action Bar */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border border-amber-100">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{filteredProducts.length}</p>
                <p className="text-gray-500 text-xs sm:text-sm">Products Found</p>
              </div>
            </div>
            {!showPasswordInput ? (
              <button
                onClick={() => setShowPasswordInput(true)}
                disabled={filteredProducts.length === 0}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-lg shadow-amber-600/30 transition-all text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export as PDF
              </button>
            ) : (
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-amber-50 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                <input
                  type="text"
                  placeholder="Enter PDF password"
                  value={pdfPassword}
                  onChange={e => setPdfPassword(e.target.value)}
                  className="border-2 border-amber-200 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm w-full sm:w-44 md:w-52 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={generatePDF}
                    disabled={isGenerating || !pdfPassword.trim()}
                    className="flex-1 sm:flex-none bg-green-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-2 text-sm"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="hidden sm:inline">Generating...</span>
                      </>
                    ) : 'Generate'}
                  </button>
                  <button onClick={() => { setShowPasswordInput(false); setPdfPassword(''); }} className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Product Table - Desktop */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-amber-100 hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-amber-600 to-amber-700 text-white">
                  <tr>
                    <th className="text-left p-3 lg:p-4 font-semibold">#</th>
                    <th className="text-left p-3 lg:p-4 font-semibold">Image</th>
                    <th className="text-left p-3 lg:p-4 font-semibold hidden lg:table-cell">Product ID</th>
                    <th className="text-left p-3 lg:p-4 font-semibold">Name</th>
                    <th className="text-left p-3 lg:p-4 font-semibold">Metal</th>
                    <th className="text-left p-3 lg:p-4 font-semibold hidden xl:table-cell">Category</th>
                    <th className="text-left p-3 lg:p-4 font-semibold">Price</th>
                    <th className="text-left p-3 lg:p-4 font-semibold hidden xl:table-cell">Weight</th>
                    <th className="text-left p-3 lg:p-4 font-semibold hidden xl:table-cell">Height</th>
                    <th className="text-left p-3 lg:p-4 font-semibold hidden lg:table-cell">Finish</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={product.id} className={`border-b border-amber-50 hover:bg-amber-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'}`}>
                      <td className="p-3 lg:p-4 text-gray-500 font-medium">{index + 1}</td>
                      <td className="p-3 lg:p-4">
                        <img src={product.images[0]} alt={product.name} className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-lg lg:rounded-xl border-2 border-amber-100 shadow-sm" />
                      </td>
                      <td className="p-3 lg:p-4 font-mono text-xs text-gray-500 hidden lg:table-cell">{product.id}</td>
                      <td className="p-3 lg:p-4">
                        <div className="font-semibold text-gray-800 text-sm">{product.name}</div>
                        <div className="text-xs text-gray-500 mt-1 max-w-[200px] line-clamp-1 hidden lg:block">{product.description}</div>
                      </td>
                      <td className="p-3 lg:p-4">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">{product.metal}</span>
                      </td>
                      <td className="p-3 lg:p-4 text-gray-600 text-sm hidden xl:table-cell">{product.category}</td>
                      <td className="p-3 lg:p-4 font-bold text-amber-600 text-sm lg:text-base">₹{product.price.toLocaleString('en-IN')}</td>
                      <td className="p-3 lg:p-4 text-gray-600 text-sm hidden xl:table-cell">{product.weightKg} kg</td>
                      <td className="p-3 lg:p-4 text-gray-600 text-sm hidden xl:table-cell">{product.heightInch}&quot;</td>
                      <td className="p-3 lg:p-4 hidden lg:table-cell">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">{product.finishType}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Product Cards - Mobile */}
          <div className="md:hidden space-y-3">
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-amber-100 p-3">
                <div className="flex gap-3">
                  <img src={product.images[0]} alt={product.name} className="w-20 h-20 object-cover rounded-lg border-2 border-amber-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{product.name}</h3>
                      <span className="text-xs text-gray-400">#{index + 1}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{product.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">{product.metal}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{product.finishType}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-amber-600">₹{product.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-gray-500">{product.weightKg}kg • {product.heightInch}&quot;</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-amber-100 text-center py-12 sm:py-20 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-lg sm:text-xl font-semibold text-gray-700">No products match your filters</p>
              <p className="mt-2 text-sm sm:text-base text-gray-500">Try adjusting the filter criteria</p>
              <button onClick={resetFilters} className="mt-4 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-medium hover:bg-amber-200 transition-colors text-sm sm:text-base">
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-orange-700 p-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">PDF Generated!</h2>
              <p className="text-amber-100 text-sm mt-1">Your catalog has been downloaded successfully</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-amber-600 font-medium">PDF Password</p>
                    <p className="text-lg font-bold text-amber-800 font-mono">{generatedPassword}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm text-gray-500 mb-6">
                <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Share this password only with authorized users who need access to the product catalog.</p>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg shadow-amber-600/30"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
