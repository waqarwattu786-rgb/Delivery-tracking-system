import React, { useState, useEffect } from 'react';
import { RouteStop } from '../types';
import { APP_ASSETS, LIVE_ROUTE_STOPS } from '../data/shipments';

interface LiveMapScreenProps {
  onCallCourier: () => void;
  onOpenInstructions: () => void;
  onChangeDropOff: () => void;
  onLeaveWithNeighbor: () => void;
  onToast: (msg: string) => void;
}

export const LiveMapScreen: React.FC<LiveMapScreenProps> = ({
  onCallCourier,
  onOpenInstructions,
  onChangeDropOff,
  onLeaveWithNeighbor,
  onToast,
}) => {
  const [is3D, setIs3D] = useState(false);
  const [showTraffic, setShowTraffic] = useState(true);
  const [speed, setSpeed] = useState(28);
  const [vanOffset, setVanOffset] = useState({ x: 162, y: 138 });
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [routeStops] = useState<RouteStop[]>(LIVE_ROUTE_STOPS);

  // Subtle realistic telemetry fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      // Small fluctuations in speed between 22 and 31 MPH
      setSpeed((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(18, Math.min(33, prev + delta));
      });
      // Micro drift along path
      setVanOffset((prev) => {
        const driftX = (Math.random() - 0.45) * 1.5;
        const driftY = (Math.random() - 0.45) * 1.2;
        return {
          x: Math.max(155, Math.min(185, prev.x + driftX)),
          y: Math.max(130, Math.min(155, prev.y + driftY)),
        };
      });
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  const handleCenter = () => {
    setVanOffset({ x: 162, y: 138 });
    onToast('Centered camera view on Van #402');
  };

  const handleToggle3D = () => {
    setIs3D(!is3D);
    onToast(!is3D ? 'Tactical 3D perspective enabled' : 'Top-down orthogonal map view');
  };

  const handleToggleTraffic = () => {
    setShowTraffic(!showTraffic);
    onToast(!showTraffic ? 'High-density telemetry layer on' : 'Traffic flow layer hidden');
  };

  const handlePresetClick = (preset: string) => {
    setSelectedPreset(preset);
    onToast(`Instruction dispatched to Elena: "${preset}"`);
  };

  return (
    <div className="flex flex-col w-full relative select-none pb-28 pt-2">
      {/* Interactive Tactical Map Canvas Area */}
      <div
        className={`relative w-full h-[360px] overflow-hidden rounded-2xl shadow-2xl bg-surface-container-lowest border border-outline-variant/30 transition-transform duration-500 ${
          is3D ? 'perspective-[700px]' : ''
        }`}
      >
        {/* Dark Vector Map Simulation SVG Layer */}
        <div
          className={`w-full h-full transition-transform duration-700 origin-bottom ${
            is3D ? 'scale-105 rotate-x-[26deg] -translate-y-2' : ''
          }`}
        >
          <svg
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 400 360"
          >
            <defs>
              {/* Route polyline gradient */}
              <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4d8eff" stopOpacity="0.9" />
                <stop offset="55%" stopColor="#adc6ff" stopOpacity="1" />
                <stop offset="100%" stopColor="#4edea3" stopOpacity="0.95" />
              </linearGradient>

              {/* Traffic Congestion gradients */}
              <linearGradient id="trafficCongestion" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ffb95f" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#4edea3" stopOpacity="0.5" />
              </linearGradient>

              {/* Pulsing radar rings */}
              <radialGradient id="destRadar" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4edea3" stopOpacity="0.65" />
                <stop offset="60%" stopColor="#4edea3" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#4edea3" stopOpacity="0" />
              </radialGradient>

              {/* Filter for tactical luminescence */}
              <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Grid & Secondary Streets */}
            <path
              d="M-20,40 L420,40 M-20,110 L420,110 M-20,180 L420,180 M-20,250 L420,250 M-20,310 L420,310"
              stroke="#1c1f2a"
              strokeWidth="1.5"
            />
            <path
              d="M40,-20 L40,380 M110,-20 L110,380 M190,-20 L190,380 M270,-20 L270,380 M350,-20 L350,380"
              stroke="#1c1f2a"
              strokeWidth="1.5"
            />

            {/* Highway arterial veins */}
            <path
              d="M-10,130 C90,140 130,220 220,230 S330,120 420,110"
              fill="none"
              stroke="#262a35"
              strokeLinecap="round"
              strokeWidth="8"
            />
            <path
              d="M-10,130 C90,140 130,220 220,230 S330,120 420,110"
              fill="none"
              stroke="#313540"
              strokeDasharray="8 6"
              strokeWidth="4"
            />

            {/* Traffic flow layer */}
            {showTraffic && (
              <path
                d="M-10,130 C90,140 130,220 220,230 S330,120 420,110"
                fill="none"
                stroke="url(#trafficCongestion)"
                strokeDasharray="14 10"
                strokeWidth="2.5"
                className="animate-pulse"
              />
            )}

            {/* Cross avenues */}
            <path d="M70,-10 C80,90 140,160 160,370" fill="none" stroke="#262a35" strokeWidth="6" />
            <path d="M290,-10 C260,110 310,210 340,370" fill="none" stroke="#262a35" strokeWidth="5" />

            {/* Completed Path Segment (faded cyan) */}
            <path
              d="M50,80 L105,80 L105,155 L178,155"
              fill="none"
              stroke="#4d8eff"
              strokeLinecap="round"
              strokeOpacity="0.3"
              strokeWidth="4"
            />

            {/* Active Animated Polyline to Destination */}
            <path
              id="activeRoute"
              d="M178,155 L245,155 C275,155 285,185 285,215 L285,275 L312,275"
              fill="none"
              filter="url(#neonBlur)"
              stroke="url(#routeGlow)"
              strokeDasharray="7 4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              className="animate-pulse"
            />

            {/* Destination Radar Waves */}
            <circle
              cx="312"
              cy="275"
              r="28"
              fill="url(#destRadar)"
              className="animate-ping"
              style={{ animationDuration: '2.8s' }}
            />
            <circle cx="312" cy="275" r="14" fill="#4edea3" fillOpacity="0.25" />

            {/* Hub Source Node (Stop 14) */}
            <circle cx="50" cy="80" r="5" fill="#424754" />
            <circle cx="50" cy="80" r="2.5" fill="#8c909f" />
          </svg>
        </div>

        {/* Top Left Floating Telemetry Chips */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high/90 backdrop-blur-md shadow-md text-on-surface border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-telemetry text-[11px] text-secondary uppercase tracking-wider">
              LIVE GPS
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-high/90 backdrop-blur-md shadow-md border border-outline-variant/30">
            <span className="material-symbols-outlined text-[16px] text-tertiary">speed</span>
            <span className="font-label-telemetry text-[11px] text-on-surface font-semibold">
              {speed} <span className="text-on-surface-variant font-normal">MPH</span>
            </span>
          </div>
        </div>

        {/* Top Right Map View Controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 pointer-events-auto">
          <button
            type="button"
            onClick={handleToggle3D}
            aria-label="Toggle 3D View"
            className={`w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high/90 backdrop-blur-md shadow-lg active:scale-95 transition-all cursor-pointer border border-outline-variant/30 ${
              is3D ? 'text-secondary ring-1 ring-secondary' : 'text-primary'
            }`}
          >
            <span className="font-label-caps text-[12px] font-bold">3D</span>
          </button>
          <button
            type="button"
            onClick={handleCenter}
            aria-label="Center on Delivery Courier"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high/90 backdrop-blur-md text-primary shadow-lg hover:bg-surface-bright active:scale-95 transition-all cursor-pointer border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[20px]">my_location</span>
          </button>
          <button
            type="button"
            onClick={handleToggleTraffic}
            aria-label="Toggle Traffic Conditions"
            className={`w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high/90 backdrop-blur-md shadow-lg active:scale-95 transition-all cursor-pointer border border-outline-variant/30 ${
              showTraffic ? 'text-secondary' : 'text-outline opacity-60'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">traffic</span>
          </button>
        </div>

        {/* Real-Time Delivery Courier Marker */}
        <div
          style={{ top: `${vanOffset.y}px`, left: `${vanOffset.x}px` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none transition-all duration-700 ease-out"
        >
          {/* Directional heading beam */}
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-primary opacity-80 mb-0.5 animate-bounce" />
          {/* Pulse halo & Courier icon */}
          <div className="relative w-11 h-11 rounded-full bg-primary-container flex items-center justify-center text-on-primary shadow-[0_0_18px_rgba(77,142,255,0.7)]">
            <span className="material-symbols-outlined text-[22px]">local_shipping</span>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
              <span className="material-symbols-outlined text-[10px] font-bold">bolt</span>
            </span>
          </div>
          <div className="mt-1 px-2 py-0.5 rounded-md bg-surface-container-lowest/90 backdrop-blur-md shadow-md flex items-center gap-1 border border-primary/30">
            <span className="font-label-telemetry text-[10px] text-primary font-bold">VAN #402</span>
          </div>
        </div>

        {/* Destination Pin (Home marker at Stop 16) */}
        <div className="absolute top-[260px] left-[300px] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-[0_0_16px_rgba(78,222,163,0.6)]">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              home
            </span>
          </div>
          <div className="mt-1 px-1.5 py-0.5 rounded bg-surface-container-lowest/90 text-on-surface font-label-caps text-[10px] border border-secondary/40">
            YOUR APT
          </div>
        </div>

        {/* Subtle bottom gradient feather for clean drawer transition */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-surface-container to-transparent pointer-events-none z-10" />
      </div>

      {/* Persistent Interactive Sliding Drawer / Bottom Sheet Stack */}
      <div className="relative z-30 -mt-3 flex flex-col w-full rounded-t-2xl bg-surface-container shadow-2xl p-4 gap-4 border-t border-outline-variant/30">
        {/* Drag Handle / Tactile Gripper */}
        <div className="w-full flex items-center justify-center pt-0.5 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-outline-variant/60" />
        </div>

        {/* ETA & Real-Time Status Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-tertiary/15 text-tertiary font-label-caps text-[10px] flex items-center gap-1 border border-tertiary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                IN PROGRESS
              </span>
              <span className="text-[12px] text-on-surface-variant truncate">Driver is 2 stops away</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-headline-xl-mobile text-[26px] text-on-surface tracking-tight font-extrabold tabular-nums">
                02:38 PM
              </span>
              <span className="text-[12px] text-secondary font-semibold">18 mins remaining</span>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-[22px]">timer</span>
            </div>
            <span className="font-label-telemetry text-[10px] text-on-surface-variant mt-1">ON SCHEDULE</span>
          </div>
        </div>

        {/* Driver Profile Tactical Glass Card */}
        <div className="w-full rounded-xl bg-surface-container-high p-3 shadow-md flex flex-col gap-3 border border-outline-variant/25">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={APP_ASSETS.elenaCourier}
                  alt="Elena Rostova courier"
                  className="w-12 h-12 rounded-xl object-cover shadow-sm ring-1 ring-outline-variant/40"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
                  <span className="material-symbols-outlined text-[10px] font-bold">verified</span>
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-[15px] text-on-surface truncate">Elena Rostova</span>
                  <span className="px-1.5 py-0.2 rounded bg-primary/15 text-primary font-label-caps text-[10px] shrink-0 border border-primary/20">
                    PRO
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 text-on-surface-variant text-[12px] truncate">
                  <span className="flex items-center text-tertiary">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="font-semibold ml-0.5 text-on-surface">4.98</span>
                  </span>
                  <span>•</span>
                  <span className="truncate">3,420+ deliveries</span>
                </div>
                <span className="font-label-telemetry text-[11px] text-primary-fixed-dim truncate mt-0.5">
                  Electric Transit Van #402
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onCallCourier}
              className="h-11 px-3 rounded-lg bg-surface-container-highest hover:bg-surface-bright active:scale-95 text-on-surface flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border border-outline-variant/20"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">phone_in_talk</span>
              <span className="font-label-caps text-[11px]">Call Courier</span>
            </button>
            <button
              type="button"
              onClick={onOpenInstructions}
              className="h-11 px-3 rounded-lg bg-primary text-on-primary hover:bg-primary-container active:scale-95 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span className="font-label-caps text-[11px]">Instructions</span>
            </button>
          </div>

          {/* Quick Delivery Preset Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
            <button
              type="button"
              onClick={() => handlePresetClick('Leave at door')}
              className={`px-2.5 py-1 rounded-full text-[12px] whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer border ${
                selectedPreset === 'Leave at door'
                  ? 'bg-secondary text-on-secondary font-semibold border-secondary'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-bright border-outline-variant/30'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">door_front</span>
              Leave at door
            </button>
            <button
              type="button"
              onClick={() => handlePresetClick('Gate code: 4921')}
              className={`px-2.5 py-1 rounded-full text-[12px] whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer border ${
                selectedPreset === 'Gate code: 4921'
                  ? 'bg-secondary text-on-secondary font-semibold border-secondary'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-bright border-outline-variant/30'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">pin</span>
              Gate code: 4921
            </button>
            <button
              type="button"
              onClick={() => handlePresetClick("Please don't ring")}
              className={`px-2.5 py-1 rounded-full text-[12px] whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer border ${
                selectedPreset === "Please don't ring"
                  ? 'bg-secondary text-on-secondary font-semibold border-secondary'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-bright border-outline-variant/30'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">notifications_off</span>
              Please don't ring
            </button>
          </div>
        </div>

        {/* Live Stop Progression Milestone Conduit */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-[15px] text-on-surface">Route Progression</span>
            <span className="font-label-telemetry text-[11px] text-secondary">LIVE FEED</span>
          </div>

          <div className="flex flex-col w-full bg-surface-container-high rounded-xl p-3.5 border border-outline-variant/25">
            {/* Milestone 1: Stop 14 (Completed) */}
            <div className="flex items-start gap-3 relative pb-4">
              <div className="absolute left-3.5 top-6 bottom-0 w-0.5 bg-secondary" />
              <div className="relative z-10 w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary shrink-0 shadow-md">
                <span className="material-symbols-outlined text-[15px] font-bold">check</span>
              </div>
              <div className="flex items-center justify-between w-full min-w-0">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-label-telemetry text-[13px] text-on-surface font-semibold">Stop 14</span>
                    <span className="px-1.5 py-0.2 rounded bg-surface-container-highest text-on-surface-variant font-label-caps text-[10px] border border-outline-variant/20">
                      DELIVERED
                    </span>
                  </div>
                  <span className="text-[12px] text-on-surface-variant truncate mt-0.5">
                    Oak Street Hub • Package dropped
                  </span>
                </div>
                <span className="font-label-telemetry text-[11px] text-on-surface-variant shrink-0">02:14 PM</span>
              </div>
            </div>

            {/* Milestone 2: Stop 15 (Current Drop-off) */}
            <div className="flex items-start gap-3 relative pb-4">
              <div className="absolute left-3.5 top-6 bottom-0 w-0.5 bg-surface-container-highest" />
              <div className="relative z-10 w-7 h-7 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary shrink-0 shadow-[0_0_12px_rgba(255,185,95,0.4)]">
                <span className="material-symbols-outlined text-[15px] animate-spin" style={{ animationDuration: '4s' }}>
                  sync
                </span>
              </div>
              <div className="flex items-center justify-between w-full min-w-0">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-label-telemetry text-[13px] text-tertiary font-bold">Stop 15</span>
                    <span className="px-1.5 py-0.2 rounded bg-tertiary/20 text-tertiary font-label-caps text-[10px] font-semibold border border-tertiary/30">
                      UNLOADING
                    </span>
                  </div>
                  <span className="text-[12px] text-on-surface truncate mt-0.5">
                    Maple Ave. • 1 package remaining
                  </span>
                </div>
                <span className="font-label-telemetry text-[11px] text-tertiary font-semibold shrink-0">NOW</span>
              </div>
            </div>

            {/* Milestone 3: Stop 16 (Your Address) */}
            <div className="flex items-start gap-3 relative">
              <div className="relative z-10 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-[0_0_14px_rgba(77,142,255,0.5)]">
                <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  home
                </span>
              </div>
              <div className="flex items-center justify-between w-full min-w-0">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-label-telemetry text-[13px] text-primary font-bold">Stop 16</span>
                    <span className="px-1.5 py-0.2 rounded bg-primary/20 text-primary font-label-caps text-[10px] border border-primary/30">
                      DESTINATION
                    </span>
                  </div>
                  <span className="text-[12px] text-on-surface font-semibold truncate mt-0.5">
                    742 Evergreen Terr, Apt 4B
                  </span>
                  <span className="text-[11px] text-on-surface-variant truncate">
                    Signature verification required
                  </span>
                </div>
                <span className="font-label-telemetry text-[11px] text-primary font-bold shrink-0">02:38 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action / Reschedule Utility Capsule Bar */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={onChangeDropOff}
            className="flex-1 h-11 px-3 rounded-lg bg-surface-container-high hover:bg-surface-bright active:scale-95 text-on-surface flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">edit_location_alt</span>
            <span className="font-label-caps text-[11px] truncate">Change Drop-off</span>
          </button>
          <button
            type="button"
            onClick={onLeaveWithNeighbor}
            className="flex-1 h-11 px-3 rounded-lg bg-surface-container-high hover:bg-surface-bright active:scale-95 text-on-surface flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">handshake</span>
            <span className="font-label-caps text-[11px] truncate">Leave with Neighbor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
