import { useState } from 'react';
import { CATEGORIES } from '../lib/intervals';

/**
 * Modal for editing an existing provider's details.
 * Fields: name, company, trade, phone, email, rating, recommended, notes.
 */
export default function EditProviderModal({ provider, onClose, onSave }) {
  const [form, setForm] = useState({
    name: provider.name || '',
    company: provider.company || '',
    trade: provider.trade || '',
    phone: provider.phone || '',
    email: provider.email || '',
    rating: provider.rating || 0,
    recommended: provider.recommended || false,
    notes: provider.notes || '',
  });
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.trade) return;

    setSaving(true);
    setSubmitError('');

    const result = await onSave(provider.id, {
      name: form.name.trim(),
      company: form.company.trim() || null,
      trade: form.trade,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      rating: form.rating || null,
      recommended: form.recommended,
      notes: form.notes.trim() || null,
    });

    setSaving(false);

    if (result.success) {
      onClose();
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div
        className="w-full max-w-[480px] max-h-[90vh] overflow-y-auto
          rounded-t-[20px] sm:rounded-[20px] p-lg"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-lg">
          <h2 className="text-[18px] font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>
            Edit Provider
          </h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none cursor-pointer px-xs"
            style={{ color: 'var(--color-muted)' }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          {/* Name */}
          <Field label="Name">
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full p-[12px] text-sm rounded-[10px] outline-none"
              style={{ border: '1.5px solid var(--color-border)' }}
            />
          </Field>

          {/* Company */}
          <Field label="Company (optional)">
            <input
              type="text"
              placeholder="e.g. ABC Plumbing Co."
              value={form.company}
              onChange={(e) => update('company', e.target.value)}
              className="w-full p-[12px] text-sm rounded-[10px] outline-none"
              style={{ border: '1.5px solid var(--color-border)' }}
            />
          </Field>

          {/* Trade */}
          <Field label="Trade">
            <select
              value={form.trade}
              onChange={(e) => update('trade', e.target.value)}
              className="w-full p-[12px] text-sm rounded-[10px] outline-none cursor-pointer"
              style={{ border: '1.5px solid var(--color-border)' }}
            >
              <option value="">Select trade...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </Field>

          {/* Phone + Email row */}
          <div className="flex gap-sm">
            <Field label="Phone" className="flex-1">
              <input
                type="tel"
                placeholder="555-123-4567"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full p-[12px] text-sm rounded-[10px] outline-none"
                style={{ border: '1.5px solid var(--color-border)' }}
              />
            </Field>
            <Field label="Email" className="flex-1">
              <input
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full p-[12px] text-sm rounded-[10px] outline-none"
                style={{ border: '1.5px solid var(--color-border)' }}
              />
            </Field>
          </div>

          {/* Rating */}
          <Field label="Rating">
            <div className="flex gap-xs">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => update('rating', form.rating === i ? 0 : i)}
                  className="text-[24px] cursor-pointer transition-transform hover:scale-110"
                  style={{ color: i <= form.rating ? '#F59E0B' : '#D1D5DB' }}
                  aria-label={`${i} star`}
                >
                  ★
                </button>
              ))}
            </div>
          </Field>

          {/* Recommended toggle */}
          <label className="flex items-center gap-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.recommended}
              onChange={(e) => update('recommended', e.target.checked)}
              className="w-[18px] h-[18px] cursor-pointer"
            />
            <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
              Recommended
            </span>
          </label>

          {/* Notes */}
          <Field label="Notes (optional)">
            <textarea
              placeholder="Any notes about this provider..."
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={2}
              className="w-full p-[12px] text-sm rounded-[10px] outline-none resize-none"
              style={{ border: '1.5px solid var(--color-border)' }}
            />
          </Field>

          {/* Submit Error */}
          {submitError && (
            <p className="text-sm" style={{ color: 'var(--color-danger)' }}>
              {submitError}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-sm mt-sm">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-[12px] text-sm font-semibold rounded-[10px] cursor-pointer"
              style={{ color: 'var(--color-muted)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-[12px] text-sm font-semibold rounded-[10px] cursor-pointer
                transition-colors duration-200"
              style={{
                backgroundColor: saving ? '#333333' : 'var(--color-primary)',
                color: '#FFFFFF',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, className = '', children }) {
  return (
    <div className={className}>
      <label className="block text-[12px] font-medium uppercase tracking-wider mb-[6px]"
        style={{ color: 'var(--color-muted)' }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
