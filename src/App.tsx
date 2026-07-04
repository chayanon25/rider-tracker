import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useMaintenance } from './hooks/useMaintenance';
import { useFinance } from './hooks/useFinance';
import { Garage } from './components/Garage';
import { Dashboard } from './components/Dashboard';
import { Finance } from './components/Finance';
import { Analytics } from './components/Analytics';
import { Navigation } from './components/Navigation';
import { LogOut } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        {/* Soft background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 -translate-y-1/2 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>

        <div className="w-full max-w-md text-center premium-card p-10 relative z-10 bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 shadow-2xl">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Work<span className="bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Notes</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed px-4">
            แอปผู้ช่วยอัจฉริยะ ติดตามระยะบำรุงรักษามอเตอร์ไซค์สำหรับไรเดอร์มืออาชีพ บันทึกรายรับรายจ่ายแบบเรียลไทม์ ซิงค์ข้ามอุปกรณ์ไร้กังวล
          </p>
          <button 
            onClick={signInWithGoogle} 
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-indigo-600/20 active:scale-[0.97] cursor-pointer text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fillRule="evenodd" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            เข้าใช้งานด้วยบัญชี Google
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
            <div className="flex items-center">
              <div>
                <h1 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight md:hidden">WorkNotes</h1>
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
