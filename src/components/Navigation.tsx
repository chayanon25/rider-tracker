import { Wrench, CircleDollarSign, BarChart3, Briefcase } from 'lucide-react';

interface NavigationProps {
  activeTab: 'maintenance' | 'finance' | 'analytics';
  onTabChange: (tab: 'maintenance' | 'finance' | 'analytics') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'maintenance', label: 'รถของฉัน', icon: Wrench },
    { id: 'finance', label: 'บันทึกบัญชี', icon: CircleDollarSign },
    { id: 'analytics', label: 'สถิติวิเคราะห์', icon: BarChart3 },
  ] as const;

  return (
    <>
      {/* Mobile: Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 glass-effect z-40 flex justify-around items-center px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-20 h-full transition-colors cursor-pointer ${
                isActive 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <Icon size={20} className={isActive ? 'scale-110 transition-transform' : ''} />
              <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Desktop: Sidebar Menu */}
      <aside className="hidden md:flex flex-col w-64 fixed top-0 left-0 bottom-0 bg-white/50 dark:bg-slate-900/30 border-r border-slate-200/60 dark:border-slate-800/80 glass-effect p-6 z-40">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-md shadow-indigo-500/20">
            <Briefcase size={22} />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight text-slate-900 dark:text-white leading-tight">WorkNotes</h1>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">SaaS Dashboard</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">เมนูนำทาง</span>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
