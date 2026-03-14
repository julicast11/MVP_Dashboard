import { createContext, useContext, useState } from 'react';

const DEFAULT_THEME = {
  primary: '#3b82f6',     // blue - main data series, active states
  secondary: '#8b5cf6',   // violet - supporting data series
  positive: '#22c55e',    // green - on target, inflows, growth
  warning: '#eab308',     // yellow - at risk
  critical: '#ef4444',    // red - critical, outflows, decline
  neutral: '#94a3b8',     // slate - secondary/inactive elements
};

export const PRESET_THEMES = {
  Default: { ...DEFAULT_THEME },
  'Ocean Blue': {
    primary: '#0284c7',
    secondary: '#0891b2',
    positive: '#059669',
    warning: '#d97706',
    critical: '#dc2626',
    neutral: '#6b7280',
  },
  'Corporate Dark': {
    primary: '#1e40af',
    secondary: '#4338ca',
    positive: '#15803d',
    warning: '#b45309',
    critical: '#b91c1c',
    neutral: '#4b5563',
  },
  'Warm Tones': {
    primary: '#c2410c',
    secondary: '#a16207',
    positive: '#4d7c0f',
    warning: '#ca8a04',
    critical: '#be123c',
    neutral: '#78716c',
  },
  'Teal & Coral': {
    primary: '#0d9488',
    secondary: '#0891b2',
    positive: '#16a34a',
    warning: '#ea580c',
    critical: '#e11d48',
    neutral: '#64748b',
  },
  'Monochrome': {
    primary: '#1e293b',
    secondary: '#475569',
    positive: '#166534',
    warning: '#92400e',
    critical: '#991b1b',
    neutral: '#94a3b8',
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  const updateColor = (key, value) => {
    setTheme(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (presetName) => {
    if (PRESET_THEMES[presetName]) {
      setTheme({ ...PRESET_THEMES[presetName] });
    }
  };

  const resetTheme = () => {
    setTheme({ ...DEFAULT_THEME });
  };

  return (
    <ThemeContext.Provider value={{ theme, updateColor, applyPreset, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
