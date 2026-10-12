import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminTheme {
  id: string;
  name: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryBorder: string;
  accent: string;
  sidebarBg?: string;
  isDark?: boolean;
}

export const PRESET_THEMES: AdminTheme[] = [
  {
    id: 'blue',
    name: 'Ocean Blue (Default)',
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primaryLight: '#eff6ff',
    primaryBorder: '#bfdbfe',
    accent: '#4f46e5',
    sidebarBg: '#0f172a',
  },
  {
    id: 'emerald',
    name: 'Royal Emerald',
    primary: '#059669',
    primaryHover: '#047857',
    primaryLight: '#ecfdf5',
    primaryBorder: '#a7f3d0',
    accent: '#10b981',
    sidebarBg: '#064e3b',
  },
  {
    id: 'purple',
    name: 'Imperial Violet',
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    primaryLight: '#f5f3ff',
    primaryBorder: '#ddd6fe',
    accent: '#9333ea',
    sidebarBg: '#1e1b4b',
  },
  {
    id: 'amber',
    name: 'Sunset Copper',
    primary: '#ea580c',
    primaryHover: '#c2410c',
    primaryLight: '#fff7ed',
    primaryBorder: '#fed7aa',
    accent: '#f59e0b',
    sidebarBg: '#431407',
  },
  {
    id: 'rose',
    name: 'Crimson Ruby',
    primary: '#e11d48',
    primaryHover: '#be123c',
    primaryLight: '#fff1f2',
    primaryBorder: '#fecdd3',
    accent: '#f43f5e',
    sidebarBg: '#4c0519',
  },
  {
    id: 'obsidian',
    name: 'Midnight Cyber',
    primary: '#06b6d4',
    primaryHover: '#0891b2',
    primaryLight: '#083344',
    primaryBorder: '#164e63',
    accent: '#3b82f6',
    sidebarBg: '#020617',
    isDark: true,
  },
  {
    id: 'slate',
    name: 'Executive Slate',
    primary: '#334155',
    primaryHover: '#1e293b',
    primaryLight: '#f1f5f9',
    primaryBorder: '#cbd5e1',
    accent: '#64748b',
    sidebarBg: '#0f172a',
  },
];

// Helper to compute light and hover shades from a hex color
export function generateCustomTheme(hex: string): AdminTheme {
  const cleanHex = hex.startsWith('#') ? hex : `#${hex}`;
  return {
    id: 'custom',
    name: 'Custom Palette',
    primary: cleanHex,
    primaryHover: adjustBrightness(cleanHex, -20),
    primaryLight: hexToRgba(cleanHex, 0.12),
    primaryBorder: hexToRgba(cleanHex, 0.35),
    accent: adjustBrightness(cleanHex, 15),
    sidebarBg: '#0f172a',
  };
}

function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(37, 99, 235, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function hexToHsl(hex: string): [number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return [221, 83, 53];
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  l = Math.max(0, Math.min(100, l)) / 100;
  s = Math.max(0, Math.min(100, s)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function computeTailwindShades(hex: string, accentHex?: string): Record<string, string> {
  const [h, s] = hexToHsl(hex);
  const accent = accentHex || hex;
  const [ah, as] = hexToHsl(accent);

  return {
    '--color-blue-50': hslToHex(h, Math.min(s, 95), 97),
    '--color-blue-100': hslToHex(h, Math.min(s, 90), 93),
    '--color-blue-200': hslToHex(h, Math.min(s, 85), 84),
    '--color-blue-300': hslToHex(h, Math.min(s, 85), 73),
    '--color-blue-400': hslToHex(h, Math.min(s, 85), 60),
    '--color-blue-500': hslToHex(h, s, 50),
    '--color-blue-600': hex,
    '--color-blue-700': hslToHex(h, s, 36),
    '--color-blue-800': hslToHex(h, s, 26),
    '--color-blue-900': hslToHex(h, s, 18),
    '--color-blue-950': hslToHex(h, s, 11),
    '--color-indigo-50': hslToHex(ah, Math.min(as, 95), 97),
    '--color-indigo-100': hslToHex(ah, Math.min(as, 90), 93),
    '--color-indigo-200': hslToHex(ah, Math.min(as, 85), 84),
    '--color-indigo-300': hslToHex(ah, Math.min(as, 85), 73),
    '--color-indigo-400': hslToHex(ah, Math.min(as, 85), 60),
    '--color-indigo-500': hslToHex(ah, as, 50),
    '--color-indigo-600': accent,
    '--color-indigo-700': hslToHex(ah, as, 36),
    '--color-indigo-800': hslToHex(ah, as, 26),
    '--color-indigo-900': hslToHex(ah, as, 18),
    '--color-indigo-950': hslToHex(ah, as, 11),
  };
}

export function applyThemeToDocument(theme: AdminTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Root design system variables
  root.style.setProperty('--admin-primary', theme.primary);
  root.style.setProperty('--admin-primary-hover', theme.primaryHover);
  root.style.setProperty('--admin-primary-light', theme.primaryLight);
  root.style.setProperty('--admin-primary-border', theme.primaryBorder);
  root.style.setProperty('--admin-accent', theme.accent);
  root.style.setProperty('--primary-blue', theme.primary);
  root.style.setProperty('--border-focus', theme.primary);
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-primary-hover', theme.primaryHover);

  // Tailwind scale variables to transform the entire customer and admin web
  const shades = computeTailwindShades(theme.primary, theme.accent);
  Object.entries(shades).forEach(([prop, val]) => {
    root.style.setProperty(prop, val);
  });

  try {
    window.dispatchEvent(new CustomEvent('doorstep_theme_applied', { detail: theme }));
  } catch {
    // ignore in environments without CustomEvent
  }
}

interface AdminThemeState {
  currentTheme: AdminTheme;
  customHex: string;
  isThemePickerOpen: boolean;
  setThemeById: (id: string) => void;
  setCustomColor: (hex: string) => void;
  openThemePicker: () => void;
  closeThemePicker: () => void;
}

export const useAdminThemeStore = create<AdminThemeState>()(
  persist(
    (set) => ({
      currentTheme: PRESET_THEMES[0],
      customHex: '#2563eb',
      isThemePickerOpen: false,

      setThemeById: (id: string) => {
        const found = PRESET_THEMES.find((t) => t.id === id);
        if (found) {
          applyThemeToDocument(found);
          set({ currentTheme: found, customHex: found.primary });
        }
      },

      setCustomColor: (hex: string) => {
        const custom = generateCustomTheme(hex);
        applyThemeToDocument(custom);
        set({ currentTheme: custom, customHex: hex });
      },

      openThemePicker: () => set({ isThemePickerOpen: true }),
      closeThemePicker: () => set({ isThemePickerOpen: false }),
    }),
    {
      name: 'doorstep_admin_theme_v2',
      onRehydrateStorage: () => (state) => {
        if (state?.currentTheme) {
          applyThemeToDocument(state.currentTheme);
        }
      }
    }
  )
);

