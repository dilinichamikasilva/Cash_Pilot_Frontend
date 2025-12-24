import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/authContext";
import api from "../service/api";
import { getMonthlyAllocation, type CategoryItem } from "../service/budgetService";
import { 
  User as UserIcon, 
  Bell, 
  Search, 
  ChevronDown, 
  Settings, 
  LogOut 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationDropdown from "./NotificationDropdown";

export default function Topbar() {
  const { user } = useAuth();
  const [accountName, setAccountName] = useState("Loading...");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Function to re-fetch all topbar data
  const fetchData = async () => {
    if (!user?.accountId) return;
    try {
      // 1. Fetch Account Name
      const accRes = await api.get(`/account/${user.accountId}`);
      setAccountName(accRes.data.account.name);

      // 2. Fetch Categories for Alerts
      const now = new Date();
      const budgetData = await getMonthlyAllocation(user.accountId, now.getMonth() + 1, now.getFullYear());
      setCategories(budgetData.categories);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Handle clicking outside to close menus
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasAlerts = categories.some(cat => (cat.spent / cat.budget) >= 0.8);

  return (
    <header className="sticky top-0 z-40 w-full h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 md:px-10 flex items-center justify-between">
      
      {/* Search Section */}
      <div className="flex-1">
        <div className="hidden md:flex items-center bg-slate-50 border border-slate-200/60 px-4 py-2 rounded-2xl gap-3 w-full max-w-sm group focus-within:ring-2 ring-indigo-500/20 transition-all">
          <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500" />
          <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl transition-all ${showNotifications ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <Bell size={22} />
            {hasAlerts && <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <NotificationDropdown categories={categories} onRefresh={fetchData} />
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden sm:block" />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 hover:bg-slate-50 p-1 pr-3 rounded-2xl transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px] shadow-sm">
              <div className="w-full h-full rounded-[9px] bg-white overflow-hidden flex items-center justify-center">
                {user?.picture && !imgError ? (
                  <img src={user.picture} alt="profile" className="w-full h-full object-cover" onError={() => setImgError(true)} />
                ) : (
                  <UserIcon className="text-slate-400 w-5 h-5" />
                )}
              </div>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-black text-slate-800">{user?.name?.split(' ')[0]}</p>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">{accountName}</p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50">
                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Signed in as</p>
                  <p className="text-xs font-bold text-slate-800 truncate">{user?.email}</p>
                </div>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  <Settings size={16} /> Account
                </button>
                {/* <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                  <LogOut size={16} /> Sign out
                </button> */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}