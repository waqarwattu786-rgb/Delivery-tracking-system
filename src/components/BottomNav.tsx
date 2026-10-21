import React from 'react';
import { TabDestination } from '../types';

interface BottomNavProps {
  currentTab: TabDestination | 'package-details';
  onSelectTab: (tab: TabDestination) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { id: TabDestination; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'dashboard' },
    { id: 'live-map', label: 'Live Map', icon: 'explore' },
    { id: 'shipments', label: 'Shipments', icon: 'local_shipping' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface-container-low/90 backdrop-blur-xl border-t border-surface-container-high/60 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-3">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center h-12 px-3.5 rounded-xl gap-0.5 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-primary bg-primary/15 shadow-[0_0_14px_rgba(173,198,255,0.25)] font-semibold scale-105'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              <span className="font-label-caps text-[10px] tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
