'use client';

import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { MetalType, METAL_TYPES } from '@/types';

interface FormData {
  designFile: File | null;
  size: string;
  material: MetalType | '';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string;
}

interface FormErrors {
  size?: string;
  material?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

const initialFormData: FormData = {
  designFile: null,
  size: '',
  material: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  notes: '',
};

export function validateCustomOrderForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.contactName || data.contactName.trim().length < 2) {
    errors.contactName = 'Please enter your name';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.contactEmail || !emailRegex.test(data.contactEmail)) {
    errors.contactEmail = 'Please enter a valid email address';
  }
  const phoneRegex = /^[+]?[\d\s-]{10,}$/;
  if (!data.contactPhone || !phoneRegex.test(data.contactPhone.replace(/\s/g, ''))) {
    errors.contactPhone = 'Please enter a valid phone number';
  }
  if (!data.material) {
    errors.material = 'Please select a material type';
  }
  if (!data.designFile && !data.size.trim()) {
    errors.size = 'Please specify the required size';
  }
  return errors;
}

// Custom Dropdown Component
function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  error 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  options: string[]; 
  placeholder: string;
  error?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-left bg-white border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all ${
          error ? 'border-red-400' : 'border-gray-200 hover:border-amber-300'
        }`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <svg 
          className={`absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white border-2 border-amber-200 rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => { onChange(option); setIsOpen(false); }}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-left hover:bg-amber-50 transition-colors ${
                value === option ? 'bg-amber-100 text-amber-700 font-medium' : 'text-gray-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CustomOrderForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleMaterialChange = (value: string) => {
    setFormData((prev) => ({ ...prev, material: value as MetalType }));
    if (errors.material) {
      setErrors((prev) => ({ ...prev, material: undefined }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, designFile: file }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData((prev) => ({ ...prev, designFile: e.dataTransfer.files[0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCustomOrderForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl p-10 shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-gray-600 text-lg">
              Your custom order request has been submitted successfully. Our team will contact you within 24-48 hours.
            </p>
          </div>
        </div>
      </section>
    );
  }


  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-14">
          <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-200 text-xs md:text-sm font-medium mb-3 md:mb-4">
            Made to Order
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
            Custom <span className="text-amber-400">Orders</span>
          </h2>
          <p className="text-amber-100/80 max-w-2xl mx-auto text-sm md:text-lg px-2">
            Have a specific design in mind? Upload your reference and we&apos;ll craft it with perfection.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Design Upload - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Upload Design Reference
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-4 sm:p-6 lg:p-8 text-center transition-all cursor-pointer ${
                    dragActive ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50/50'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {formData.designFile ? (
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-left min-w-0">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{formData.designFile.name}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{(formData.designFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 font-medium text-sm sm:text-base">Drag & drop your design here</p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">or click to browse (PNG, JPG, PDF)</p>
                    </>
                  )}
                </div>
              </div>


              {/* Size */}
              <div>
                <label htmlFor="size" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Required Size
                </label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="e.g., 12 inches height"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all ${
                    errors.size ? 'border-red-400' : 'border-gray-200 hover:border-amber-300'
                  }`}
                />
                {errors.size && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.size}</p>}
              </div>

              {/* Material - Custom Dropdown */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Material Type *
                </label>
                <CustomSelect
                  value={formData.material}
                  onChange={handleMaterialChange}
                  options={[...METAL_TYPES]}
                  placeholder="Select Material"
                  error={errors.material}
                />
                {errors.material && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.material}</p>}
              </div>

              {/* Contact Name */}
              <div>
                <label htmlFor="contactName" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all ${
                    errors.contactName ? 'border-red-400' : 'border-gray-200 hover:border-amber-300'
                  }`}
                />
                {errors.contactName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.contactName}</p>}
              </div>

              {/* Contact Email */}
              <div>
                <label htmlFor="contactEmail" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all ${
                    errors.contactEmail ? 'border-red-400' : 'border-gray-200 hover:border-amber-300'
                  }`}
                />
                {errors.contactEmail && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.contactEmail}</p>}
              </div>


              {/* Contact Phone */}
              <div>
                <label htmlFor="contactPhone" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all ${
                    errors.contactPhone ? 'border-red-400' : 'border-gray-200 hover:border-amber-300'
                  }`}
                />
                {errors.contactPhone && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.contactPhone}</p>}
              </div>

              {/* Notes - Full Width */}
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe your requirements, special instructions, or any details..."
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-300 transition-all resize-none"
                />
              </div>

              {/* Submit Button - Full Width */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 md:py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold text-base md:text-lg rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg shadow-amber-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Custom Order Request
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Trust Indicators */}
          <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-4 md:gap-6 text-amber-200/80 text-xs md:text-sm">
            <span className="flex items-center gap-1.5 md:gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              100% Secure
            </span>
            <span className="flex items-center gap-1.5 md:gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Response within 24 hrs
            </span>
            <span className="flex items-center gap-1.5 md:gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Free Consultation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
