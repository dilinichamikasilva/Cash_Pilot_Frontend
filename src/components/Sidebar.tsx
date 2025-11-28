import React, { useState } from "react";
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
import MenuItem from "./MenuItem";

type SidebarProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ open, setOpen, mobileOpen, setMobileOpen }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}
      
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

        {/* Close button for mobile */}
        <button className="lg:hidden absolute top-5 right-5" onClick={() => setMobileOpen(false)}>
          <X size={28} className="text-slate-700" />
        </button>
      </aside>
    </>
  );
}
