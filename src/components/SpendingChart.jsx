import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function SpendingChart({ records }) {
  const data = useMemo(() => {
    const monthlyData = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'short' });
      monthlyData[label] = 0;
    }

    records.forEach((record) => {
      const cost = parseFloat(record.cost) || 0;
      if (cost <= 0) return;
      
      const recordDate = new Date(record.date);
      // Ensure the record falls within the last 6 months
      const diffMonths = (now.getFullYear() - recordDate.getFullYear()) * 12 + now.getMonth() - recordDate.getMonth();
      if (diffMonths >= 0 && diffMonths <= 5) {
        const label = recordDate.toLocaleString('default', { month: 'short' });
        if (monthlyData[label] !== undefined) {
          monthlyData[label] += cost;
        }
      }
    });

    return Object.keys(monthlyData).map(month => ({
      name: month,
      total: monthlyData[month]
    }));
  }, [records]);

  const hasData = data.some(d => d.total > 0);

  if (!hasData) {
    return (
      <div className="bg-surface border border-stone rounded-2xl p-lg text-center animate-fade-in shadow-sm w-full">
        <p className="text-muted text-sm font-medium">No spending data yet for the past 6 months.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-stone p-sm rounded-[10px] shadow-sm">
          <p className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
            {payload[0].payload.name}
          </p>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            Total: ${payload[0].value.toFixed(0)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface border border-stone rounded-2xl p-lg animate-fade-in shadow-sm w-full">
      <h2 className="text-heading font-semibold text-primary mb-md">Spending (Last 6 Months)</h2>
      <div className="h-[200px] w-full mt-sm">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'var(--color-muted)' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'var(--color-muted)' }} 
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-background)' }} />
            <Bar 
              dataKey="total" 
              fill="var(--color-primary)" 
              radius={[4, 4, 0, 0]} 
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
