import { BADGE_COLORS } from './CategoryBadge';

export default function SpendingChart({ records }) {
  // Aggregate spending by category
  const categoryTotals = records.reduce((acc, record) => {
    const cost = parseFloat(record.cost) || 0;
    if (cost > 0) {
      if (!acc[record.category]) acc[record.category] = 0;
      acc[record.category] += cost;
    }
    return acc;
  }, {});

  const categories = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a]);

  if (categories.length === 0) {
    return (
      <div className="bg-surface border border-stone rounded-2xl p-lg text-center animate-fade-in shadow-sm">
        <p className="text-muted text-sm font-medium">No spending data yet.</p>
      </div>
    );
  }

  const maxTotal = Math.max(...Object.values(categoryTotals));

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="bg-surface border border-stone rounded-2xl p-lg animate-fade-in shadow-sm">
      <h2 className="text-heading font-semibold text-primary mb-md">Spending by Category</h2>
      <div className="space-y-4">
        {categories.map((cat) => {
          const total = categoryTotals[cat];
          const colors = BADGE_COLORS[cat] || BADGE_COLORS.General;
          const percent = ((total / maxTotal) * 100).toFixed(1);

          return (
            <div key={cat} className="space-y-1">
              <div className="flex justify-between items-end text-sm">
                <span className="font-medium text-primary">{cat}</span>
                <span className="text-muted font-medium">{formatCurrency(total)}</span>
              </div>
              <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-2.5 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${percent}%`, backgroundColor: colors.text }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
