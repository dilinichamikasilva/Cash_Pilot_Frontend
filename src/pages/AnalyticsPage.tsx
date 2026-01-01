import { useState, useEffect } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Bar, Legend 
} from 'recharts';
import { 
  TrendingUp, ArrowUpRight, Activity, PieChart as PieIcon, 
  BarChart3, Calendar, ListFilter
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../service/api"; // Ensure this points to your axios instance
import { motion, AnimatePresence } from "framer-motion";

// --- TypeScript Interfaces ---
interface SpendingTrend {
  month: string;
  income: number;
  expenses: number;
}

interface CategoryData {
  name: string;
  value: number;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

interface AnalyticsSummary {
  trends: SpendingTrend[];
  categories: CategoryData[];
  savingsRate: number;
  topExpenseCategory: string;
  totalMonthlySpend: number;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState("6");
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // This calls your new backend route: /api/v1/analytics/summary?months=X
        const res = await api.get<AnalyticsSummary>(`/analytics/summary?months=${timeRange}`);
        setData(res.data);
      } catch (err) {
        console.error("Analytics Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeRange]);

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50/30 min-h-screen">
        
        {/* --- Header & Controls --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics</h1>
            <p className="text-slate-500 font-medium">Deep insights into your cash flow.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => setTimeRange("3")}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${timeRange === "3" ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >3 MONTHS</button>
            <button 
              onClick={() => setTimeRange("6")}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${timeRange === "6" ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >6 MONTHS</button>
          </div>
        </header>

        {/* --- 1. Metric Overview --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            title="Savings Rate" 
            value={`${data?.savingsRate || 0}%`} 
            description="Proportion of income kept"
            icon={<TrendingUp />} 
            color="text-emerald-600" bg="bg-emerald-50"
          />
          <MetricCard 
            title="Top Category" 
            value={data?.topExpenseCategory || "N/A"} 
            description="Highest spend this period"
            icon={<ArrowUpRight />} 
            color="text-rose-600" bg="bg-rose-50"
          />
          <MetricCard 
            title="Avg. Monthly Burn" 
            value={`${(data?.totalMonthlySpend || 0).toLocaleString()} LKR`} 
            description="Typical monthly expense"
            icon={<Activity />} 
            color="text-indigo-600" bg="bg-indigo-50"
          />
        </div>

        {/* --- 2. Main Charts Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Trends Chart */}
          <motion.div 
            layout
            className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[480px] flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" /> Income vs Expenses
              </h3>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button onClick={() => setChartType('area')} className={`p-1.5 rounded ${chartType === 'area' ? 'bg-white shadow-sm' : ''}`}><Calendar size={14}/></button>
                <button onClick={() => setChartType('bar')} className={`p-1.5 rounded ${chartType === 'bar' ? 'bg-white shadow-sm' : ''}`}><ListFilter size={14}/></button>
              </div>
            </div>

            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data?.trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{paddingBottom: '20px'}} />
                  
                  {chartType === 'area' ? (
                    <>
                      <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorInc)" strokeWidth={4} />
                      <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="transparent" strokeWidth={4} strokeDasharray="8 5" />
                    </>
                  ) : (
                    <>
                      <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} barSize={30} />
                      <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={30} />
                    </>
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart Section */}
          <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-indigo-500" /> Spending Mix
            </h3>
            
            <div className="h-[260px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.categories}
                    innerRadius={75}
                    outerRadius={100}
                    paddingAngle={10}
                    dataKey="value"
                    cornerRadius={12}
                    stroke="none"
                  >
                    {data?.categories.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-800">{data?.categories.length}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sectors</span>
              </div>
            </div>
            
            <div className="space-y-3 mt-6">
              {data?.categories.slice(0, 4).map((cat, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs font-bold text-slate-600">{cat.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{cat.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

// --- Sub-component: Metric Card ---
function MetricCard({ title, value, description, icon, color, bg }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-5"
    >
      <div className={`p-4 ${bg} ${color} rounded-2xl shadow-inner`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <h2 className="text-2xl font-black text-slate-900 mt-1">{value}</h2>
        <p className="text-xs text-slate-400 mt-1 font-medium">{description}</p>
      </div>
    </motion.div>
  );
}