import React, { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  PiggyBank,
  Settings,
  LogOut,
  X,
  ChevronRight,
  Sparkles,
  AlertCircle
} from "lucide-react";
import logo from "../assets/cashPilot-logo.png";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/authContext"; 

type SidebarProps = {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();
  
  // State to control the confirmation modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/budget", icon: <PiggyBank size={20} />, label: "Budget Planner" },
    { path: "/accounts", icon: <Wallet size={20} />, label: "My Accounts" },
    { path: "/reports", icon: <BarChart3 size={20} />, label: "Analytics" },
    { path: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <>
      {/* 1. Logout Confirmation Modal Overlay */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm border border-slate-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="text-rose-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                  You are about to sign out. You will need to login again to access your financial data.
                </p>
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={logout}
                    className="flex-1 px-4 py-3 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
                  >
                    Yes, Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-100 flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-[70] ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={logo} alt="CP" className="w-10 h-10 object-contain drop-shadow-sm" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">CashPilot</h1>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1 block">Personal Finance</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                <div className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 mb-1 ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
                  <div className="flex items-center gap-3 font-semibold text-[14px]">
                    <span className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                  {isActive && <ChevronRight size={14} className="opacity-70" />}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-50">
          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-2xl p-4 mb-4 border border-indigo-100/50">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-indigo-600" />
              <p className="text-xs font-bold text-indigo-900 uppercase">Premium Plan</p>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">You're currently using the Pro features.</p>
          </div>

          
          <button 
            onClick={() => setShowLogoutConfirm(true)} 
            className="w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 font-bold text-sm"
          >
            <div className="bg-slate-100 group-hover:bg-rose-100 p-1.5 rounded-lg transition-colors">
              <LogOut size={18} />
            </div>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}