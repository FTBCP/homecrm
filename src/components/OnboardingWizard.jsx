import { useState } from 'react';

export default function OnboardingWizard({ onLogSample, defaultMinimized = false }) {
  const [minimized, setMinimized] = useState(defaultMinimized);
  const SAMPLES = [
    {
      label: 'Changed HVAC Air Filters',
      data: { category: 'HVAC', description: 'Changed HVAC air filters', cost: 20 },
    },
    {
      label: 'Turned off outside water for winter',
      data: { category: 'Plumbing', description: 'Turned off outside water for winter', cost: 0 },
    },
    {
      label: 'Replaced smoke detector batteries',
      data: { category: 'Safety', description: 'Replaced smoke detector batteries', cost: 15 },
    },
    {
      label: 'Cleaned the gutters',
      data: { category: 'Exterior', description: 'Cleaned the gutters', cost: 0 },
    },
    {
      label: 'Replaced refrigerator water filter',
      data: { category: 'Appliance', description: 'Replaced refrigerator water filter', cost: 45 },
    },
    {
      label: 'Flushed the water heater',
      data: { category: 'Plumbing', description: 'Flushed the water heater', cost: 0 },
    },
  ];

  if (minimized) {
    return (
      <button 
        onClick={() => setMinimized(false)}
        className="w-full bg-surface border border-stone rounded-2xl p-md flex items-center justify-between
          hover:border-primary hover:shadow-sm transition-all duration-200 cursor-pointer animate-fade-in"
      >
        <span className="text-sm font-semibold text-primary">⭐ Quick Log Templates</span>
        <span className="text-muted text-sm px-xs py-[2px] bg-background rounded-full border border-stone">Expand</span>
      </button>
    );
  }

  return (
    <div className="bg-surface border border-stone rounded-2xl p-lg animate-fade-in shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-heading font-semibold text-primary">Welcome to HomeBase!</h2>
        <button 
          onClick={() => setMinimized(true)}
          className="text-2xl leading-none text-muted hover:text-primary cursor-pointer px-xs transition-colors duration-200"
          aria-label="Minimize"
        >
          ×
        </button>
      </div>
      <p className="text-muted text-sm mb-md">
        Let's get started by logging a few common maintenance items you might have done recently.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
        {SAMPLES.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => onLogSample(sample.data)}
            className="text-left px-md py-sm bg-background border border-stone rounded-[10px] 
              hover:border-primary hover:shadow-sm transition-all duration-200 cursor-pointer"
          >
            <span className="text-sm font-medium text-primary block">{sample.label}</span>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-muted mt-md text-center">
        Or click the + button to log something entirely custom!
      </p>
    </div>
  );
}
