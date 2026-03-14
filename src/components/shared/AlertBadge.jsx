import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

const config = {
  critical: { icon: AlertCircle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-600' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-500' },
  info: { icon: Info, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-500' },
};

export default function AlertBadge({ type = 'info', message, time }) {
  const c = config[type] || config.info;
  const Icon = c.icon;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${c.bg} ${c.border}`}>
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${c.text}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${c.text}`}>{message}</p>
        {time && <p className="text-xs text-slate-500 mt-0.5">{time}</p>}
      </div>
    </div>
  );
}

export function AlertCount({ alerts }) {
  const critical = alerts.filter(a => a.type === 'critical').length;
  const warning = alerts.filter(a => a.type === 'warning').length;

  if (critical === 0 && warning === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {critical > 0 && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
          <AlertCircle className="w-3 h-3" /> {critical}
        </span>
      )}
      {warning > 0 && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
          <AlertTriangle className="w-3 h-3" /> {warning}
        </span>
      )}
    </div>
  );
}
