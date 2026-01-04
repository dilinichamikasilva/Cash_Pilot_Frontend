import { useState, useEffect, useMemo } from "react";
import { 
  Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Bar, Line 
} from 'recharts';
import { TrendingUp, Activity, PieChart as PieIcon, Wallet, Calendar } from "lucide-react";
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

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.accountId) return;
      setLoading(true);
      try {
        const res = await api.get('/analytics/summary', { 
          params: { months: timeRange, accountId: user.accountId } 
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching monthly analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeRange, user?.accountId]);

  const chartData = useMemo(() => data?.trends || [], [data]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#fcfcfd] min-h-screen">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Monthly Trends</h1>
            <p className="text-slate-500 font-medium mt-1">Reviewing your financial performance over time</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <Calendar size={16} className="text-indigo-500" />
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs font-bold uppercase text-slate-700 bg-transparent outline-none cursor-pointer"
            >
              <option value="6">Last 6 Months</option>
              <option value="12">Last 12 Months</option>
              <option value="24">Last 2 Years</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="h-[50vh] flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* MAIN MONTHLY CHART */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Activity size={18} className="text-indigo-500" /> Income vs Expenses
                  </h3>
                  <div className="flex gap-6 text-[10px] font-bold uppercase text-slate-400">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400"/> Income</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-400"/> Expenses</div>
                  </div>
                </div>

                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 700, fill: '#64748b'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 700, fill: '#64748b'}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                        cursor={{fill: '#f8fafc'}}
                      />
                      
                      <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={40} />
                      <Area type="monotone" dataKey="income" fill="#10b981" fillOpacity={0.05} stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="net" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* KPI TILES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricTile title="Current Savings Rate" value={`${data?.savingsRate}%`} icon={<TrendingUp size={18}/>} status="Latest Month" />
                <MetricTile title="Period Spending" value={`${data?.totalPeriodSpend?.toLocaleString()} LKR`} icon={<Wallet size={18}/>} status="Total" />
                <MetricTile title="Efficiency" value="Optimized" icon={<Activity size={18}/>} status="Auto-calculated" />
              </div>
            </div>

            {/* CATEGORY BREAKDOWN */}
            <div className="lg:col-span-4">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full">
                <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
                  <PieIcon size={18} className="text-indigo-500" /> Category Spend
                </h3>
                <div className="h-[250px] relative mb-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data?.categories} dataKey="value" innerRadius={75} outerRadius={95} paddingAngle={8} cornerRadius={10} stroke="none">
                        {data?.categories.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Biggest Leak</span>
                    <span className="text-sm font-black text-slate-800 text-center px-6">{data?.topExpenseCategory}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {data?.categories.map((cat: any, i: number) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-xs font-bold text-slate-600">{cat.name}</span>
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

function MetricTile({ title, value, icon, status }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">{icon}</div>
        <span className="text-[10px] font-bold px-2 py-1 bg-slate-50 text-slate-500 rounded-lg uppercase">{status}</span>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
}