import React from 'react';
import { PackageItem } from '../types';

interface ProofModalProps {
  packageItem: PackageItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProofModal: React.FC<ProofModalProps> = ({
  packageItem,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !packageItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-lowest/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-container-high rounded-2xl p-4 space-y-3.5 shadow-2xl border border-outline-variant/30 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">photo_camera</span>
            <h3 className="font-headline-sm text-[16px] text-on-surface font-bold">Proof of Delivery</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* High-res Photo Container */}
        <div className="relative rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/30 aspect-4/3">
          <img
            src={
              packageItem.proofPhoto ||
              'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
            }
            alt="Delivery Proof"
            className="w-full h-full object-cover"
          />
          {/* Watermark telemetry overlay */}
          <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-between text-[11px] font-label-telemetry border border-outline-variant/20">
            <span className="text-secondary font-bold">GPS: 47.6062° N, 122.3321° W</span>
            <span className="text-on-surface-variant">{packageItem.historyDateTag || 'Verified Drop-off'}</span>
          </div>
        </div>

        {/* Details list */}
        <div className="space-y-1.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-[12px]">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Package:</span>
            <span className="text-on-surface font-semibold truncate max-w-[200px]">{packageItem.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Tracking:</span>
            <span className="font-label-telemetry text-primary">{packageItem.trackingNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Drop Location:</span>
            <span className="text-on-surface">{packageItem.destinationType}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-bright text-on-surface font-bold text-[13px] cursor-pointer"
        >
          Close Photo Record
        </button>
      </div>
    </div>
  );
};
