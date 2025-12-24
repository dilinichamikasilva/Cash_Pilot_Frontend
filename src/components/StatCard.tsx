import React from "react";

// Define the interface to fix the "Cannot find name 'StatCardProps'" error
interface StatCardProps {
  title: string;
  value: string;
  gradient: string;
}

export default function StatCard({ title, value, gradient }: StatCardProps) {
  return (
    <div className={`group relative p-8 rounded-[2rem] text-white shadow-2xl bg-gradient-to-br ${gradient} overflow-hidden transition-all duration-500 hover:scale-[1.02]`}>
      {/* Decorative Circles */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-1">{title}</p>
        <h3 className="text-3xl md:text-4xl font-black tracking-tight">{value}</h3>
        <div className="mt-4 flex items-center gap-2">
           <span className="text-[10px] bg-white/20 px-2 py-1 rounded-lg backdrop-blur-md font-bold italic">LIVE DATA</span>
        </div>
      </div>
    </div>
  );
}