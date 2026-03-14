import { useState } from 'react';
import { Plus, X, GripVertical, LayoutDashboard, Pin } from 'lucide-react';
import KPICard from '../shared/KPICard';
import {
  cashFlowSummary, arAging, apSummary, cashFlowTimeSeries, cashForecast,
  financialKPIs, revenueVsCogs, operatingExpenses, netIncomeTrend,
  inventoryKPIs, inventoryByCategory, stockAlerts, stockFlow,
} from '../../data/mockData';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const fmtK = (v) => `$${(v / 1000).toFixed(0)}K`;
const fmtM = (v) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : fmtK(v);
const fmtN = (v) => v.toLocaleString();

// ── All available tiles a user can pin ──

const AVAILABLE_TILES = [
  // Cash Flow tiles
  { id: 'cf-net-cash', label: 'Net Cash Position', source: 'Cash Flow', size: 'kpi' },
  { id: 'cf-burn-rate', label: 'Burn Rate', source: 'Cash Flow', size: 'kpi' },
  { id: 'cf-ap', label: 'Accounts Payable', source: 'Cash Flow', size: 'kpi' },
  { id: 'cf-forecast-kpi', label: '30-Day Cash Forecast', source: 'Cash Flow', size: 'kpi' },
  { id: 'cf-inflows-outflows', label: 'Cash Inflows vs Outflows', source: 'Cash Flow', size: 'chart' },
  { id: 'cf-ar-aging', label: 'AR Aging Breakdown', source: 'Cash Flow', size: 'chart' },
  { id: 'cf-forecast-line', label: 'Projected Cash Position', source: 'Cash Flow', size: 'chart-wide' },

  // Financial tiles
  { id: 'fin-revenue', label: 'Revenue MTD', source: 'Financial', size: 'kpi' },
  { id: 'fin-margin', label: 'Gross Margin %', source: 'Financial', size: 'kpi' },
  { id: 'fin-ebitda', label: 'EBITDA', source: 'Financial', size: 'kpi' },
  { id: 'fin-dso', label: 'Days Sales Outstanding', source: 'Financial', size: 'kpi' },
  { id: 'fin-rev-cogs', label: 'Revenue vs COGS vs Gross Profit', source: 'Financial', size: 'chart' },
  { id: 'fin-opex', label: 'Operating Expenses', source: 'Financial', size: 'chart' },
  { id: 'fin-net-income', label: 'Net Income Trend', source: 'Financial', size: 'chart-wide' },

  // Inventory tiles
  { id: 'inv-value', label: 'Total Inventory Value', source: 'Inventory', size: 'kpi' },
  { id: 'inv-turnover', label: 'Inventory Turnover', source: 'Inventory', size: 'kpi' },
  { id: 'inv-days', label: 'Days on Hand', source: 'Inventory', size: 'kpi' },
  { id: 'inv-alerts-count', label: 'Stock Alerts', source: 'Inventory', size: 'kpi' },
  { id: 'inv-by-category', label: 'Inventory by Category', source: 'Inventory', size: 'chart' },
  { id: 'inv-stock-flow', label: 'Stock Flow In vs Out', source: 'Inventory', size: 'chart' },
  { id: 'inv-alerts-table', label: 'Stock Alerts Table', source: 'Inventory', size: 'chart-wide' },
];

const DEFAULT_PINNED = [
  'cf-net-cash', 'fin-revenue', 'fin-margin', 'inv-alerts-count',
  'cf-inflows-outflows', 'fin-rev-cogs',
];

// ── Tile renderers ──

