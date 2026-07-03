import { useState } from 'react';
import type { Vehicle, MaintenanceItemType } from '../types';
import { Settings, RotateCcw, AlertTriangle } from 'lucide-react';
import { EditIntervalModal } from './EditIntervalModal';

interface MaintenanceListProps {
  vehicle: Vehicle;
  onLogService: (itemId: string, serviceOdo: number) => Promise<void>;
  onUpdateInterval: (itemId: string, newInterval: number) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
}

export function MaintenanceList({ vehicle, onLogService, onUpdateInterval, onDeleteItem }: MaintenanceListProps) {
  const [editingItem, setEditingItem] = useState<MaintenanceItemType | null>(null);
  const [loggingItem, setLoggingItem] = useState<string | null>(null);
  const [customOdo, setCustomOdo] = useState<string>(vehicle.odometer.toString());

  const handleResetSubmit = async (itemId: string) => {
    const odoValue = parseInt(customOdo) || vehicle.odometer;
    await onLogService(itemId, odoValue);
    setLoggingItem(null);
  };

  return (
    <div className="space-y-4">
      {vehicle.maintenanceItems.map((item) => {
        const interval = item.currentInterval ?? item.defaultInterval;
        const mileageSinceService = vehicle.odometer - item.lastServiceMileage;
        const progressPercent = Math.min(100, Math.max(0, (mileageSinceService / interval) * 100));
        
        let statusColor = 'bg-emerald-500';
        let badgeBg = 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400';
        let cardBorder = 'border-slate-100 dark:border-slate-800/80';
        let barBg = 'bg-slate-100 dark:bg-slate-800';

        if (progressPercent >= 100) {
          statusColor = 'bg-rose-500';
          badgeBg = 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400';
          cardBorder = 'border-rose-200 dark:border-rose-950/50 bg-rose-500/5 dark:bg-rose-500/2';
          barBg = 'bg-rose-100 dark:bg-rose-950/40';
        } else if (progressPercent >= 80) {
          statusColor = 'bg-amber-500';
          badgeBg = 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400';
          cardBorder = 'border-amber-200 dark:border-amber-950/50 bg-amber-500/5 dark:bg-amber-500/2';
          barBg = 'bg-amber-100 dark:bg-amber-950/40';
        }

        return (
          <div key={item.id} className={`premium-card p-5 border transition-all duration-300 ${cardBorder}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-1.5">
                  {item.name}
                  {progressPercent >= 100 && <AlertTriangle size={15} className="text-rose-500 animate-pulse" />}
                </h4>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                  เตือนทุก {interval.toLocaleString()} กม. (ล่าสุดที่ {item.lastServiceMileage.toLocaleString()} กม.)
                </p>
              </div>
              <button 
                onClick={() => setEditingItem(item)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="ปรับระยะแจ้งเตือน / ลบ"
              >
                <Settings size={16} />
              </button>
            </div>

            {/* Progress bar info */}
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${badgeBg}`}>
                {mileageSinceService >= interval 
                  ? `เกินกำหนด ${(mileageSinceService - interval).toLocaleString()} กม.` 
                  : `อีก ${(interval - mileageSinceService).toLocaleString()} กม. ต้องเปลี่ยน`
                }
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                {mileageSinceService.toLocaleString()} / {interval.toLocaleString()} กม.
              </span>
            </div>

            {/* Progress Bar */}
            <div className={`w-full ${barBg} h-3 rounded-full overflow-hidden mb-4 shadow-inner`}>
              <div 
                className={`h-full rounded-full transition-all duration-500 ${statusColor}`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end">
              {loggingItem === item.id ? (
                <div className="flex items-center gap-2 w-full p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex-1 flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap">ทำที่ไมล์:</span>
                    <input
                      type="number"
                      value={customOdo}
                      onChange={(e) => setCustomOdo(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => handleResetSubmit(item.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    ตกลง
                  </button>
                  <button
                    onClick={() => setLoggingItem(null)}
                    className="px-2 py-2 text-slate-500 dark:text-slate-400 text-xs font-semibold cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setLoggingItem(item.id);
                    setCustomOdo(vehicle.odometer.toString());
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  บันทึกการเปลี่ยนอะไหล่
                </button>
              )}
            </div>
          </div>
        );
      })}

      {editingItem && (
        <EditIntervalModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={async (newInterval) => {
            await onUpdateInterval(editingItem.id, newInterval);
            setEditingItem(null);
          }}
          onDelete={async () => {
            await onDeleteItem(editingItem.id);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}
