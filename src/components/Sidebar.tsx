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
import {Link} from "react-router-dom"

type SidebarProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* <aside
        className={`
          fixed lg:static z-40 top-16 left-0      
          min-h-[calc(100vh-4rem)]                
          w-72                                    
          bg-white/90 backdrop-blur-xl 
          shadow-2xl border-r border-slate-200 
          p-5 flex flex-col justify-between
          transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      > */}
      <aside
          className={`
            fixed lg:static top-16 left-0
            min-h-[calc(100vh-4rem)]
            w-72
            bg-white/90 backdrop-blur-xl 
            shadow-2xl border-r border-slate-200 
            p-5 flex flex-col justify-between
            transition-transform duration-300
            ${
              mobileOpen
                ? "translate-x-0 z-40"
                : "-translate-x-full -z-10 lg:translate-x-0 lg:z-40"
            }
          `}
        >
        <div>
          <div className="flex items-center gap-3 mb-10">
            <img src={logo} alt="CashPilot" className="w-12 h-12 drop-shadow" />
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CashPilot
            </h1>
          </div>

          <nav className="flex flex-col gap-3 text-slate-700 font-medium">
            <Link to="/dashboard">
              <MenuItem icon={<LayoutDashboard />} label="Dashboard" open />
            </Link>
            <Link to="/budget">
              <MenuItem icon={<PiggyBank />} label="Budget" open />
            </Link>
            <Link to="/accounts">
              <MenuItem icon={<Wallet />} label="Accounts" open />
            </Link>
            <Link to="/reports">
              <MenuItem icon={<BarChart3 />} label="Reports" open />
            </Link>
            <Link to="/settings">
              <MenuItem icon={<Settings />} label="Settings" open />
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <MenuItem icon={<LogOut />} label="Logout" open />
        </div>

        <button
          className="lg:hidden absolute top-5 right-5"
          onClick={() => setMobileOpen(false)}
        >
          <X size={28} className="text-slate-700" />
        </button>
      </aside>
    </>
  );
}
