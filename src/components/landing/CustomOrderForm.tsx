'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/Button';
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

export function CustomOrderForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, designFile: file }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCustomOrderForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-xl p-8 shadow-sm">
            <span className="text-5xl mb-4 block">✅</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-gray-600">
              Your custom order request has been submitted successfully. Our team will contact you
              within 24-48 hours.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
          Custom Orders
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Have a specific design in mind? Upload your reference and we&apos;ll create it for you.
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-xl p-8 shadow-sm">
          <div className="space-y-6">
            {/* Design Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Design (Optional)
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Size */}
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                Required Size
              </label>
              <input
                type="text"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                placeholder="e.g., 12 inches height"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 ${errors.size ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
            </div>

            {/* Material */}
            <div>
              <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-2">
                Material *
              </label>
              <select
                id="material"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 ${errors.material ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Material</option>
                {METAL_TYPES.map((metal) => (
                  <option key={metal} value={metal}>{metal}</option>
                ))}
              </select>
              {errors.material && <p className="text-red-500 text-sm mt-1">{errors.material}</p>}
            </div>

            {/* Contact Name */}
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 ${errors.contactName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
            </div>

            {/* Contact Email */}
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
            </div>

            {/* Contact Phone */}
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 ${errors.contactPhone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Custom Order Request'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
