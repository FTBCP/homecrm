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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="flex flex-col gap-sm animate-stagger">
      {upcoming.map((record) => {
        const dueDate = new Date(record.next_recommended_date);
        dueDate.setHours(0, 0, 0, 0);
        const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        const isOverdue = daysUntil < 0;
        const isDueSoon = daysUntil >= 0 && daysUntil <= 30;

        return (
          <UpcomingRow
            key={record.id}
            record={record}
            daysUntil={daysUntil}
            isOverdue={isOverdue}
            isDueSoon={isDueSoon}
            onMarkDone={onMarkDone}
          />
        );
      })}
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

  return (
    <div
      className="rounded-[16px] p-md transition-shadow duration-200 hover:shadow-sm"
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
        {/* Left: info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-sm mb-[6px]">
            <CategoryBadge category={record.category} />
            <UrgencyBadge isOverdue={isOverdue} isDueSoon={isDueSoon} label={urgencyLabel} />
          </div>
          <p className="text-sm font-medium truncate" style={{ color: 'var(--color-primary)' }}>
            {record.description}
          </p>
          <p className="text-[12px] mt-[2px]" style={{ color: 'var(--color-muted)' }}>
            Last done: {new Date(record.date).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </p>
        </div>

        {/* Right: mark done button */}
        <button
          onClick={() => onMarkDone(record)}
          className="shrink-0 ml-sm px-sm py-[6px] text-[12px] font-semibold rounded-[8px]
            cursor-pointer transition-colors duration-200"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
          }}
        >
          Log Again
        </button>
      </div>
    </div>
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
