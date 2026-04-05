import { useState } from 'react';

/**
 * Provider list with cards showing name, trade, contact info, rating, and job count.
 */
export default function ProviderList({ providers, loading, error, onEdit, serviceRecords }) {
  const [search, setSearch] = useState('');

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

  if (providers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-xl text-center">
        <p className="text-sm max-w-[260px]" style={{ color: 'var(--color-muted)' }}>
          No providers added yet. They&apos;ll appear here as you log services.
        </p>
      </div>
    );
  }

  // Count jobs per provider
  const jobCounts = {};
  serviceRecords.forEach((r) => {
    if (r.provider_id) {
      jobCounts[r.provider_id] = (jobCounts[r.provider_id] || 0) + 1;
    }
  });

  // Filter by search term
  const filtered = search.trim()
    ? providers.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.trade || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.company || '').toLowerCase().includes(search.toLowerCase())
      )
    : providers;

  return (
    <div>
      {/* Search */}
      <div className="mb-md">
        <input
          id="provider-search"
          type="text"
          placeholder="Search providers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-[12px] text-sm rounded-[10px] outline-none"
          style={{ border: '1.5px solid var(--color-border)' }}
        />
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm animate-stagger">
        {filtered.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            jobCount={jobCounts[provider.id] || 0}
            onEdit={onEdit}
          />
        ))}
      </div>

      {filtered.length === 0 && search.trim() && (
        <p className="text-sm text-center py-lg" style={{ color: 'var(--color-muted)' }}>
          No providers match &ldquo;{search}&rdquo;
        </p>
      )}
    </div>
  );
}

function ProviderCard({ provider, jobCount, onEdit }) {
  return (
    <div
      className="rounded-[16px] p-md cursor-pointer
        transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
      onClick={() => onEdit(provider)}
    >
      {/* Top row: name + rating */}
      <div className="flex items-start justify-between mb-xs">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-primary)' }}>
            {provider.name}
          </p>
          {provider.company && (
            <p className="text-[12px] truncate" style={{ color: 'var(--color-muted)' }}>
              {provider.company}
            </p>
          )}
        </div>
        {provider.rating && <StarRating rating={provider.rating} />}
      </div>

      {/* Trade badge */}
      <span
        className="inline-block px-sm py-[3px] rounded-full
          text-[11px] font-semibold uppercase tracking-wider mb-sm"
        style={{ backgroundColor: '#E8E6E1', color: 'var(--color-primary)' }}
      >
        {provider.trade}
      </span>

      {/* Contact info */}
      <div className="flex flex-col gap-[4px] mb-sm">
        {provider.phone && (
          <p className="text-[12px] truncate" style={{ color: 'var(--color-muted)' }}>
            📞 {provider.phone}
          </p>
        )}
        {provider.email && (
          <p className="text-[12px] truncate" style={{ color: 'var(--color-muted)' }}>
            ✉️ {provider.email}
          </p>
        )}
      </div>

      {/* Footer: job count + recommended */}
      <div className="flex items-center justify-between">
        <p className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
          {jobCount} {jobCount === 1 ? 'job' : 'jobs'} logged
        </p>
        {provider.recommended && (
          <span
            className="text-[11px] font-semibold px-sm py-[2px] rounded-full"
            style={{ backgroundColor: '#E8F5E9', color: '#1B5E20' }}
          >
            ★ Recommended
          </span>
        )}
      </div>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <span className="flex gap-[1px] text-[14px] shrink-0" aria-label={`${rating} of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= rating ? '#F59E0B' : '#D1D5DB' }}>
          ★
        </span>
      ))}
    </span>
  );
}
