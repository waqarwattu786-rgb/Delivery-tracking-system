import React, { useState } from 'react';
import { PackageItem, TabDestination } from '../types';
import { APP_ASSETS } from '../data/shipments';

interface ShipmentsScreenProps {
  packages: PackageItem[];
  onSelectPackage: (pkg: PackageItem) => void;
  onNavigateTab: (tab: TabDestination) => void;
  onOpenAddModal: () => void;
  onOpenScanner: () => void;
  onOpenPreSign: (pkg: PackageItem) => void;
  onOpenProofModal: (pkg: PackageItem) => void;
  onOpenDeliveryPreferences: (pkg: PackageItem) => void;
  onToast: (msg: string) => void;
}

type FilterType = 'all' | 'active' | 'out_for_delivery' | 'action_needed' | 'delivered';

export const ShipmentsScreen: React.FC<ShipmentsScreenProps> = ({
  packages,
  onSelectPackage,
  onNavigateTab,
  onOpenAddModal,
  onOpenScanner,
  onOpenPreSign,
  onOpenProofModal,
  onOpenDeliveryPreferences,
  onToast,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTime, setSyncTime] = useState('5 mins ago');

  const handleSyncCarriers = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncTime('Just now');
      onToast('Carriers synchronized: 4 active packages refreshed');
    }, 1200);
  };

  // Categorize packages
  const todayDeliveries = packages.filter(
    (p) => p.status === 'out_for_delivery'
  );
  const thisWeekDeliveries = packages.filter(
    (p) => p.status === 'in_transit' || p.status === 'awaiting_pickup'
  );
  const deliveredPackages = packages.filter((p) => p.status === 'delivered');

  // Filter application
  const matchesFilter = (pkg: PackageItem) => {
    if (filter === 'active') return pkg.status !== 'delivered';
    if (filter === 'out_for_delivery') return pkg.status === 'out_for_delivery';
    if (filter === 'action_needed') return pkg.signatureRequired && !pkg.isPreSigned;
    if (filter === 'delivered') return pkg.status === 'delivered';
    return true;
  };

  const matchesSearch = (pkg: PackageItem) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      pkg.title.toLowerCase().includes(q) ||
      pkg.trackingNumber.toLowerCase().includes(q) ||
      pkg.carrier.toLowerCase().includes(q) ||
      pkg.serviceType.toLowerCase().includes(q) ||
      pkg.statusLabel.toLowerCase().includes(q)
    );
  };

  const filteredToday = todayDeliveries.filter((p) => matchesFilter(p) && matchesSearch(p));
  const filteredThisWeek = thisWeekDeliveries.filter((p) => matchesFilter(p) && matchesSearch(p));
  const filteredDelivered = deliveredPackages.filter((p) => matchesFilter(p) && matchesSearch(p));

  const totalActiveCount = packages.filter((p) => p.status !== 'delivered').length;

  return (
    <div className="flex flex-col w-full pb-32 space-y-4 pt-2">
      {/* Top Command Hub Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <h1 className="font-headline-md text-[20px] text-on-surface tracking-tight">All Shipments</h1>
          <p className="text-[12px] text-on-surface-variant flex items-center gap-1.5 mt-0.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span>{totalActiveCount} Active • 28 Archived</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToast('Sort order: Nearest ETA first')}
            aria-label="Sort & Filter Shipments"
            className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center shadow-sm active:scale-95 transition-transform cursor-pointer border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
          <button
            type="button"
            onClick={() => onToast('Bulk archive options: 28 delivered packages')}
            aria-label="Bulk Archive Actions"
            className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center shadow-sm active:scale-95 transition-transform cursor-pointer border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          </button>
        </div>
      </div>

      {/* Telemetry Search Bar */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">search</span>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tracking #, parcel, carrier, store..."
          className="w-full h-12 pl-10 pr-12 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline font-label-telemetry text-[13px] focus:outline-none focus:bg-surface-container shadow-inner border border-outline-variant/20 focus:border-primary-container"
        />
        <button
          type="button"
          onClick={onOpenScanner}
          aria-label="Scan barcode"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary-container hover:text-primary active:scale-90 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">barcode_scanner</span>
        </button>
      </div>

      {/* Horizontal Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar scroll-smooth">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`filter-pill whitespace-nowrap px-3.5 py-1.5 rounded-full font-label-caps text-[11px] transition-all shrink-0 cursor-pointer ${
            filter === 'all'
              ? 'bg-primary text-on-primary shadow-md font-bold'
              : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/20'
          }`}
        >
          All ({packages.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('active')}
          className={`filter-pill whitespace-nowrap px-3.5 py-1.5 rounded-full font-label-caps text-[11px] transition-all shrink-0 cursor-pointer ${
            filter === 'active'
              ? 'bg-primary text-on-primary shadow-md font-bold'
              : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/20'
          }`}
        >
          Active ({totalActiveCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('out_for_delivery')}
          className={`filter-pill whitespace-nowrap px-3.5 py-1.5 rounded-full font-label-caps text-[11px] transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
            filter === 'out_for_delivery'
              ? 'bg-primary text-on-primary shadow-md font-bold'
              : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/20'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          Out for Delivery ({todayDeliveries.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('action_needed')}
          className={`filter-pill whitespace-nowrap px-3.5 py-1.5 rounded-full font-label-caps text-[11px] transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
            filter === 'action_needed'
              ? 'bg-primary text-on-primary shadow-md font-bold'
              : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/20'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
          Action Needed (1)
        </button>
        <button
          type="button"
          onClick={() => setFilter('delivered')}
          className={`filter-pill whitespace-nowrap px-3.5 py-1.5 rounded-full font-label-caps text-[11px] transition-all shrink-0 cursor-pointer ${
            filter === 'delivered'
              ? 'bg-primary text-on-primary shadow-md font-bold'
              : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/20'
          }`}
        >
          Delivered ({deliveredPackages.length + 25})
        </button>
      </div>

      {/* Integration Carrier Sync Strip */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-4 shadow-md border border-outline-variant/25">
        <div className="flex items-start justify-between gap-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-container-highest text-secondary flex items-center justify-center shadow-inner shrink-0 border border-outline-variant/20">
              <span
                className={`material-symbols-outlined text-[20px] ${isSyncing ? 'animate-spin' : ''}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                sync
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-[14px] text-on-surface font-semibold tracking-tight">
                  Active Carrier Sync
                </span>
                <span className="w-2 h-2 rounded-full bg-secondary" />
              </div>
              <span className="text-[12px] text-on-surface-variant truncate">
                Auto-synced {syncTime} • Gmail & Amazon
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSyncCarriers}
            disabled={isSyncing}
            aria-label="Carrier Integrations"
            className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all border border-outline-variant/20"
          >
            <span className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin' : ''}`}>
              cached
            </span>
          </button>
        </div>

        {/* Carrier badges status row */}
        <div className="grid grid-cols-5 gap-1.5 mt-3 pt-1 relative z-10">
          <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-surface-container-high text-center border border-outline-variant/20">
            <span className="font-label-caps text-[9px] uppercase tracking-wider text-tertiary font-bold">AMZN</span>
            <span className="text-[9px] text-on-surface-variant mt-0.5">Live</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-surface-container-high text-center border border-outline-variant/20">
            <span className="font-label-caps text-[9px] uppercase tracking-wider text-primary font-bold">FDX</span>
            <span className="text-[9px] text-on-surface-variant mt-0.5">2 Act</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-surface-container-high text-center border border-outline-variant/20">
            <span className="font-label-caps text-[9px] uppercase tracking-wider text-tertiary font-bold">UPS</span>
            <span className="text-[9px] text-on-surface-variant mt-0.5">1 Act</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-surface-container-high text-center border border-outline-variant/20">
            <span className="font-label-caps text-[9px] uppercase tracking-wider text-tertiary font-bold">DHL</span>
            <span className="text-[9px] text-on-surface-variant mt-0.5">1 Act</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-surface-container-high text-center border border-outline-variant/20">
            <span className="font-label-caps text-[9px] uppercase tracking-wider text-primary-fixed-dim font-bold">
              USPS
            </span>
            <span className="text-[9px] text-on-surface-variant mt-0.5">Idle</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: TODAY'S DELIVERIES */}
      {filteredToday.length > 0 && (
        <div className="flex flex-col space-y-2.5">
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-[16px] text-on-surface tracking-tight">Today's Deliveries</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-[10px]">
                {filteredToday.length}
              </span>
            </div>
            <span className="font-label-telemetry text-[12px] text-secondary">Target: 2:45 PM</span>
          </div>

          {filteredToday.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg)}
              className="rounded-xl bg-surface-container p-4 shadow-xl flex flex-col space-y-3.5 relative overflow-hidden group border border-outline-variant/30 cursor-pointer hover:border-primary-container/40 transition-all"
            >
              <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-secondary/10 blur-2xl pointer-events-none" />

              {/* Top info line */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high p-1 shrink-0 overflow-hidden flex items-center justify-center shadow-inner border border-outline-variant/20">
                    <img
                      src={pkg.image || APP_ASSETS.sonyHeadphones}
                      alt={pkg.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-caps text-[10px] text-primary uppercase tracking-wider">
                        {pkg.carrier} Home
                      </span>
                      <span className="text-on-surface-variant">•</span>
                      <span className="font-label-telemetry text-[11px] text-on-surface-variant">
                        #{pkg.trackingNumber}
                      </span>
                    </div>
                    <h2 className="font-headline-sm text-[15px] text-on-surface truncate">{pkg.title} Headphones</h2>
                    <span className="text-[12px] text-on-surface-variant">
                      Arriving ~2:45 PM • {pkg.stopsAway || 4} stops away
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-[10px] tracking-wide uppercase shrink-0 flex items-center gap-1 shadow-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-on-secondary-container animate-ping" />
                  Out for Delivery
                </span>
              </div>

              {/* Live Telemetry Progress Gauge */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[12px] font-label-telemetry">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-secondary">local_shipping</span>
                    Courier in Metro Zone
                  </span>
                  <span className="text-secondary font-bold">85% Processed</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(78,222,163,0.5)]"
                    style={{ width: '85%' }}
                  />
                </div>
              </div>

              {/* Map Snapshot Preview Widget */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateTab('live-map');
                }}
                style={{
                  backgroundImage: `url(${APP_ASSETS.seattleMapGlimpse})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                className="w-full h-24 rounded-lg overflow-hidden relative shadow-inner border border-outline-variant/30 cursor-pointer"
              >
                <div className="absolute inset-0 bg-surface-dim/40 backdrop-blur-[0.5px]" />
                <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-surface-container-lowest/90 px-2.5 py-1 rounded-lg backdrop-blur-md border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[16px] text-secondary">near_me</span>
                  <span className="font-label-telemetry text-[11px] text-on-surface font-semibold">
                    Vehicle ID: FX-841 (Driver: Carlos M.)
                  </span>
                </div>
              </div>

              {/* Quick Action Touchpoints */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateTab('live-map');
                  }}
                  className="flex-1 h-10 rounded-lg bg-primary-container text-on-primary-container font-headline-sm text-[13px] flex items-center justify-center gap-1.5 shadow-sm active:opacity-90 cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">explore</span>
                  Live Driver Map
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDeliveryPreferences(pkg);
                  }}
                  aria-label="Delivery Preferences"
                  className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center hover:text-primary transition-colors cursor-pointer border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[20px]">doorbell</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard?.writeText(pkg.trackingNumber);
                    onToast(`Tracking link for ${pkg.title} copied`);
                  }}
                  aria-label="Share tracking details"
                  className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center hover:text-primary transition-colors cursor-pointer border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 2: THIS WEEK */}
      {filteredThisWeek.length > 0 && (
        <div className="flex flex-col space-y-2.5 pt-1">
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-[16px] text-on-surface tracking-tight">This Week</span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-[10px]">
                {filteredThisWeek.length}
              </span>
            </div>
            <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">Estimated ETA</span>
          </div>

          {filteredThisWeek.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg)}
              className="rounded-xl bg-surface-container p-4 shadow-md flex flex-col space-y-3 relative overflow-hidden border border-outline-variant/25 cursor-pointer hover:border-primary-container/30 transition-all"
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high p-1 shrink-0 overflow-hidden flex items-center justify-center shadow-inner border border-outline-variant/20">
                    <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-caps text-[10px] text-tertiary uppercase font-bold tracking-wider">
                        {pkg.carrier} {pkg.serviceType.split('•')[0]}
                      </span>
                      <span className="text-on-surface-variant">•</span>
                      <span className="font-label-telemetry text-[11px] text-on-surface-variant">
                        #{pkg.trackingNumber}
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-[15px] text-on-surface truncate">{pkg.title}</h3>
                    <span className="text-[12px] text-on-surface-variant">{pkg.etaFormatted}</span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full font-label-caps text-[10px] tracking-wide uppercase shrink-0 flex items-center gap-1 ${
                    pkg.id === 'pkg-keychron-q1'
                      ? 'bg-tertiary-container text-on-tertiary-container'
                      : 'bg-primary-container text-on-primary-container'
                  }`}
                >
                  {pkg.id === 'pkg-keychron-q1' && (
                    <span className="material-symbols-outlined text-[13px]">gavel</span>
                  )}
                  {pkg.status === 'in_transit' ? (pkg.id === 'pkg-keychron-q1' ? 'Customs Cleared' : 'In Transit') : 'Created'}
                </span>
              </div>

              {/* Action notice for direct signature */}
              {pkg.signatureRequired && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/15">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0">
                      history_edu
                    </span>
                    <span className="font-label-caps text-[11px] text-on-surface truncate">
                      {pkg.isPreSigned ? 'Electronic signature on file' : 'Direct Signature Required upon arrival'}
                    </span>
                  </div>
                  {!pkg.isPreSigned ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPreSign(pkg);
                      }}
                      className="font-label-caps text-[11px] text-primary hover:underline shrink-0 pl-2 cursor-pointer font-bold"
                    >
                      Pre-Sign
                    </button>
                  ) : (
                    <span className="font-label-caps text-[10px] text-secondary font-bold">Signed</span>
                  )}
                </div>
              )}

              {/* Timeline mini nodes */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 font-label-telemetry text-[12px] text-on-surface-variant truncate">
                  <span className="w-2 h-2 rounded-full bg-tertiary shrink-0" />
                  <span className="truncate">
                    {pkg.checkpoints[0]?.title || 'In Transit'} • {pkg.checkpoints[0]?.location || 'Cincinnati Hub'}
                  </span>
                </div>
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center shrink-0 border border-outline-variant/20"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 3: DELIVERED RECENTLY */}
      {filteredDelivered.length > 0 && (
        <div className="flex flex-col space-y-2.5 pt-1">
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-[16px] text-on-surface tracking-tight">
                Delivered Recently
              </span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-[10px]">
                {filteredDelivered.length} of 28
              </span>
            </div>
            <button
              type="button"
              onClick={() => onToast('Loading full archive: 28 historical parcels')}
              className="font-label-caps text-[11px] text-primary hover:underline cursor-pointer"
            >
              View All Archive
            </button>
          </div>

          {filteredDelivered.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg)}
              className="rounded-xl bg-surface-container-low p-4 shadow-sm flex items-center justify-between gap-3 border border-outline-variant/20 cursor-pointer hover:bg-surface-container transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary shrink-0 border border-secondary/20">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="font-headline-sm text-[14px] text-on-surface font-semibold truncate">
                    {pkg.title}
                  </h4>
                  <p className="text-[12px] text-on-surface-variant truncate">
                    {pkg.carrier} • {pkg.statusLabel}
                  </p>
                  <span className="font-label-telemetry text-[11px] text-outline">
                    {pkg.historyDateTag || 'Nov 10 • Front Porch'}
                  </span>
                </div>
              </div>

              {pkg.proofPhoto ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenProofModal(pkg);
                  }}
                  aria-label="Parcel photo and receipt"
                  className="h-9 px-3 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-caps text-[11px] flex items-center gap-1.5 shrink-0 cursor-pointer border border-outline-variant/30 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">photo_camera</span>
                  <span>Proof</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPackage(pkg);
                  }}
                  aria-label="Re-order or archive details"
                  className="h-9 px-3 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-caps text-[11px] flex items-center gap-1 shrink-0 cursor-pointer border border-outline-variant/30 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  <span>Details</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* FLOATING QUICK ACTION BAR */}
      <div className="fixed bottom-20 left-0 right-0 px-4 z-40 max-w-md mx-auto pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between p-2 rounded-2xl bg-surface-container-high/95 backdrop-blur-xl shadow-2xl border border-outline-variant/30">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex-1 h-12 rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-[14px] flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Add Tracking Number</span>
          </button>
          <div className="w-px h-6 bg-outline-variant/50 mx-2" />
          <button
            type="button"
            onClick={onOpenScanner}
            aria-label="Open Camera Barcode Scanner"
            className="w-12 h-12 rounded-xl bg-surface-container-highest text-primary flex items-center justify-center active:scale-95 transition-transform cursor-pointer border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
          </button>
        </div>
      </div>
    </div>
  );
};
