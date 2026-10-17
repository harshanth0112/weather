import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Map as MapIcon,
  Wind,
  Bot,
  ArrowRightLeft,
} from 'lucide-react';

export const NAVIGATION_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'forecast', label: 'Forecast & Trends', icon: CalendarDays },
  { id: 'map', label: 'Interactive Map', icon: MapIcon },
  { id: 'airquality', label: 'Air Quality & Risks', icon: Wind },
  { id: 'assistant', label: 'AI Assistant', icon: Bot, highlight: true },
  { id: 'compare', label: 'Compare & History', icon: ArrowRightLeft },
];

export function DesktopNavigation({ activeTab, onSelectTab }) {
  return (
    <nav role="tablist" aria-label="Main Application Views" className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl glass-panel border border-white/10 mb-6 max-w-fit mx-auto shadow-xl">
      {NAVIGATION_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-label={`${tab.label} View`}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
              isActive
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : tab.highlight ? 'text-cyan-400' : 'text-slate-400'}`} aria-hidden="true" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function MobileBottomNavigation({ activeTab, onSelectTab }) {
  // Ultra-compact labels to avoid truncation on 320px screens
  const mobileLabelMap = {
    dashboard: 'Home',
    forecast: 'Forecast',
    map: 'Radar',
    airquality: 'Air',
    assistant: 'AI',
    compare: 'Compare',
  };

  return (
    <nav role="tablist" aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 inset-x-0 z-50 glass-panel border-t pt-2 safe-bottom-nav px-1.5 flex items-center justify-around shadow-2xl backdrop-blur-2xl">
      {NAVIGATION_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const label = mobileLabelMap[tab.id] || tab.label.split(' ')[0];

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-label={`${tab.label} View`}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all min-w-[48px] ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 ${isActive ? 'text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' : ''} transition-transform`} aria-hidden="true" />
            <span className="text-[9px] sm:text-[10px] mt-1 font-medium tracking-tight">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
