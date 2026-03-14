import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const formatCurrency = (n) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

const formatNumber = (n, prefix = '', suffix = '') => {
  if (prefix === '$') return formatCurrency(n);
  return `${prefix}${n.toLocaleString()}${suffix}`;
};

export default function KPICard({
  label,
  value,
  prior,
  prefix = '',
  suffix = '',
  invertColor = false, // true when lower is better (e.g., DSO, burn rate)
  target,
  status, // override: 'green' | 'yellow' | 'red'
}) {
  const formatted = formatNumber(value, prefix, suffix);
  const delta = prior != null ? ((value - prior) / Math.abs(prior)) * 100 : null;
  const deltaAbs = delta != null ? Math.abs(delta).toFixed(1) : null;

  let trend = 'neutral';
  if (delta > 1) trend = 'up';
  else if (delta < -1) trend = 'down';

  let color = 'text-slate-500';
  if (trend === 'up') color = invertColor ? 'text-red-600' : 'text-emerald-600';
  if (trend === 'down') color = invertColor ? 'text-emerald-600' : 'text-red-600';

  const statusColors = {
    green: 'border-l-emerald-500',
    yellow: 'border-l-amber-500',
    red: 'border-l-red-500',
  };
  const borderClass = status ? statusColors[status] : 'border-l-slate-200';

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 border-l-4 ${borderClass} p-5 flex flex-col gap-1`}>
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
      <span className="text-2xl font-bold text-slate-900">{formatted}</span>
      <div className="flex items-center gap-1.5">
        {trend === 'up' && <TrendingUp className={`w-3.5 h-3.5 ${color}`} />}
        {trend === 'down' && <TrendingDown className={`w-3.5 h-3.5 ${color}`} />}
        {trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
        {delta != null && (
          <span className={`text-xs font-medium ${color}`}>
            {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{deltaAbs}% vs prior
          </span>
        )}
        {target != null && (
          <span className="text-xs text-slate-400 ml-auto">
            Target: {formatNumber(target, prefix, suffix)}
          </span>
        )}
      </div>
    </div>
  );
}
