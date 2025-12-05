'use client';

import { useState, useMemo } from 'react';
import { Product, FilterState, DEFAULT_FILTER_STATE, METAL_TYPES, FINISH_TYPES } from '@/types';
import { products } from '@/data/products';
import { applyFilters, getCategoriesForMetal } from '@/lib/filterUtils';
import { isNumberAuthorized } from '@/config/allowedNumbers';
import Link from 'next/link';

export default function ExportPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfPassword, setPdfPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  // Get filtered products
  const filteredProducts = useMemo(() => {
    return applyFilters(products, filters);
  }, [filters]);

  // Get available categories based on selected metal
  const availableCategories = useMemo(() => {
    return getCategoriesForMetal(filters.metal);
  }, [filters.metal]);

  const handleVerify = () => {
    setError('');
    setIsVerifying(true);

    let cleanNumber = mobileNumber.replace(/[\s\-+]/g, '');
    if (cleanNumber.length > 10 && cleanNumber.startsWith('91')) {
      cleanNumber = cleanNumber.substring(2);
    }

    if (!/^\d{10}$/.test(cleanNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      setIsVerifying(false);
      return;
    }

    setTimeout(() => {
      if (isNumberAuthorized(cleanNumber)) {
        setIsVerified(true);
      } else {
        setError('This mobile number is not authorized. Please contact admin.');
      }
      setIsVerifying(false);
    }, 500);
  };

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

      const doc = new jsPDF();

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

      const timestamp = new Date().toISOString().split('T')[0];
      doc.save(`Padmavati_Products_${timestamp}_PWD_${pdfPassword}.pdf`);

      alert(`PDF generated successfully!\n\nPassword: ${pdfPassword}\n\nShare this password only with authorized users.`);
      setShowPasswordInput(false);
      setPdfPassword('');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };


  // Verification Screen
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-amber-700 to-amber-600 text-white p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Product Export Center</h1>
            <p className="text-white/80 text-sm mt-1">Enter your registered mobile number to access</p>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={e => { setMobileNumber(e.target.value); setError(''); }}
                  placeholder="Enter 10-digit number"
                  maxLength={10}
                  className="flex-1 border border-gray-300 rounded-r-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  onKeyDown={e => e.key === 'Enter' && handleVerify()}
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={handleVerify}
              disabled={isVerifying || !mobileNumber.trim()}
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isVerifying ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <Link href="/" className="block w-full mt-3 text-center text-gray-500 hover:text-gray-700 py-2 text-sm">
              ← Back to Home
            </Link>

            <p className="text-xs text-gray-400 text-center mt-4">
              Only authorized users can access this feature. Contact admin to register.
            </p>
          </div>
        </div>
      </div>
    );
  }


  // Main Export Page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-700 to-amber-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white/80 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold">Product Export Center</h1>
          </div>
          <span className="text-sm text-white/70">Verified: +91 {mobileNumber}</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 flex gap-6">
        {/* Filter Sidebar */}
        <aside className="w-72 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Filters</h2>
              <button onClick={resetFilters} className="text-sm text-amber-600 hover:text-amber-700">Reset</button>
            </div>

            {/* Metal Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Metal Type</label>
              <select
                value={filters.metal || ''}
                onChange={e => handleMetalChange(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Metals</option>
                {METAL_TYPES.map(metal => (
                  <option key={metal} value={metal}>{metal}</option>
                ))}
              </select>
            </div>

            {/* Category Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category || ''}
                onChange={e => handleCategoryChange(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500"
                disabled={!filters.metal}
              >
                <option value="">All Categories</option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (₹)</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={filters.priceMin || ''} onChange={e => handleRangeChange('price', e.target.value, true)} className="w-1/2 border rounded-lg p-2 text-sm" />
                <input type="number" placeholder="Max" value={filters.priceMax || ''} onChange={e => handleRangeChange('price', e.target.value, false)} className="w-1/2 border rounded-lg p-2 text-sm" />
              </div>
            </div>

            {/* Weight Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <div className="flex gap-2">
                <input type="number" step="0.1" placeholder="Min" value={filters.weightMin || ''} onChange={e => handleRangeChange('weight', e.target.value, true)} className="w-1/2 border rounded-lg p-2 text-sm" />
                <input type="number" step="0.1" placeholder="Max" value={filters.weightMax || ''} onChange={e => handleRangeChange('weight', e.target.value, false)} className="w-1/2 border rounded-lg p-2 text-sm" />
              </div>
            </div>

            {/* Height Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (inches)</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={filters.heightMin || ''} onChange={e => handleRangeChange('height', e.target.value, true)} className="w-1/2 border rounded-lg p-2 text-sm" />
                <input type="number" placeholder="Max" value={filters.heightMax || ''} onChange={e => handleRangeChange('height', e.target.value, false)} className="w-1/2 border rounded-lg p-2 text-sm" />
              </div>
            </div>

            {/* Finish Types */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Finish Type</label>
              <div className="space-y-2">
                {FINISH_TYPES.map(finish => (
                  <label key={finish} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={filters.finishTypes.includes(finish)} onChange={() => handleFinishToggle(finish)} className="rounded text-amber-600 focus:ring-amber-500" />
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
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center justify-between">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-800 text-lg">{filteredProducts.length}</span> products found
            </p>
            {!showPasswordInput ? (
              <button
                onClick={() => setShowPasswordInput(true)}
                disabled={filteredProducts.length === 0}
                className="bg-amber-600 text-white px-5 py-2.5 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export as PDF
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter PDF password"
                  value={pdfPassword}
                  onChange={e => setPdfPassword(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm w-48 focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={generatePDF}
                  disabled={isGenerating || !pdfPassword.trim()}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                >
                  {isGenerating ? 'Generating...' : 'Generate'}
                </button>
                <button onClick={() => { setShowPasswordInput(false); setPdfPassword(''); }} className="text-gray-500 hover:text-gray-700 px-2">
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-amber-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">#</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Image</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Product ID</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Name & Description</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Metal</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Category</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Price</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Weight</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Height</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Finish</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-500">{index + 1}</td>
                      <td className="p-4">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                      </td>
                      <td className="p-4 font-mono text-xs text-gray-500">{product.id}</td>
                      <td className="p-4">
                        <div className="font-medium text-gray-800">{product.name}</div>
                        <div className="text-xs text-gray-500 mt-1 max-w-xs">{product.description}</div>
                      </td>
                      <td className="p-4 text-gray-600">{product.metal}</td>
                      <td className="p-4 text-gray-600">{product.category}</td>
                      <td className="p-4 font-semibold text-amber-700">₹{product.price.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-gray-600">{product.weightKg} kg</td>
                      <td className="p-4 text-gray-600">{product.heightInch}&quot;</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{product.finishType}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-lg font-medium">No products match your filters</p>
                <p className="mt-1">Try adjusting the filter criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
