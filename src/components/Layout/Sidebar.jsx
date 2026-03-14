import { DollarSign, BarChart3, Package, Factory, LayoutDashboard } from 'lucide-react';

const navItems = [
  { id: 'mydashboard', label: 'My Dashboard', icon: LayoutDashboard },
  { id: 'cashflow', label: 'Cash Flow', icon: DollarSign },
  { id: 'financial', label: 'Financial Reports', icon: BarChart3 },
  { id: 'inventory', label: 'Inventory', icon: Package },
];

export default function Sidebar({ activeView, onViewChange }) {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-60 bg-slate-900 text-white min-h-screen shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
          <Factory className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold leading-tight">MFG Insights</h1>
          <p className="text-[11px] text-slate-400">Business Intelligence</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-700">
        <p className="text-[11px] text-slate-500">Last sync: Mar 14, 2026 4:32 PM</p>
      </div>
    </aside>
  );
}
