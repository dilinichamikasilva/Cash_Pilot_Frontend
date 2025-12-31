import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, CheckCircle2, Receipt, CalendarDays, Camera, X, Plus, 
  History, AlertTriangle, Loader2 
} from "lucide-react";
import toast from "react-hot-toast";

// API and Services
import api from "../service/api"; 
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
  const [currency, setCurrency] = useState("Rs."); // Default fallback
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<CategoryItem | null>(null);
  const [uploading, setUploading] = useState(false);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // --- Premium Toast Helper ---
  const showToast = (message: string, type: 'success' | 'error') => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 ${
        type === 'success' ? 'border-emerald-500' : 'border-rose-500'
      }`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {type === 'success' ? <CheckCircle2 className="h-10 w-10 text-emerald-500" /> : <AlertTriangle className="h-10 w-10 text-rose-500" />}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-slate-900">
                {type === 'success' ? 'Transaction Logged' : 'Action Failed'}
              </p>
              <p className="mt-1 text-sm text-slate-500 font-medium">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-slate-100">
          <button onClick={() => toast.dismiss(t.id)} className="w-full p-4 text-sm font-bold text-slate-400 hover:text-slate-600 focus:outline-none">Close</button>
        </div>
      </div>
    ), { duration: 4000 });
  };

  // Fetch Data on Load or Date Change
  useEffect(() => { 
    if (user?.accountId) {
      fetchInitialData(); 
    }
  }, [user, month, year]);

  // const fetchInitialData = async () => {
  //   try {
  //     setIsLoadingPage(true);
  //     // Fetch Budget and Account Currency in parallel
  //     const [budgetData, accountRes] = await Promise.all([
  //       getMonthlyAllocation(user!.accountId, month, year),
  //       api.get(`/account/${user!.accountId}`) 
  //     ]);

  //     setCategories(budgetData.categories);
      
  //     // Update currency based on account settings
  //     if (accountRes.data?.account?.currency) {
  //       setCurrency(accountRes.data.account.currency);
  //     }
  //   } catch (err) { 
  //     setCategories([]); 
  //     showToast("Failed to sync financial categories.", "error");
  //   } finally {
  //     setIsLoadingPage(false);
  //   }
  // };

  const fetchInitialData = async () => {
    try {
      setIsLoadingPage(true);
      // Fetch Budget and Account Currency in parallel
      const [budgetData, accountRes] = await Promise.all([
        getMonthlyAllocation(user!.accountId, month, year),
        api.get(`/account/${user!.accountId}`) 
      ]);

      setCategories(budgetData.categories);
      
      // Update currency based on account settings
      if (accountRes.data?.account?.currency) {
        setCurrency(accountRes.data.account.currency);
      }
    } catch (err: any) { 
      console.error("Fetch error:", err);
      setCategories([]); 

      // FIX: Check if the error is a 404 (Month not started yet)
      const is404 = err.response?.status === 404;

      if (!is404) {
        // Only show error toast for real failures (Network, 500, etc.)
        showToast("Failed to sync financial categories.", "error");
      } else {
        // Log it for debugging, but keep the UI clean
        console.log("No categories found for this period - showing empty state.");
      }
    } finally {
      setIsLoadingPage(false);
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
      showToast(`Logged ${currency} ${Number(amount).toLocaleString()} for ${selectedCat.name}`, "success");
      
      setIsModalOpen(false);
      fetchInitialData(); // Refresh data
      setRefreshTrigger(prev => prev + 1);
      
      // Reset Form
      setAmount(""); setDesc(""); setFile(null);
    } catch (err) { 
      showToast("Could not upload transaction proof.", "error");
    } finally { 
      setUploading(false); 
    }
  };

  if (isLoadingPage) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50/50 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Top Navigation & Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <button onClick={() => navigate("/budget")} className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-2 text-sm font-bold uppercase transition-colors">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Planner
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
                        Used <span className="text-indigo-600">{currency} {cat.spent.toLocaleString()}</span> out of {currency} {cat.budget.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tight ${isOverspent ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                        {isOverspent ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                        {isOverspent ? `Over: ${currency} ${variance.toLocaleString()}` : `Left: ${currency} ${variance.toLocaleString()}`}
                      </div>

                      <button 
                        onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs uppercase transition-all ${expandedCat === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        <History size={16} /> History
                      </button>

                      <button 
                        onClick={() => { setSelectedCat(cat); setIsModalOpen(true); }} 
                        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase hover:bg-indigo-600 transition-all shadow-lg shadow-slate-100 active:scale-95"
                      >
                        <Plus size={16} /> Add Proof
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedCat === cat.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }} 
                        className="overflow-hidden"
                      >
                        <div className="pt-6 border-t border-slate-50 mt-6">
                           <TransactionHistory 
                            allocationCategoryId={cat.id} 
                            refreshTrigger={refreshTrigger} 
                            onBudgetUpdate={fetchInitialData} 
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {categories.length === 0 && (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center">
                <AlertTriangle className="mx-auto text-slate-200 w-16 h-16 mb-4" />
                <p className="text-slate-400 font-bold">No categories planned for this month.</p>
              </div>
            )}
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
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400">{currency}</span>
                        <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] p-5 pl-14 font-black text-xl outline-none focus:border-indigo-400 focus:bg-white transition-all" placeholder="0.00" />
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
                        <div className="bg-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                          {file ? <CheckCircle2 className="text-emerald-500" /> : <Camera className="text-indigo-600" />}
                        </div>
                        <span className="text-indigo-600 font-black text-sm truncate max-w-[200px]">{file ? file.name : "Select Receipt Image"}</span>
                        <input type="file" hidden onChange={(e) => setFile(e.currentTarget.files![0])} accept="image/*" />
                      </label>
                    </div>

                    <button disabled={uploading} type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-lg hover:shadow-2xl hover:shadow-indigo-200 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-3">
                      {uploading ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Processing...
                        </>
                      ) : "Confirm Transaction"}
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