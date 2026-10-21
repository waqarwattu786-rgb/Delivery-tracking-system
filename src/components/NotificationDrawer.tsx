import React from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  type: 'urgent' | 'live' | 'success';
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onClear: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-sm h-full bg-surface-container-high shadow-2xl p-4 flex flex-col justify-between border-l border-outline-variant/30 animate-in slide-in-from-right duration-300">
        <div className="space-y-4">
          <div className="flex items-center justify-between pt-safe">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">notifications</span>
              <h3 className="font-headline-sm text-[16px] text-on-surface font-bold">Live Activity</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-on-surface-variant px-1">
            <span>Recent alerts & dispatch triggers</span>
            <button
              type="button"
              onClick={onClear}
              className="text-primary hover:underline font-label-caps uppercase font-bold cursor-pointer"
            >
              Mark all read
            </button>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[70vh] no-scrollbar">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-outline space-y-2">
                <span className="material-symbols-outlined text-[36px]">notifications_none</span>
                <p className="text-[12px]">All caught up! No active alerts.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          n.type === 'urgent'
                            ? 'text-tertiary'
                            : n.type === 'success'
                            ? 'text-secondary'
                            : 'text-primary'
                        }`}
                      >
                        {n.icon}
                      </span>
                      <span className="text-[13px] text-on-surface font-semibold">{n.title}</span>
                    </div>
                    <span className="font-label-telemetry text-[10px] text-outline">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant pl-6">{n.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-bright text-on-surface font-bold text-[13px] cursor-pointer"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
