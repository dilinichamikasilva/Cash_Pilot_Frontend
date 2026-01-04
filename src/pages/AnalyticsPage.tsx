import { useState, useEffect, useMemo } from "react";
import { 
  Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Bar, Line 
} from 'recharts';
import { 
  TrendingUp, Activity, PieChart as PieIcon, 
  Wallet, ArrowDownRight
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../service/api";
import { useAuth } from "../context/authContext";
import { motion } from "framer-motion";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("6");
  const [groupBy, setGroupBy] = useState("month");

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.accountId) return;
      setLoading(true);
      try {
        const res = await api.get('/analytics/summary', { 
          params: { months: timeRange, groupBy, accountId: user.accountId } 
        });
        setData(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeRange, groupBy, user?.accountId]);

  const chartData = useMemo(() => data?.trends || [], [data]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#fcfcfd] min-h-screen">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div>
            <span className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em]">Intelligence</span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mt-1">Financial Analysis</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 bg-white p-1.5 rounded-[1.25rem] border border-slate-200 shadow-sm">
            <div className="flex gap-1">
              {['day', 'week', 'month'].map((lvl) => (
                <button 
                  key={lvl} 
                  onClick={() => setGroupBy(lvl)} 
                  className={`px-4 py-2 text-[10px] font-bold rounded-lg uppercase transition-all ${groupBy === lvl ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-[10px] font-bold uppercase text-slate-500 bg-transparent outline-none pr-4 cursor-pointer"
            >
              <option value="1">Last Month</option>
              <option value="3">Last 3 Months</option>
              <option value="6">Last 6 Months</option>
              <option value="12">Last Year</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="h-[50vh] flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* MAIN CHART */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Activity size={18} className="text-indigo-500" /> {groupBy}ly Cash Flow
                  </h3>
                  <div className="hidden sm:flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400"/> Income</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-400"/> Expenses</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"/> Net</span>
                  </div>
                </div>

                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={15} interval={groupBy === 'day' ? 5 : 0} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      
                      <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={groupBy === 'month' ? 35 : 12} />
                      <Area type="monotone" dataKey="income" fill="#10b981" fillOpacity={0.05} stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="net" stroke="#6366f1" strokeWidth={3} dot={groupBy !== 'day'} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* METRICS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricTile title="Savings Rate" value={`${data?.savingsRate}%`} icon={<TrendingUp size={18}/>} trend="Avg" positive />
                <MetricTile title="Total Spend" value={`${data?.totalPeriodSpend?.toLocaleString()} LKR`} icon={<ArrowDownRight size={18}/>} trend="Period" positive={false} />
                <MetricTile title="Status" value="Healthy" icon={<Wallet size={18}/>} trend="Stable" positive />
              </div>
            </div>

            {/* PIE CHART */}
            <div className="lg:col-span-4">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
                <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
                  <PieIcon size={18} className="text-purple-500" /> Category Breakdown
                </h3>
                <div className="h-[250px] relative mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data?.categories} dataKey="value" innerRadius={70} outerRadius={90} paddingAngle={8} cornerRadius={10} stroke="none">
                        {data?.categories.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Top Source</span>
                    <span className="text-sm font-bold text-slate-800 text-center px-4">{data?.topExpenseCategory}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {data?.categories.map((cat: any, i: number) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-xs font-medium text-slate-600">{cat.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">{cat.value.toLocaleString()}</span>
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