import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTheme } from './ThemeContext';

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
  invertColor = false,
  target,
  status,
}) {
  const { theme } = useTheme();
  const formatted = formatNumber(value, prefix, suffix);
  const delta = prior != null ? ((value - prior) / Math.abs(prior)) * 100 : null;
  const deltaAbs = delta != null ? Math.abs(delta).toFixed(1) : null;

  let trend = 'neutral';
  if (delta > 1) trend = 'up';
  else if (delta < -1) trend = 'down';

  // Use theme colors for trend direction
  let trendColor = theme.neutral;
  if (trend === 'up') trendColor = invertColor ? theme.critical : theme.positive;
  if (trend === 'down') trendColor = invertColor ? theme.positive : theme.critical;

  // Status border color from theme
  const statusColorMap = {
    green: theme.positive,
    yellow: theme.warning,
    red: theme.critical,
  };
  const borderColor = status ? statusColorMap[status] : '#e2e8f0';

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-1"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
      <span className="text-2xl font-bold text-slate-900">{formatted}</span>
      <div className="flex items-center gap-1.5">
        {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" style={{ color: trendColor }} />}
        {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" style={{ color: trendColor }} />}
        {trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
        {delta != null && (
          <span className="text-xs font-medium" style={{ color: trendColor }}>
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
