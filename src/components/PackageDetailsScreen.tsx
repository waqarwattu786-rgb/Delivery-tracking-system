import React, { useState } from 'react';
import { PackageItem, TabDestination } from '../types';
import { APP_ASSETS } from '../data/shipments';

interface PackageDetailsScreenProps {
  packageItem: PackageItem;
  onNavigateTab: (tab: TabDestination) => void;
  onOpenManageDelivery: () => void;
  onCallCourier: () => void;
  onEditGateCode: () => void;
  onToast: (msg: string) => void;
}

export const PackageDetailsScreen: React.FC<PackageDetailsScreenProps> = ({
  packageItem,
  onNavigateTab,
  onOpenManageDelivery,
  onCallCourier,
  onEditGateCode,
  onToast,
}) => {
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(packageItem.trackingNumber);
    setCopied(true);
    onToast(`Tracking ID ${packageItem.trackingNumber} copied`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `TrackPulse: ${packageItem.title}`,
          text: `Tracking shipment #${packageItem.trackingNumber}. Expected: ${packageItem.eta}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 space-y-4 pt-1">
      {/* Top Summary Card with Tactile Obsidian Glass Depth */}
      <div className="relative bg-surface-container rounded-2xl p-4 shadow-xl overflow-hidden border border-outline-variant/30">
        {/* Ambient Status Glow Overlay */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col space-y-3.5">
          {/* Item Metadata & Parcel Visual Anchor */}
          <div className="flex items-start gap-3.5">
            <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-surface-container-high shadow-md border border-outline-variant/30">
              <img
                src={APP_ASSETS.sonyDetail}
                alt={packageItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent" />
              <span
                className="material-symbols-outlined absolute bottom-1 right-1 text-secondary text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                package_2
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-primary font-label-caps text-[10px] uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>Priority Transit</span>
              </div>
              <h1 className="font-headline-sm text-[16px] text-on-surface leading-tight truncate">
                {packageItem.title} Headphones
              </h1>
              <p className="text-[12px] text-on-surface-variant truncate mt-0.5">
                {packageItem.subtitle}
              </p>
            </div>
          </div>

          {/* Tracking ID Action Row */}
          <div className="flex items-center justify-between bg-surface-container-low px-3.5 py-2 rounded-xl border border-outline-variant/20">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-outline text-[18px]">barcode</span>
              <span className="font-label-telemetry text-[13px] text-on-surface font-semibold tracking-wide">
                {packageItem.trackingNumber}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy tracking ID"
                className="h-9 px-3 flex items-center gap-1 rounded-lg bg-surface-container-high text-on-surface hover:text-primary transition-all active:scale-95 cursor-pointer border border-outline-variant/20"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copied ? 'done' : 'content_copy'}
                </span>
                <span className="font-label-caps text-[11px] font-semibold">
                  {copied ? 'Copied' : 'Copy'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setShowQr(!showQr)}
                aria-label="Show QR code"
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all active:scale-95 cursor-pointer border ${
                  showQr
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-high text-on-surface hover:text-primary border-outline-variant/20'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
              </button>
            </div>
          </div>

          {/* Live Expected Time Banner */}
          <div className="relative bg-secondary-container rounded-xl p-3.5 text-on-secondary-container shadow-lg overflow-hidden border border-secondary/30">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3 min-w-0">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary-fixed shadow-[0_0_8px_rgba(111,251,190,0.8)]" />
                </span>
                <div className="truncate">
                  <div className="font-label-caps text-[10px] uppercase tracking-wider text-secondary-fixed font-bold leading-none mb-1">
                    On Schedule
                  </div>
                  <div className="font-headline-sm text-[15px] font-bold text-on-secondary leading-tight truncate">
                    Today by 2:45 PM
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className="font-label-telemetry text-[12px] bg-surface-container-lowest/40 px-2.5 py-1 rounded-md text-secondary-fixed font-semibold border border-secondary-fixed/20">
                  ETA ~18m
                </span>
              </div>
            </div>
          </div>

          {/* Security Requirement Notice */}
          <div className="flex items-center gap-3 bg-surface-container-high px-3.5 py-2.5 rounded-xl border border-outline-variant/20">
            <span
              className="material-symbols-outlined text-tertiary text-[20px] shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              draw
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-on-surface font-semibold truncate">Direct Signature Required</p>
              <p className="text-[11px] text-on-surface-variant truncate">
                {packageItem.isPreSigned ? 'Electronic authorization recorded' : 'Must present government ID or digital pass'}
              </p>
            </div>
            <span className="font-label-caps text-[10px] uppercase px-2 py-0.5 rounded bg-tertiary/15 text-tertiary shrink-0 font-bold border border-tertiary/30">
              {packageItem.isPreSigned ? 'Pre-Cleared' : 'Mandatory'}
            </span>
          </div>
        </div>
      </div>

      {/* QR Modal Popover (Toggleable) */}
      {showQr && (
        <div className="relative bg-surface-container-high rounded-xl p-4 shadow-2xl text-center space-y-3 border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center">
            <span className="font-label-caps text-[11px] uppercase tracking-wider text-primary font-bold">
              Driver Scan Barcode
            </span>
            <button
              type="button"
              onClick={() => setShowQr(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
          <div className="bg-surface-bright p-4 rounded-xl flex flex-col items-center justify-center shadow-inner">
            <svg className="w-36 h-36 text-surface-container-lowest" fill="currentColor" viewBox="0 0 100 100">
              <rect width="100" height="100" fill="#dfe2f1" rx="6" />
              <path
                d="M10 10h24v24H10zm6 6v12h12V16zm50-6h24v24H66zm6 6v12h12V16zM10 66h24v24H10zm6 6v12h12V72zm28-56h6v12h-6zm12 6h6v6h-6zm-12 12h18v6H44zm22 6h12v6H66zm-28 6h6v12h-6zm12 6h6v18h-6zm12-6h6v6h-6zm12 6h6v12h-6zm-36 12h12v6H38zm24 6h12v12H62zm18-6h6v12h-6z"
                fill="#0a0e18"
              />
            </svg>
            <p className="font-label-telemetry text-[12px] text-surface-container-lowest mt-2 font-bold">
              {packageItem.trackingNumber}-SEA
            </p>
          </div>
        </div>
      )}

      {/* Telemetry & Spec Sheet Bento */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-surface-container p-3.5 rounded-xl space-y-1 border border-outline-variant/20">
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">scale</span>
            <span className="font-label-caps text-[10px] uppercase tracking-wider">Gross Weight</span>
          </div>
          <div className="font-headline-sm text-[16px] text-on-surface font-bold">{packageItem.weight}</div>
          <div className="font-label-telemetry text-[11px] text-outline">{packageItem.weightTare}</div>
        </div>

        <div className="bg-surface-container p-3.5 rounded-xl space-y-1 border border-outline-variant/20">
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">straighten</span>
            <span className="font-label-caps text-[10px] uppercase tracking-wider">Dimensions</span>
          </div>
          <div className="font-headline-sm text-[16px] text-on-surface font-bold">{packageItem.dimensions}</div>
          <div className="font-label-telemetry text-[11px] text-outline">{packageItem.dimensionsUnit}</div>
        </div>

        <div className="bg-surface-container p-3.5 rounded-xl space-y-1 border border-outline-variant/20">
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
            <span className="font-label-caps text-[10px] uppercase tracking-wider">Origin Facility</span>
          </div>
          <div className="font-headline-sm text-[15px] text-on-surface font-bold truncate">
            {packageItem.originFacility}
          </div>
          <div className="text-[11px] text-outline truncate">{packageItem.originLocation}</div>
        </div>

        <div className="bg-surface-container p-3.5 rounded-xl space-y-1 border border-outline-variant/20">
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            <span className="font-label-caps text-[10px] uppercase tracking-wider">Destination</span>
          </div>
          <div className="font-headline-sm text-[15px] text-secondary font-bold truncate">
            {packageItem.destination}
          </div>
          <div className="text-[11px] text-outline truncate">{packageItem.destinationType}</div>
        </div>
      </div>

      {/* Interactive Map Glimpse Section */}
      <div
        onClick={() => onNavigateTab('live-map')}
        className="relative bg-surface-container rounded-2xl overflow-hidden shadow-lg border border-outline-variant/30 cursor-pointer group"
      >
        <div
          className="w-full h-36 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${APP_ASSETS.seattleMapGlimpse})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/40 to-transparent" />
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-[0_0_8px_rgba(77,142,255,0.8)]" />
            </span>
            <span className="font-label-telemetry text-[12px] text-on-surface font-semibold">
              Van #402 • 0.8 mi away
            </span>
          </div>
          <button
            type="button"
            className="px-3 py-1 rounded-lg bg-surface-container-high/90 text-primary group-hover:text-on-surface text-[11px] font-label-caps uppercase tracking-wider flex items-center gap-1 backdrop-blur-md border border-outline-variant/30"
          >
            <span>Live Route</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Detailed Interactive Milestones Timeline */}
      <div className="bg-surface-container rounded-2xl p-4 shadow-xl space-y-4 border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">route</span>
            <h2 className="font-headline-sm text-[16px] text-on-surface font-bold">Milestones Telemetry</h2>
          </div>
          <span className="font-label-telemetry text-[11px] text-secondary-fixed bg-secondary/15 px-2 py-0.5 rounded font-semibold uppercase border border-secondary/20">
            5 / 5 Logged
          </span>
        </div>

        {/* Timeline Conduit */}
        <div className="relative pl-7 space-y-5">
          <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-surface-container-highest" />

          {/* STEP 4: CURRENT (In Progress) */}
          <div className="relative group">
            <div className="absolute -left-7 top-1.5 flex items-center justify-center">
              <span className="animate-ping absolute h-6 w-6 rounded-full bg-secondary/40" />
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-on-secondary text-[14px] font-bold">
                  local_shipping
                </span>
              </div>
            </div>
            <div className="bg-surface-container-high rounded-xl p-3.5 space-y-2 shadow-md border border-outline-variant/30">
              <div className="flex items-start justify-between gap-2">
                <span className="font-headline-sm text-[15px] text-secondary font-bold leading-tight">
                  Out for Final Delivery
                </span>
                <span className="font-label-telemetry text-[11px] text-secondary-fixed font-bold shrink-0">
                  1:12 PM
                </span>
              </div>
              <p className="text-[13px] text-on-surface leading-snug">
                Courier in transit to local address destination.
              </p>

              {/* Driver Card Sub-item */}
              <div className="mt-2 pt-1 flex items-center justify-between bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={APP_ASSETS.elenaCourier}
                    alt="Elena Rostova courier"
                    className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-secondary/50"
                  />
                  <div className="min-w-0">
                    <div className="text-[13px] text-on-surface font-bold truncate">Elena Rostova</div>
                    <div className="font-label-telemetry text-[11px] text-on-surface-variant truncate">
                      Van #402 • Seattle Depot
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onCallCourier}
                  aria-label="Call Courier"
                  className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary hover:text-on-surface active:scale-90 transition-transform cursor-pointer border border-outline-variant/20"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                </button>
              </div>
            </div>
          </div>

          {/* STEP 3: Completed */}
          <div className="relative">
            <div className="absolute -left-7 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-on-primary text-[14px]">check</span>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-[14px] text-on-surface font-bold">
                  Arrived at Regional Center
                </span>
                <span className="font-label-telemetry text-[11px] text-on-surface-variant">06:45 AM</span>
              </div>
              <p className="text-[12px] text-on-surface-variant">Seattle SORT Logistics Facility (Bay 14)</p>
              <span className="inline-block font-label-caps text-[10px] uppercase text-outline">
                Processed & Sorted for dispatch
              </span>
            </div>
          </div>

          {/* STEP 2: Completed */}
          <div className="relative">
            <div className="absolute -left-7 top-1 w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-[14px]">flight</span>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-[14px] text-on-surface font-semibold">
                  Departed Sort Hub
                </span>
                <span className="font-label-telemetry text-[11px] text-on-surface-variant">Yesterday, 11:20 PM</span>
              </div>
              <p className="text-[12px] text-on-surface-variant">Sacramento Air Logistics Hub (Flight FX-804)</p>
            </div>
          </div>

          {/* STEP 1: Completed */}
          <div className="relative">
            <div className="absolute -left-7 top-1 w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30">
              <span className="material-symbols-outlined text-outline text-[14px]">inventory_2</span>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-[14px] text-on-surface font-semibold">
                  Picked Up & Scanned
                </span>
                <span className="font-label-telemetry text-[11px] text-on-surface-variant">Yesterday, 4:15 PM</span>
              </div>
              <p className="text-[12px] text-on-surface-variant">San Jose Fulfillment Center</p>
            </div>
          </div>

          {/* STEP 0: Initial */}
          <div className="relative">
            <div className="absolute -left-7 top-1 w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30">
              <span className="material-symbols-outlined text-outline text-[14px]">receipt_long</span>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-[14px] text-on-surface font-semibold">
                  Shipping Info Received
                </span>
                <span className="font-label-telemetry text-[11px] text-on-surface-variant">Nov 12, 10:00 AM</span>
              </div>
              <p className="text-[12px] text-on-surface-variant">Billing details & manifest verified by sender</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Instructions Card */}
      <div className="bg-surface-container rounded-2xl p-4 space-y-3 border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-[15px] text-on-surface font-bold">Delivery Protocol</span>
          <span className="font-label-caps text-[10px] uppercase text-secondary font-semibold">
            Active Gate Code
          </span>
        </div>
        <div className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between border border-outline-variant/20">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[20px]">pin</span>
            <div>
              <div className="font-label-telemetry text-[13px] text-on-surface font-bold">
                {packageItem.gateCode}
              </div>
              <div className="text-[11px] text-on-surface-variant">{packageItem.dropInstructions}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onEditGateCode}
            className="text-primary hover:text-on-surface font-label-caps text-[11px] uppercase font-bold p-1 cursor-pointer"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Bottom Floating Tactical Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-xl px-4 py-3 pb-safe shadow-[0_-8px_24px_rgba(0,0,0,0.6)] border-t border-outline-variant/30">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onOpenManageDelivery}
            className="h-12 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-bright flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-md cursor-pointer border border-outline-variant/30 font-bold"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">tune</span>
            <span className="font-label-caps text-[11px] uppercase tracking-wider">Manage Delivery</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="h-12 rounded-xl bg-primary-container text-on-primary-container hover:brightness-110 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
            <span className="font-label-caps text-[11px] uppercase tracking-wider">Share Tracking</span>
          </button>
        </div>
      </div>
    </div>
  );
};
