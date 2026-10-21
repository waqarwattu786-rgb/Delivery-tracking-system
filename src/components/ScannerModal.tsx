import React, { useState } from 'react';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (code: string) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onScanResult,
}) => {
  const [torchOn, setTorchOn] = useState(false);

  if (!isOpen) return null;

  const sampleBarcodes = [
    { label: 'FedEx Priority', code: 'TRK-9842-8810' },
    { label: 'DHL Worldwide', code: 'DHL-4091-893' },
    { label: 'UPS Ground', code: '1Z-899-281-03' },
    { label: 'USPS Priority', code: '9400-1112-99' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between text-on-surface pt-2">
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center cursor-pointer border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="font-headline-sm text-[15px] font-bold">Tactical Scanner</span>
          <span className="text-[11px] text-primary font-label-telemetry">ALIGN BARCODE / QR</span>
        </div>

        <button
          type="button"
          onClick={() => setTorchOn(!torchOn)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer border border-outline-variant/30 transition-colors ${
            torchOn ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container-high text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {torchOn ? 'flashlight_on' : 'flashlight_off'}
          </span>
        </button>
      </div>

      {/* Viewfinder Target */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="relative w-64 h-64 rounded-2xl border-2 border-primary/40 bg-surface-container-low/40 flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(77,142,255,0.2)]">
          {/* Corner brackets */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-primary" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-primary" />

          {/* Glowing laser scanning line */}
          <div className="absolute inset-x-0 h-0.5 bg-secondary shadow-[0_0_12px_#4edea3] animate-bounce" />

          {/* Subdued viewfinder grid */}
          <div className="text-outline/40 text-center space-y-1">
            <span className="material-symbols-outlined text-[48px]">barcode_scanner</span>
            <p className="text-[11px] font-label-telemetry">Point camera at shipping label</p>
          </div>
        </div>

        <p className="text-[12px] text-on-surface-variant mt-4 text-center">
          Tap a sample barcode below to simulate instant detection:
        </p>

        {/* Quick Sample Barcode Pills */}
        <div className="flex flex-wrap gap-2 justify-center mt-3 max-w-sm">
          {sampleBarcodes.map((b) => (
            <button
              key={b.code}
              type="button"
              onClick={() => {
                onScanResult(b.code);
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-telemetry text-[11px] border border-outline-variant/30 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[14px] text-secondary">check</span>
              <span>{b.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="pb-safe text-center">
        <p className="text-[11px] text-outline">
          Supports Code 128, QR Code, DataMatrix, FedEx Astra & UPS MaxiCode
        </p>
      </div>
    </div>
  );
};
