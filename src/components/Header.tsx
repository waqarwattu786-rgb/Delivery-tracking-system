import React from 'react';
import { TabDestination } from '../types';
import { APP_ASSETS } from '../data/shipments';

interface HeaderProps {
  currentTab: TabDestination | 'package-details';
  onNavigate: (tab: TabDestination) => void;
  onBack?: () => void;
  unreadCount?: number;
  onOpenNotifications: () => void;
  onShare?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onBack,
  unreadCount = 2,
  onOpenNotifications,
  onShare,
}) => {
  const getSubTitle = () => {
    switch (currentTab) {
      case 'home':
        return 'HOME';
      case 'live-map':
        return 'LIVE MAP';
      case 'shipments':
        return 'SHIPMENTS';
      case 'profile':
        return 'PROFILE';
      case 'package-details':
        return 'TRACKPULSE';
      default:
        return 'HOME';
    }
  };

  const isPackageDetails = currentTab === 'package-details';

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.35)] border-b border-surface-container-high/60 transition-all">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between gap-3">
        {/* Left branding or back button */}
        <div className="flex items-center gap-2.5 min-w-0">
          {isPackageDetails ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high/80 hover:bg-surface-bright text-on-surface hover:text-primary active:scale-95 transition-all -ml-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              <img
                src={APP_ASSETS.logo}
                alt="TrackPulse Brand Logo"
                className="h-8 w-auto object-contain shrink-0"
              />
            </button>
          )}

          <div className="flex flex-col truncate">
            <span className="font-headline-sm text-[17px] text-on-surface tracking-tight truncate leading-tight">
              {isPackageDetails ? 'Package Details' : 'TrackPulse'}
            </span>
            <span className="font-label-caps text-[10px] text-on-surface-variant truncate uppercase tracking-widest leading-tight">
              {getSubTitle()}
            </span>
          </div>
        </div>

        {/* Right contextual action icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isPackageDetails ? (
            <button
              type="button"
              onClick={onShare}
              aria-label="Share package details"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high/60 text-on-surface hover:text-primary active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenNotifications}
              aria-label="Notifications"
              className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high/60 hover:bg-surface-bright text-on-surface hover:text-primary active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-tertiary ring-2 ring-surface shadow-[0_0_8px_rgba(255,185,95,0.85)] animate-pulse" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            aria-label="User Profile"
            className="w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden ring-1 ring-outline-variant/60 hover:ring-primary/80 transition-all cursor-pointer"
          >
            <img
              src={APP_ASSETS.userProfile}
              alt="Profile"
              className="w-8 h-8 rounded-lg object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
