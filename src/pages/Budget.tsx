// import { useEffect, useMemo, useState } from "react";
// import { useAuth } from "../context/authContext";
// import { Link } from "react-router-dom";
// import { 
//   Plus, 
//   Trash2, 
//   Wallet, 
//   Calendar, 
//   CheckCircle2, 
//   ArrowRight, 
//   PieChart, 
//   AlertCircle ,
//   Receipt
// } from "lucide-react";
// import api from "../service/api";
// import AllocationModal from "../components/AllocationModal";
// import DashboardLayout from "../components/DashboardLayout";
// import { motion, AnimatePresence } from "framer-motion";

// type TempAlloc = { id: string; name: string; budget: number };

// export default function BudgetPage() {
//   const { user } = useAuth();

//   const [monthYear, setMonthYear] = useState(() => {
//     const now = new Date();
//     return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
//   });

//   const [income, setIncome] = useState<number | "">("");
//   const [showModal, setShowModal] = useState(false);
//   const [tempAllocations, setTempAllocations] = useState<TempAlloc[]>([]);
//   const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);


//   useEffect(() => {
//     if (!user?.accountId) return;
//     api.get(`/category/getCategories?accountId=${user.accountId}`)
//       .then((res) => setSuggestedCategories(res.data.categories || []))
//       .catch(() => setSuggestedCategories([]));
//   }, [user]);

//   const totalAllocated = useMemo(
//     () => tempAllocations.reduce((s, a) => s + a.budget, 0),
//     [tempAllocations]
//   );

//   const remaining = typeof income === "number" ? income - totalAllocated : 0;
//   const percentageAllocated = income ? Math.min((totalAllocated / Number(income)) * 100, 100) : 0;

//   const handleAddTemp = (name: string, budget: number) => {
//     const id = Date.now().toString();
//     setTempAllocations((s) => [...s, { id, name, budget }]);
//   };

//   const handleRemoveTemp = (id: string) =>
//     setTempAllocations((s) => s.filter((x) => x.id !== id));

//   const handleSubmit = async () => {
//     if (!user?.accountId) return alert("User not loaded");
//     const [year, month] = monthYear.split("-");
//     if (!income || Number(income) <= 0) return alert("Income required");
//     if (totalAllocated > Number(income)) return alert("Allocated exceeds income");

//     const payload = {
//       month: Number(month),
//       year: Number(year),
//       totalAllocated: Number(income),
//       categories: tempAllocations.map((t) => ({ name: t.name, budget: t.budget })),
//     };

//     try {
//       await api.post("/budget/monthly-allocations", payload);
//       alert("Allocations saved!");
//       setTempAllocations([]);
//       setShowModal(false);
//     } catch (err: any) {
//       alert(err?.response?.data?.message || "Save failed");
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-slate-50/50 py-10 px-6">
//         <div className="max-w-5xl mx-auto">
          
//           {/* HEADER AREA */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Budget Planner</h1>
//               <p className="text-slate-500 mt-1">Plan your monthly financial flight path.</p>
//             </div>

//             {/* UPDATE SPENDING BUTTON */}
//             <Link
//               to={`/update-spending?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`}
//               className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all border border-indigo-100"
//             >
//               <Receipt className="w-4 h-4" /> Track Actuals
//             </Link>

//             {/* VIEW HISTORY BUTTON */}
//             <Link
//               to={`/view-monthly-budget?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`}
//               className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
//             >
//               <PieChart className="w-4 h-4" /> View History
//             </Link>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
//             {/* LEFT: INPUTS & SUMMARY */}
//             <div className="lg:col-span-5 space-y-6">
//               <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
//                 <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
//                   <Calendar className="w-5 h-5 text-indigo-600" /> Setup Month
//                 </h3>
                
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Month</label>
//                     <input
//                       type="month"
//                       value={monthYear}
//                       onChange={(e) => setMonthYear(e.target.value)}
//                       className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Monthly Income (LKR)</label>
//                     <div className="relative">
//                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">Rs.</span>
//                       <input
//                         type="number"
//                         placeholder="0.00"
//                         value={income}
//                         onChange={(e) => setIncome(e.target.value === "" ? "" : Number(e.target.value))}
//                         className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* BALANCE CARD */}
//               <section className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
                
