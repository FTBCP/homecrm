/**
 * Stat card displaying a label and value.
 * Uses Fraunces for the value to match brand display typography.
 */
export default function StatCard({ label, value, highlight = false }) {
  return (
    <div
      className="min-w-[140px] flex-1 rounded-[16px] p-md"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <p
        className="text-[12px] font-medium uppercase tracking-wider"
        style={{ color: 'var(--color-muted)' }}
      >
        {label}
      </p>
      <p
        className="font-display text-[28px] font-bold mt-xs tracking-[-0.02em]"
        style={{ color: highlight ? 'var(--color-danger)' : 'var(--color-primary)' }}
      >
        {value}
      </p>
    </div>
  );
}
