import { useState } from 'react';
import type { Vehicle } from '../types';
import { VEHICLE_MODELS } from '../data/vehicles';
import { Plus, Bike } from 'lucide-react';

interface GarageProps {
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  onSelectVehicle: (id: string) => void;
  onAddVehicle: (modelId: string, name: string, initialOdo: number) => Promise<void>;
}

export function Garage({ vehicles, activeVehicle, onSelectVehicle, onAddVehicle }: GarageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [modelId, setModelId] = useState(VEHICLE_MODELS[0].id);
  const [initialOdo, setInitialOdo] = useState<string>('0');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddVehicle(modelId, name, parseInt(initialOdo) || 0);
      setName('');
      setInitialOdo('0');
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (vehicles.length === 0 && !showAddForm) {
    return (
      <div className="premium-card border-dashed border-2 border-slate-200 dark:border-slate-800 text-center p-10 bg-white/30 dark:bg-transparent">
        <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-900 rounded-3xl mb-4">
          <Bike className="text-slate-400 dark:text-slate-500" size={32} />
        </div>
        <h3 className="font-extrabold text-lg text-slate-800 dark:text-white mb-1.5">ยังไม่มีรถในโรงรถของคุณ</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">เพิ่มมอเตอร์ไซค์คันแรกเพื่อเริ่มคำนวณและแจ้งเตือนระยะการบำรุงรักษา</p>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:scale-102 active:scale-98 transition-all cursor-pointer text-sm"
        >
          เพิ่มรถคันแรก
        </button>
      </div>
    );
  }

  return (
    <div>
      {showAddForm ? (
        <div className="premium-card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold mb-5 text-slate-950 dark:text-white">เพิ่มรถมอเตอร์ไซค์</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">ชื่อรถ (เช่น แดงซิ่ง, Click คันแรก)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                placeholder="ระบุชื่อเรียก"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">รุ่นรถ</label>
              <select
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm cursor-pointer"
              >
                {VEHICLE_MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">เลขไมล์ปัจจุบัน (กิโลเมตร)</label>
              <input
                type="number"
                value={initialOdo}
                onChange={(e) => setInitialOdo(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                min={0}
                required
              />
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl font-bold dark:text-white text-center text-sm transition-all cursor-pointer"
                disabled={isSubmitting}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-center text-sm transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {vehicles.map((v) => (
            <button
              key={v.id}
              onClick={() => onSelectVehicle(v.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-200 hover_premium cursor-pointer ${
                activeVehicle?.id === v.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-transparent'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {v.name}
            </button>
          ))}
          <button
            onClick={() => setShowAddForm(true)}
            className="p-2.5 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 hover:border-slate-400 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="เพิ่มรถ"
          >
            <Plus size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
