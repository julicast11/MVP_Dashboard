// Realistic seed data for a mid-size commercial manufacturer ($10M–$50M annual revenue)

// ── Cash Flow ──────────────────────────────────────────────

export const cashFlowSummary = {
  netCashPosition: 2_847_500,
  priorPeriodCash: 2_312_000,
  burnRate: 185_000, // monthly
  burnThreshold: 250_000,
  projectedCash30Days: 3_105_000,
};

const buildCashFlowSeries = () => {
  const data = [];
  const now = new Date(2026, 2, 14);
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const base = 280_000 + Math.sin(i * 0.15) * 80_000;
    const inflow = Math.round(base + Math.random() * 40_000);
    const outflow = Math.round(base * 0.82 + Math.random() * 35_000);
    data.push({
      date: d.toISOString().slice(0, 10),
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      inflows: inflow,
      outflows: outflow,
    });
  }
  return data;
};

export const cashFlowTimeSeries = buildCashFlowSeries();

export const arAging = [
  { bucket: "0–30 days", amount: 1_240_000, color: "#22c55e" },
  { bucket: "31–60 days", amount: 685_000, color: "#eab308" },
  { bucket: "61–90 days", amount: 312_000, color: "#f97316" },
  { bucket: "90+ days", amount: 148_000, color: "#ef4444" },
];

export const apSummary = {
  totalPayable: 1_890_000,
  dueSoon: 720_000,    // due within 15 days
  overdue: 135_000,
};

export const cashForecast = (() => {
  const data = [];
  const now = new Date(2026, 2, 14);
  let position = 2_847_500;
  for (let i = 0; i <= 30; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const daily = (Math.random() - 0.42) * 25_000;
    position += daily;
    data.push({
      date: d.toISOString().slice(0, 10),
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      projected: Math.round(position),
    });
  }
  return data;
})();

// ── Financial Reports ──────────────────────────────────────

export const financialKPIs = {
  revenueMTD: 3_420_000,
  revenuePrior: 3_180_000,
  grossMargin: 38.2,
  grossMarginPrior: 36.8,
  ebitda: 485_000,
  ebitdaPrior: 412_000,
  dso: 42,
  dsoPrior: 47,
};

export const revenueVsCogs = [
  { month: "Oct", revenue: 3_100_000, cogs: 1_922_000, grossProfit: 1_178_000 },
  { month: "Nov", revenue: 3_350_000, cogs: 2_077_000, grossProfit: 1_273_000 },
  { month: "Dec", revenue: 2_980_000, cogs: 1_878_540, grossProfit: 1_101_460 },
  { month: "Jan", revenue: 3_210_000, cogs: 2_021_100, grossProfit: 1_188_900 },
  { month: "Feb", revenue: 3_180_000, cogs: 2_010_960, grossProfit: 1_169_040 },
  { month: "Mar", revenue: 3_420_000, cogs: 2_113_560, grossProfit: 1_306_440 },
];

export const operatingExpenses = [
  { category: "Labor", amount: 480_000 },
  { category: "Materials", amount: 320_000 },
  { category: "Facilities", amount: 185_000 },
  { category: "Logistics", amount: 142_000 },
  { category: "Admin & IT", amount: 98_000 },
  { category: "R&D", amount: 65_000 },
];

export const netIncomeTrend = [
  { month: "Oct", value: 310_000 },
  { month: "Nov", value: 365_000 },
  { month: "Dec", value: 248_000 },
  { month: "Jan", value: 335_000 },
  { month: "Feb", value: 352_000 },
  { month: "Mar", value: 485_000 },
];

// ── Inventory ──────────────────────────────────────────────

export const inventoryByCategory = [
  { category: "Raw Steel", units: 12_400, capacity: 15_000, value: 1_860_000 },
  { category: "Aluminum Sheet", units: 8_200, capacity: 10_000, value: 984_000 },
  { category: "Fasteners", units: 45_000, capacity: 50_000, value: 225_000 },
  { category: "Electronics", units: 3_100, capacity: 5_000, value: 620_000 },
  { category: "Packaging", units: 18_500, capacity: 20_000, value: 185_000 },
  { category: "Finished Goods", units: 2_800, capacity: 4_000, value: 2_240_000 },
  { category: "Chemicals", units: 1_200, capacity: 3_000, value: 360_000 },
];

export const inventoryKPIs = {
  turnoverRatio: 5.8,
  turnoverTarget: 6.0,
  turnoverPrior: 5.2,
  daysOnHand: 63,
  daysOnHandPrior: 70,
  totalValue: 6_474_000,
};

export const stockAlerts = [
  { sku: "ELEC-4021", name: "Control Board v3", status: "critical", current: 42, reorder: 200, category: "Electronics" },
  { sku: "CHEM-1105", name: "Epoxy Resin A", status: "critical", current: 85, reorder: 300, category: "Chemicals" },
  { sku: "FAST-2290", name: "M8 Hex Bolt", status: "warning", current: 1_200, reorder: 2_000, category: "Fasteners" },
  { sku: "ALUM-3010", name: "6061-T6 Sheet 4x8", status: "warning", current: 340, reorder: 500, category: "Aluminum Sheet" },
  { sku: "PKG-5500", name: "Crate Liner Foam", status: "warning", current: 890, reorder: 1_200, category: "Packaging" },
  { sku: "FIN-7001", name: "Widget Assembly A", status: "overstock", current: 1_800, reorder: 400, category: "Finished Goods" },
  { sku: "STEEL-1020", name: "CR Steel Coil 16ga", status: "overstock", current: 4_500, reorder: 2_000, category: "Raw Steel" },
];

export const stockFlow = [
  { week: "W6", incoming: 2_400, outgoing: 2_100 },
  { week: "W7", incoming: 1_800, outgoing: 2_300 },
  { week: "W8", incoming: 3_200, outgoing: 2_600 },
  { week: "W9", incoming: 2_100, outgoing: 2_400 },
  { week: "W10", incoming: 2_900, outgoing: 2_200 },
  { week: "W11", incoming: 2_600, outgoing: 2_800 },
];

// ── Alerts / Notifications ─────────────────────────────────

export const activeAlerts = [
  { id: 1, type: "critical", section: "inventory", message: "Control Board v3 stock at 21% of reorder level", time: "12 min ago" },
  { id: 2, type: "critical", section: "inventory", message: "Epoxy Resin A below reorder threshold", time: "1h ago" },
  { id: 3, type: "warning", section: "cashflow", message: "AR 90+ days increased 18% vs last month", time: "3h ago" },
  { id: 4, type: "warning", section: "inventory", message: "Widget Assembly A overstock — 4.5x reorder level", time: "5h ago" },
  { id: 5, type: "info", section: "financial", message: "Gross margin improved +1.4pp MTD vs prior month", time: "Today" },
];
