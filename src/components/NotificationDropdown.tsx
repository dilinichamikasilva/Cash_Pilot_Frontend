import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, BellOff, Loader2 } from "lucide-react";
import { type CategoryItem } from "../service/budgetService";

interface NotificationDropdownProps {
  categories: CategoryItem[];
  onRefresh: () => Promise<void>; // Receives the refresh function from Topbar
}

export default function NotificationDropdown({ categories, onRefresh }: NotificationDropdownProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const generateAlerts = () => {
    const alerts = [];
    categories.forEach((cat) => {
      const usagePercent = (cat.spent / cat.budget) * 100;

      if (cat.spent > cat.budget) {
        alerts.push({
          id: `over-${cat.id}`,
          title: "Budget Exceeded",
          desc: `You've spent Rs. ${(cat.spent - cat.budget).toLocaleString()} over your ${cat.name} limit!`,
          icon: <AlertCircle className="text-rose-500" size={18} />,
          time: "Just now"
        });
      } 
      else if (usagePercent >= 80) {
        alerts.push({
          id: `warn-${cat.id}`,
          title: "Approaching Limit",
          desc: `Your ${cat.name} budget is at ${Math.round(usagePercent)}% capacity.`,
          icon: <AlertCircle className="text-amber-500" size={18} />,
          time: "Recently"
        });
      }
    });

    if (categories.length > 0 && alerts.length === 0) {
      alerts.push({
        id: "good-news",
        title: "On Track!",
        desc: "All your spending is currently within your set limits. Keep it up!",
        icon: <CheckCircle2 className="text-emerald-500" size={18} />,
        time: "Today"
      });
    }
    return alerts;
  };

  const activeAlerts = generateAlerts();

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    await onRefresh(); // Executes the fetch logic in Topbar
    setTimeout(() => setIsRefreshing(false), 500); // Small delay for visual feedback
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-50"
    >
      <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-800 text-sm">Alert Center</h3>
        {activeAlerts.length > 0 && (
          <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold uppercase">
            {activeAlerts.length} Active
          </span>
        )}
      </div>

      <div className="max-h-[350px] overflow-y-auto">
        {activeAlerts.length > 0 ? (
          activeAlerts.map((n) => (
            <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-3 border-b border-slate-50 last:border-0">
              <div className="mt-1">{n.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">{n.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-tighter">{n.time}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center">
            <BellOff className="mx-auto text-slate-200 mb-2" size={32} />
            <p className="text-sm text-slate-400">No alerts found</p>
          </div>
        )}
      </div>

      <button 
        onClick={handleRefreshClick}
        disabled={isRefreshing}
        className="w-full py-4 flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors uppercase tracking-widest border-t border-slate-50 disabled:opacity-50"
      >
        {isRefreshing ? <Loader2 size={14} className="animate-spin" /> : null}
        {isRefreshing ? "Refreshing..." : "Refresh Dashboard"}
      </button>
    </motion.div>
  );
}