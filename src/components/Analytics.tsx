import type { Transaction } from '../types';
import { Sparkles, TrendingUp, DollarSign, PieChart } from 'lucide-react';

interface AnalyticsProps {
  transactions: Transaction[];
}

export function Analytics({ transactions }: AnalyticsProps) {
  // 1. Math calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '0';

  // 2. Category totals (for expense breakdown)
  const categoryMap: Record<string, number> = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const categories = Object.keys(categoryMap);
  const maxCategoryValue = categories.length > 0 ? Math.max(...Object.values(categoryMap)) : 0;

  // 3. Generate last 7 days grouped data (Daily Income vs Expense)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i)); // Go from 6 days ago up to today
    return d.toISOString().split('T')[0];
  });

  const dailyData = last7Days.map(date => {
    const dayTxs = transactions.filter(t => t.date === date);
    const income = dayTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = dayTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    // Format date for label (e.g. "04/07/2026")
    const [year, month, day] = date.split('-');
    const label = `${day}/${month}/${year}`;

    return { date, label, income, expense };
  });

  // Find max value in daily data to scale the chart
  const maxDailyValue = Math.max(
    ...dailyData.map(d => Math.max(d.income, d.expense)),
    100 // Default baseline max height scale (e.g. 100 Baht)
  );

  return (
    <div className="space-y-6">
      {/* SaaS Style KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="premium-card p-5 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/10 flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">อัตรากำไรสุทธิ</span>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400"><TrendingUp size={16} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{profitMargin}%</h3>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1">ของรายรับทั้งหมดเป็นกำไร</p>
          </div>
        </div>

        <div className="premium-card p-5 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/10 flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">กำไรสุทธิสะสม</span>
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400"><DollarSign size={16} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">฿{netProfit.toLocaleString()}</h3>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1">หลังจากหักค่าน้ำมันและค่าซ่อม</p>
          </div>
        </div>
      </div>

      {/* Improved Daily Bar Chart */}
      <div className="premium-card p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5 mb-2">
          <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
          สถิติรายได้เทียบรายจ่าย (7 วันล่าสุด)
        </h3>
        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-6">กราฟเปรียบเทียบผลประกอบการในแต่ละวันของคุณ</p>

        <div className="space-y-4">
          {/* Chart Area */}
          <div className="flex items-end justify-between h-60 pt-6 px-4 border-b border-slate-100 dark:border-slate-800 gap-2">
            {dailyData.map((day) => {
              const incomeHeight = (day.income / maxDailyValue) * 90;
              const expenseHeight = (day.expense / maxDailyValue) * 90;

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center h-full justify-end">
                  <div className="flex items-end gap-1 w-full justify-center h-[90%]">
                    {/* Income Bar (Green) */}
                    <div className="relative group flex justify-center items-end h-full w-5">
                      {day.income > 0 && (
                        <>
                          <div className="absolute bottom-full mb-1 scale-0 group-hover:scale-100 bg-slate-950 text-white text-[9px] font-bold px-2 py-1 rounded transition-all z-10 whitespace-nowrap shadow-md">
                            รับ: ฿{day.income.toLocaleString()}
                          </div>
                          <div 
                            className="w-full bg-emerald-500 dark:bg-emerald-400 rounded-t-md shadow-md shadow-emerald-500/10 transition-all duration-500"
                            style={{ height: `${incomeHeight}%` }}
                          ></div>
                        </>
                      )}
                    </div>

                    {/* Expense Bar (Red) */}
                    <div className="relative group flex justify-center items-end h-full w-5">
                      {day.expense > 0 && (
                        <>
                          <div className="absolute bottom-full mb-1 scale-0 group-hover:scale-100 bg-slate-950 text-white text-[9px] font-bold px-2 py-1 rounded transition-all z-10 whitespace-nowrap shadow-md">
                            จ่าย: ฿{day.expense.toLocaleString()}
                          </div>
                          <div 
                            className="w-full bg-rose-500 dark:bg-rose-400 rounded-t-md shadow-md shadow-rose-500/10 transition-all duration-500"
                            style={{ height: `${expenseHeight}%` }}
                          ></div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Day Label */}
                  <span className="text-[9px] md:text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-3 rotate-45 md:rotate-0 whitespace-nowrap">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Legends */}
          <div className="flex justify-center gap-6 text-[10px] font-semibold pt-2">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              รายรับ (ค่ารอบ / ทิป)
            </div>
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              รายจ่าย (น้ำมัน / ซ่อม)
            </div>
          </div>
        </div>
      </div>

      {/* Expense Breakdown Categories */}
      <div className="premium-card p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5 mb-5">
          <PieChart size={16} className="text-purple-600 dark:text-purple-400" />
          สัดส่วนรายจ่ายแยกตามหมวดหมู่
        </h3>

        {categories.length === 0 ? (
          <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm">
            ยังไม่มีบันทึกข้อมูลรายจ่าย
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map(cat => {
              const val = categoryMap[cat];
              const pct = ((val / totalExpense) * 100).toFixed(0);
              const barWidth = maxCategoryValue > 0 ? (val / maxCategoryValue) * 100 : 0;

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{cat}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      ฿{val.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-600 dark:bg-purple-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
