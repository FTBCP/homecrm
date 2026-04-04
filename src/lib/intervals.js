/**
 * Default maintenance intervals by category (in months).
 * Source of truth: db-schema.md
 *
 * Used to calculate next_recommended_date when logging a service:
 *   nextDate = serviceDate + INTERVALS[category] months
 */
export const INTERVALS = {
  HVAC: 3,
  Plumbing: 12,
  Electrical: 12,
  Roofing: 12,
  Appliance: 6,
  Exterior: 12,
  Safety: 6,
  Landscaping: 3,
  'Pest Control': 6,
  General: 12,
};

/**
 * All valid categories, derived from INTERVALS keys.
 * Use this for dropdowns, validation, and badge rendering.
 */
export const CATEGORIES = Object.keys(INTERVALS);

/**
 * Calculate the next recommended service date.
 * @param {string} dateStr - ISO date string of the service (YYYY-MM-DD)
 * @param {string} category - One of the CATEGORIES
 * @returns {string} ISO date string of the next recommended date
 */
export function getNextRecommendedDate(dateStr, category) {
  const months = INTERVALS[category] || 12;
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
}
