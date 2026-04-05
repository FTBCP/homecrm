import { useState } from 'react';
import { CATEGORIES } from '../lib/intervals';
import { getNextRecommendedDate } from '../lib/intervals';

/**
 * Modal form for logging a new service.
 * Max 6 fields per brand.md rule: category, description, cost, date, provider name, notes.
 */
export default function LogServiceModal({ onClose, onSave, providers, prefill, editRecord }) {
  const [form, setForm] = useState({
    category: editRecord?.category || prefill?.category || '',
    description: editRecord?.description || prefill?.description || '',
    cost: editRecord?.cost !== undefined ? String(editRecord.cost) : '',
    date: editRecord?.date || new Date().toISOString().split('T')[0],
    providerName: editRecord?.providers?.name || prefill?.providerName || '',
    notes: editRecord?.notes || '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.category) newErrors.category = 'Pick a category';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.cost || isNaN(form.cost) || parseFloat(form.cost) < 0) {
      newErrors.cost = 'Enter a valid cost';
    }
    if (!form.date) newErrors.date = 'Pick a date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSubmitError('');

    const result = await onSave({
      category: form.category,
      description: form.description.trim(),
      cost: parseFloat(form.cost),
      date: form.date,
      providerName: form.providerName.trim(),
      notes: form.notes.trim() || null,
      next_recommended_date: getNextRecommendedDate(form.date, form.category),
    });

    setSaving(false);

    if (result.success) {
      onClose();
    } else {
      setSubmitError(result.error);
    }
  };

  // Provider name suggestions from existing providers
  const suggestions = form.providerName.length >= 1
    ? providers.filter((p) =>
        p.name.toLowerCase().includes(form.providerName.toLowerCase())
      ).slice(0, 3)
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center modal-overlay animate-overlay"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div
        className="w-full max-w-[480px] max-h-[90vh] overflow-y-auto
          rounded-t-[20px] sm:rounded-[20px] p-lg animate-slide-up"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-lg">
          <h2 className="text-[18px] font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>
            {editRecord ? 'Edit Service' : 'Log a Service'}
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
          {/* Category */}
          <Field label="Category" error={errors.category}>
            <select
              id="field-category"
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full p-[12px] text-sm rounded-[10px] outline-none cursor-pointer"
              style={{
                backgroundColor: form.category ? 'var(--color-surface)' : '#E8E6E1',
                border: errors.category
                  ? '1.5px solid var(--color-danger)'
                  : '1.5px solid var(--color-border)',
                color: form.category ? 'var(--color-primary)' : 'var(--color-muted)',
              }}
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </Field>

          {/* Description */}
          <Field label="What was done?" error={errors.description}>
            <input
              id="field-description"
              type="text"
              placeholder="e.g. Replaced air filter"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="w-full p-[12px] text-sm rounded-[10px] outline-none"
              style={{
                border: errors.description
                  ? '1.5px solid var(--color-danger)'
                  : '1.5px solid var(--color-border)',
              }}
            />
          </Field>

          {/* Cost + Date row */}
          <div className="flex gap-sm">
            <Field label="Cost ($)" error={errors.cost} className="flex-1">
              <input
                id="field-cost"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.cost}
                onChange={(e) => update('cost', e.target.value)}
                className="w-full p-[12px] text-sm rounded-[10px] outline-none"
                style={{
                  border: errors.cost
                    ? '1.5px solid var(--color-danger)'
                    : '1.5px solid var(--color-border)',
                }}
              />
            </Field>

            <Field label="Date" error={errors.date} className="flex-1">
              <input
                id="field-date"
                type="date"
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
                className="w-full p-[12px] text-sm rounded-[10px] outline-none"
                style={{
                  border: errors.date
                    ? '1.5px solid var(--color-danger)'
                    : '1.5px solid var(--color-border)',
                }}
              />
            </Field>
          </div>

          {/* Provider */}
          <Field label="Provider (optional)">
            <div className="relative">
              <input
                id="field-provider"
                type="text"
                placeholder="e.g. John's HVAC"
                value={form.providerName}
                onChange={(e) => update('providerName', e.target.value)}
                className="w-full p-[12px] text-sm rounded-[10px] outline-none"
                style={{ border: '1.5px solid var(--color-border)' }}
              />
              {suggestions.length > 0 && (
                <div
                  className="absolute left-0 right-0 top-full mt-[2px] rounded-[10px] overflow-hidden z-10 shadow-md"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {suggestions.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => update('providerName', p.name)}
                      className="w-full text-left px-[12px] py-[10px] text-sm hover:bg-background cursor-pointer"
                    >
                      {p.name}
                      {p.company && (
                        <span style={{ color: 'var(--color-muted)' }}> — {p.company}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>

          {/* Notes */}
          <Field label="Notes (optional)">
            <textarea
              id="field-notes"
              placeholder="Any extra details..."
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
              className="flex-1 py-[12px] px-lg text-sm font-semibold rounded-[10px] cursor-pointer"
              style={{ color: 'var(--color-muted)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              id="btn-save-service"
              className="flex-1 py-[12px] px-lg text-sm font-semibold rounded-[10px] cursor-pointer
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

/** Reusable form field wrapper with label and error */
function Field({ label, error, className = '', children }) {
  return (
    <div className={className}>
      <label className="block text-[12px] font-medium uppercase tracking-wider mb-[6px]"
        style={{ color: 'var(--color-muted)' }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[12px] mt-[4px]" style={{ color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
