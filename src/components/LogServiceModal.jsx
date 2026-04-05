import { useState } from 'react';
import { CATEGORIES, COMMON_TASKS, getNextRecommendedDate } from '../lib/intervals';

/**
 * Modal form for logging a new service.
 * Max 6 fields per brand.md rule: category, description, cost, date, provider name, notes.
 */
export default function LogServiceModal({ onClose, onSave, providers, prefill, editRecord }) {
  const initialProviderName = editRecord?.providers?.name || prefill?.providerName || '';
  const initialJobType = initialProviderName ? 'pro' : 'diy';

  const [jobType, setJobType] = useState(initialJobType);
  const [form, setForm] = useState({
    category: editRecord?.category || prefill?.category || '',
    description: editRecord?.description || prefill?.description || '',
    cost: editRecord?.cost !== undefined ? String(editRecord.cost) : (initialJobType === 'diy' ? '0' : ''),
    date: editRecord?.date || new Date().toISOString().split('T')[0],
    providerName: initialProviderName,
    notes: editRecord?.notes || '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Track if they want to enter a custom task description
  const [isCustomDesc, setIsCustomDesc] = useState(() => {
    if (!editRecord && !prefill) return false;
    const desc = editRecord?.description || prefill?.description;
    const cat = editRecord?.category || prefill?.category;
    if (cat && desc) {
      const isCommon = COMMON_TASKS[cat]?.some((t) => t.name === desc);
      return !isCommon;
    }
    return false;
  });

  const update = (field, value) => {
    if (field === 'category') {
      setIsCustomDesc(false);
    }

    setForm((prev) => {
      const nextForm = { ...prev, [field]: value };
      
      if (field === 'category') {
        // Reset description and custom flag when category changes
        nextForm.description = '';
      }
      
      // Auto-fill default cost if they select a known common task
      if (field === 'description') {
        const commonTasks = COMMON_TASKS[nextForm.category] || [];
        const matchedTask = commonTasks.find((t) => t.name === value);
        
        // Always overwrite cost if they select a new valid dropdown item
        if (matchedTask) {
          nextForm.cost = String(jobType === 'diy' ? matchedTask.defaultDiyCost : matchedTask.defaultProCost);
        }
      }

      return nextForm;
    });

    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleJobTypeChange = (type) => {
    setJobType(type);
    
    setForm((prev) => {
      let newCost = prev.cost;
      
      // If they switch job type, let's see if we should auto-switch the matched default cost
      if (prev.description) {
        const commonTasks = COMMON_TASKS[prev.category] || [];
        const matchedTask = commonTasks.find((t) => t.name === prev.description);
        if (matchedTask) {
          if (type === 'diy' && prev.cost === String(matchedTask.defaultProCost)) {
            newCost = String(matchedTask.defaultDiyCost);
          } else if (type === 'pro' && prev.cost === String(matchedTask.defaultDiyCost)) {
            newCost = String(matchedTask.defaultProCost);
          }
        }
      }

      return {
        ...prev,
        providerName: type === 'diy' ? '' : prev.providerName,
        cost: newCost === '' && type === 'diy' ? '0' : newCost,
      };
    });
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
        p.name.toLowerCase().includes(form.providerName.toLowerCase()) && 
        p.name.toLowerCase() !== form.providerName.trim().toLowerCase() // hide if exact match
      ).slice(0, 3)
    : [];

  const matchedProvider = form.providerName.trim()
    ? providers.find((p) => p.name.toLowerCase() === form.providerName.trim().toLowerCase())
    : null;

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

        {/* DIY vs PRO Toggle */}
        <div className="flex p-1 rounded-[10px] mb-md" style={{ backgroundColor: '#E8E6E1' }}>
          <button
            type="button"
            onClick={() => handleJobTypeChange('diy')}
            className="flex-1 py-[8px] text-sm font-semibold rounded-[8px] transition-all duration-200 cursor-pointer"
            style={{
              backgroundColor: jobType === 'diy' ? 'var(--color-surface)' : 'transparent',
              color: jobType === 'diy' ? 'var(--color-primary)' : 'var(--color-muted)',
              boxShadow: jobType === 'diy' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            I did it (DIY)
          </button>
          <button
            type="button"
            onClick={() => handleJobTypeChange('pro')}
            className="flex-1 py-[8px] text-sm font-semibold rounded-[8px] transition-all duration-200 cursor-pointer"
            style={{
              backgroundColor: jobType === 'pro' ? 'var(--color-surface)' : 'transparent',
              color: jobType === 'pro' ? 'var(--color-primary)' : 'var(--color-muted)',
              boxShadow: jobType === 'pro' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            Hired a Pro
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
            <div className="flex flex-col gap-sm">
              {form.category && COMMON_TASKS[form.category] && !isCustomDesc ? (
                <select
                  value={form.description}
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM_OTHER') {
                      setIsCustomDesc(true);
                      update('description', '');
                    } else {
                      update('description', e.target.value);
                    }
                  }}
                  className="w-full p-[12px] text-sm rounded-[10px] outline-none cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: errors.description
                      ? '1.5px solid var(--color-danger)'
                      : '1.5px solid var(--color-border)',
                  }}
                >
                  <option value="">Select a common task...</option>
                  {COMMON_TASKS[form.category].map((task) => (
                    <option key={task.name} value={task.name}>
                      {task.name}
                    </option>
                  ))}
                  <option value="CUSTOM_OTHER">Other (Custom task)...</option>
                </select>
              ) : (
                <div className="relative">
                  <input
                    id="field-description"
                    type="text"
                    placeholder="e.g. Replaced air filter"
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    className="w-full p-[12px] pr-[36px] text-sm rounded-[10px] outline-none"
                    style={{
                      border: errors.description
                        ? '1.5px solid var(--color-danger)'
                        : '1.5px solid var(--color-border)',
                    }}
                  />
                  {form.category && COMMON_TASKS[form.category] && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomDesc(false);
                        update('description', '');
                      }}
                      className="absolute right-3 top-[50%] translate-y-[-50%] text-xs font-semibold cursor-pointer"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Back to list
                    </button>
                  )}
                </div>
              )}
            </div>
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

          {/* Provider - Only show if hired a pro */}
          {jobType === 'pro' && (
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
                {!matchedProvider && suggestions.length > 0 && (
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
                {matchedProvider && (
                  <div className="mt-xs p-[10px] rounded-[8px] flex items-center justify-between" style={{ backgroundColor: '#F8F7F4', border: '1px solid var(--color-border)' }}>
                    <div>
                      <p className="text-[12px] font-semibold" style={{ color: 'var(--color-primary)' }}>Saved Contact</p>
                      {(matchedProvider.phone || matchedProvider.email) ? (
                        <div className="flex gap-sm mt-[2px]">
                          {matchedProvider.phone && <span className="text-[11px]" style={{ color: 'var(--color-muted)' }}>📞 {matchedProvider.phone}</span>}
                          {matchedProvider.email && <span className="text-[11px]" style={{ color: 'var(--color-muted)' }}>✉️ {matchedProvider.email}</span>}
                        </div>
                      ) : (
                        <p className="text-[11px]" style={{ color: 'var(--color-muted)' }}>No contact info saved.</p>
                      )}
                    </div>
                    {matchedProvider.rating > 0 && (
                      <span className="text-[12px] font-bold" style={{ color: '#F59E0B' }}>★ {matchedProvider.rating}.0</span>
                    )}
                  </div>
                )}
              </div>
            </Field>
          )}

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
