'use client';

import React from 'react';
import { 
  Palette, 
  Check, 
  X, 
  Sparkles, 
  RotateCcw, 
  Sliders, 
  CheckCircle2,
  Eye
} from 'lucide-react';
import { 
  useAdminThemeStore, 
  PRESET_THEMES 
} from '@/lib/store/adminThemeStore';

export default function AdminThemeModal() {
  const { 
    currentTheme, 
    customHex, 
    isThemePickerOpen, 
    setThemeById, 
    setCustomColor, 
    closeThemePicker 
  } = useAdminThemeStore();

  if (!isThemePickerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div 
              className="w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-xs transition-colors"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Admin Design System & Theme
              </h3>
              <p className="text-xs text-slate-500">
                Customize your admin portal color scheme in real time
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeThemePicker}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Live Component Preview */}
          <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Live Interactive Preview</span>
              </span>
              <span 
                className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                style={{ 
                  backgroundColor: currentTheme.primaryLight, 
                  borderColor: currentTheme.primaryBorder,
                  color: currentTheme.primary 
                }}
              >
                {currentTheme.name}
              </span>
            </div>

            {/* Simulated Admin UI elements */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <span>+ Primary Action</span>
              </button>
              
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
                style={{ 
                  backgroundColor: currentTheme.primaryLight, 
                  borderColor: currentTheme.primaryBorder,
                  color: currentTheme.primary 
                }}
              >
                <span>Active Status Filter</span>
              </button>

              <div 
                className="w-3 h-3 rounded-full animate-ping"
                style={{ backgroundColor: currentTheme.primary }}
              />
            </div>
          </div>

          {/* Curated Color Palettes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Curated Theme Palettes
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PRESET_THEMES.map((theme) => {
                const isSelected = currentTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setThemeById(theme.id)}
                    className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-20 ${
                      isSelected
                        ? 'border-slate-900 bg-white ring-2 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    style={isSelected ? { borderColor: theme.primary, boxShadow: `0 0 0 2px ${theme.primary}40` } : {}}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-1.5">
                        <span 
                          className="w-5 h-5 rounded-lg shadow-2xs inline-block"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <span 
                          className="w-3.5 h-3.5 rounded-md inline-block opacity-75"
                          style={{ backgroundColor: theme.accent }}
                        />
                      </div>
                      {isSelected && (
                        <span 
                          className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px]"
                          style={{ backgroundColor: theme.primary }}
                        >
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {theme.name.split(' ')[0]}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {theme.primary}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color Engine */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Choose Your Own Custom Color</span>
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Pick any hex color from the palette to instantly theme the entire portal.
            </p>

            <div className="flex items-center space-x-3">
              {/* Native color picker box */}
              <div className="relative">
                <input
                  type="color"
                  value={customHex}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-12 h-12 rounded-2xl border-2 border-slate-300 cursor-pointer p-0.5 bg-white shadow-xs"
                />
              </div>

              {/* Hex text input */}
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-mono text-xs">
                    #
                  </span>
                  <input
                    type="text"
                    value={customHex.replace('#', '')}
                    onChange={(e) => setCustomColor(`#${e.target.value}`)}
                    placeholder="2563eb"
                    maxLength={7}
                    className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:bg-white transition-all uppercase"
                  />
                </div>
              </div>

              {/* Reset to Default */}
              <button
                type="button"
                onClick={() => setThemeById('blue')}
                className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                title="Reset to Default Blue"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Changes save automatically to your browser
          </span>
          <button
            type="button"
            onClick={closeThemePicker}
            className="px-5 py-2 rounded-xl text-white text-xs font-bold shadow-xs transition-all"
            style={{ backgroundColor: currentTheme.primary }}
          >
            Done & Apply
          </button>
        </div>

      </div>
    </div>
  );
}
