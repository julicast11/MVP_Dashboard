import { useState } from 'react';
import { Bell, ChevronDown, Menu, X, DollarSign, BarChart3, Package, LayoutDashboard } from 'lucide-react';
import { AlertCount } from '../shared/AlertBadge';
import AlertBadge from '../shared/AlertBadge';
import egLogo from '../../assets/eg-logo.png';

const roles = ['Executive', 'Operations Manager', 'Finance'];
const dateRanges = ['MTD', 'QTD', 'YTD', 'Custom'];
const mobileNav = [
  { id: 'mydashboard', label: 'My Dashboard', icon: LayoutDashboard },
  { id: 'cashflow', label: 'Cash Flow', icon: DollarSign },
  { id: 'financial', label: 'Financial', icon: BarChart3 },
  { id: 'inventory', label: 'Inventory', icon: Package },
];

export default function Header({
  activeView,
  onViewChange,
  role,
  onRoleChange,
  dateRange,
  onDateRangeChange,
  alerts = [],
  exportMenu,
  themeSettings,
}) {
  const [showAlerts, setShowAlerts] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const titles = {
    mydashboard: 'My Dashboard',
    cashflow: 'Cash Flow Dashboard',
    financial: 'Financial Reports',
    inventory: 'Inventory Status',
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        {/* Logo + title */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-1.5 rounded-md hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <img src={egLogo} alt="Escalate Group" className="w-8 h-8 rounded-md object-cover" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-slate-900 leading-tight">{titles[activeView]}</h2>
            <span className="hidden sm:block text-[10px] text-slate-400 leading-tight">Escalate Group</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Role selector */}
          <div className="hidden sm:flex items-center gap-1.5">
            <label className="text-xs text-slate-500">View:</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => onRoleChange(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 pl-3 pr-7 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Date range */}
          <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5">
            {dateRanges.map(dr => (
              <button
                key={dr}
                onClick={() => onDateRangeChange(dr)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  dateRange === dr
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {dr}
              </button>
            ))}
          </div>

          {/* Theme settings */}
          {themeSettings && <div className="hidden sm:block">{themeSettings}</div>}

          {/* Export */}
          {exportMenu && <div className="hidden sm:block">{exportMenu}</div>}

          {/* Alerts bell */}
          <div className="relative">
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-4.5 h-4.5 text-slate-600" />
              {alerts.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </button>

            {/* Alert dropdown */}
            {showAlerts && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Notifications</span>
                  <AlertCount alerts={alerts} />
                </div>
                <div className="max-h-72 overflow-y-auto p-3 space-y-2">
                  {alerts.map(a => (
                    <AlertBadge key={a.id} type={a.type} message={a.message} time={a.time} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          {mobileNav.map(item => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onViewChange(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
          {/* Mobile role + date */}
          <div className="flex gap-2 pt-2">
            <select
              value={role}
              onChange={(e) => onRoleChange(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 px-3 py-2"
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 px-3 py-2"
            >
              {dateRanges.map(dr => <option key={dr} value={dr}>{dr}</option>)}
            </select>
          </div>
        </div>
      )}
    </header>
  );
}
