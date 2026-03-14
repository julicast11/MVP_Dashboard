import { useState } from 'react';
import { Palette, RotateCcw, X, Check } from 'lucide-react';
import { useTheme, PRESET_THEMES } from './ThemeContext';

const COLOR_LABELS = {
  primary: 'Primary (main data)',
  secondary: 'Secondary (supporting)',
  positive: 'Positive (on target)',
  warning: 'Warning (at risk)',
  critical: 'Critical (alert)',
  neutral: 'Neutral (inactive)',
};

function ColorSwatch({ color, label, onChange }) {
  return (
    <label className="flex items-center gap-3 group cursor-pointer">
      <div className="relative">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="w-8 h-8 rounded-lg border-2 border-slate-200 group-hover:border-slate-400 transition-colors"
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400 font-mono">{color}</p>
      </div>
    </label>
  );
}

export default function ThemeSettings() {
  const { theme, updateColor, applyPreset, resetTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <Palette className="w-3.5 h-3.5" />
        Colors
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="relative bg-white w-80 h-full shadow-xl border-l border-slate-200 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between z-10">
              <h3 className="text-sm font-semibold text-slate-900">Color Settings</h3>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-slate-100">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Presets */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(PRESET_THEMES).map(([name, preset]) => {
                    const isActive = Object.keys(preset).every(k => theme[k] === preset[k]);
                    return (
                      <button
                        key={name}
                        onClick={() => applyPreset(name)}
                        className={`relative flex items-center gap-2 p-2.5 rounded-lg border text-left transition-colors ${
                          isActive
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex gap-0.5">
                          {[preset.primary, preset.positive, preset.critical].map((c, i) => (
                            <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-slate-700 truncate">{name}</span>
                        {isActive && <Check className="w-3 h-3 text-blue-600 absolute top-1.5 right-1.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom colors */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Custom Colors</h4>
                <div className="space-y-3">
                  {Object.entries(COLOR_LABELS).map(([key, label]) => (
                    <ColorSwatch
                      key={key}
                      color={theme[key]}
                      label={label}
                      onChange={(val) => updateColor(key, val)}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Preview</h4>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.positive }} />
                    <span className="text-xs text-slate-700">Revenue: $3.4M (+12%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.warning }} />
                    <span className="text-xs text-slate-700">Margin: 38.2% (near target)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.critical }} />
                    <span className="text-xs text-slate-700">Stock Alert: 2 critical</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {['primary', 'secondary', 'positive', 'warning', 'critical', 'neutral'].map(k => (
                      <div key={k} className="flex-1 h-6 rounded" style={{ backgroundColor: theme[k] }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={resetTheme}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
