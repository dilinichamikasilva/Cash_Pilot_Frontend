import React from "react";

type StatCardProps = {
  title: string;
  value: string;
  gradient: string;
};

export default function StatCard({ title, value, gradient }: StatCardProps) {
  return (
    <div
      className={`p-6 rounded-2xl text-white shadow-xl bg-gradient-to-br ${gradient} transform transition-all hover:-translate-y-1 hover:shadow-2xl`}
    >
      <p className="text-sm opacity-90">{title}</p>
      <h3 className="text-3xl md:text-4xl font-bold mt-2">{value}</h3>
    </div>
  );
}
