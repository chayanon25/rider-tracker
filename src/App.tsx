import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useMaintenance } from './hooks/useMaintenance';
import { useFinance } from './hooks/useFinance';
import { Garage } from './components/Garage';
import { Dashboard } from './components/Dashboard';
import { Finance } from './components/Finance';
import { Analytics } from './components/Analytics';
import { Navigation } from './components/Navigation';
import { Wrench, LogOut } from 'lucide-react';
import './index.css';

type TabType = 'maintenance' | 'finance' | 'analytics';

function App() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const { 
    vehicles, 
    activeVehicle, 
    loading: dbLoading, 
    addVehicle, 
    selectActiveVehicle, 
    updateOdometer, 
    logService, 
    updateItemInterval,
    addCustomItem,
    deleteItem
  } = useMaintenance(user?.uid);

  const {
    transactions,
    loading: financeLoading,
    addTransaction,
    deleteTransaction
  } = useFinance(user?.uid);

  const [activeTab, setActiveTab] = useState<TabType>('maintenance');

  const isLoading = authLoading || dbLoading || (user && financeLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wider">กำลังโหลดข้อมูล...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800/80 p-8 rounded-[32px] shadow-xl shadow-slate-100/50 dark:shadow-none backdrop-blur-xl">
          <div className="inline-flex p-5 bg-blue-50 dark:bg-blue-950/40 rounded-3xl mb-8">
            <Wrench size={40} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">Rider Tracker</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed px-2">
            แอปผู้ช่วยอัจฉริยะ ติดตามระยะบำรุงรักษามอเตอร์ไซค์สำหรับไรเดอร์มืออาชีพ ซิงค์ข้ามอุปกรณ์ไร้กังวล
          </p>
          <button 
            onClick={signInWithGoogle} 
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-98 cursor-pointer text-base"
          >
            เข้าใช้งานด้วย Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Sidebar & Bottom Nav */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Layout */}
      <div className="md:pl-64 min-h-screen flex flex-col">
        <div className="w-full max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-12 space-y-6 flex-1">
          
          {/* Header (Top Nav) - Hidden on desktop sidebar logo but keeps user panel */}
          <header className="flex justify-between items-center premium-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600/10 rounded-2xl md:hidden">
                <Wrench size={22} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight md:hidden">Rider Tracker</h1>
                <h1 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight hidden md:block">
                  {activeTab === 'maintenance' && 'ระบบการดูแลรักษารถ'}
                  {activeTab === 'finance' && 'ระบบบัญชีการเงิน'}
                  {activeTab === 'analytics' && 'ระบบวิเคราะห์สถิติ'}
                </h1>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{user.displayName}</p>
              </div>
            </div>
            <button 
              onClick={signOut} 
              className="p-2.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl transition-all cursor-pointer"
              title="ออกจากระบบ"
            >
              <LogOut size={18} />
            </button>
          </header>

          {/* Garage selection is only relevant for maintenance tab, or show it globally as layout */}
          {activeTab === 'maintenance' && (
            <section className="space-y-2">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">โรงรถของฉัน</span>
              <Garage
                vehicles={vehicles}
                activeVehicle={activeVehicle}
                onSelectVehicle={selectActiveVehicle}
                onAddVehicle={addVehicle}
              />
            </section>
          )}

          {/* Active Tab Content Routing */}
          <main>
            {activeTab === 'maintenance' && (
              activeVehicle ? (
                <section>
                  <Dashboard
                    vehicle={activeVehicle}
                    onUpdateOdometer={updateOdometer}
                    onLogService={logService}
                    onUpdateInterval={updateItemInterval}
                    onAddCustomItem={addCustomItem}
                    onDeleteItem={deleteItem}
                  />
                </section>
              ) : (
                vehicles.length > 0 && (
                  <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                    กรุณาเลือกรถจากโรงรถด้านบน
                  </div>
                )
              )
            )}

            {activeTab === 'finance' && (
              <section>
                <Finance
                  transactions={transactions}
                  onAddTransaction={addTransaction}
                  onDeleteTransaction={deleteTransaction}
                />
              </section>
            )}

            {activeTab === 'analytics' && (
              <section>
                <Analytics transactions={transactions} />
              </section>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}

export default App;
