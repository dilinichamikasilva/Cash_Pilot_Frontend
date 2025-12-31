// import { useEffect, useState } from "react";
// import { useAuth } from "../context/authContext";
// import { getMonthlyAllocation } from "../service/budgetService";
// import { useSearchParams, Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   ChevronLeft, 
//   Calendar, 
//   TrendingUp, 
//   Wallet, 
//   ArrowUpRight, 
//   Search,
//   AlertCircle
// } from "lucide-react";
// import DashboardLayout from "../components/DashboardLayout";

// const ViewMonthlyBudget = () => {
//   const { user, loading: authLoading } = useAuth();
//   const accountId = user?.accountId;
//   const [searchParams] = useSearchParams();

//   const initialMonth = Number(searchParams.get("month")) || new Date().getMonth() + 1;
//   const initialYear = Number(searchParams.get("year")) || new Date().getFullYear();

//   const [month, setMonth] = useState(initialMonth);
//   const [year, setYear] = useState(initialYear);
//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (authLoading) return;
//     if (!accountId) {
//       setLoading(false);
//       return;
//     }
//     fetchData(month, year);
//   }, [accountId, authLoading]);

//   const fetchData = async (m: number, y: number) => {
//     if (!accountId) return;
//     setLoading(true);
//     try {
//       const res = await getMonthlyAllocation(accountId, m, y);
//       setData(res);
//     } catch (err) {
//       console.error(err);
//       setData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleView = () => fetchData(month, year);

//   if (authLoading || loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex h-[60vh] items-center justify-center">
//           <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   const containerVars = {
//     hidden: { opacity: 0 },
//     show: { opacity: 1, transition: { staggerChildren: 0.1 } }
//   };

//   const itemVars = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0 }
//   };

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-slate-50/50 py-10 px-6">
//         <div className="max-w-5xl mx-auto">
          
//           {/* TOP NAVIGATION & SELECTORS */}
//           <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
//             <div className="flex items-center gap-4">
//               <Link to="/budget" className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
//                 <ChevronLeft className="w-6 h-6 text-slate-600" />
//               </Link>
//               <div>
//                 <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Report</h1>
//                 <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
//                    {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2024, month - 1))} {year}
//                 </p>
//               </div>
//             </div>

//             <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
//               <select
//                 value={month}
//                 onChange={(e) => setMonth(Number(e.target.value))}
//                 className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer px-4"
//               >
//                 {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
//                   <option key={m} value={m}>{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(2024, m-1))}</option>
//                 ))}
//               </select>
//               <select
//                 value={year}
//                 onChange={(e) => setYear(Number(e.target.value))}
//                 className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer px-4 border-l border-slate-100"
//               >
//                 {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
//                   <option key={y} value={y}>{y}</option>
//                 ))}
//               </select>
//               <button
//                 onClick={handleView}
//                 className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-all active:scale-95"
//               >
//                 <Search className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           <AnimatePresence mode="wait">
//             {!data ? (
//               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
//                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <AlertCircle className="w-8 h-8 text-slate-400" />
//                 </div>
//                 <h3 className="text-xl font-bold text-slate-800">No Record Found</h3>
//                 <p className="text-slate-500">We couldn't find any budget allocations for this period.</p>
//               </motion.div>
//             ) : (
//               <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">
                
//                 {/* SUMMARY CARDS */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {[
//                     { label: "Total Budget", val: data.allocation.totalAllocated, icon: <Wallet className="text-blue-600" />, bg: "bg-blue-50" },
//                     { label: "Total Spent", val: data.totals.allocatedSum, icon: <TrendingUp className="text-amber-600" />, bg: "bg-amber-50" },
//                     { label: "Remaining", val: data.totals.remaining, icon: <ArrowUpRight className="text-emerald-600" />, bg: "bg-emerald-50", isEmph: true },
//                   ].map((metric, i) => (
//                     <motion.div key={i} variants={itemVars} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
//                       <div className={`w-12 h-12 ${metric.bg} rounded-2xl flex items-center justify-center mb-4`}>
//                         {metric.icon}
//                       </div>
//                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{metric.label}</p>
//                       <h2 className={`text-2xl font-black mt-1 ${metric.isEmph && metric.val < 0 ? 'text-red-600' : 'text-slate-900'}`}>
//                         Rs. {metric.val.toLocaleString()}
//                       </h2>
//                     </motion.div>
//                   ))}
//                 </div>

//                 {/* CATEGORIES TABLE */}
//                 <motion.div variants={itemVars} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
//                   <div className="p-8 border-b border-slate-50">
//                     <h3 className="text-xl font-bold text-slate-900">Category Breakdown</h3>
//                   </div>
//                   <div className="p-8 pt-4">
//                     <div className="space-y-8">
//                       {data.categories.map((cat: any) => {
//                         const usagePercent = Math.min((cat.spent / cat.budget) * 100, 100);
//                         const isOver = cat.spent > cat.budget;

//                         return (
//                           <div key={cat.id} className="group">
//                             <div className="flex justify-between items-end mb-3">
//                               <div>
//                                 <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{cat.name}</h4>
//                                 <p className="text-xs font-bold text-slate-400 uppercase">
//                                   Spent Rs. {cat.spent.toLocaleString()} of Rs. {cat.budget.toLocaleString()}
//                                 </p>
//                               </div>
//                               <div className={`text-sm font-black ${isOver ? 'text-red-500' : 'text-slate-900'}`}>
//                                 {usagePercent.toFixed(0)}%
//                               </div>
//                             </div>
                            
