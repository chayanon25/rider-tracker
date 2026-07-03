import { useState, useEffect } from 'react';
import type { Vehicle } from '../types';
import { Sun, Moon, Edit3, Check, Plus, Wrench } from 'lucide-react';
import { MaintenanceList } from './MaintenanceList';

interface DashboardProps {
  vehicle: Vehicle;
  onUpdateOdometer: (odo: number) => Promise<void>;
  onLogService: (itemId: string, serviceOdo: number) => Promise<void>;
  onUpdateInterval: (itemId: string, newInterval: number) => Promise<void>;
  onAddCustomItem: (name: string, interval: number) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
}

export function Dashboard({ 
  vehicle, 
  onUpdateOdometer, 
  onLogService, 
  onUpdateInterval,
  onAddCustomItem,
  onDeleteItem
}: DashboardProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [isEditingOdo, setIsEditingOdo] = useState(false);
  const [odoInput, setOdoInput] = useState(vehicle.odometer.toString());
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customInterval, setCustomInterval] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setOdoInput(vehicle.odometer.toString());
  }, [vehicle.odometer]);

  const handleOdoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newOdo = parseInt(odoInput);
    if (!isNaN(newOdo) && newOdo >= 0) {
      await onUpdateOdometer(newOdo);
      setIsEditingOdo(false);
    }
  };

  const handleAddCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const intervalVal = parseInt(customInterval);
    if (!customName.trim() || isNaN(intervalVal) || intervalVal <= 0) return;

    setIsAdding(true);
    try {
      await onAddCustomItem(customName, intervalVal);
      setCustomName('');
      setCustomInterval('');
      setShowAddCustom(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper bar: Welcome & Theme Toggle */}
      <div className="flex justify-between items-center premium-card p-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">รุ่นรถปัจจุบัน</span>
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight mt-0.5">{vehicle.name}</h3>
        </div>
        
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="เปลี่ยนโหมดสี"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      {/* Main Odometer Display */}
      <div className="premium-card p-8 text-center relative overflow-hidden bg-gradient-to-br from-blue-50/40 via-white/80 to-indigo-50/20 dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-950/20 border-blue-500/10 dark:border-slate-800">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl -mr-8 -mt-8"></div>
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">เลขไมล์สะสม</span>
        
        {isEditingOdo ? (
          <form onSubmit={handleOdoSubmit} className="flex justify-center items-center gap-3 mt-3 max-w-xs mx-auto">
            <input
              type="number"
              value={odoInput}
              onChange={(e) => setOdoInput(e.target.value)}
              className="text-4xl font-black text-center w-full bg-transparent border-b-2 border-blue-500 text-slate-950 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              autoFocus
              min={0}
            />
            <button type="submit" className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer">
              <Check size={18} />
            </button>
          </form>
        ) : (
          <div className="flex justify-center items-baseline gap-2 mt-2">
            <span className="text-5xl font-black text-slate-950 dark:text-white tracking-tight">
              {vehicle.odometer.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-slate-400 dark:text-slate-500">กม.</span>
            <button
              onClick={() => setIsEditingOdo(true)}
              className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-all ml-1 cursor-pointer"
              title="แก้ไขเลขไมล์"
            >
              <Edit3 size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Add Custom Item Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-2">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">รายการการบำรุงรักษา</span>
          <button
            onClick={() => setShowAddCustom(!showAddCustom)}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            <Plus size={14} />
            เพิ่มรายการแทร็กเอง
          </button>
        </div>

        {showAddCustom && (
          <div className="premium-card p-5 border border-blue-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-1.5">
              <Wrench size={14} className="text-blue-600" />
              เพิ่มรายการตรวจสอบที่ต้องการแทร็ก
            </h4>
            <form onSubmit={handleAddCustomSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">ชื่อรายการ (เช่น ล้างโซ่)</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="ชื่ออะไหล่/หัวข้อ"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">เตือนทุกๆ (กิโลเมตร)</label>
                  <input
                    type="number"
                    value={customInterval}
                    onChange={(e) => setCustomInterval(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="เช่น 1500"
                    min={100}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddCustom(false)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                  disabled={isAdding}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  disabled={isAdding}
                >
                  {isAdding ? 'กำลังเพิ่ม...' : 'เพิ่มรายการ'}
                </button>
              </div>
            </form>
          </div>
        )}

        <MaintenanceList
          vehicle={vehicle}
          onLogService={onLogService}
          onUpdateInterval={onUpdateInterval}
          onDeleteItem={onDeleteItem}
        />
      </div>
    </div>
  );
}
