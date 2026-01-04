import { useState, useEffect, useMemo } from "react";
import { 
  Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Bar, Legend, Line 
} from 'recharts';
import { 
  TrendingUp, ArrowUpRight, Activity, PieChart as PieIcon, 
  CalendarDays, Calendar as CalendarIcon, Filter, Wallet, ArrowDownRight
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../service/api";
import { useAuth } from "../context/authContext";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("6");
  const [groupBy, setGroupBy] = useState("month");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Memoize chart data to add a "Net" field for the Savings Line
  const chartData = useMemo(() => {
    if (!data?.trends) return [];
    return data.trends.map((item: any) => ({
      ...item,
      net: item.income - item.expenses
    }));
  }, [data]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.accountId) return;
      setLoading(true);
      try {
        const params = isCustomMode 
          ? { date: selectedDate, view: "single", accountId: user.accountId } 
          : { months: timeRange, groupBy: groupBy, accountId: user.accountId };
        const res = await api.get('/analytics/summary', { params });
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeRange, groupBy, selectedDate, isCustomMode, user?.accountId]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#fcfcfd] min-h-screen">
        
        {/* --- PROFESSIONAL HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div>
            <span className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em]">Intelligence</span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mt-1">Financial Analysis</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 bg-white p-1.5 rounded-[1.25rem] border border-slate-200 shadow-sm">
            <button 
              onClick={() => setIsCustomMode(!isCustomMode)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isCustomMode ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {isCustomMode ? "Custom Date" : "Timeline View"}
            </button>
            {!isCustomMode && (
              <div className="h-4 w-[1px] bg-slate-200 mx-1" />
            )}
            <AnimatePresence mode="wait">
              {!isCustomMode && (
                <div className="flex gap-1">
                  {['day', 'week', 'month'].map((lvl) => (
                    <button key={lvl} onClick={() => setGroupBy(lvl)} className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase ${groupBy === lvl ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}>{lvl}</button>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {loading ? (
          <div className="h-[50vh] flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- PRIMARY CHART --- */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Activity size={18} className="text-indigo-500" /> Cash Flow Momentum
                  </h3>
                  <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400"/> Income</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-400"/> Expenses</span>
                  </div>
                </div>

                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                        cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                      />
                      
                      {/* Income Background Area */}
                      <Area type="monotone" dataKey="income" fill="url(#incGrad)" stroke="#10b981" strokeWidth={3} />
                      
                      {/* Expense Bars */}
                      <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={groupBy === 'month' ? 40 : 15} />
                      
                      {/* Net Line (Savings Trend) */}
                      <Line type="monotone" dataKey="net" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* --- MINI METRICS --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricTile title="Avg. Savings Rate" value={`${data?.savingsRate}%`} icon={<TrendingUp size={18}/>} trend="+2.4%" positive />
                <MetricTile title="Burn Rate" value={`${data?.totalMonthlySpend.toLocaleString()} LKR`} icon={<ArrowDownRight size={18}/>} trend="High" positive={false} />
                <MetricTile title="Efficiency" value="Optimal" icon={<Wallet size={18}/>} trend="Steady" positive />
              </div>
            </div>

            {/* --- SIDEBAR: SPENDING MIX --- */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
                <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
                  <PieIcon size={18} className="text-purple-500" /> Spending Mix
                </h3>
                
                <div className="h-[220px] relative mb-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data?.categories} dataKey="value" innerRadius={75} outerRadius={95} paddingAngle={10} cornerRadius={10} stroke="none">
                        {data?.categories.map((_: any, i: number) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Top Source</span>
                    <span className="text-sm font-bold text-slate-800">{data?.topExpenseCategory}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {data?.categories.map((cat: any, i: number) => (
                    <div key={i} className="flex items-center justify-between group cursor-default">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{cat.name}</span>
                      </div>
                      <span className="text-xs font-black text-slate-900">{cat.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function MetricTile({ title, value, icon, trend, positive }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-2xl text-slate-600">{icon}</div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend}
        </span>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-xl font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
}