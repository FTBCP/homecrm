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
 * Common tasks for each category to pre-populate dropdowns.
 * Each task has a default cost for DIY and Pro to help speed up logging.
 */
export const COMMON_TASKS = {
  HVAC: [
    { name: 'Replace air filter', defaultDiyCost: 20, defaultProCost: 100 },
    { name: 'Inspect/Clean coils', defaultDiyCost: 0, defaultProCost: 150 },
    { name: 'A/C tune-up', defaultDiyCost: 0, defaultProCost: 200 }
  ],
  Plumbing: [
    { name: 'Fix leak', defaultDiyCost: 20, defaultProCost: 150 },
    { name: 'Clear drain', defaultDiyCost: 10, defaultProCost: 120 },
    { name: 'Flush water heater', defaultDiyCost: 0, defaultProCost: 200 }
  ],
  Electrical: [
    { name: 'Replace outlet/switch', defaultDiyCost: 15, defaultProCost: 120 },
    { name: 'Check breaker panel', defaultDiyCost: 0, defaultProCost: 150 }
  ],
  Roofing: [
    { name: 'Clean gutters', defaultDiyCost: 0, defaultProCost: 150 },
    { name: 'Patch leak', defaultDiyCost: 50, defaultProCost: 300 }
  ],
  Appliance: [
    { name: 'Clean dryer vent', defaultDiyCost: 15, defaultProCost: 100 },
    { name: 'Refrigerator coil clean', defaultDiyCost: 5, defaultProCost: 100 }
  ],
  Exterior: [
    { name: 'Power wash', defaultDiyCost: 40, defaultProCost: 250 },
    { name: 'Paint touch-up', defaultDiyCost: 30, defaultProCost: 200 },
    { name: 'Deck/Patio seal', defaultDiyCost: 100, defaultProCost: 400 }
  ],
  Safety: [
    { name: 'Test smoke/CO detectors', defaultDiyCost: 0, defaultProCost: 50 },
    { name: 'Replace detector batteries', defaultDiyCost: 15, defaultProCost: 60 }
  ],
  Landscaping: [
    { name: 'Mowing/Edging', defaultDiyCost: 10, defaultProCost: 60 },
    { name: 'Prune trees/shrubs', defaultDiyCost: 0, defaultProCost: 100 },
    { name: 'Mulch beds', defaultDiyCost: 50, defaultProCost: 200 }
  ],
  'Pest Control': [
    { name: 'Ext. spray/barrier', defaultDiyCost: 30, defaultProCost: 100 },
    { name: 'Termite inspection', defaultDiyCost: 0, defaultProCost: 80 }
  ],
  General: [
    { name: 'Deep clean', defaultDiyCost: 20, defaultProCost: 200 },
    { name: 'Replace light bulbs', defaultDiyCost: 15, defaultProCost: 50 }
  ]
};

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
