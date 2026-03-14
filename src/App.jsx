import { useState, useRef } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import CashFlowDashboard from './components/CashFlow/CashFlowDashboard';
import FinancialDashboard from './components/Financial/FinancialDashboard';
import InventoryDashboard from './components/Inventory/InventoryDashboard';
import ComposableDashboard from './components/Composable/ComposableDashboard';
import ExportMenu from './components/shared/ExportMenu';
import ThemeSettings from './components/shared/ThemeSettings';
import { ThemeProvider } from './components/shared/ThemeContext';
import { activeAlerts } from './data/mockData';

const fileNames = {
  mydashboard: 'my-dashboard',
  cashflow: 'cash-flow',
  financial: 'financial-reports',
  inventory: 'inventory-status',
};

export default function App() {
  const [activeView, setActiveView] = useState('mydashboard');
  const [role, setRole] = useState('Executive');
  const [dateRange, setDateRange] = useState('MTD');
  const mainRef = useRef(null);

  const views = {
    mydashboard: <ComposableDashboard />,
    cashflow: <CashFlowDashboard />,
    financial: <FinancialDashboard />,
    inventory: <InventoryDashboard />,
  };

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        <div className="flex-1 flex flex-col min-w-0">
          <Header
            activeView={activeView}
            onViewChange={setActiveView}
            role={role}
            onRoleChange={setRole}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            alerts={activeAlerts}
            exportMenu={<ExportMenu targetRef={mainRef} fileName={fileNames[activeView]} />}
            themeSettings={<ThemeSettings />}
          />

          <main ref={mainRef} className="flex-1 p-4 lg:p-6 overflow-y-auto">
            {views[activeView]}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
