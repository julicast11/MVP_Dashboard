import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import KPICard from '../shared/KPICard';
import { useTheme } from '../shared/ThemeContext';
import {
  cashFlowSummary, cashFlowTimeSeries,
  financialKPIs, revenueVsCogs,
  inventoryKPIs, stockAlerts, stockFlow,
} from '../../data/mockData';

const fmtK = (v) => `$${(v / 1000).toFixed(0)}K`;
const fmtM = (v) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : fmtK(v);
const fmtN = (v) => v.toLocaleString();

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-medium text-slate-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.value >= 1000 ? fmtK(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function OverviewDashboard() {
  const { theme } = useTheme();
  const s = cashFlowSummary;
  const k = financialKPIs;
  const ik = inventoryKPIs;
  const last30 = cashFlowTimeSeries.slice(-30);

  return (
    <div className="space-y-6">
      {/* KPIs — one from each domain + a cross-cutting metric */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Net Cash Position" value={s.netCashPosition} prior={s.priorPeriodCash} prefix="$" status="green" />
        <KPICard label="Revenue MTD" value={k.revenueMTD} prior={k.revenuePrior} prefix="$" status="green" />
        <KPICard label="Gross Margin" value={k.grossMargin} prior={k.grossMarginPrior} suffix="%" status="green" />
        <KPICard label="Stock Alerts" value={stockAlerts.filter(a => a.status === 'critical').length} suffix=" critical" status={stockAlerts.some(a => a.status === 'critical') ? 'red' : 'green'} />
      </div>

      {/* Charts row */}
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
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Revenue vs COGS vs Gross Profit</h3>
          <p className="text-xs text-slate-500 mb-4">Monthly, last 6 months</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueVsCogs} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={fmtM} tick={{ fontSize: 10 }} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="revenue" name="Revenue" fill={theme.primary} radius={[3, 3, 0, 0]} />
              <Bar dataKey="cogs" name="COGS" fill={theme.neutral} radius={[3, 3, 0, 0]} />
              <Bar dataKey="grossProfit" name="Gross Profit" fill={theme.positive} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row: stock flow */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Stock Flow: Incoming vs Outgoing</h3>
        <p className="text-xs text-slate-500 mb-4">Weekly unit volume, last 6 weeks</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stockFlow} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={fmtN} tick={{ fontSize: 10 }} width={50} />
            <Tooltip formatter={(v) => `${fmtN(v)} units`} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="incoming" name="Incoming" fill={theme.positive} radius={[3, 3, 0, 0]} />
            <Bar dataKey="outgoing" name="Outgoing" fill={theme.warning} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
