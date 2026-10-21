import React, { useRef, useState, useEffect } from 'react';
import { PackageItem } from '../types';

interface PreSignModalProps {
  packageItem: PackageItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (signerName: string) => void;
}

export const PreSignModal: React.FC<PreSignModalProps> = ({
  packageItem,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [signerName, setSignerName] = useState('Waqar Wattu');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#4d8eff';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasSignature(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleConfirm = () => {
    onConfirm(signerName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-container-high rounded-2xl p-5 space-y-4 shadow-2xl border border-outline-variant/30 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[22px]">draw</span>
            <h3 className="font-headline-sm text-[16px] text-on-surface font-bold">
              Electronic Signature Authorization
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="text-[12px] text-on-surface-variant">
          You are authorizing contactless release for{' '}
          <span className="text-on-surface font-semibold">{packageItem.title}</span> (Tracking #{packageItem.trackingNumber}).
        </p>

        {/* Legal Signer Name */}
        <div>
          <label className="text-[11px] font-label-caps uppercase text-on-surface-variant">Full Legal Name</label>
          <input
            type="text"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-xl bg-surface-container-lowest text-on-surface text-[13px] border border-outline-variant/30 focus:border-primary focus:outline-none"
          />
        </div>

        {/* Signature Drawing Canvas */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-label-caps uppercase text-on-surface-variant">
              Draw Signature Below
            </label>
            <button
              type="button"
              onClick={clearCanvas}
              className="text-[11px] text-primary hover:underline cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="relative rounded-xl border border-outline-variant/40 bg-surface-container-lowest overflow-hidden h-36 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={340}
              height={144}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
              className="cursor-crosshair touch-none w-full h-full"
            />
            {!hasSignature && (
              <div className="absolute pointer-events-none text-outline/40 text-[12px] flex items-center gap-1 font-label-telemetry">
                <span className="material-symbols-outlined text-[16px]">gesture</span>
                Sign here with finger or mouse
              </div>
            )}
            <div className="absolute bottom-3 left-4 right-4 border-b border-outline-variant/20 pointer-events-none" />
          </div>
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
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl bg-secondary text-on-secondary text-[13px] font-bold cursor-pointer shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            Authorize Release
          </button>
        </div>
      </div>
    </div>
  );
};
