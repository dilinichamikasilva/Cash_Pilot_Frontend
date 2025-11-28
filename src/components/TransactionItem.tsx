import React from "react";

type TransactionItemProps = {
  category: string;
  amount: string;
};

export default function TransactionItem({ category, amount }: TransactionItemProps) {
  const positive = amount.trim().startsWith("+");

  return (
    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-white/80 to-slate-100/60 backdrop-blur rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
      <span className="font-medium text-slate-700">{category}</span>
      <span className={positive ? "text-green-600" : "text-red-600"}>
        {amount}
      </span>
    </div>
  );
}
