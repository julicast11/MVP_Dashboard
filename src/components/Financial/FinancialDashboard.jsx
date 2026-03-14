import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import KPICard from '../shared/KPICard';
import { useTheme } from '../shared/ThemeContext';
import {
  financialKPIs, revenueVsCogs, operatingExpenses, netIncomeTrend,
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

const sortedOpex = [...operatingExpenses].sort((a, b) => b.amount - a.amount);

export default function FinancialDashboard() {
  const { theme } = useTheme();
  const k = financialKPIs;

  return (
    <div className="space-y-6">
      {/* Top Row: KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Revenue MTD" value={k.revenueMTD} prior={k.revenuePrior} prefix="$" status="green" />
        <KPICard label="Gross Margin" value={k.grossMargin} prior={k.grossMarginPrior} suffix="%" status="green" />
        <KPICard label="EBITDA" value={k.ebitda} prior={k.ebitdaPrior} prefix="$" status="green" />
        <KPICard label="Days Sales Outstanding" value={k.dso} prior={k.dsoPrior} suffix=" days" invertColor target={45} status={k.dso > 60 ? 'red' : k.dso > 45 ? 'yellow' : 'green'} />
      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Revenue vs COGS vs Gross Profit</h3>
          <p className="text-xs text-slate-500 mb-4">Monthly, last 6 months</p>
          <ResponsiveContainer width="100%" height={260}>
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

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Operating Expenses Breakdown</h3>
          <p className="text-xs text-slate-500 mb-4">Total: {fmtM(operatingExpenses.reduce((s, e) => s + e.amount, 0))}</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={sortedOpex} layout="vertical" barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tickFormatter={fmtK} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={85} />
              <Tooltip formatter={(v) => fmtK(v)} />
              <Bar dataKey="amount" name="Amount" fill={theme.secondary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row: Net Income Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Net Income Trend</h3>
        <p className="text-xs text-slate-500 mb-4">Monthly, tracking profitability trajectory</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={netIncomeTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={fmtK} tick={{ fontSize: 10 }} width={55} />
            <Tooltip formatter={(v) => fmtK(v)} />
            <Line type="monotone" dataKey="value" name="Net Income" stroke={theme.secondary} strokeWidth={2.5} dot={{ r: 4, fill: theme.secondary }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
