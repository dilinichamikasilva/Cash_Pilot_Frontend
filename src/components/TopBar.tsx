import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import api from "../service/api";
import { getMonthlyAllocation, type CategoryItem } from "../service/budgetService";
import { 
  User as UserIcon, 
  Bell, 
  Search, 
  ChevronDown, 
  Settings, 
  LogOut,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Menu 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationDropdown from "./NotificationDropdown";


interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const [accountName, setAccountName] = useState("Loading...");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); 
  const [imgError, setImgError] = useState(false);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<CategoryItem[]>([]);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    if (!user?.accountId) return;
    try {
      const accRes = await api.get(`/account/${user.accountId}`);
      setAccountName(accRes.data.account.name);

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

  // Handle Search Filtering
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResults([]);
    } else {
      const filtered = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResults(filtered);
    }
  }, [searchQuery, categories]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchQuery("");
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasAlerts = categories.some(cat => (cat.spent / cat.budget) >= 0.8);

  return (
    <>
      {/*  Logout Confirmation Modal  */}
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
                <h3 className="text-xl font-bold text-slate-800 mb-2">Sign Out?</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                  Are you sure you want to log out of CashPilot? You will need to sign in again to manage your budget.
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
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-40 w-full h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 md:px-10 flex items-center justify-between">
        
        {/*  MOBILE TOGGLE BUTTON  */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2.5 mr-4 rounded-xl bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-200/50 flex-shrink-0"
        >
          <Menu size={22} />
        </button>

        {/*  Search Bar & Instant Category View  */}
        <div className="flex-1 relative" ref={searchRef}>
          <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200/60 px-4 py-2 rounded-2xl gap-3 w-full max-w-sm group focus-within:ring-2 ring-indigo-500/20 transition-all">
            <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500" />
            <input 
              type="text" 
              placeholder="Search Categories..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <AnimatePresence>
            {filteredResults.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-14 left-0 w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-4 z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category Analysis</p>
                  <TrendingUp size={14} className="text-indigo-500" />
                </div>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredResults.map(result => (
                    <button 
                      key={result.id} 
                      onClick={() => {
                        navigate(`/transactions?category=${result.id}`);
                        setSearchQuery("");
                      }}
                      className="w-full text-left p-3 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-800 flex items-center gap-2">
                          {result.name}
                          <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-indigo-500" />
                        </span>
                        <span className={`text-sm font-black ${result.spent > result.budget ? 'text-rose-500' : 'text-slate-900'}`}>
                          Rs. {result.spent.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((result.spent / result.budget) * 100, 100)}%` }}
                          className={`h-full rounded-full ${result.spent > result.budget ? 'bg-rose-500' : 'bg-indigo-500'}`}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                        <span className="text-slate-400">Limit: Rs. {result.budget.toLocaleString()}</span>
                        <span className={result.spent > result.budget ? "text-rose-500" : "text-indigo-500"}>
                          {result.spent > result.budget 
                            ? `Over by Rs. ${(result.spent - result.budget).toLocaleString()}` 
                            : `${Math.round((result.spent/result.budget)*100)}% Consumed`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/*  Right Actions  */}
        <div className="flex items-center gap-2 md:gap-4">
  
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
                
                <div className="fixed inset-x-4 top-20 md:absolute md:top-full md:right-0 md:inset-x-auto mt-2 z-50">
                  <NotificationDropdown categories={categories} onRefresh={fetchData} />
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-8 w-[1px] bg-slate-100 mx-1 hidden sm:block" />

          <div className="relative" ref={profileRef}>
            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 hover:bg-slate-50 p-1 pr-3 rounded-2xl transition-all group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px] shadow-sm group-hover:shadow-indigo-200 transition-all">
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
                  <div className="px-4 py-3 border-b border-slate-50 mb-1 text-center sm:text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Signed in as</p>
                    <p className="text-xs font-bold text-slate-800 truncate">{user?.email}</p>
                  </div>

                  <button 
                    onClick={() => { navigate("/settings"); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                  >
                    <Settings size={16} /> Account Settings
                  </button>
                  
                  <button 
                    onClick={() => { setShowLogoutConfirm(true); setShowProfileMenu(false); }} 
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </>
  );
}