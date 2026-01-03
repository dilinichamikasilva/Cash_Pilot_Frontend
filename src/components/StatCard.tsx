import React from "react";

// Define the interface to fix the "Cannot find name 'StatCardProps'" error
interface StatCardProps {
  title: string;
  value: string;
  gradient: string;
  className?: string;
}

export default function StatCard({ title, value, gradient, className = "" }: StatCardProps) {
  return (
    <div className={`p-6 rounded-[2.5rem] text-white bg-gradient-to-br shadow-lg flex flex-col justify-center ${gradient} ${className}`}>
      <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">
        {title}
      </p>
      <h3 className="text-2xl font-black tracking-tight">
        {value}
      </h3>
    </div>
  );
}