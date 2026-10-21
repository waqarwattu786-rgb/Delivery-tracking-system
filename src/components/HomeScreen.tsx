import React, { useState } from 'react';
import { PackageItem, TabDestination } from '../types';
import { APP_ASSETS } from '../data/shipments';

interface HomeScreenProps {
  packages: PackageItem[];
  onSelectPackage: (pkg: PackageItem) => void;
  onNavigateTab: (tab: TabDestination) => void;
  onOpenAddModal: () => void;
  onOpenScanner: () => void;
  onOpenDropInstructions: (pkg: PackageItem) => void;
  onToast: (msg: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  packages,
  onSelectPackage,
  onNavigateTab,
  onOpenAddModal,
  onOpenScanner,
  onOpenDropInstructions,
  onToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Primary active hero package is the Sony WH-1000XM5
  const heroPackage = packages.find((p) => p.id === 'pkg-sony-wh1000xm5') || packages[0];

  // Secondary stream packages
  const streamPackages = packages.filter((p) => p.id !== heroPackage.id);

  const filteredStream = streamPackages.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.trackingNumber.toLowerCase().includes(q) ||
      p.carrier.toLowerCase().includes(q) ||
      p.statusLabel.toLowerCase().includes(q)
    );
  });

  const handleCopyTracking = (e: React.MouseEvent, trk: string) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(trk);
    onToast(`${trk} copied to clipboard`);
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-28 pt-2">
      {/* Interactive Tactical Search Bar */}
      <div className="relative w-full">
        <div className="relative flex items-center bg-surface-container rounded-xl shadow-md border border-outline-variant/30 overflow-hidden transition-all duration-300 focus-within:shadow-[0_0_20px_rgba(77,142,255,0.25)] focus-within:border-primary-container">
          <div className="pl-3.5 flex items-center pointer-events-none text-primary">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="tracking-search"
            placeholder="e.g. TRK-9842-US"
            spellCheck={false}
            autoComplete="off"
            className="w-full bg-transparent py-3.5 px-2.5 font-label-telemetry text-[13px] text-on-surface placeholder:text-outline focus:outline-none tracking-wider uppercase"
          />
          <div className="pr-1.5 flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear input"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenScanner}
              title="Scan barcode or QR"
              className="h-9 px-3 bg-surface-container-high hover:bg-surface-bright text-primary rounded-lg flex items-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer border border-primary/20"
            >
              <span className="material-symbols-outlined text-[19px]">qr_code_scanner</span>
              <span className="font-label-caps text-[11px] tracking-wider hidden xs:inline">SCAN</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Active Shipment Hero Card */}
      {heroPackage && (
        <section
          onClick={() => onSelectPackage(heroPackage)}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-surface-container-high via-surface-container to-surface-container-low shadow-[0_12px_32px_rgba(0,0,0,0.6)] border border-outline-variant/40 cursor-pointer group hover:border-primary-container/50 transition-all duration-200"
        >
          {/* Ambient electric glow aura */}
          <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-primary-container/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-secondary-container/15 blur-2xl pointer-events-none" />

          <div className="relative p-4 flex flex-col gap-3.5">
            {/* Card Header: Status & Telemetry */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary shadow-[0_0_10px_rgba(78,222,163,0.9)]" />
                  </span>
                  <span className="font-headline-sm text-[16px] text-on-surface">Out for Delivery</span>
                </div>
                <span className="font-label-telemetry text-[12px] text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  Arriving in ~24 mins (by 2:45 PM)
                </span>
              </div>

              <div className="flex items-center bg-surface-container-highest px-2.5 py-1 rounded-full text-primary shrink-0 shadow-inner border border-outline-variant/30">
                <span className="material-symbols-outlined text-[14px] mr-1">flight_takeoff</span>
                <span className="font-label-caps text-[10px] uppercase text-on-surface-variant tracking-wider">
                  FedEx Air
                </span>
              </div>
            </div>

            {/* Item Profile Details */}
            <div className="flex items-center gap-3 bg-surface-container-lowest/80 p-3 rounded-xl backdrop-blur-md border border-outline-variant/20">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 text-primary shadow-sm border border-outline-variant/30">
                <span className="material-symbols-outlined text-[24px]">headphones</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="font-headline-sm text-[15px] text-on-surface truncate">
                  {heroPackage.title}
                </div>
                <div className="flex items-center gap-2 text-[12px] text-on-surface-variant truncate">
                  <span>TechWarehouse CA</span>
                  <span className="w-1 h-1 rounded-full bg-outline" />
                  <span className="font-label-telemetry text-primary">{heroPackage.trackingNumber}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => handleCopyTracking(e, heroPackage.trackingNumber)}
                title="Copy Tracking ID"
                className="w-9 h-9 rounded-lg bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shrink-0 cursor-pointer active:scale-95 border border-outline-variant/20"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
              </button>
            </div>

            {/* 4-Stage Tactical Milestone Progress Conduit */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="grid grid-cols-4 gap-1.5 items-center">
                <div className="h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.5)]" />
                <div className="h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.5)]" />
                <div className="h-1.5 rounded-full bg-primary-container shadow-[0_0_10px_rgba(77,142,255,0.7)] animate-pulse" />
                <div className="h-1.5 rounded-full bg-surface-container-highest" />
              </div>
              <div className="flex justify-between items-center text-on-surface-variant font-label-caps text-[11px] uppercase tracking-wider px-0.5">
                <span className="text-secondary font-semibold">Picked Up</span>
                <span className="text-secondary font-semibold">Transit</span>
                <span className="text-primary font-bold">Delivery</span>
                <span className="text-outline">Done</span>
              </div>
            </div>

            {/* Courier / Proximity Snapshot */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={APP_ASSETS.marcusCourier}
                    alt="Marcus Vance courier"
                    className="w-9 h-9 rounded-full object-cover shadow-md ring-1 ring-surface-container-high"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-secondary shadow-[0_0_6px_rgba(78,222,163,0.8)]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-[14px] text-on-surface leading-tight">Marcus Vance</span>
                  <span className="font-label-telemetry text-[12px] text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                    2 stops away
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-highest/90 px-2.5 py-1.5 rounded-lg text-primary font-label-caps border border-outline-variant/20">
                <span className="material-symbols-outlined text-[16px] text-tertiary">speed</span>
                <span className="font-label-telemetry text-[12px] text-on-surface">ETA 14:45</span>
              </div>
            </div>

            {/* Hero Call To Actions */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateTab('live-map');
                }}
                className="h-12 w-full rounded-xl bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-[14px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(77,142,255,0.4)] transition-all active:scale-[0.98] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[19px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  near_me
                </span>
                <span>Track on Live Map</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDropInstructions(heroPackage);
                }}
                className="h-12 w-full rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline-sm text-[14px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[19px]">doorbell</span>
                <span>Drop Instructions</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Metric Deck / Tactical Bento Grid */}
      <section className="grid grid-cols-3 gap-2">
        {/* Active Shipments Stat */}
        <div
          onClick={() => onNavigateTab('shipments')}
          className="bg-surface-container hover:bg-surface-container-high transition-colors p-3 rounded-xl flex flex-col justify-between gap-1 shadow-sm border border-outline-variant/20 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[16px]">package_2</span>
            </span>
            <span className="font-label-telemetry text-[11px] text-primary font-bold">LIVE</span>
          </div>
          <div>
            <div className="font-headline-xl-mobile text-[24px] text-on-surface leading-none tabular-nums font-bold">
              3
            </div>
            <div className="text-[11px] text-on-surface-variant truncate mt-1">Active Incoming</div>
          </div>
        </div>

        {/* Urgent / Action Required Stat */}
        <div
          onClick={() => onNavigateTab('shipments')}
          className="bg-surface-container hover:bg-surface-container-high transition-colors p-3 rounded-xl flex flex-col justify-between gap-1 shadow-sm border border-outline-variant/20 relative overflow-hidden cursor-pointer"
        >
          <div className="absolute -right-4 -bottom-4 w-12 h-12 rounded-full bg-tertiary/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="w-6 h-6 rounded-md bg-tertiary/15 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[16px]">draw</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_6px_rgba(255,185,95,0.8)] animate-pulse" />
          </div>
          <div>
            <div className="font-headline-xl-mobile text-[24px] text-tertiary leading-none tabular-nums font-bold">
              1
            </div>
            <div className="text-[11px] text-on-surface-variant truncate mt-1">Sign Needed</div>
          </div>
        </div>

        {/* Delivered Monthly Summary */}
        <div
          onClick={() => onNavigateTab('shipments')}
          className="bg-surface-container hover:bg-surface-container-high transition-colors p-3 rounded-xl flex flex-col justify-between gap-1 shadow-sm border border-outline-variant/20 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="w-6 h-6 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
            </span>
            <span className="material-symbols-outlined text-[16px] text-outline">trending_up</span>
          </div>
          <div>
            <div className="font-headline-xl-mobile text-[24px] text-on-surface leading-none tabular-nums font-bold">
              14
            </div>
            <div className="text-[11px] text-on-surface-variant truncate mt-1">Past 30 Days</div>
          </div>
        </div>
      </section>

      {/* Recent & Upcoming Deliveries Stream */}
      <section className="flex flex-col gap-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="font-headline-md text-[18px] text-on-surface">Deliveries Stream</span>
            <span className="bg-surface-container-high font-label-telemetry text-[11px] text-primary px-2 py-0.5 rounded-full border border-outline-variant/30">
              {packages.length} total
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('shipments')}
            className="font-label-caps text-[11px] text-primary hover:underline uppercase tracking-wider flex items-center cursor-pointer"
          >
            History
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* Stream Packages Cards matching Image 1 */}
        {filteredStream.slice(0, 3).map((pkg) => {
          const isDelivered = pkg.status === 'delivered';
          const isAwaiting = pkg.status === 'awaiting_pickup';

          return (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg)}
              className="group relative bg-surface-container hover:bg-surface-container-high transition-all p-3.5 rounded-xl shadow-sm border border-outline-variant/25 flex flex-col gap-2.5 cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-11 h-11 rounded-lg bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-inner border border-outline-variant/20 ${
                    isDelivered ? 'text-secondary' : isAwaiting ? 'text-outline' : 'text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {isDelivered ? 'checkroom' : isAwaiting ? 'inventory_2' : 'desktop_mac'}
                  </span>
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-headline-sm text-[15px] text-on-surface truncate">{pkg.title}</span>
                    <span
                      className={`font-label-telemetry text-[11px] px-2 py-0.5 rounded-full shrink-0 ${
                        isDelivered
                          ? 'text-secondary bg-secondary/10 flex items-center gap-1'
                          : isAwaiting
                          ? 'text-outline bg-surface-container-highest'
                          : 'text-tertiary bg-tertiary/10'
                      }`}
                    >
                      {isDelivered && (
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                      )}
                      {pkg.eta}
                    </span>
                  </div>
                  <div className="text-[12px] text-on-surface-variant truncate">
                    {pkg.carrier} {pkg.serviceType.split('•')[0]} • Tracking #{pkg.trackingNumber}
                  </div>
                </div>
              </div>

              {/* Status strip */}
              <div className="flex items-center justify-between pt-1 text-[12px] bg-surface-container-lowest/60 px-3 py-2 rounded-lg border border-outline-variant/15">
                <div className="flex items-center gap-2 text-on-surface-variant min-w-0">
                  <span
                    className={`material-symbols-outlined text-[17px] shrink-0 ${
                      isDelivered ? 'text-secondary' : isAwaiting ? 'text-outline' : 'text-primary'
                    }`}
                  >
                    {isDelivered ? 'house' : isAwaiting ? 'hourglass_top' : 'verified_user'}
                  </span>
                  <span className="text-on-surface truncate">
                    {isDelivered
                      ? 'Front Porch • Signed by Resident'
                      : isAwaiting
                      ? 'Label Created • Awaiting Carrier Pickup'
                      : 'Customs Cleared • In Transit'}
                  </span>
                </div>

                {isDelivered ? (
                  <span className="font-label-telemetry text-[11px] text-outline shrink-0">
                    {pkg.historyDateTag || 'Today 10:15 AM'}
                  </span>
                ) : isAwaiting ? (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPackage(pkg);
                    }}
                    className="font-label-caps text-[11px] text-primary hover:underline cursor-pointer shrink-0"
                  >
                    Details
                  </span>
                ) : (
                  <span className="font-label-caps text-[10px] text-tertiary bg-tertiary/15 px-2 py-0.5 rounded uppercase font-semibold shrink-0">
                    Tomorrow
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Floating Add Tracked Item Pill CTA */}
      <div className="sticky bottom-20 z-30 flex justify-center w-full px-4 pointer-events-none mt-2">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-full bg-primary-container text-on-primary-container shadow-[0_8px_24px_rgba(77,142,255,0.45)] hover:bg-primary transition-all active:scale-95 group font-headline-sm text-[14px] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px] transition-transform duration-300 group-hover:rotate-90">
            add_circle
          </span>
          <span>New Tracked Package</span>
        </button>
      </div>
    </div>
  );
};
