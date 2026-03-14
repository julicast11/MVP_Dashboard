import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import KPICard from '../shared/KPICard';
import { useTheme } from '../shared/ThemeContext';
import {
  cashFlowSummary, cashFlowTimeSeries, arAging, apSummary, cashForecast,
} from '../../data/mockData';

const fmtK = (v) => `$${(v / 1000).toFixed(0)}K`;
const fmtM = (v) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : fmtK(v);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-medium text-slate-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {fmtK(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function CashFlowDashboard() {
  const { theme } = useTheme();
  const s = cashFlowSummary;
  const last30 = cashFlowTimeSeries.slice(-30);

  // AR aging uses theme-aware colors
  const arColors = [theme.positive, theme.warning, '#f97316', theme.critical];

  return (
    <div className="space-y-6">
      {/* Top Row: KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Net Cash Position" value={s.netCashPosition} prior={s.priorPeriodCash} prefix="$" status="green" />
        <KPICard label="Monthly Burn Rate" value={s.burnRate} prior={210_000} prefix="$" invertColor target={s.burnThreshold} status={s.burnRate > s.burnThreshold ? 'red' : s.burnRate > s.burnThreshold * 0.8 ? 'yellow' : 'green'} />
        <KPICard label="Accounts Payable" value={apSummary.totalPayable} prior={1_750_000} prefix="$" invertColor status={apSummary.overdue > 200_000 ? 'red' : apSummary.overdue > 100_000 ? 'yellow' : 'green'} />
        <KPICard label="30-Day Cash Forecast" value={s.projectedCash30Days} prior={s.netCashPosition} prefix="$" status="green" />
      </div>

      {/* Middle Row: Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Cash Inflows vs Outflows</h3>
          <p className="text-xs text-slate-500 mb-4">Last 30 days, daily totals</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={last30}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={4} />
              <YAxis tickFormatter={fmtK} tick={{ fontSize: 10 }} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="inflows" name="Inflows" stroke={theme.positive} fill={theme.positive} fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="outflows" name="Outflows" stroke={theme.critical} fill={theme.critical} fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Accounts Receivable Aging</h3>
          <p className="text-xs text-slate-500 mb-4">Total AR: {fmtM(arAging.reduce((s, a) => s + a.amount, 0))}</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={arAging} layout="vertical" barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tickFormatter={fmtK} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="bucket" tick={{ fontSize: 11 }} width={90} />
              <Tooltip formatter={(v) => fmtK(v)} />
              <Bar dataKey="amount" name="Amount" radius={[0, 4, 4, 0]}>
                {arAging.map((_, i) => (
                  <Cell key={i} fill={arColors[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row: Forecast */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Projected Cash Position, Next 30 Days</h3>
        <p className="text-xs text-slate-500 mb-4">Based on current inflow/outflow trends and scheduled payments</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={cashForecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={4} />
            <YAxis tickFormatter={fmtM} tick={{ fontSize: 10 }} width={55} />
            <Tooltip formatter={(v) => fmtM(v)} />
            <ReferenceLine y={2_500_000} stroke={theme.critical} strokeDasharray="5 5" label={{ value: 'Min Target', fontSize: 10, fill: theme.critical }} />
            <Line type="monotone" dataKey="projected" name="Projected Cash" stroke={theme.primary} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
