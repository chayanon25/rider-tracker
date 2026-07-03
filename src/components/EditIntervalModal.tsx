import { useState } from 'react';
import type { MaintenanceItemType } from '../types';
import { X, Trash2 } from 'lucide-react';

interface EditIntervalModalProps {
  item: MaintenanceItemType;
  onClose: () => void;
  onSave: (newInterval: number) => void;
  onDelete?: () => void;
}

export function EditIntervalModal({ item, onClose, onSave, onDelete }: EditIntervalModalProps) {
  const currentVal = item.currentInterval ?? item.defaultInterval;
  const [value, setValue] = useState<number>(currentVal);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value > 0) {
      onSave(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-[32px] w-full max-w-sm p-6 shadow-xl border border-slate-100 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-extrabold text-slate-950 dark:text-white">ตั้งค่าการตรวจสอบ</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {showConfirmDelete ? (
          <div className="space-y-4 py-2">
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
              คุณแน่ใจหรือไม่ว่าต้องการลบรายการบำรุงรักษา <strong>{item.name}</strong> ออกจากรถคันนี้?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-bold dark:text-white text-xs cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-500/20 cursor-pointer"
              >
                ยืนยันลบ
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              ปรับเปลี่ยนระยะทางเตือนสำหรับ <strong>{item.name}</strong> (ค่าเริ่มต้นจากโรงงาน: {item.defaultInterval.toLocaleString()} กม.)
            </p>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                ระยะแจ้งเตือนรอบถัดไป (กิโลเมตร)
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold"
                min={100}
                required
              />
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {onDelete && (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-2xl transition-colors cursor-pointer"
                  title="ลบรายการนี้"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-2xl font-bold dark:text-white text-xs cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
              >
                บันทึก
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
