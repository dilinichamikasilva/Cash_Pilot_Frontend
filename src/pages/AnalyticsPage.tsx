import { useState, useEffect } from "react";
import { 
  Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Bar, Legend 
} from 'recharts';
import { 
  TrendingUp, ArrowUpRight, Activity, PieChart as PieIcon, 
  BarChart3, LayoutGrid, CalendarDays
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../service/api";
import { motion } from "framer-motion";

interface AnalyticsSummary {
  trends: any[];
  categories: any[];
  savingsRate: number;
  topExpenseCategory: string;
  totalMonthlySpend: number;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("6");
  const [groupBy, setGroupBy] = useState("month");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/analytics/summary?months=${timeRange}&groupBy=${groupBy}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeRange, groupBy]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Analytics...</div>;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 bg-slate-50/50 min-h-screen">
        
        {/* --- UI CONTROLS --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Financial Insights</h1>
            <p className="text-sm text-slate-500">Analyze your spending velocity and habits.</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* View Level */}
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {['day', 'week', 'month'].map((lvl) => (
                <button 
                  key={lvl}
                  onClick={() => setGroupBy(lvl)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase transition-all ${groupBy === lvl ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                >{lvl}</button>
              ))}
            </div>
            {/* Range */}
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {['3', '6', '12'].map((m) => (
                <button 
                  key={m}
                  onClick={() => setTimeRange(m)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${timeRange === m ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                >{m}M</button>
              ))}
            </div>
          </div>
        </div>

        {/* --- METRICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard title="Savings Rate" value={`${data?.savingsRate}%`} icon={<TrendingUp size={20}/>} color="text-emerald-600" bg="bg-emerald-50" />
          <MetricCard title="Top Category" value={data?.topExpenseCategory} icon={<ArrowUpRight size={20}/>} color="text-rose-600" bg="bg-rose-50" />
          <MetricCard title="Last Period Spend" value={`${data?.totalMonthlySpend.toLocaleString()} LKR`} icon={<Activity size={20}/>} color="text-indigo-600" bg="bg-indigo-50" />
        </div>

        {/* --- MAIN CHART --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6 font-bold text-slate-800">
               <CalendarDays className="text-indigo-500" size={20}/> Cash Flow Trends
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data?.trends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                  <Tooltip contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}} />
                  <Legend verticalAlign="top" align="right" />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={groupBy === 'day' ? 8 : 20} name="Income" />
                  <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={groupBy === 'day' ? 8 : 20} name="Expenses" />
                  <Area type="monotone" dataKey="income" fill="transparent" stroke="#10b981" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* --- PIE CHART --- */}
          <div className="lg:col-span-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6 font-bold text-slate-800">
               <PieIcon className="text-indigo-500" size={20}/> Spending Mix
            </div>
            <div className="h-[220px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                 <Pie 
                    data={data?.categories} 
                    dataKey="value"
                    innerRadius={60} 
                    outerRadius={80} 
                    paddingAngle={5}
                    cornerRadius={10} 
                  >
                    {data?.categories.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-800">{data?.categories.length}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Categories</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {data?.categories.slice(0, 3).map((cat, i) => (
                <div key={i} className="flex justify-between text-[11px] font-medium p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-500">{cat.name}</span>
                  <span className="font-bold text-slate-800">{cat.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

function MetricCard({ title, value, icon, color, bg }: any) {
  return (
    <motion.div whileHover={{y: -2}} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${bg} ${color}`}>{icon}</div>
      <div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-lg font-black text-slate-800 leading-tight">{value}</p>
      </div>
    </motion.div>
  );
}