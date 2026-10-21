import React, { useState } from 'react';
import { APP_ASSETS } from '../data/shipments';

interface ProfileScreenProps {
  onToast: (msg: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onToast }) => {
  const [carrierSyncs, setCarrierSyncs] = useState({
    fedex: true,
    ups: true,
    dhl: true,
    amazon: true,
    usps: true,
  });

  const [notifications, setNotifications] = useState({
    proximity: true,
    outForDelivery: true,
    proofPhotos: true,
    signatureAlerts: true,
  });

  const [gateCode, setGateCode] = useState('#4829');
  const [isEditingGate, setIsEditingGate] = useState(false);

  const toggleCarrier = (key: keyof typeof carrierSyncs) => {
    const updated = !carrierSyncs[key];
    setCarrierSyncs({ ...carrierSyncs, [key]: updated });
    onToast(`${key.toUpperCase()} integration ${updated ? 'enabled' : 'paused'}`);
  };

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    onToast('Notification preferences saved');
  };

  return (
    <div className="flex flex-col w-full pb-28 space-y-4 pt-1">
      {/* Profile Header Card */}
      <div className="relative rounded-2xl bg-gradient-to-b from-surface-container-high via-surface-container to-surface-container-low p-4 shadow-xl border border-outline-variant/30 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="relative">
            <img
              src={APP_ASSETS.userProfile}
              alt="User Avatar"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/40 shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-md">
              <span className="material-symbols-outlined text-[10px] font-bold">verified</span>
            </span>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-headline-sm text-[17px] text-on-surface truncate">Waqar Wattu</h2>
              <span className="px-2 py-0.2 rounded-full bg-primary/20 text-primary font-label-caps text-[9px] uppercase font-bold border border-primary/30">
                PRO
              </span>
            </div>
            <p className="text-[12px] text-on-surface-variant truncate">waqarwattu786@gmail.com</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-secondary flex items-center gap-1 font-label-telemetry">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Active Subscriber
              </span>
              <span className="text-outline text-[11px]">•</span>
              <span className="text-[11px] text-on-surface-variant font-label-telemetry">28 Deliveries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Delivery Addresses & Protocols */}
      <div className="rounded-2xl bg-surface-container p-4 space-y-3 shadow-md border border-outline-variant/25">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">home_pin</span>
            <h3 className="font-headline-sm text-[15px] text-on-surface">Primary Drop Destination</h3>
          </div>
          <span className="font-label-caps text-[10px] text-primary uppercase font-bold">Default</span>
        </div>

        <div className="bg-surface-container-low p-3 rounded-xl space-y-2 border border-outline-variant/20">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[13px] text-on-surface font-semibold">742 Evergreen Terr, Apt 4B</div>
              <div className="text-[11px] text-on-surface-variant">Seattle, WA 98101</div>
            </div>
            <span className="material-symbols-outlined text-outline text-[18px]">verified</span>
          </div>

          <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[16px]">pin</span>
              <span className="text-[11px] text-on-surface-variant">Gate Code:</span>
              {isEditingGate ? (
                <input
                  type="text"
                  value={gateCode}
                  onChange={(e) => setGateCode(e.target.value)}
                  className="w-20 px-1 py-0.5 rounded bg-surface-container-highest text-primary font-label-telemetry text-[11px] focus:outline-none"
                />
              ) : (
                <span className="font-label-telemetry text-primary text-[12px] font-bold">{gateCode}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                if (isEditingGate) {
                  onToast(`Gate code updated to ${gateCode}`);
                }
                setIsEditingGate(!isEditingGate);
              }}
              className="text-primary hover:text-on-surface font-label-caps text-[11px] uppercase font-bold cursor-pointer"
            >
              {isEditingGate ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>
      </div>

      {/* Connected Carrier Sync Integrations */}
      <div className="rounded-2xl bg-surface-container p-4 space-y-3 shadow-md border border-outline-variant/25">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">sync_alt</span>
            <h3 className="font-headline-sm text-[15px] text-on-surface">Carrier Integrations</h3>
          </div>
          <span className="font-label-telemetry text-[11px] text-secondary">5 CONNECTED</span>
        </div>

        <div className="space-y-2">
          {[
            { id: 'fedex', label: 'FedEx Overnight & Ground', code: 'FDX', act: '2 packages' },
            { id: 'ups', label: 'UPS MyChoice & Ground', code: 'UPS', act: '1 package' },
            { id: 'dhl', label: 'DHL Express Worldwide', code: 'DHL', act: '1 package' },
            { id: 'amazon', label: 'Amazon Delivery Logistics', code: 'AMZN', act: 'Live sync' },
            { id: 'usps', label: 'USPS Informed Delivery', code: 'USPS', act: 'Idle' },
          ].map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/15"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-label-caps text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded font-bold">
                  {c.code}
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] text-on-surface font-semibold truncate">{c.label}</div>
                  <div className="text-[11px] text-on-surface-variant truncate">{c.act}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleCarrier(c.id as keyof typeof carrierSyncs)}
                className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                  carrierSyncs[c.id as keyof typeof carrierSyncs]
                    ? 'bg-secondary justify-end'
                    : 'bg-surface-container-highest justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-surface shadow-md" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Real-Time Push & Proximity Alerts */}
      <div className="rounded-2xl bg-surface-container p-4 space-y-3 shadow-md border border-outline-variant/25">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary text-[20px]">notifications_active</span>
          <h3 className="font-headline-sm text-[15px] text-on-surface">Tactical Telemetry Alerts</h3>
        </div>

        <div className="space-y-2">
          {[
            {
              id: 'proximity',
              title: 'Proximity Warning',
              desc: 'Vibrate & ping when driver is 2 stops away',
            },
            {
              id: 'outForDelivery',
              title: 'Morning Route Dispatch',
              desc: 'Notify upon loading onto local courier vehicle',
            },
            {
              id: 'proofPhotos',
              title: 'Delivery Photo Scans',
              desc: 'High-res porch snapshot instant preview',
            },
            {
              id: 'signatureAlerts',
              title: 'Mandatory Signature Prompts',
              desc: 'Prompt pre-sign authorization options',
            },
          ].map((n) => (
            <div
              key={n.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/15"
            >
              <div className="min-w-0 pr-2">
                <div className="text-[13px] text-on-surface font-semibold">{n.title}</div>
                <div className="text-[11px] text-on-surface-variant">{n.desc}</div>
              </div>
              <button
                type="button"
                onClick={() => toggleNotif(n.id as keyof typeof notifications)}
                className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                  notifications[n.id as keyof typeof notifications]
                    ? 'bg-primary justify-end'
                    : 'bg-surface-container-highest justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-surface shadow-md" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* App Info & Diagnostics */}
      <div className="p-3 text-center space-y-1 text-on-surface-variant">
        <p className="font-label-telemetry text-[11px] text-outline">
          TrackPulse Engine v3.4.2-rel • Ultra-Low Latency Telemetry
        </p>
        <p className="text-[10px] text-outline-variant">
          Connected to FedEX, UPS, DHL, Amazon & USPS Feeds
        </p>
      </div>
    </div>
  );
};
