import React from "react";

type ChartBoxProps = {
  title: string;
};

export default function ChartBox({ title }: ChartBoxProps) {
  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-200 h-64 md:h-72 flex items-center justify-center">
      <p className="text-slate-500 text-center">{title} (Coming Soon)</p>
    </div>
  );
}
