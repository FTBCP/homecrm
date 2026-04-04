import CategoryBadge from './CategoryBadge';

/**
 * Displays the service history as a list of rows.
 * Each row shows: date, category badge, description, provider, cost.
 */
export default function ServiceHistory({ records, loading, error }) {
  if (loading) {
    return (
      <div className="flex justify-center py-xl">
        <div
          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--color-border)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-center py-xl" style={{ color: 'var(--color-danger)' }}>
        {error}
      </p>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-xl text-center">
        <p className="text-sm max-w-[260px]" style={{ color: 'var(--color-muted)' }}>
          No services logged yet. Tap the button below to log your first one.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-sm">
      {records.map((record) => (
        <ServiceRow key={record.id} record={record} />
      ))}
    </div>
  );
}

function ServiceRow({ record }) {
  const formattedDate = new Date(record.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedCost = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(record.cost);

  const providerName = record.providers?.name || null;

  return (
    <div
      className="rounded-[16px] p-md flex items-start gap-md
        transition-shadow duration-200 hover:shadow-sm"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Left side: info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-sm mb-[6px]">
          <CategoryBadge category={record.category} />
          <span className="text-[12px] font-medium" style={{ color: 'var(--color-muted)' }}>
            {formattedDate}
          </span>
        </div>
        <p className="text-sm font-medium truncate" style={{ color: 'var(--color-primary)' }}>
          {record.description}
        </p>
        {providerName && (
          <p className="text-[12px] mt-[2px]" style={{ color: 'var(--color-muted)' }}>
            {providerName}
          </p>
        )}
      </div>

      {/* Right side: cost */}
      <p
        className="font-display text-[18px] font-semibold whitespace-nowrap"
        style={{ color: 'var(--color-primary)' }}
      >
        {formattedCost}
      </p>
    </div>
  );
}