function renderTile(id) {
  const s = cashFlowSummary;
  const k = financialKPIs;
  const ik = inventoryKPIs;
  const last30 = cashFlowTimeSeries.slice(-30);
  const sortedOpex = [...operatingExpenses].sort((a, b) => b.amount - a.amount);
  const sortedInventory = [...inventoryByCategory].sort((a, b) => b.value - a.value);

  switch (id) {
    // ── Cash Flow KPIs ──
    case 'cf-net-cash':
      return <KPICard label="Net Cash Position" value={s.netCashPosition} prior={s.priorPeriodCash} prefix="$" status="green" />;
    case 'cf-burn-rate':
      return <KPICard label="Monthly Burn Rate" value={s.burnRate} prior={210000} prefix="$" invertColor target={s.burnThreshold} status={s.burnRate > s.burnThreshold ? 'red' : 'green'} />;
    case 'cf-ap':
      return <KPICard label="Accounts Payable" value={apSummary.totalPayable} prior={1750000} prefix="$" invertColor status={apSummary.overdue > 200000 ? 'red' : 'green'} />;
    case 'cf-forecast-kpi':
      return <KPICard label="30-Day Cash Forecast" value={s.projectedCash30Days} prior={s.netCashPosition} prefix="$" status="green" />;

    // ── Cash Flow Charts ──
    case 'cf-inflows-outflows':
      return (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={last30}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={4} />
            <YAxis tickFormatter={fmtK} tick={{ fontSize: 10 }} width={55} />
            <Tooltip formatter={(v) => fmtK(v)} />
            <Area type="monotone" dataKey="inflows" name="Inflows" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="outflows" name="Outflows" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 3" />
          </AreaChart>
        </ResponsiveContainer>
      );
    case 'cf-ar-aging':
      return (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={arAging} layout="vertical" barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tickFormatter={fmtK} tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="bucket" tick={{ fontSize: 11 }} width={90} />
            <Tooltip formatter={(v) => fmtK(v)} />
            <Bar dataKey="amount" name="Amount" radius={[0, 4, 4, 0]}>
              {arAging.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    case 'cf-forecast-line':
      return (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={cashForecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={4} />
            <YAxis tickFormatter={fmtM} tick={{ fontSize: 10 }} width={55} />
            <Tooltip formatter={(v) => fmtM(v)} />
            <ReferenceLine y={2500000} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Min Target', fontSize: 10, fill: '#ef4444' }} />
            <Line type="monotone" dataKey="projected" name="Projected Cash" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      );

    // ── Financial KPIs ──
    case 'fin-revenue':
      return <KPICard label="Revenue MTD" value={k.revenueMTD} prior={k.revenuePrior} prefix="$" status="green" />;
    case 'fin-margin':
      return <KPICard label="Gross Margin" value={k.grossMargin} prior={k.grossMarginPrior} suffix="%" status="green" />;
    case 'fin-ebitda':
      return <KPICard label="EBITDA" value={k.ebitda} prior={k.ebitdaPrior} prefix="$" status="green" />;
    case 'fin-dso':
      return <KPICard label="Days Sales Outstanding" value={k.dso} prior={k.dsoPrior} suffix=" days" invertColor target={45} status={k.dso > 60 ? 'red' : k.dso > 45 ? 'yellow' : 'green'} />;

    // ── Financial Charts ──
    case 'fin-rev-cogs':
      return (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={revenueVsCogs} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={fmtM} tick={{ fontSize: 10 }} width={55} />
            <Tooltip formatter={(v) => fmtK(v)} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="cogs" name="COGS" fill="#94a3b8" radius={[3, 3, 0, 0]} />
            <Bar dataKey="grossProfit" name="Gross Profit" fill="#22c55e" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'fin-opex':
      return (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sortedOpex} layout="vertical" barSize={22}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tickFormatter={fmtK} tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={85} />
            <Tooltip formatter={(v) => fmtK(v)} />
            <Bar dataKey="amount" name="Amount" fill="#6366f1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'fin-net-income':
      return (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={netIncomeTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={fmtK} tick={{ fontSize: 10 }} width={55} />
            <Tooltip formatter={(v) => fmtK(v)} />
            <Line type="monotone" dataKey="value" name="Net Income" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6' }} />
          </LineChart>
        </ResponsiveContainer>
      );

    // ── Inventory KPIs ──
    case 'inv-value':
      return <KPICard label="Total Inventory Value" value={ik.totalValue} prefix="$" prior={6200000} status="green" />;
    case 'inv-turnover':
      return <KPICard label="Inventory Turnover" value={ik.turnoverRatio} prior={ik.turnoverPrior} suffix="x" target={ik.turnoverTarget} status={ik.turnoverRatio >= ik.turnoverTarget ? 'green' : 'yellow'} />;
    case 'inv-days':
      return <KPICard label="Days on Hand" value={ik.daysOnHand} prior={ik.daysOnHandPrior} suffix=" days" invertColor status={ik.daysOnHand > 90 ? 'red' : ik.daysOnHand > 75 ? 'yellow' : 'green'} />;
    case 'inv-alerts-count':
      return <KPICard label="Stock Alerts" value={stockAlerts.filter(a => a.status === 'critical').length} suffix=" critical" status={stockAlerts.some(a => a.status === 'critical') ? 'red' : 'green'} />;

    // ── Inventory Charts ──
    case 'inv-by-category':
      return (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sortedInventory} layout="vertical" barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tickFormatter={fmtK} tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={105} />
            <Tooltip formatter={(v) => fmtK(v)} />
            <Bar dataKey="value" name="Value" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'inv-stock-flow':
      return (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={stockFlow} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={fmtN} tick={{ fontSize: 10 }} width={50} />
            <Tooltip formatter={(v) => `${fmtN(v)} units`} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="incoming" name="Incoming" fill="#22c55e" radius={[3, 3, 0, 0]} />
            <Bar dataKey="outgoing" name="Outgoing" fill="#f97316" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'inv-alerts-table':
      return (
        <div className="overflow-x-auto text-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">SKU</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Item</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase text-right">Current</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase text-right">Reorder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stockAlerts.map(item => {
                const colors = { critical: 'text-red-600', warning: 'text-amber-600', overstock: 'text-blue-600' };
                const dots = { critical: 'bg-red-500', warning: 'bg-amber-500', overstock: 'bg-blue-500' };
                return (
                  <tr key={item.sku} className="hover:bg-slate-50">
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${colors[item.status]}`}>
                        <span className={`w-2 h-2 rounded-full ${dots[item.status]}`} />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-slate-600">{item.sku}</td>
                    <td className="px-3 py-2 font-medium text-slate-900">{item.name}</td>
                    <td className="px-3 py-2 text-right text-slate-900">{item.current.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right text-slate-600">{item.reorder.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );

    default:
      return <p className="text-sm text-slate-400">Unknown tile</p>;
  }
}

// ── Source badge colors ──
const sourceColors = {
  'Cash Flow': 'bg-emerald-100 text-emerald-700',
  'Financial': 'bg-blue-100 text-blue-700',
  'Inventory': 'bg-orange-100 text-orange-700',
};

export default function ComposableDashboard() {
  const [pinnedIds, setPinnedIds] = useState(DEFAULT_PINNED);
  const [showPicker, setShowPicker] = useState(false);
  const [filterSource, setFilterSource] = useState('All');

  const pinned = pinnedIds.map(id => AVAILABLE_TILES.find(t => t.id === id)).filter(Boolean);
  const unpinned = AVAILABLE_TILES.filter(t => !pinnedIds.includes(t.id));
  const filteredUnpinned = filterSource === 'All' ? unpinned : unpinned.filter(t => t.source === filterSource);

  const addTile = (id) => setPinnedIds(prev => [...prev, id]);
  const removeTile = (id) => setPinnedIds(prev => prev.filter(x => x !== id));

  const moveTile = (index, direction) => {
    const newIds = [...pinnedIds];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newIds.length) return;
    [newIds[index], newIds[targetIndex]] = [newIds[targetIndex], newIds[index]];
    setPinnedIds(newIds);
  };

  // Separate KPIs from charts for layout
  const kpiTiles = pinned.filter(t => t.size === 'kpi');
  const chartTiles = pinned.filter(t => t.size === 'chart');
  const wideTiles = pinned.filter(t => t.size === 'chart-wide');

  return (
    <div className="space-y-6">
      {/* ── Header with pin button ── */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Your Custom Dashboard</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {pinned.length} tile{pinned.length !== 1 ? 's' : ''} pinned from {new Set(pinned.map(t => t.source)).size} source{new Set(pinned.map(t => t.source)).size !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showPicker
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {showPicker ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showPicker ? 'Close' : 'Pin Tiles'}
        </button>
      </div>

      {/* ── Tile Picker ── */}
      {showPicker && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-900">Available Tiles</h4>
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
              {['All', 'Cash Flow', 'Financial', 'Inventory'].map(src => (
                <button
                  key={src}
                  onClick={() => setFilterSource(src)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    filterSource === src ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {src}
                </button>
              ))}
            </div>
          </div>
          {filteredUnpinned.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">All tiles from this source are pinned</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredUnpinned.map(tile => (
                <button
                  key={tile.id}
                  onClick={() => addTile(tile.id)}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{tile.label}</p>
                    <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${sourceColors[tile.source]}`}>
                      {tile.source}
                    </span>
                  </div>
                  <Pin className="w-4 h-4 text-slate-300 group-hover:text-blue-500 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Pinned KPI Row ── */}
      {kpiTiles.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiTiles.map(tile => (
            <div key={tile.id} className="relative group">
              {renderTile(tile.id)}
              {/* Source badge */}
              <span className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity ${sourceColors[tile.source]}`}>
                {tile.source}
              </span>
              {/* Remove button */}
              <button
                onClick={() => removeTile(tile.id)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Pinned Charts (half-width) ── */}
      {chartTiles.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {chartTiles.map(tile => (
            <div key={tile.id} className="relative group bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">{tile.label}</h3>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${sourceColors[tile.source]}`}>
                    {tile.source}
                  </span>
                  <button
                    onClick={() => removeTile(tile.id)}
                    className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
              {renderTile(tile.id)}
            </div>
          ))}
        </div>
      )}

      {/* ── Pinned Wide Charts ── */}
      {wideTiles.map(tile => (
        <div key={tile.id} className="relative group bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">{tile.label}</h3>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${sourceColors[tile.source]}`}>
                {tile.source}
              </span>
              <button
                onClick={() => removeTile(tile.id)}
                className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          {renderTile(tile.id)}
        </div>
      ))}

      {/* ── Empty state ── */}
      {pinned.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-dashed border-slate-300 p-12 text-center">
          <LayoutDashboard className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No tiles pinned yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Click "Pin Tiles" to add KPIs and charts from any data source</p>
          <button
            onClick={() => setShowPicker(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Pin Your First Tile
          </button>
        </div>
      )}
    </div>
  );
}
