import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { AlertCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import KPICard from '../shared/KPICard';
import { useTheme } from '../shared/ThemeContext';
import {
  inventoryByCategory, inventoryKPIs, stockAlerts, stockFlow,
} from '../../data/mockData';

const fmtK = (v) => `$${(v / 1000).toFixed(0)}K`;
const fmtN = (v) => v.toLocaleString();

const sortedInventory = [...inventoryByCategory].sort((a, b) => b.value - a.value);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-medium text-slate-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {fmtN(p.value)} units
        </p>
      ))}
    </div>
  );
};

export default function InventoryDashboard() {
  const { theme } = useTheme();
  const k = inventoryKPIs;

  const statusConfig = {
    critical: { label: 'Low Stock', bg: 'bg-red-50', text: 'text-red-700', icon: AlertCircle, dotColor: theme.critical },
    warning: { label: 'Watch', bg: 'bg-amber-50', text: 'text-amber-700', icon: AlertTriangle, dotColor: theme.warning },
    overstock: { label: 'Overstock', bg: 'bg-blue-50', text: 'text-blue-700', icon: TrendingUp, dotColor: theme.primary },
  };

  return (
    <div className="space-y-6">
      {/* Top Row: KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Inventory Value" value={k.totalValue} prefix="$" prior={6_200_000} status="green" />
        <KPICard label="Inventory Turnover" value={k.turnoverRatio} prior={k.turnoverPrior} suffix="x" target={k.turnoverTarget} status={k.turnoverRatio >= k.turnoverTarget ? 'green' : 'yellow'} />
        <KPICard label="Days of Inventory on Hand" value={k.daysOnHand} prior={k.daysOnHandPrior} suffix=" days" invertColor status={k.daysOnHand > 90 ? 'red' : k.daysOnHand > 75 ? 'yellow' : 'green'} />
        <KPICard label="Stock Alerts" value={stockAlerts.filter(a => a.status === 'critical').length} suffix=" critical" status={stockAlerts.some(a => a.status === 'critical') ? 'red' : 'green'} />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Inventory Value by Category</h3>
          <p className="text-xs text-slate-500 mb-4">Sorted by value, higher value categories at top</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sortedInventory} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tickFormatter={fmtK} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={105} />
              <Tooltip formatter={(v) => fmtK(v)} />
              <Bar dataKey="value" name="Value" fill={theme.primary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Stock Flow: Incoming vs Outgoing</h3>
          <p className="text-xs text-slate-500 mb-4">Weekly unit volume, last 6 weeks</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stockFlow} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={fmtN} tick={{ fontSize: 10 }} width={50} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="incoming" name="Incoming" fill={theme.positive} radius={[3, 3, 0, 0]} />
              <Bar dataKey="outgoing" name="Outgoing" fill={theme.warning} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row: Stock Alerts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Stock Alerts: Items Requiring Attention</h3>
          <p className="text-xs text-slate-500 mt-0.5">Low-stock and overstock exceptions only</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-5 py-2.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-5 py-2.5 text-xs font-semibold text-slate-500 uppercase">SKU</th>
                <th className="px-5 py-2.5 text-xs font-semibold text-slate-500 uppercase">Item</th>
                <th className="px-5 py-2.5 text-xs font-semibold text-slate-500 uppercase">Category</th>
                <th className="px-5 py-2.5 text-xs font-semibold text-slate-500 uppercase text-right">Current</th>
                <th className="px-5 py-2.5 text-xs font-semibold text-slate-500 uppercase text-right">Reorder Point</th>
                <th className="px-5 py-2.5 text-xs font-semibold text-slate-500 uppercase text-right">% of Reorder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stockAlerts.map((item) => {
                const cfg = statusConfig[item.status];
                const pct = Math.round((item.current / item.reorder) * 100);
                return (
                  <tr key={item.sku} className={`${cfg.bg} hover:bg-opacity-80`}>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.text}`}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.dotColor }} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-600">{item.sku}</td>
                    <td className="px-5 py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="px-5 py-3 text-slate-600">{item.category}</td>
                    <td className="px-5 py-3 text-right font-medium text-slate-900">{item.current.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-slate-600">{item.reorder.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="font-medium" style={{ color: pct < 50 ? theme.critical : pct < 100 ? theme.warning : theme.primary }}>
                        {pct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
