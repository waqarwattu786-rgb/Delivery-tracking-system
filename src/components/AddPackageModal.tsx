import React, { useState } from 'react';
import { CarrierType, PackageItem } from '../types';

interface AddPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (pkg: PackageItem) => void;
  onToast: (msg: string) => void;
}

export const AddPackageModal: React.FC<AddPackageModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  onToast,
}) => {
  const [carrier, setCarrier] = useState<CarrierType>('FedEx');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [title, setTitle] = useState('');
  const [store, setStore] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      onToast('Please enter a tracking number');
      return;
    }

    const newPkg: PackageItem = {
      id: `pkg-${Date.now()}`,
      trackingNumber: trackingNumber.trim().toUpperCase(),
      title: title.trim() || `${carrier} Package`,
      subtitle: store.trim() ? `${store} via ${carrier}` : `Shipped via ${carrier}`,
      carrier,
      serviceType: `${carrier} Standard Tracked`,
      status: 'in_transit',
      statusLabel: 'In Transit • On Schedule',
      eta: 'In 2 Days',
      etaFormatted: 'Expected in 2-3 Business Days',
      progressPercent: 35,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80',
      weight: '1.10 kg',
      weightTare: '2.4 lbs tare gross',
      dimensions: '24×18×12',
      dimensionsUnit: 'Centimeters',
      originFacility: 'Regional Logistics Center',
      originLocation: 'United States',
      destination: 'Seattle, WA',
      destinationType: 'Residential Drop-Off',
      signatureRequired: false,
      gateCode: '#4829',
      dropInstructions: 'Leave at front entrance',
      checkpoints: [
        {
          id: `cp-${Date.now()}-1`,
          title: 'Package Processed at Sort Facility',
          location: 'Regional Logistics Hub',
          timestamp: 'Today, 11:45 AM',
          icon: 'local_shipping',
          isCompleted: true,
          isCurrent: true,
        },
      ],
    };

    onAdd(newPkg);
    onToast(`Added tracking for ${newPkg.title}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-container-high rounded-2xl p-5 space-y-4 shadow-2xl border border-outline-variant/30 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">add_circle</span>
            <h3 className="font-headline-sm text-[16px] text-on-surface font-bold">New Tracked Package</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Carrier Selector */}
          <div>
            <label className="text-[11px] font-label-caps uppercase text-on-surface-variant">Select Carrier</label>
            <div className="grid grid-cols-5 gap-1.5 mt-1.5">
              {(['FedEx', 'UPS', 'DHL', 'USPS', 'Amazon'] as CarrierType[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCarrier(c)}
                  className={`py-2 rounded-lg text-[11px] font-label-caps uppercase font-bold transition-all border cursor-pointer ${
                    carrier === c
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-outline-variant/20'
                  }`}
                >
                  {c === 'Amazon' ? 'AMZN' : c}
                </button>
              ))}
            </div>
          </div>

          {/* Tracking Number */}
          <div>
            <label className="text-[11px] font-label-caps uppercase text-on-surface-variant">
              Tracking Number *
            </label>
            <input
              type="text"
              required
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. TRK-7841-9210"
              className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-label-telemetry text-[13px] border border-outline-variant/30 focus:border-primary focus:outline-none uppercase"
            />
          </div>

          {/* Item Name */}
          <div>
            <label className="text-[11px] font-label-caps uppercase text-on-surface-variant">
              Item Name / Package Label
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Studio Monitor Headphones"
              className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface text-[13px] border border-outline-variant/30 focus:border-primary focus:outline-none"
            />
          </div>

          {/* Store / Merchant */}
          <div>
            <label className="text-[11px] font-label-caps uppercase text-on-surface-variant">
              Store / Vendor (Optional)
            </label>
            <input
              type="text"
              value={store}
              onChange={(e) => setStore(e.target.value)}
              placeholder="e.g. B&H Photo, Apple Store"
              className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface text-[13px] border border-outline-variant/30 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface text-[13px] font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-primary-container text-on-primary-container text-[13px] font-bold cursor-pointer shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              Start Tracking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
