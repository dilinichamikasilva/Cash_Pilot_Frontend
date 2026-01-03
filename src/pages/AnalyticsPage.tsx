// import { useState, useEffect } from "react";
// import { 
//   Area, XAxis, YAxis, CartesianGrid, Tooltip, 
//   ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Bar, Legend 
// } from 'recharts';
// import { 
//   TrendingUp, ArrowUpRight, Activity, PieChart as PieIcon, 
//   BarChart3, LayoutGrid, CalendarDays
// } from "lucide-react";
// import DashboardLayout from "../components/DashboardLayout";
// import api from "../service/api";
// import { motion } from "framer-motion";

// interface AnalyticsSummary {
//   trends: any[];
//   categories: any[];
//   savingsRate: number;
//   topExpenseCategory: string;
//   totalMonthlySpend: number;
// }

// const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// export default function AnalyticsPage() {
//   const [data, setData] = useState<AnalyticsSummary | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [timeRange, setTimeRange] = useState("6");
//   const [groupBy, setGroupBy] = useState("month");

//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       setLoading(true);
//       try {
//         const res = await api.get(`/analytics/summary?months=${timeRange}&groupBy=${groupBy}`);
//         setData(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAnalytics();
//   }, [timeRange, groupBy]);

//   if (loading) return <div className="h-screen flex items-center justify-center">Loading Analytics...</div>;

//   return (
//     <DashboardLayout>
//       <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 bg-slate-50/50 min-h-screen">
        
//         {/* --- UI CONTROLS --- */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <h1 className="text-2xl font-black text-slate-900">Financial Insights</h1>
//             <p className="text-sm text-slate-500">Analyze your spending velocity and habits.</p>
//           </div>
          
//           <div className="flex flex-wrap gap-3">
//             {/* View Level */}
//             <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
//               {['day', 'week', 'month'].map((lvl) => (
//                 <button 
//                   key={lvl}
//                   onClick={() => setGroupBy(lvl)}
//                   className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase transition-all ${groupBy === lvl ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
//                 >{lvl}</button>
//               ))}
//             </div>
//             {/* Range */}
//             <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
//               {['3', '6', '12'].map((m) => (
//                 <button 
//                   key={m}
//                   onClick={() => setTimeRange(m)}
//                   className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${timeRange === m ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
//                 >{m}M</button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* --- METRICS --- */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <MetricCard title="Savings Rate" value={`${data?.savingsRate}%`} icon={<TrendingUp size={20}/>} color="text-emerald-600" bg="bg-emerald-50" />
//           <MetricCard title="Top Category" value={data?.topExpenseCategory} icon={<ArrowUpRight size={20}/>} color="text-rose-600" bg="bg-rose-50" />
//           <MetricCard title="Last Period Spend" value={`${data?.totalMonthlySpend.toLocaleString()} LKR`} icon={<Activity size={20}/>} color="text-indigo-600" bg="bg-indigo-50" />
//         </div>

//         {/* --- MAIN CHART --- */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           <div className="lg:col-span-8 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
//             <div className="flex items-center gap-2 mb-6 font-bold text-slate-800">
//                <CalendarDays className="text-indigo-500" size={20}/> Cash Flow Trends
//             </div>
//             <div className="h-[350px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <ComposedChart data={data?.trends}>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                   <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
//                   <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
//                   <Tooltip contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}} />
//                   <Legend verticalAlign="top" align="right" />
//                   <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={groupBy === 'day' ? 8 : 20} name="Income" />
//                   <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={groupBy === 'day' ? 8 : 20} name="Expenses" />
//                   <Area type="monotone" dataKey="income" fill="transparent" stroke="#10b981" strokeWidth={2} dot={false} />
//                 </ComposedChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* --- PIE CHART --- */}
//           <div className="lg:col-span-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
//             <div className="flex items-center gap-2 mb-6 font-bold text-slate-800">
//                <PieIcon className="text-indigo-500" size={20}/> Spending Mix
//             </div>
//             <div className="h-[220px] relative">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                  <Pie 
//                     data={data?.categories} 
//                     dataKey="value"
//                     innerRadius={60} 
//                     outerRadius={80} 
//                     paddingAngle={5}
//                     cornerRadius={10} 
//                   >
//                     {data?.categories.map((_, index) => (
//                       <Cell 
//                         key={`cell-${index}`} 
//                         fill={COLORS[index % COLORS.length]} 
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//                 <span className="text-xl font-black text-slate-800">{data?.categories.length}</span>
//                 <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Categories</span>
//               </div>
//             </div>
//             <div className="mt-4 space-y-2">
//               {data?.categories.slice(0, 3).map((cat, i) => (
//                 <div key={i} className="flex justify-between text-[11px] font-medium p-2 bg-slate-50 rounded-lg">
//                   <span className="text-slate-500">{cat.name}</span>
//                   <span className="font-bold text-slate-800">{cat.value.toLocaleString()}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//       </div>
//     </DashboardLayout>
//   );
// }

