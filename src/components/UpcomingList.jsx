import CategoryBadge from './CategoryBadge';

/**
 * Upcoming maintenance tab.
 * Shows service records that have a next_recommended_date, sorted by urgency.
 * Items past due are highlighted.
 */
export default function UpcomingList({ records, loading, error, onMarkDone }) {
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

  // Filter records that have a next_recommended_date
  const upcoming = records
    .filter((r) => r.next_recommended_date)
    .sort((a, b) => new Date(a.next_recommended_date) - new Date(b.next_recommended_date));

  if (upcoming.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-xl text-center">
        <p className="text-sm max-w-[260px]" style={{ color: 'var(--color-muted)' }}>
          No upcoming maintenance yet. Log a service to get started.
        </p>
      </div>
    );
  }

  const overdue = [];
  const dueSoon = [];
  const dueLater = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  upcoming.forEach((record) => {
    const dueDate = new Date(record.next_recommended_date);
    dueDate.setHours(0, 0, 0, 0);
    const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) overdue.push({ record, daysUntil });
    else if (daysUntil <= 30) dueSoon.push({ record, daysUntil });
    else dueLater.push({ record, daysUntil });
  });

  return (
    <div className="flex flex-col gap-lg animate-stagger">
      {overdue.length > 0 && (
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-sm" style={{ color: 'var(--color-danger)' }}>
            Overdue
          </h3>
          <div className="flex flex-col gap-sm">
            {overdue.map(({ record, daysUntil }) => (
              <UpcomingRow key={record.id} record={record} daysUntil={daysUntil} isOverdue={true} onMarkDone={onMarkDone} />
            ))}
          </div>
        </section>
      )}

      {dueSoon.length > 0 && (
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-sm" style={{ color: '#E65100' }}>
            Due Soon
          </h3>
          <div className="flex flex-col gap-sm">
            {dueSoon.map(({ record, daysUntil }) => (
              <UpcomingRow key={record.id} record={record} daysUntil={daysUntil} isDueSoon={true} onMarkDone={onMarkDone} />
            ))}
          </div>
        </section>
      )}

      {dueLater.length > 0 && (
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-sm" style={{ color: 'var(--color-muted)' }}>
            Upcoming
          </h3>
          <div className="flex flex-col gap-sm">
            {dueLater.map(({ record, daysUntil }) => (
              <UpcomingRow key={record.id} record={record} daysUntil={daysUntil} onMarkDone={onMarkDone} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function UpcomingRow({ record, daysUntil, isOverdue, isDueSoon, onMarkDone }) {
  const formattedDate = new Date(record.next_recommended_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const urgencyLabel = isOverdue
    ? `${Math.abs(daysUntil)} days overdue`
    : daysUntil === 0
      ? 'Due today'
      : daysUntil <= 30
        ? `Due in ${daysUntil} days`
        : `Due ${formattedDate}`;

  const providerName = record.providers?.name;
  const wasPro = !!providerName;

  return (
    <button
      onClick={() => onMarkDone(record)}
      className="w-full text-left rounded-[16px] p-md transition-shadow duration-200 hover:shadow-sm cursor-pointer block"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: isOverdue
          ? '1.5px solid var(--color-danger)'
          : isDueSoon
            ? '1.5px solid #F59E0B'
            : '1px solid var(--color-border)',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-sm mb-[6px] flex-wrap">
            <CategoryBadge category={record.category} />
            <UrgencyBadge isOverdue={isOverdue} isDueSoon={isDueSoon} label={urgencyLabel} />
            <span
              className="text-[11px] font-semibold px-2 py-[2px] rounded border"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'var(--color-border)',
                color: 'var(--color-muted)',
              }}
            >
              {wasPro ? 'PRO' : 'DIY'}
            </span>
          </div>
          <p className="text-sm font-medium truncate" style={{ color: 'var(--color-primary)' }}>
            {record.description}
          </p>
          <p className="text-[12px] mt-[2px]" style={{ color: 'var(--color-muted)' }}>
            Last done: {new Date(record.date).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
            {wasPro && ` (by ${providerName})`}
          </p>
        </div>

        <div
          className="shrink-0 ml-sm text-[18px] flex items-center justify-center opacity-50"
          style={{ color: 'var(--color-muted)' }}
        >
          →
        </div>
      </div>
    </button>
  );
}

function UrgencyBadge({ isOverdue, isDueSoon, label }) {
  const bg = isOverdue ? '#FCE4EC' : isDueSoon ? '#FFF3E0' : '#F5F5F5';
  const color = isOverdue ? '#880E4F' : isDueSoon ? '#E65100' : '#424242';

  return (
    <span
      className="inline-block px-sm py-[2px] rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  );
}
