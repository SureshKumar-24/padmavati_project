/**
 * Allowed Mobile Numbers Configuration
 * 
 * Add mobile numbers (10 digits, without country code) that are authorized
 * to access the product export feature.
 * 
 * Example: '9876543210'
 */
export const ALLOWED_MOBILE_NUMBERS: string[] = [
  // Add your authorized mobile numbers here
  '9876543210',
  '9123456789',
  // '9999999999',
];

/**
 * Check if a mobile number is authorized
 * @param number - 10-digit mobile number
 * @returns boolean
 */
export function isNumberAuthorized(number: string): boolean {
  let cleanNumber = number.replace(/[\s\-+]/g, '');
  // Only remove country code if number is longer than 10 digits
  if (cleanNumber.length > 10 && cleanNumber.startsWith('91')) {
    cleanNumber = cleanNumber.substring(2);
  }
  return ALLOWED_MOBILE_NUMBERS.includes(cleanNumber);
}
