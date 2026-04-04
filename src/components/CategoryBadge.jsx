/**
 * Category badge colors — matches brand.md exactly.
 * Each category gets a consistent background + text color pair.
 */
const BADGE_COLORS = {
  HVAC:           { bg: '#FFF3E0', text: '#E65100' },
  Plumbing:       { bg: '#E3F2FD', text: '#0D47A1' },
  Electrical:     { bg: '#FFF9C4', text: '#F57F17' },
  Roofing:        { bg: '#F3E5F5', text: '#6A1B9A' },
  Appliance:      { bg: '#E8F5E9', text: '#1B5E20' },
  Exterior:       { bg: '#EFEBE9', text: '#4E342E' },
  Safety:         { bg: '#FCE4EC', text: '#880E4F' },
  Landscaping:    { bg: '#E0F2F1', text: '#004D40' },
  'Pest Control': { bg: '#FBE9E7', text: '#BF360C' },
  General:        { bg: '#F5F5F5', text: '#424242' },
};

/**
 * Rendered as a small pill badge showing the service category.
 * Colors are fixed per brand.md — never change them.
 */
export default function CategoryBadge({ category }) {
  const colors = BADGE_COLORS[category] || BADGE_COLORS.General;

  return (
    <span
      className="inline-block px-sm py-[3px] rounded-full
        text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {category}
    </span>
  );
}
