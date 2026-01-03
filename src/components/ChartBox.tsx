import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data (In a real app, you'd fetch this or derive it from stats.categories)
const data = [
  { day: '01', spent: 400, budget: 1000 },
  { day: '05', spent: 700, budget: 1000 },
  { day: '10', spent: 1200, budget: 1000 }, // Overspent point
  { day: '15', spent: 1500, budget: 1000 },
  { day: '20', spent: 1800, budget: 1000 },
  { day: '25', spent: 2100, budget: 1000 },
  { day: '30', spent: 2400, budget: 1000 },
];

export default function ChartBox({ title }: { title: string }) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm h-full min-h-[350px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <select className="text-xs font-bold text-slate-400 bg-slate-50 border-none rounded-lg p-1 outline-none">
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} 
              dy={10}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="spent" 
              stroke="#6366f1" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorSpent)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}