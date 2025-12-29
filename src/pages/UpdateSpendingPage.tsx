import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, CheckCircle2, Receipt, CalendarDays, Camera, X, Plus, 
  History, AlertTriangle 
} from "lucide-react";

import { getMonthlyAllocation, addTransaction, type CategoryItem } from "../service/budgetService";
import DashboardLayout from "../components/DashboardLayout";
import { TransactionHistory } from "../components/TransactionHistory";

export default function UpdateSpendingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Date Handling
  const month = Number(searchParams.get("month")) || new Date().getMonth() + 1;
  const year = Number(searchParams.get("year")) || new Date().getFullYear();
  const [selectedDate, setSelectedDate] = useState(`${year}-${String(month).padStart(2, '0')}`);

  // Data State
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<CategoryItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Fetch Budget Data
  useEffect(() => { 
    if (user?.accountId) fetchBudget(); 
  }, [user, month, year]);

  const fetchBudget = async () => {
    try {
      const data = await getMonthlyAllocation(user!.accountId, month, year);
      setCategories(data.categories);
    } catch (err) { 
      setCategories([]); 
    }
  };

  const handleDateChange = (dateValue: string) => {
    setSelectedDate(dateValue);
    const [newYear, newMonth] = dateValue.split("-");
    setSearchParams({ month: String(Number(newMonth)), year: newYear });
  };

  const handleSubmitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCat) return;
    setUploading(true);
    
    const formData = new FormData();
    formData.append("allocationCategoryId", selectedCat.id);
    formData.append("amount", amount);
    formData.append("paymentMethod", method);
    formData.append("description", desc);
    if (file) formData.append("billImage", file);

    try {
      await addTransaction(formData);
      setSuccessMessage("Update Successful!");
      setIsModalOpen(false);
      
      // Reset & Refresh
      fetchBudget(); 
      setRefreshTrigger(prev => prev + 1);
      
      setTimeout(() => setSuccessMessage(null), 3000);
      setAmount(""); setDesc(""); setFile(null);
    } catch (err) { 
      alert("Upload failed"); 
    } finally { 
      setUploading(false); 
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50/50 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Top Navigation & Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <button onClick={() => navigate("/budget")} className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-2 text-sm font-bold uppercase">
                <ArrowLeft className="w-4 h-4" /> Back to Planner
              </button>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                <Receipt className="text-indigo-600 w-10 h-10" /> Actual Expenses
              </h1>
            </div>
            <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-3 font-bold text-sm">
              <CalendarDays className="w-5 h-5 text-indigo-500" />
              <input type="month" value={selectedDate} onChange={(e) => handleDateChange(e.target.value)} className="outline-none cursor-pointer border-none bg-transparent" />
            </div>
          </div>

          {/* Success Notification */}
          <AnimatePresence>
            {successMessage && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-8 bg-emerald-500 text-white px-8 py-4 rounded-[2rem] shadow-xl shadow-emerald-100 flex items-center gap-3 font-black justify-center">
                <CheckCircle2 className="w-6 h-6" /> {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category List */}
          <div className="space-y-6">
            {categories.map((cat) => {
              const isOverspent = cat.spent > cat.budget;
              const variance = Math.abs(cat.budget - cat.spent);

              return (
                <motion.div layout key={cat.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm transition-all hover:shadow-md">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-slate-800 mb-1">{cat.name}</h3>
                      <p className="text-slate-400 text-sm font-bold tracking-tight">
                        Used <span className="text-indigo-600">Rs. {cat.spent.toLocaleString()}</span> out of Rs. {cat.budget.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Status Badge */}
                      <div className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tight ${isOverspent ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                        {isOverspent ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                        {isOverspent ? `Over: Rs. ${variance.toLocaleString()}` : `Left: Rs. ${variance.toLocaleString()}`}
                      </div>

                      {/* History Toggle */}
                      <button 
                        onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs uppercase transition-all ${expandedCat === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        <History size={16} /> History
                      </button>

                      {/* Add Button */}
                      <button 
                        onClick={() => { setSelectedCat(cat); setIsModalOpen(true); }} 
                        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase hover:bg-indigo-600 transition-all shadow-lg shadow-slate-100"
                      >
                        <Plus size={16} /> Add Proof
                      </button>
                    </div>
                  </div>

                  {/* Nested Transaction History */}
                  <AnimatePresence>
                    {expandedCat === cat.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <TransactionHistory 
                          allocationCategoryId={cat.id} 
                          refreshTrigger={refreshTrigger} 
                          onBudgetUpdate={fetchBudget} // Pass refresh logic to child
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Add Transaction Modal */}
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[3rem] w-full max-w-lg p-10 relative z-10 shadow-2xl">
                  <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 text-slate-300 hover:text-slate-900 transition-colors"><X size={28} /></button>
                  <h2 className="text-3xl font-black mb-1 tracking-tighter">New Expense</h2>
                  <p className="text-slate-500 mb-8 font-bold">Log payment for <span className="text-indigo-600">{selectedCat?.name}</span></p>
                  
                  <form onSubmit={handleSubmitTransaction} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-2 tracking-widest">Amount Spent</label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400">Rs.</span>
                        <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] p-5 pl-12 font-black text-xl outline-none focus:border-indigo-400 focus:bg-white transition-all" placeholder="0.00" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-2 tracking-widest">Payment Method</label>
                      <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] p-5 font-bold outline-none appearance-none focus:border-indigo-400 focus:bg-white transition-all">
                        <option value="CASH">💵 Cash Payment</option>
                        <option value="DEBIT_CARD">💳 Debit Card</option>
                        <option value="CREDIT_CARD">🚀 Credit Card</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-2 tracking-widest">Upload Bill</label>
                      <label className="flex items-center justify-center gap-3 w-full bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-[1.5rem] p-8 cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition-all group">
                        <div className="bg-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform"><Camera className="text-indigo-600" /></div>
                        <span className="text-indigo-600 font-black text-sm">{file ? file.name : "Select Receipt Image"}</span>
                        <input type="file" hidden onChange={(e) => setFile(e.currentTarget.files![0])} accept="image/*" />
                      </label>
                    </div>

                    <button disabled={uploading} type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-lg hover:shadow-2xl hover:shadow-indigo-200 disabled:opacity-50 transition-all active:scale-95">
                      {uploading ? "Uploading to Cloud..." : "Confirm Transaction"}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}