//                 <div className="relative z-10">
//                   <div className="flex justify-between items-start mb-8">
//                     <div>
//                       <p className="text-slate-400 text-sm font-medium">Available to Allocate</p>
//                       <h2 className="text-4xl font-black mt-1">
//                         {remaining.toLocaleString()} <span className="text-lg font-normal opacity-50">LKR</span>
//                       </h2>
//                     </div>
//                     <Wallet className="w-8 h-8 text-indigo-400 opacity-80" />
//                   </div>

//                   <div className="space-y-4">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-slate-400">Total Allocated</span>
//                       <span className="font-bold">{totalAllocated.toLocaleString()}</span>
//                     </div>

//                     {/* Progress Bar */}
//                     <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
//                       <motion.div 
//                         initial={{ width: 0 }}
//                         animate={{ width: `${percentageAllocated}%` }}
//                         className={`h-full rounded-full ${remaining < 0 ? 'bg-red-500' : 'bg-indigo-500'}`}
//                       />
//                     </div>
//                     {remaining < 0 && (
//                       <div className="flex items-center gap-2 text-red-400 text-xs font-bold animate-pulse">
//                         <AlertCircle className="w-4 h-4" /> Exceeds Income
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </section>
//             </div>

//             {/* RIGHT: ALLOCATIONS LIST */}
//             <div className="lg:col-span-7">
//               <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-full min-h-[500px]">
//                 <div className="p-6 border-b border-slate-50 flex justify-between items-center">
//                   <h3 className="text-lg font-bold text-slate-800">Categories</h3>
//                   <button
//                     onClick={() => setShowModal(true)}
//                     className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all"
//                   >
//                     <Plus className="w-4 h-4" /> Add New
//                   </button>
//                 </div>

