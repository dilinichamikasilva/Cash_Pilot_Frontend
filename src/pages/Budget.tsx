import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  Plus, Trash2, Wallet, Calendar, CheckCircle2, 
  ArrowRight, PieChart, AlertCircle, Receipt, Loader2, Edit3
} from "lucide-react";
import api from "../service/api";
import AllocationModal from "../components/AllocationModal";
import DashboardLayout from "../components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

type TempAlloc = { id: string; name: string; budget: number };

export default function BudgetPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [monthYear, setMonthYear] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  // States
  const [income, setIncome] = useState<number | "">("");
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("LKR");
  const [showModal, setShowModal] = useState(false);
  const [tempAllocations, setTempAllocations] = useState<TempAlloc[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  // // --- Toast Logic ---
  // const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
  //   toast.custom((t) => (
  //     <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 ${
  //       type === 'success' ? 'border-emerald-500' : type === 'error' ? 'border-rose-500' : 'border-amber-500'
  //     }`}>
  //       <div className="flex-1 w-0 p-4">
  //         <div className="flex items-start">
  //           <div className="flex-shrink-0 pt-0.5">
  //             {type === 'success' && <CheckCircle2 className="h-10 w-10 text-emerald-500" />}
  //             {type === 'error' && <AlertCircle className="h-10 w-10 text-rose-500" />}
  //             {type === 'warning' && <AlertCircle className="h-10 w-10 text-amber-500" />}
  //           </div>
  //           <div className="ml-3 flex-1">
  //             <p className="text-sm font-bold text-slate-900">
  //               {type === 'success' ? 'Budget Updated' : type === 'error' ? 'Budget Error' : 'Attention Required'}
  //             </p>
  //             <p className="mt-1 text-sm text-slate-500 font-medium">{message}</p>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="flex border-l border-slate-100">
  //         <button onClick={() => toast.dismiss(t.id)} className="w-full p-4 text-sm font-bold text-slate-400 hover:text-slate-600 focus:outline-none">Close</button>
  //       </div>
  //     </div>
  //   ), { duration: 4000 });
  // };

  // --- Toast Logic ---
  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 ${
        type === 'success' ? 'border-emerald-500' : type === 'error' ? 'border-rose-500' : 'border-amber-500'
      }`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {type === 'success' && <CheckCircle2 className="h-10 w-10 text-emerald-500" />}
              {type === 'error' && <AlertCircle className="h-10 w-10 text-rose-500" />}
              {type === 'warning' && <AlertCircle className="h-10 w-10 text-amber-500" />}
            </div>
            <div className="ml-3 flex-1">
              {/* UPDATED TITLE LOGIC HERE */}
              <p className="text-sm font-bold text-slate-900">
                {type === 'success' ? 'Budget Updated' : type === 'error' ? 'Budget Error' : 'New Month Setup'}
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

  // 1. Fetch Account and Suggested Categories
  useEffect(() => {
    if (!user?.accountId) return;
    
    api.get(`/auth/me`) 
      .then((res) => {
        const account = res.data.account;
        setOpeningBalance(account?.openingBalance || 0);
        setCurrency(account?.currency || "LKR");
      })
      .catch(() => setCurrency("LKR"));

    api.get(`/category/getCategories?accountId=${user.accountId}`)
      .then((res) => setSuggestedCategories(res.data.categories || []))
      .catch(() => setSuggestedCategories([]));
  }, [user]);

  // // 2. FETCH EXISTING BUDGET FOR SELECTED MONTH
  // useEffect(() => {
  //   if (!user?.accountId || !monthYear) return;
  //   const [year, month] = monthYear.split("-");

  //   api.get(`/budget/view-monthly-allocations?accountId=${user.accountId}&month=${month}&year=${year}`)
  //     .then((res) => {
  //       if (res.data) {
  //         // If budget exists, load it into state
  //         setIncome(res.data.allocation.totalAllocated - openingBalance); // Inverse calculation if needed
  //         const existingCats = res.data.categories.map((c: any) => ({
  //           id: c.id,
  //           name: c.name,
  //           budget: c.budget
  //         }));
  //         setTempAllocations(existingCats);
  //         setIsEditingExisting(true);
  //       } else {
  //         setTempAllocations([]);
  //         setIncome("");
  //         setIsEditingExisting(false);
  //       }
  //     })
  //     .catch(() => {
  //       // If 404 or error, assume new budget
  //       setTempAllocations([]);
  //       setIncome("");
  //       setIsEditingExisting(false);
  //     });
  // }, [monthYear, user, openingBalance]);
  // 2. FETCH EXISTING BUDGET FOR SELECTED MONTH

  useEffect(() => {
  if (!user?.accountId || !monthYear) return;
  const [year, month] = monthYear.split("-");

  api.get(`/budget/view-monthly-allocations?accountId=${user.accountId}&month=${month}&year=${year}`)
    .then((res) => {
      // If we get data, set it
      if (res.data) {
        setIncome(res.data.allocation.totalAllocated - openingBalance); 
        const existingCats = res.data.categories.map((c: any) => ({
          id: c.id,
          name: c.name,
          budget: c.budget
        }));
        setTempAllocations(existingCats);
        setIsEditingExisting(true);
      }
    })
    .catch((err) => {
      // RESET everything for the new month
      setTempAllocations([]);
      setIncome("");
      setIsEditingExisting(false);

      // CHECK IF 404: If it is, DO NOT show an error.
      if (err.response?.status === 404) {
        console.log("New month detected, no existing budget found.");
        // We do NOT call showToast here with "error" type
        // Optional: showToast("Plan your budget for this month!", "warning");
      } else {
        // Only show "System Error" for 500s or network failures
        showToast("System Error: Failed to sync data.", "error");
      }
    });
}, [monthYear, user, openingBalance]);

  const totalPool = useMemo(() => {
    const currentIncome = typeof income === "number" ? income : 0;
    return openingBalance + currentIncome;
  }, [openingBalance, income]);

  const totalAllocated = useMemo(
    () => tempAllocations.reduce((s, a) => s + a.budget, 0),
    [tempAllocations]
  );

  const remaining = totalPool - totalAllocated;
  
  const percentageAllocated = totalPool > 0 
    ? Math.min((totalAllocated / totalPool) * 100, 100) 
    : 0;

  const handleAddTemp = (name: string, budget: number) => {
    // Check if category already exists in temp list
    const exists = tempAllocations.find(cat => cat.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      showToast(`${name} is already in your list.`, "warning");
      return;
    }
    const id = Date.now().toString();
    setTempAllocations((s) => [...s, { id, name, budget }]);
  };

  const handleRemoveTemp = (id: string) =>
    setTempAllocations((s) => s.filter((x) => x.id !== id));

  const handleSubmit = async () => {
    if (!user?.accountId) return;
    const [year, month] = monthYear.split("-");
    
    if (totalPool <= 0) {
      showToast(`Please enter income.`, "warning");
      return;
    }
    
    if (remaining < 0) {
      showToast("Allocations exceed available funds.", "error");
      return;
    }

    const payload = {
      month: Number(month),
      year: Number(year),
      totalAllocated: Number(totalPool),
      categories: tempAllocations.map((t) => ({ name: t.name, budget: t.budget })),
    };

    setIsSaving(true);
    try {
      await api.post("/budget/monthly-allocations", payload);
      showToast(isEditingExisting ? "Budget updated successfully!" : "Budget locked in! 🎉", "success");
      
      // Navigate after a small delay
      setTimeout(() => navigate(`/view-monthly-budget?month=${month}&year=${year}`), 1500);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-slate-50/50 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {isEditingExisting ? "Edit Budget Plan" : "Budget Planner"}
              </h1>
              <p className="text-slate-500 mt-1">
                {isEditingExisting ? `Modifying allocations for ${monthYear}` : "Plan your monthly financial flight path."}
              </p>
            </div>

            <div className="flex gap-3">
              {/* VIEW SUMMARY BUTTON: Only show if an allocation already exists */}
              {isEditingExisting && (
                <Link 
                  // This maps the YYYY-MM state to ?month=X&year=Y
                  to={`/view-monthly-budget?month=${parseInt(monthYear.split('-')[1])}&year=${monthYear.split('-')[0]}`} 
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all border border-slate-200 shadow-sm"
                >
                  <PieChart className="w-4 h-4 text-indigo-500" /> 
                  View Summary
                </Link>
              )}

              {/* TRACK ACTUALS BUTTON */}
              <Link 
                to={`/update-spending?month=${monthYear.split('-')[1]}&year=${monthYear.split('-')[0]}`} 
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all border border-indigo-100"
              >
                <Receipt className="w-4 h-4" /> 
                Track Actuals
              </Link>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-5 space-y-6">
              <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" /> Setup Month
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Target Month</label>
                    <input type="month" value={monthYear} onChange={(e) => setMonthYear(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Monthly Income ({currency})</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{currency}</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={income}
                        onChange={(e) => setIncome(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full bg-slate-50 border-none rounded-xl pl-14 pr-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* BALANCE CARD */}
              <section className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">Remaining to Allocate</p>
                      <h2 className={`text-4xl font-black mt-1 ${remaining < 0 ? 'text-rose-400' : 'text-white'}`}>
                        {remaining.toLocaleString()} <span className="text-lg font-normal opacity-50">{currency}</span>
                      </h2>
                    </div>
                    <Wallet className="w-8 h-8 text-indigo-400 opacity-80" />
                  </div>

                  <div className="flex items-center gap-3 mb-8 bg-slate-800/50 p-3 rounded-2xl border border-white/5">
                    <div className="flex-1 text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase">Opening</p>
                        <p className="text-sm font-bold text-indigo-300">{openingBalance.toLocaleString()}</p>
                    </div>
                    <div className="text-slate-600 font-bold">+</div>
                    <div className="flex-1 text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase">Income</p>
                        <p className="text-sm font-bold text-emerald-400">{(Number(income) || 0).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Progress</span>
                      <span className="font-bold">{totalAllocated.toLocaleString()} {currency} spent</span>
                    </div>

                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentageAllocated}%` }}
                        className={`h-full rounded-full transition-colors duration-500 ${remaining < 0 ? 'bg-red-500' : 'bg-indigo-500'}`}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-full min-h-[500px]">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800">Allocations</h3>
                  <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95">
                    <Plus className="w-4 h-4" /> Add Category
                  </button>
                </div>

                <div className="p-6 flex-1">
                  <AnimatePresence mode="popLayout">
                    {tempAllocations.length > 0 ? (
                      <div className="space-y-3">
                        {tempAllocations.map((t) => (
                          <motion.div key={t.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                              </div>
                              <div>
                                <div className="font-bold text-slate-800">{t.name}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Plan: {t.budget.toLocaleString()} {currency}</div>
                              </div>
                            </div>
                            <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" onClick={() => handleRemoveTemp(t.id)}>
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <Plus className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium max-w-[200px]">No categories planned for this month yet.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-6 bg-slate-50/50 rounded-b-[2rem] border-t border-slate-100">
                  <button
                    onClick={handleSubmit}
                    disabled={tempAllocations.length === 0 || isSaving}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center justify-center gap-2 group"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                    <>{isEditingExisting ? 'Update Monthly Budget' : 'Lock Monthly Budget'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {showModal && (
        <AllocationModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddTemp}
          suggestions={suggestedCategories}
          currentRemaining={remaining}
          accountId={user?.accountId}
          currency={currency} 
        />
      )}
    </DashboardLayout>
  );
}