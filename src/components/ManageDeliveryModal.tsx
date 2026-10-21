import React, { useState } from 'react';
import { PackageItem } from '../types';

interface ManageDeliveryModalProps {
  packageItem: PackageItem;
  isOpen: boolean;
  onClose: () => void;
  onUpdateInstructions: (gateCode: string, instructions: string) => void;
  onPreSign: () => void;
  onToast: (msg: string) => void;
}

export const ManageDeliveryModal: React.FC<ManageDeliveryModalProps> = ({
  packageItem,
  isOpen,
  onClose,
  onUpdateInstructions,
  onPreSign,
  onToast,
}) => {
  const [isEditingGate, setIsEditingGate] = useState(false);
  const [gateCode, setGateCode] = useState(packageItem.gateCode || '#4829');
  const [instructions, setInstructions] = useState(
    packageItem.dropInstructions || 'Leave behind patio column if no answer'
  );

  if (!isOpen) return null;

  const handleSaveProtocol = () => {
    onUpdateInstructions(gateCode, instructions);
    setIsEditingGate(false);
    onToast('Delivery protocol updated');
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-sm flex flex-col justify-end p-4 pb-safe animate-in fade-in duration-200">
      <div className="max-w-md w-full mx-auto bg-surface-container-high rounded-2xl p-4 space-y-4 shadow-2xl border border-outline-variant/30 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline-sm text-[16px] text-on-surface font-bold">
              Manage Delivery Options
            </h3>
            <p className="text-[12px] text-on-surface-variant">Update shipment instructions before drop-off</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {isEditingGate ? (
          <div className="space-y-3 p-3 bg-surface-container rounded-xl border border-outline-variant/20">
            <div>
              <label className="text-[11px] font-label-caps uppercase text-on-surface-variant">
                Gate / Access Code
              </label>
              <input
                type="text"
                value={gateCode}
                onChange={(e) => setGateCode(e.target.value)}
                placeholder="e.g. #4829 or Call Apt 4B"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-surface-container-highest text-on-surface font-label-telemetry text-[13px] border border-outline-variant/30 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-label-caps uppercase text-on-surface-variant">
                Driver Instructions
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                placeholder="Leave behind patio column..."
                className="w-full mt-1 px-3 py-2 rounded-lg bg-surface-container-highest text-on-surface text-[13px] border border-outline-variant/30 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingGate(false)}
                className="flex-1 py-2 rounded-lg bg-surface-container-high text-on-surface text-[12px] font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProtocol}
                className="flex-1 py-2 rounded-lg bg-primary text-on-primary text-[12px] font-bold cursor-pointer shadow-md"
              >
                Save Protocol
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Option 1: Hold at Locker */}
            <button
              type="button"
              onClick={() => {
                onToast('Redirected to Local FedEx Locker at 4th Ave');
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl bg-surface-container hover:bg-surface-bright flex items-center justify-between transition-colors border border-outline-variant/20 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[22px]">storefront</span>
                <div>
                  <div className="text-[13px] text-on-surface font-semibold">Hold at FedEx Location</div>
                  <div className="text-[11px] text-on-surface-variant">Pick up at 4th Ave Grocery Locker</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
            </button>

            {/* Option 2: Pre-Sign Electronically */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onPreSign();
              }}
              className="w-full text-left p-3 rounded-xl bg-surface-container hover:bg-surface-bright flex items-center justify-between transition-colors border border-outline-variant/20 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-[22px]">stylus_note</span>
                <div>
                  <div className="text-[13px] text-on-surface font-semibold">Pre-Sign Electronically</div>
                  <div className="text-[11px] text-on-surface-variant">
                    Waives direct physical contact requirement
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
            </button>

            {/* Option 3: Update Gate / Access Code */}
            <button
              type="button"
              onClick={() => setIsEditingGate(true)}
              className="w-full text-left p-3 rounded-xl bg-surface-container hover:bg-surface-bright flex items-center justify-between transition-colors border border-outline-variant/20 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary text-[22px]">key</span>
                <div>
                  <div className="text-[13px] text-on-surface font-semibold">Update Gate / Access Code</div>
                  <div className="text-[11px] text-on-surface-variant">
                    Provide fresh building pin or buzzer info
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
