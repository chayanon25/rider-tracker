import { useState } from 'react';
import type { Transaction } from '../types';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface FinanceProps {
  transactions: Transaction[];
  onAddTransaction: (type: 'income' | 'expense', category: string, amount: number, date: string, description: string) => Promise<void>;
  onDeleteTransaction: (id: string) => Promise<void>;
}

const INCOME_CATEGORIES = ['ค่ารอบ', 'ทิป', 'โบนัส', 'อื่นๆ'];
const EXPENSE_CATEGORIES = ['ค่าน้ำมัน', 'ค่าซ่อมบำรุง/อะไหล่', 'ค่าอาหาร/เครื่องดื่ม', 'ค่าอุปกรณ์วิ่งงาน', 'อื่นๆ'];

export function Finance({ transactions, onAddTransaction, onDeleteTransaction }: FinanceProps) {
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(INCOME_CATEGORIES[0]);
  const today = new Date();
  const [day, setDay] = useState(() => today.getDate().toString().padStart(2, '0'));
  const [month, setMonth] = useState(() => (today.getMonth() + 1).toString().padStart(2, '0'));
  const [year, setYear] = useState(() => today.getFullYear().toString());
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    setCategory(newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(amount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    setIsSubmitting(true);
    try {
      const dateStr = `${year}-${month}-${day}`;
      await onAddTransaction(type, category, amountVal, dateStr, description);
      setAmount('');
      setDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate quick summary metrics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="premium-card p-5 text-center bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">รายรับรวม</span>
          <div className="text-lg md:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1.5 tracking-tight">
            ฿{totalIncome.toLocaleString()}
          </div>
        </div>
        <div className="premium-card p-5 text-center bg-gradient-to-br from-rose-500/5 to-rose-600/5 border-rose-500/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">รายจ่ายรวม</span>
          <div className="text-lg md:text-2xl font-black text-rose-600 dark:text-rose-400 mt-1.5 tracking-tight">
            ฿{totalExpense.toLocaleString()}
          </div>
        </div>
        <div className="premium-card p-5 text-center bg-gradient-to-br from-purple-500/5 to-purple-600/5 border-purple-500/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">คงเหลือสุทธิ</span>
          <div className={`text-lg md:text-2xl font-black mt-1.5 tracking-tight ${netBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'}`}>
            ฿{netBalance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="premium-card p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">บันทึกธุรกรรมการเงิน</h3>
        
        {/* Toggle Income/Expense tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              type === 'income' 
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <TrendingUp size={14} />
            รายรับ
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              type === 'expense' 
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <TrendingDown size={14} />
            รายจ่าย
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">จำนวนเงิน (บาท)</label>
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">หมวดหมู่</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold cursor-pointer"
              >
                {(type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">วันที่ (วัน/เดือน/ปี)</label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold cursor-pointer"
                >
                  {Array.from({ length: 31 }, (_, i) => {
                    const dVal = (i + 1).toString().padStart(2, '0');
                    return <option key={dVal} value={dVal}>{dVal}</option>;
                  })}
                </select>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const mVal = (i + 1).toString().padStart(2, '0');
                    return <option key={mVal} value={mVal}>{mVal}</option>;
                  })}
                </select>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold cursor-pointer"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const yVal = (today.getFullYear() - 2 + i).toString();
                    return <option key={yVal} value={yVal}>{yVal}</option>;
                  })}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">รายละเอียด (ไม่บังคับ)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="เช่น ค่าน้ำมันปั๊ม ปตท."
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            disabled={isSubmitting}
          >
            <Plus size={16} />
            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกรายการ'}
          </button>
        </form>
      </div>

      {/* Transaction History Logs */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">ประวัติการเงินย้อนหลัง</span>
        
        {transactions.length === 0 ? (
          <div className="premium-card p-8 text-center text-slate-400 dark:text-slate-500">
            ยังไม่มีบันทึกประวัติการเงิน
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div key={tx.id} className="premium-card p-4 border border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/40 dark:bg-slate-900/40">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      isIncome 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}>
                      {isIncome ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">
                        {tx.category}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {(() => {
                          const [y, m, d] = tx.date.split('-');
                          return `${d}/${m}/${y}`;
                        })()} {tx.description && `• ${tx.description}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`font-black text-sm ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {isIncome ? '+' : '-'}฿{tx.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                      title="ลบรายการ"
                    >
                      <Trash2 size={14} />
                    </button>
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
