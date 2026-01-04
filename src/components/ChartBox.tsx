import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LabelList 
} from 'recharts';

interface ChartBoxProps {
  title: string;
  data: { label: string; expenses: number }[]; 
}

export default function ChartBox({ title, data }: ChartBoxProps) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm h-full min-h-[380px]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <p className="text-xs text-slate-400 font-medium mt-1">Specific monthly actuals</p>
      </div>
      
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 30, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} 
              dy={10}
            />
            {/* YAxis is hidden to keep it clean, as we show labels on the points */}
            <YAxis hide domain={[0, 'dataMax + 20000']} /> 
            
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              formatter={(value: number | undefined) => [
                `${(value ?? 0).toLocaleString()} LKR`, 
                'Total Spent'
              ]}
            />
            
            <Area 
  type="monotone" 
  dataKey="expenses" 
  stroke="#6366f1" 
  strokeWidth={4}
  fillOpacity={1} 
  fill="url(#colorSpent)" 
  dot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }}
  activeDot={{ r: 8 }}
>
  {/* FIXED LABEL LIST FORMATTER */}
  <LabelList 
    dataKey="expenses" 
    position="top" 
    offset={15}
    // We change the type to any or (any) => string to bypass the strict Recharts LabelFormatter type
    formatter={(value: any) => value ? Number(value).toLocaleString() : ""}
    style={{ fill: '#1e293b', fontSize: 12, fontWeight: '900' }}
  />
</Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}