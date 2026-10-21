import React, { useState, useEffect } from 'react';
import { APP_ASSETS } from '../data/shipments';

interface CallCourierModalProps {
  isOpen: boolean;
  onClose: () => void;
  courierName?: string;
  vehicle?: string;
}

export const CallCourierModal: React.FC<CallCourierModalProps> = ({
  isOpen,
  onClose,
  courierName = 'Elena Rostova',
  vehicle = 'Van #402',
}) => {
  const [callState, setCallState] = useState<'connecting' | 'connected'>('connecting');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setCallState('connecting');
      setSeconds(0);
      return;
    }

    const connectTimer = setTimeout(() => {
      setCallState('connected');
    }, 1800);

    const callTimer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(callTimer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="max-w-xs w-full bg-surface-container-high rounded-3xl p-6 flex flex-col items-center text-center space-y-5 shadow-2xl border border-outline-variant/30">
        {/* Masked status */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-[11px] font-label-telemetry text-secondary border border-secondary/30">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          <span>TrackPulse Masked Voice Bridge</span>
        </div>

        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/30 shadow-xl">
            <img src={APP_ASSETS.elenaCourier} alt={courierName} className="w-full h-full object-cover" />
          </div>
          <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-md ring-2 ring-surface">
            <span className="material-symbols-outlined text-[14px] font-bold">phone</span>
          </span>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="font-headline-sm text-[18px] text-on-surface font-bold">{courierName}</h3>
          <p className="text-[12px] text-on-surface-variant">{vehicle} • Assigned Courier</p>
          <div className="font-label-telemetry text-[13px] text-primary pt-1">
            {callState === 'connecting' ? 'Connecting masked line...' : formatTime(seconds)}
          </div>
        </div>

        {/* Audio Waveform visualization */}
        {callState === 'connected' && (
          <div className="flex items-center justify-center gap-1 h-6">
            <div className="w-1 bg-secondary rounded-full h-3 animate-pulse" />
            <div className="w-1 bg-secondary rounded-full h-5 animate-pulse delay-75" />
            <div className="w-1 bg-secondary rounded-full h-2 animate-pulse delay-150" />
            <div className="w-1 bg-secondary rounded-full h-6 animate-pulse" />
            <div className="w-1 bg-secondary rounded-full h-4 animate-pulse delay-100" />
            <div className="w-1 bg-secondary rounded-full h-2 animate-pulse delay-200" />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border transition-colors ${
              isMuted
                ? 'bg-tertiary text-on-tertiary border-tertiary'
                : 'bg-surface-container text-on-surface border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{isMuted ? 'mic_off' : 'mic'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-14 h-14 rounded-full bg-error text-on-error flex items-center justify-center cursor-pointer shadow-lg hover:brightness-110 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[26px]">call_end</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border transition-colors ${
              isSpeaker
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-surface-container text-on-surface border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isSpeaker ? 'volume_up' : 'volume_down'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