//                             {/*  Progress Bar */}
//                             <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
//                               <motion.div
//                                 initial={{ width: 0 }}
//                                 animate={{ width: `${usagePercent}%` }}
//                                 transition={{ duration: 1, ease: "easeOut" }}
//                                 className={`h-full rounded-full ${
//                                   isOver ? 'bg-red-500' : usagePercent > 80 ? 'bg-amber-500' : 'bg-indigo-500'
//                                 }`}
//                               />
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
                  
//                   <div className="bg-slate-50 p-6 flex justify-center">
//                      <p className="text-xs font-bold text-slate-400 flex items-center gap-2 tracking-widest uppercase">
//                        <Calendar className="w-3 h-3" /> Report generated for {data.allocation.month}/{data.allocation.year}
//                      </p>
//                   </div>
//                 </motion.div>

//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default ViewMonthlyBudget;

import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { getMonthlyAllocation } from "../service/budgetService";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Calendar, 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  Search,
  AlertCircle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";

const ViewMonthlyBudget = () => {
  const { user, loading: authLoading } = useAuth();
  const accountId = user?.accountId;
  const [searchParams] = useSearchParams();

  const initialMonth = Number(searchParams.get("month")) || new Date().getMonth() + 1;
  const initialYear = Number(searchParams.get("year")) || new Date().getFullYear();

  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- Premium Toast Helper ---
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 ${
        type === 'success' ? 'border-emerald-500' : type === 'error' ? 'border-rose-500' : 'border-indigo-500'
      }`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {type === 'success' && <CheckCircle2 className="h-10 w-10 text-emerald-500" />}
              {type === 'error' && <XCircle className="h-10 w-10 text-rose-500" />}
              {type === 'info' && <AlertCircle className="h-10 w-10 text-indigo-500" />}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-slate-900">
                {type === 'success' ? 'Success' : type === 'error' ? 'Report Error' : 'Notice'}
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
    if (authLoading) return;
    if (!accountId) {
      setLoading(false);
      return;
    }
    fetchData(month, year, true); // initial silent load
  }, [accountId, authLoading]);

  const fetchData = async (m: number, y: number, isInitial = false) => {
    if (!accountId) return;
    setLoading(true);
    try {
      const res = await getMonthlyAllocation(accountId, m, y);
      setData(res);
      if (!isInitial) showToast("Financial report updated.", "success");
    } catch (err) {
      console.error(err);
      setData(null);
      showToast("Could not retrieve data for this period.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleView = () => fetchData(month, year);

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50/50 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* TOP NAVIGATION & SELECTORS */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
            <div className="flex items-center gap-4">
              <Link to="/budget" className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                <ChevronLeft className="w-6 h-6 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Report</h1>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                   {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2024, month - 1))} {year}
                </p>
              </div>
            </div>

            <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer px-4"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(2024, m-1))}</option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer px-4 border-l border-slate-100"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <button
                onClick={handleView}
                className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-all active:scale-95"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!data ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No Record Found</h3>
                <p className="text-slate-500">We couldn't find any budget allocations for this period.</p>
              </motion.div>
            ) : (
              <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">
                
                {/* SUMMARY CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Total Budget", val: data.allocation.totalAllocated, icon: <Wallet className="text-blue-600" />, bg: "bg-blue-50" },
                    { label: "Total Spent", val: data.totals.allocatedSum, icon: <TrendingUp className="text-amber-600" />, bg: "bg-amber-50" },
                    { label: "Remaining", val: data.totals.remaining, icon: <ArrowUpRight className="text-emerald-600" />, bg: "bg-emerald-50", isEmph: true },
                  ].map((metric, i) => (
                    <motion.div key={i} variants={itemVars} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                      <div className={`w-12 h-12 ${metric.bg} rounded-2xl flex items-center justify-center mb-4`}>
                        {metric.icon}
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{metric.label}</p>
                      <h2 className={`text-2xl font-black mt-1 ${metric.isEmph && metric.val < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                        Rs. {metric.val.toLocaleString()}
                      </h2>
                    </motion.div>
                  ))}
                </div>

                {/* CATEGORIES TABLE */}
                <motion.div variants={itemVars} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-50">
                    <h3 className="text-xl font-bold text-slate-900">Category Breakdown</h3>
                  </div>
                  <div className="p-8 pt-4">
                    <div className="space-y-8">
                      {data.categories.map((cat: any) => {
                        const usagePercent = Math.min((cat.spent / cat.budget) * 100, 100);
                        const isOver = cat.spent > cat.budget;

                        return (
                          <div key={cat.id} className="group">
                            <div className="flex justify-between items-end mb-3">
                              <div>
                                <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{cat.name}</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase">
                                  Spent Rs. {cat.spent.toLocaleString()} of Rs. {cat.budget.toLocaleString()}
                                </p>
                              </div>
                              <div className={`text-sm font-black ${isOver ? 'text-red-500' : 'text-slate-900'}`}>
                                {usagePercent.toFixed(0)}%
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${usagePercent}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${
                                  isOver ? 'bg-red-500' : usagePercent > 80 ? 'bg-amber-500' : 'bg-indigo-500'
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-6 flex justify-center">
                     <p className="text-xs font-bold text-slate-400 flex items-center gap-2 tracking-widest uppercase">
                       <Calendar className="w-3 h-3" /> Report generated for {data.allocation.month}/{data.allocation.year}
                     </p>
                  </div>
                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewMonthlyBudget;