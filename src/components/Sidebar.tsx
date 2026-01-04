import { useState, useMemo, type Dispatch, type SetStateAction } from "react";
import {
  LayoutDashboard,
  BarChart3,
  PiggyBank,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  AlertCircle
} from "lucide-react";
import logo from "../assets/cashPilot-logo.png";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/authContext";

type SidebarProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mobileOpen: boolean;
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
};

const MOTIVATIONAL_QUOTES = [
  { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
  { text: "Budgeting is telling your money where to go instead of wondering where it went.", author: "John Maxwell" },
  { text: "The goal is not to look rich, but to be wealthy.", author: "Unknown" },
  { text: "Beware of little expenses; a small leak will sink a great ship.", author: "Benjamin Franklin" },
  { text: "Money is a terrible master but an excellent servant.", author: "P.T. Barnum" },
  { text: "Financial freedom is available to those who learn about it and work for it.", author: "Robert Kiyosaki" }
];

export default function Sidebar({ open, mobileOpen, setMobileOpen }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

 
  const dailyQuote = useMemo(() => {
    const dayOfMonth = new Date().getDate();
    return MOTIVATIONAL_QUOTES[dayOfMonth % MOTIVATIONAL_QUOTES.length];
  }, []);

  const menuItems = [
    { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/budget", icon: <PiggyBank size={20} />, label: "Budget Planner" },
    { path: "/analytics", icon: <BarChart3 size={20} />, label: "Analytics" },
    { path: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <>
      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm border border-slate-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="text-rose-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">You are about to sign out. You will need to login again to access your data.</p>
                <div className="flex gap-3 w-full">
                  <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">Cancel</button>
                  <button onClick={logout} className="flex-1 px-4 py-3 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 shadow-lg shadow-rose-200">Yes, Logout</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-100 
        flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-[70]
        ${open ? "w-72" : "w-24"} 
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="CP" className="w-10 h-10 object-contain" />
            {open && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">CashPilot</h1>
                <span className="text-[10px] font-bold text-indigo-600 uppercase mt-1 block tracking-wider">Financial Guide</span>
              </motion.div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                <div className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 mb-1 ${isActive ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"} ${!open ? "justify-center" : "justify-between"}`}>
                  <div className="flex items-center gap-3 font-semibold text-[14px]">
                    <span className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`}>{item.icon}</span>
                    {open && <span>{item.label}</span>}
                  </div>
                  {open && isActive && <ChevronRight size={14} className="opacity-70" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* DYNAMIC MOTIVATION FOOTER */}
        <div className="p-4 border-t border-slate-50">
          {open && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-4 mb-4 relative overflow-hidden group shadow-lg"
            >
              <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Sparkles size={64} className="text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={12} className="text-indigo-100" />
                  <p className="text-[9px] font-bold text-indigo-100 uppercase tracking-widest">Daily Wisdom</p>
                </div>
                <p className="text-white text-[11px] font-medium leading-relaxed italic">"{dailyQuote.text}"</p>
                <p className="text-indigo-200 text-[9px] mt-2 font-bold">— {dailyQuote.author}</p>
              </div>
            </motion.div>
          )}

          <button 
            onClick={() => setShowLogoutConfirm(true)} 
            className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold text-sm ${!open ? "justify-center" : ""}`}
          >
            <div className="bg-slate-100 group-hover:bg-rose-100 p-1.5 rounded-lg flex-shrink-0 transition-colors">
              <LogOut size={18} />
            </div>
            {open && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}