// function MetricCard({ title, value, icon, color, bg }: any) {
//   return (
//     <motion.div whileHover={{y: -2}} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
//       <div className={`p-3 rounded-2xl ${bg} ${color}`}>{icon}</div>
//       <div>
//         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
//         <p className="text-lg font-black text-slate-800 leading-tight">{value}</p>
//       </div>
//     </motion.div>
//   );
// }


import { useState, useEffect } from "react";
import { 
  Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Bar, Legend 
} from 'recharts';
import { 
  TrendingUp, ArrowUpRight, Activity, PieChart as PieIcon, 
  CalendarDays, Calendar as CalendarIcon, Filter, Info, ChevronRight
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../service/api";
import { useAuth } from "../context/authContext"; // IMPORTANT
import { motion, AnimatePresence } from "framer-motion";

interface AnalyticsSummary {
  trends: any[];
  categories: any[];
  savingsRate: number;
  topExpenseCategory: string;
  totalMonthlySpend: number;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("6");
  const [groupBy, setGroupBy] = useState("month");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isCustomMode, setIsCustomMode] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.accountId) return; // Wait until user is loaded

      setLoading(true);
      try {
        const params = isCustomMode 
          ? { date: selectedDate, view: "single", accountId: user.accountId } 
          : { months: timeRange, groupBy: groupBy, accountId: user.accountId };
        
        const res = await api.get('/analytics/summary', { params });
        setData(res.data);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange, groupBy, selectedDate, isCustomMode, user?.accountId]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 bg-slate-50/30 min-h-screen">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Insights</h1>
            <p className="text-sm text-slate-500 font-medium">Deep dive into your spending and income velocity.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button 
              onClick={() => setIsCustomMode(!isCustomMode)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-sm ${
                isCustomMode ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
              }`}
            >
              <Filter size={14} />
              {isCustomMode ? "Viewing Single Date" : "Pick Specific Date"}
            </button>

            <AnimatePresence mode="wait">
              {!isCustomMode ? (
                <motion.div key="trends" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex gap-3">
                  <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    {['day', 'week', 'month'].map((lvl) => (
                      <button key={lvl} onClick={() => setGroupBy(lvl)} className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase transition-all ${groupBy === lvl ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{lvl}</button>
                    ))}
                  </div>
                  <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    {['3', '6', '12'].map((m) => (
                      <button key={m} onClick={() => setTimeRange(m)} className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${timeRange === m ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>{m}M</button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="date" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                   <CalendarIcon size={14} className="ml-3 text-indigo-500" />
                   <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent border-none outline-none text-xs font-bold p-2 text-slate-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
             <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Analyzing Patterns...</p>
          </div>
        ) : (
          <>
            {/* --- METRICS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard title={isCustomMode ? "Daily Savings" : "Savings Rate"} value={`${data?.savingsRate}%`} icon={<TrendingUp size={20}/>} color="text-emerald-600" bg="bg-emerald-50" />
              <MetricCard title="Highest Expense" value={data?.topExpenseCategory || "N/A"} icon={<ArrowUpRight size={20}/>} color="text-rose-600" bg="bg-rose-50" />
              <MetricCard title={isCustomMode ? "Total Spend (Day)" : "Total Period Spend"} value={`${data?.totalMonthlySpend.toLocaleString()} LKR`} icon={<Activity size={20}/>} color="text-indigo-600" bg="bg-indigo-50" />
            </div>

            {/* --- CHARTS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8 text-lg font-bold text-slate-800">
                   <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><CalendarDays size={18}/></div>
                      {isCustomMode ? `Activity for ${new Date(selectedDate).toLocaleDateString('en-GB')}` : 'Cash Flow Trends'}
                   </div>
                </div>
                <div className="h-[400px]">
                   <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data?.trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)'}} />
                      <Legend verticalAlign="top" align="right" iconType="circle" />
                      <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Income" barSize={isCustomMode ? 60 : undefined} />
                      <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} name="Expenses" barSize={isCustomMode ? 60 : undefined} />
                    </ComposedChart>
                   </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-8 font-bold text-slate-800 text-lg">
                   <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><PieIcon size={18}/></div>
                   Spending Mix
                </div>
                <div className="h-[250px] relative mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data?.categories} dataKey="value" innerRadius={70} outerRadius={95} paddingAngle={8} cornerRadius={12} stroke="none">
                        {data?.categories.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-slate-800">{data?.categories.length}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Sources</span>
                  </div>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {data?.categories.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl group border border-transparent hover:border-slate-100 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-xs font-bold text-slate-600">{cat.name}</span>
                      </div>
                      <span className="text-xs font-black text-slate-800">{cat.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function MetricCard({ title, value, icon, color, bg }: any) {
  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-all"
    >
      <div className={`p-4 rounded-2xl ${bg} ${color} shadow-inner`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
      </div>
    </motion.div>
  );
}