//                 <div className="p-6 flex-1">
//                   <AnimatePresence mode="popLayout">
//                     {tempAllocations.length > 0 ? (
//                       <div className="space-y-3">
//                         {tempAllocations.map((t) => (
//                           <motion.div 
//                             key={t.id}
//                             initial={{ opacity: 0, x: 20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, scale: 0.95 }}
//                             className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all group"
//                           >
//                             <div className="flex items-center gap-4">
//                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
//                                 <CheckCircle2 className="w-5 h-5 text-indigo-500" />
//                               </div>
//                               <div>
//                                 <div className="font-bold text-slate-800">{t.name}</div>
//                                 <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Budget: {t.budget.toLocaleString()} LKR</div>
//                               </div>
//                             </div>
//                             <button
//                               className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
//                               onClick={() => handleRemoveTemp(t.id)}
//                             >
//                               <Trash2 className="w-5 h-5" />
//                             </button>
//                           </motion.div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="h-full flex flex-col items-center justify-center text-center py-20">
//                         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
//                           <Plus className="w-8 h-8 text-slate-300" />
//                         </div>
//                         <p className="text-slate-400 font-medium max-w-[200px]">No categories added to your budget yet.</p>
//                       </div>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 <div className="p-6 bg-slate-50/50 rounded-b-[2rem] border-t border-slate-100">
//                   <button
//                     onClick={handleSubmit}
//                     disabled={!income || tempAllocations.length === 0}
//                     className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center justify-center gap-2 group"
//                   >
//                     Save & Lock Allocations <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showModal && (
//         <AllocationModal
//           onClose={() => setShowModal(false)}
//           onAdd={handleAddTemp}
//           suggestions={suggestedCategories}
//           currentRemaining={remaining}
//           accountId={user?.accountId}
//         />
//       )}
//     </DashboardLayout>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  Plus, Trash2, Wallet, Calendar, CheckCircle2, 
  ArrowRight, PieChart, AlertCircle, Receipt, Loader2 
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

  const [income, setIncome] = useState<number | "">("");
  const [showModal, setShowModal] = useState(false);
  const [tempAllocations, setTempAllocations] = useState<TempAlloc[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // --- Beautiful Custom Toast Styling (Consistent with Auth) ---
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
              <p className="text-sm font-bold text-slate-900">
                {type === 'success' ? 'Budget Saved' : type === 'error' ? 'Budget Error' : 'Attention Required'}
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

  useEffect(() => {
    if (!user?.accountId) return;
    api.get(`/category/getCategories?accountId=${user.accountId}`)
      .then((res) => setSuggestedCategories(res.data.categories || []))
      .catch(() => setSuggestedCategories([]));
  }, [user]);

  const totalAllocated = useMemo(
    () => tempAllocations.reduce((s, a) => s + a.budget, 0),
    [tempAllocations]
  );

  const remaining = typeof income === "number" ? income - totalAllocated : 0;
  const percentageAllocated = income ? Math.min((totalAllocated / Number(income)) * 100, 100) : 0;

  const handleAddTemp = (name: string, budget: number) => {
    const id = Date.now().toString();
    setTempAllocations((s) => [...s, { id, name, budget }]);
  };

  const handleRemoveTemp = (id: string) =>
    setTempAllocations((s) => s.filter((x) => x.id !== id));

  const handleSubmit = async () => {
    if (!user?.accountId) {
      showToast("Session expired. Please log in again.", "error");
      return;
    }
    
    const [year, month] = monthYear.split("-");
    
    if (!income || Number(income) <= 0) {
      showToast("Please enter a valid monthly income.", "warning");
      return;
    }
    
    if (totalAllocated > Number(income)) {
      showToast("Allocations exceed your income. Please adjust your budget.", "error");
      return;
    }

    if (tempAllocations.length === 0) {
      showToast("Add at least one category to save your budget.", "warning");
      return;
    }

    const payload = {
      month: Number(month),
      year: Number(year),
      totalAllocated: Number(income),
      categories: tempAllocations.map((t) => ({ name: t.name, budget: t.budget })),
    };

    setIsSaving(true);
    try {
      await api.post("/budget/monthly-allocations", payload);
      showToast("Monthly budget has been locked and saved successfully! 🎉", "success");
      setTempAllocations([]);
      setShowModal(false);
      // Optional: Redirect to history
      setTimeout(() => navigate(`/view-monthly-budget?month=${month}&year=${year}`), 2000);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save budget.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-slate-50/50 py-10 px-6"
      >
        <div className="max-w-5xl mx-auto">
          
          {/* HEADER AREA */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Budget Planner</h1>
              <p className="text-slate-500 mt-1">Plan your monthly financial flight path.</p>
            </div>

            <div className="flex gap-3">
              <Link
                to={`/update-spending?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all border border-indigo-100"
              >
                <Receipt className="w-4 h-4" /> Track Actuals
              </Link>

              <Link
                to={`/view-monthly-budget?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
              >
                <PieChart className="w-4 h-4" /> History
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT: INPUTS & SUMMARY */}
            <div className="lg:col-span-5 space-y-6">
              <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" /> Setup Month
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Target Month</label>
                    <input
                      type="month"
                      value={monthYear}
                      onChange={(e) => setMonthYear(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Monthly Income (LKR)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">Rs.</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={income}
                        onChange={(e) => setIncome(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* BALANCE CARD */}
              <section className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">Available to Allocate</p>
                      <h2 className="text-4xl font-black mt-1">
                        {remaining.toLocaleString()} <span className="text-lg font-normal opacity-50">LKR</span>
                      </h2>
                    </div>
                    <Wallet className="w-8 h-8 text-indigo-400 opacity-80" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Total Allocated</span>
                      <span className="font-bold">{totalAllocated.toLocaleString()}</span>
                    </div>

                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentageAllocated}%` }}
                        className={`h-full rounded-full transition-colors duration-500 ${remaining < 0 ? 'bg-red-500' : 'bg-indigo-500'}`}
                      />
                    </div>
                    {remaining < 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-red-400 text-xs font-bold animate-pulse"
                      >
                        <AlertCircle className="w-4 h-4" /> Exceeds Income
                      </motion.div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT: ALLOCATIONS LIST */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-full min-h-[500px]">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800">Categories</h3>
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add New
                  </button>
                </div>

                <div className="p-6 flex-1">
                  <AnimatePresence mode="popLayout">
                    {tempAllocations.length > 0 ? (
                      <div className="space-y-3">
                        {tempAllocations.map((t) => (
                          <motion.div 
                            key={t.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                              </div>
                              <div>
                                <div className="font-bold text-slate-800">{t.name}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Budget: {t.budget.toLocaleString()} LKR</div>
                              </div>
                            </div>
                            <button
                              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              onClick={() => handleRemoveTemp(t.id)}
                            >
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
                        <p className="text-slate-400 font-medium max-w-[200px]">No categories added to your budget yet.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-6 bg-slate-50/50 rounded-b-[2rem] border-t border-slate-100">
                  <button
                    onClick={handleSubmit}
                    disabled={!income || tempAllocations.length === 0 || isSaving}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center justify-center gap-2 group"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Save & Lock Allocations <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
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
        />
      )}
    </DashboardLayout>
  );
}