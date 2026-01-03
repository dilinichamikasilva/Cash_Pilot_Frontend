import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  Plus, Trash2, Calendar, CheckCircle2, 
  ArrowRight, PieChart, AlertCircle, Receipt, Loader2, Sparkles, Edit3, X, Check
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

  // State for Month Selection
  const [monthYear, setMonthYear] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  // Budget States
  const [income, setIncome] = useState<number | "">("");
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [isFirstMonth, setIsFirstMonth] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>("LKR");
  const [showModal, setShowModal] = useState(false);
  const [tempAllocations, setTempAllocations] = useState<TempAlloc[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  // Inline Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editBudget, setEditBudget] = useState<number>(0);

  // Custom Toast Notification
  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 ${
        type === 'success' ? 'border-emerald-500' : type === 'error' ? 'border-rose-500' : 'border-amber-500'
      }`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {type === 'success' && <CheckCircle2 className="h-10 w-10 text-emerald-500" />}
              {(type === 'error' || type === 'warning') && <AlertCircle className={`h-10 w-10 ${type === 'error' ? 'text-rose-500' : 'text-amber-500'}`} />}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-slate-900">
                {type === 'success' ? 'Success' : type === 'error' ? 'Budget Error' : 'Attention Required'}
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

  // 1. Fetch User Settings & Global Categories
  useEffect(() => {
    if (!user?.accountId) return;
    api.get(`/auth/me`) 
      .then((res) => setCurrency(res.data.account?.currency || "LKR"))
      .catch(() => setCurrency("LKR"));

    api.get(`/category/getCategories?accountId=${user.accountId}`)
      .then((res) => setSuggestedCategories(res.data.categories || []))
      .catch(() => setSuggestedCategories([]));
  }, [user]);

  // 2. Core Logic: Handle Monthly Sync & Opening Balance Check
  useEffect(() => {
    if (!user?.accountId || !monthYear) return;
    const [year, month] = monthYear.split("-");

    const syncBudgetData = async () => {
      try {
        // Check if this month is chronologically the user's first month
        const firstMonthRes = await api.get(`/budget/is-first-month?accountId=${user.accountId}&month=${month}&year=${year}`);
        const isFirst = firstMonthRes.data.isFirstMonth;
        setIsFirstMonth(isFirst);

        // Fetch opening balance from profile only if it's the first month
        if (isFirst) {
          const authRes = await api.get(`/auth/me`);
          setOpeningBalance(authRes.data.account?.openingBalance || 0);
        } else {
          setOpeningBalance(0); // Subsequent months rely on income + carry-over savings
        }

        // Fetch existing budget if it exists
        const res = await api.get(`/budget/view-monthly-allocations?accountId=${user.accountId}&month=${month}&year=${year}`);
        
        if (res.data && res.data.allocation) {
          // Calculate monthly income back from total pool
          setIncome(res.data.allocation.totalAllocated - (res.data.allocation.carryForwardSavings || 0)); 
          const existingCats = res.data.categories.map((c: any) => ({
            id: c.id,
            name: c.name,
            budget: c.budget
          }));
          setTempAllocations(existingCats);
          setIsEditingExisting(true);
        } else {
          setTempAllocations([]);
          setIncome("");
          setIsEditingExisting(false);
        }
      } catch (err: any) {
        setTempAllocations([]);
        setIncome("");
        setIsEditingExisting(false);
        if (err.response?.status !== 404) showToast("System Error: Failed to sync monthly data.", "error");
      }
    };

    syncBudgetData();
  }, [monthYear, user]);

  // AI Suggestions Handler
  const handleAiSuggest = async () => {
    if (!income || Number(income) <= 0) {
      showToast("Please enter a monthly income first.", "warning");
      return;
    }
    setIsAiLoading(true);
    try {
      const response = await api.get(`/budget/ai-suggestions`, {
        params: { income: Number(income), currency: currency }
      });
      const formatted = response.data.suggestions.map((s: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: s.name,
        budget: s.budget
      }));
      setTempAllocations(formatted);
      showToast(`AI generated a balanced ${currency} plan!`, "success");
    } catch (err) {
      showToast("AI service is currently unavailable.", "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Calculations
  const totalPool = useMemo(() => {
    const currentIncome = typeof income === "number" ? income : 0;
    return openingBalance + currentIncome;
  }, [openingBalance, income]);

  const totalAllocated = useMemo(() => tempAllocations.reduce((s, a) => s + a.budget, 0), [tempAllocations]);
  const remaining = totalPool - totalAllocated;
  const percentageAllocated = totalPool > 0 ? Math.min((totalAllocated / totalPool) * 100, 100) : 0;

  // List Management
  const handleAddTemp = (name: string, budget: number) => {
    if (tempAllocations.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
      showToast(`${name} is already added.`, "warning");
      return;
    }
    setTempAllocations([...tempAllocations, { id: Date.now().toString(), name, budget }]);
  };

  const saveEdit = () => {
    setTempAllocations(prev => prev.map(item => 
      item.id === editingId ? { ...item, name: editName, budget: Number(editBudget) } : item
    ));
    setEditingId(null);
  };

  // Submit Logic
  const handleSubmit = async () => {
    if (!user?.accountId) return;
    const [year, month] = monthYear.split("-");
    if (totalPool <= 0) return showToast(`Please enter income.`, "warning");
    if (remaining < 0) return showToast("Allocations exceed available funds.", "error");

    setIsSaving(true);
    try {
      await api.post("/budget/monthly-allocations", {
        month: Number(month),
        year: Number(year),
        income: Number(income),
        categories: tempAllocations.map((t) => ({ name: t.name, budget: t.budget })),
      });
      showToast(isEditingExisting ? "Budget Updated!" : "Budget locked in! 🎉", "success");
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
          
          {/* Header & Navigation */}
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
              {isEditingExisting && (
                <Link to={`/view-monthly-budget?month=${monthYear.split('-')[1]}&year=${monthYear.split('-')[0]}`} className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 rounded-xl text-sm font-bold border border-slate-200 shadow-sm hover:bg-slate-50">
                  <PieChart className="w-4 h-4 text-indigo-500" /> Summary
                </Link>
              )}
              <Link to={`/update-spending?month=${monthYear.split('-')[1]}&year=${monthYear.split('-')[0]}`} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold border border-indigo-100 hover:bg-indigo-100">
                <Receipt className="w-4 h-4" /> Track Actuals
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: SETUP */}
            <div className="lg:col-span-5 space-y-6">
              <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" /> Setup Month
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1 tracking-wider">Target Month</label>
                    <input type="month" value={monthYear} onChange={(e) => setMonthYear(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2 ml-1">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Income ({currency})</label>
                      <button onClick={handleAiSuggest} disabled={isAiLoading || !income} className="flex items-center gap-1.5 text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-700 disabled:text-slate-300 group">
                        {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform" /> AI Suggest</>}
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{currency}</span>
                      <input type="number" placeholder="0.00" value={income} onChange={(e) => setIncome(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-slate-50 border-none rounded-xl pl-14 pr-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                </div>
              </section>

              {/* CASH POOL CARD */}
              <section className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-slate-400 text-sm font-medium">Remaining to Allocate</p>
                  <h2 className={`text-4xl font-black mt-1 ${remaining < 0 ? 'text-rose-400' : 'text-white'}`}>
                    {remaining.toLocaleString()} <span className="text-lg font-normal opacity-50">{currency}</span>
                  </h2>
                  <div className="flex items-center gap-3 mt-6 mb-8 bg-slate-800/50 p-3 rounded-2xl border border-white/5">
                    {isFirstMonth && (
                      <>
                        <div className="flex-1 text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase">Opening</p>
                            <p className="text-sm font-bold text-indigo-300">{openingBalance.toLocaleString()}</p>
                        </div>
                        <div className="text-slate-600 font-bold">+</div>
                      </>
                    )}
                    <div className="flex-1 text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase">Income</p>
                        <p className="text-sm font-bold text-emerald-400">{(Number(income) || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Progress</span>
                      <span className="font-bold">{totalAllocated.toLocaleString()} {currency} Allocated</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div animate={{ width: `${percentageAllocated}%` }} className={`h-full rounded-full transition-all duration-500 ${remaining < 0 ? 'bg-red-500' : 'bg-indigo-500'}`} />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: ALLOCATIONS LIST */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-full min-h-[500px]">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800">Allocations</h3>
                  <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md transition-all active:scale-95">
                    <Plus className="w-4 h-4" /> Add Category
                  </button>
                </div>

                <div className="p-6 flex-1">
                  <AnimatePresence mode="popLayout">
                    {tempAllocations.length > 0 ? (
                      <div className="space-y-3">
                        {tempAllocations.map((t) => (
                          <motion.div key={t.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all group">
                            {editingId === t.id ? (
                              <div className="flex flex-1 items-center gap-2">
                                <input value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold" />
                                <input type="number" value={editBudget} onChange={(e) => setEditBudget(Number(e.target.value))} className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold" />
                                <button onClick={saveEdit} className="p-2 bg-emerald-500 text-white rounded-lg"><Check className="w-4 h-4"/></button>
                                <button onClick={() => setEditingId(null)} className="p-2 bg-slate-200 text-slate-600 rounded-lg"><X className="w-4 h-4"/></button>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
                                    <CheckCircle2 className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-800">{t.name}</div>
                                    <div className="text-xs font-bold text-slate-400">Plan: {t.budget.toLocaleString()} {currency}</div>
                                  </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" onClick={() => { setEditingId(t.id); setEditName(t.name); setEditBudget(t.budget); }}>
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg" onClick={() => setTempAllocations(tempAllocations.filter(x => x.id !== t.id))}>
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20">
                        <Plus className="w-12 h-12 text-slate-200 mb-2" />
                        <p className="text-slate-400 font-medium">No budget items planned yet.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-6 bg-slate-50/50 rounded-b-[2rem] border-t border-slate-100">
                  <button onClick={handleSubmit} disabled={tempAllocations.length === 0 || isSaving} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg disabled:bg-slate-300 flex items-center justify-center gap-2 group transition-all hover:bg-slate-800">
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isEditingExisting ? 'Update Budget' : 'Lock Monthly Budget'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {showModal && (
        <AllocationModal onClose={() => setShowModal(false)} onAdd={handleAddTemp} suggestions={suggestedCategories} currentRemaining={remaining} accountId={user?.accountId} currency={currency} />
      )}
    </DashboardLayout>
  );
}