// src/pages/Dashboard.tsx
import React, { useState, type JSX } from "react";
import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  PiggyBank,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import logo from "../assets/cashPilot-logo.png";

export default function Dashboard(): JSX.Element {
  const [open, setOpen] = useState<boolean>(true); 
  const [mobileOpen, setMobileOpen] = useState<boolean>(false); 

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100">

      {/* ───── MOBILE TOP BAR ───── */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white shadow-md flex items-center justify-between px-5 py-4 z-40">
        <img src={logo} alt="CashPilot" className="w-10 h-10" />
        <button onClick={() => setMobileOpen(true)}>
          <Menu size={28} className="text-slate-700" />
        </button>
      </div>

      
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ───── SIDEBAR ───── */}
      <aside
        className={`
          fixed lg:static z-40 top-0 left-0 min-h-screen bg-white/90 backdrop-blur-xl 
          shadow-2xl border-r border-slate-200 transition-all duration-300 
          p-5 flex flex-col justify-between
          ${open ? "w-72" : "w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div>
          <div
            className="flex items-center gap-3 mb-10 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setOpen(!open)}
          >
            <img src={logo} alt="CashPilot" className="w-12 h-12 drop-shadow" />
            {open && (
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CashPilot
              </h1>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col gap-3 text-slate-700 font-medium">
            <MenuItem icon={<LayoutDashboard />} label="Dashboard" open={open} />
            <MenuItem icon={<Wallet />} label="Accounts" open={open} />
            <MenuItem icon={<BarChart3 />} label="Reports" open={open} />
            <MenuItem icon={<PiggyBank />} label="Budget" open={open} />
            <MenuItem icon={<Settings />} label="Settings" open={open} />
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-4 border-t border-slate-200">
          <MenuItem icon={<LogOut />} label="Logout" open={open} />
        </div>

        {/* Close button (Mobile only) */}
        <button
          className="lg:hidden absolute top-5 right-5"
          onClick={() => setMobileOpen(false)}
        >
          <X size={28} className="text-slate-700" />
        </button>
      </aside>

      {/* ───── MAIN CONTENT ───── */}
      <main className="flex-1 px-6 md:px-10 py-20 lg:py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-10">
          Dashboard Overview
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-10">
          <StatCard title="Account Balance" value="Rs. 125,000" gradient="from-indigo-500 to-purple-500" />
          <StatCard title="Today's Expense" value="Rs. 3,200" gradient="from-rose-500 to-pink-500" />
          <StatCard title="This Month Spending" value="Rs. 45,900" gradient="from-sky-500 to-cyan-500" />
          <StatCard title="Remaining Budget" value="Rs. 22,000" gradient="from-emerald-500 to-green-500" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <ChartBox title="Monthly Expense Trend" />
          <ChartBox title="Category Breakdown" />
        </div>

        {/* Recent Transactions */}
        <div className="mt-10 bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-200">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            Recent Transactions
          </h2>

          <div className="space-y-3">
            <TransactionItem category="Food" amount="- Rs. 1,200" />
            <TransactionItem category="Transport" amount="- Rs. 600" />
            <TransactionItem category="Salary" amount="+ Rs. 45,000" />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ───────────────── CHILD COMPONENTS ───────────────── */

type MenuItemProps = {
  icon: JSX.Element;
  label: string;
  open: boolean;
};

function MenuItem({ icon, label, open }: MenuItemProps): JSX.Element {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 hover:shadow-md transition-all">
      <div className="w-6 h-6 text-indigo-600">{icon}</div>
      {open && <span className="text-slate-700">{label}</span>}
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  gradient: string;
};

function StatCard({ title, value, gradient }: StatCardProps): JSX.Element {
  return (
    <div
      className={`p-6 rounded-2xl text-white shadow-xl bg-gradient-to-br ${gradient} transform transition-all hover:-translate-y-1 hover:shadow-2xl`}
    >
      <p className="text-sm opacity-90">{title}</p>
      <h3 className="text-3xl md:text-4xl font-bold mt-2">{value}</h3>
    </div>
  );
}

function ChartBox({ title }: { title: string }): JSX.Element {
  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-200 h-64 md:h-72 flex items-center justify-center">
      <p className="text-slate-500 text-center">{title} (Coming Soon)</p>
    </div>
  );
}

function TransactionItem({
  category,
  amount,
}: {
  category: string;
  amount: string;
}): JSX.Element {
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
