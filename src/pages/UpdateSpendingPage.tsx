import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  getMonthlyAllocation, 
  updateCategorySpending, 
  type CategoryItem 
} from "../service/budgetService";
import DashboardLayout from "../components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Save, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Receipt,
  Info,
  CalendarDays // New icon
} from "lucide-react";

export default function UpdateSpendingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 1. Get initial month/year from URL or default to current
  const month = Number(searchParams.get("month")) || new Date().getMonth() + 1;
  const year = Number(searchParams.get("year")) || new Date().getFullYear();

  // 2. Local state for the HTML input (Format: YYYY-MM)
  const [selectedDate, setSelectedDate] = useState(`${year}-${String(month).padStart(2, '0')}`);

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSavingId, setActiveSavingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Triggered whenever the URL month/year changes
  useEffect(() => {
    if (user?.accountId) {
      fetchBudget();
    }
  }, [user, month, year]);

  const fetchBudget = async () => {
    setLoading(true);
    try {
      const data = await getMonthlyAllocation(user!.accountId, month, year);
      setCategories(data.categories);
    } catch (err) {
      console.error("Failed to fetch budget:", err);
      setCategories([]); // Clear categories if none found for selected month
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Date Change: Update URL params
  const handleDateChange = (dateValue: string) => {
    setSelectedDate(dateValue);
    const [newYear, newMonth] = dateValue.split("-");
    setSearchParams({ month: String(Number(newMonth)), year: newYear });
  };

  const handleUpdate = async (id: string, amount: number) => {
    setActiveSavingId(id);
    try {
      await updateCategorySpending({
        allocationCategoryId: id,
        actualAmount: amount
      });
      
      setCategories(prev => prev.map(c => c.id === id ? { ...c, spent: amount } : c));
      setSuccessMessage("Spent amount updated!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update spending");
    } finally {
      setActiveSavingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50/50 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <button 
                onClick={() => navigate("/budget")}
                className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-2 text-sm font-bold uppercase tracking-widest"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Planner
              </button>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Receipt className="text-indigo-600 w-8 h-8" />
                Actual Expenses
              </h1>
            </div>

            {/* DATE SELECTOR WIDGET */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
              <CalendarDays className="w-5 h-5 text-indigo-500 ml-2" />
              <div className="flex flex-col">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Period</label>
                <input 
                  type="month" 
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="font-bold text-slate-700 outline-none cursor-pointer border-none p-0 focus:ring-0 text-sm"
                />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-emerald-100 flex items-center gap-2 font-bold justify-center"
              >
                <CheckCircle2 className="w-5 h-5" /> {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
             <div className="flex flex-col items-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Syncing data for {selectedDate}...</p>
             </div>
          ) : (
            <div className="space-y-4">
              {categories.length > 0 ? (
                categories.map((cat, index) => {
                  const variance = cat.budget - cat.spent;
                  const isOver = cat.spent > cat.budget;

                  return (
                    <motion.div 
                      key={cat.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-slate-800">{cat.name}</h3>
                            {isOver && (
                              <span className="bg-red-50 text-red-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border border-red-100 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Overspent
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm font-medium">
                            Budget: <span className="text-slate-600 font-bold">Rs. {cat.budget.toLocaleString()}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-4 px-6 border-l border-slate-50 hidden md:flex">
                          <div className="text-right">
                            <p className="text-[10px] text-slate-400 font-black uppercase">Variance</p>
                            <div className={`flex items-center gap-1 font-black ${isOver ? 'text-red-500' : 'text-emerald-500'}`}>
                              {isOver ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              Rs. {Math.abs(variance).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">Rs.</span>
                            <input
                              type="number"
                              key={`${cat.id}-${cat.spent}`} // Force input reset when month changes
                              defaultValue={cat.spent}
                              onBlur={(e) => handleUpdate(cat.id, Number(e.target.value))}
                              className={`w-40 pl-12 pr-4 py-3 bg-slate-50 border-2 rounded-2xl font-bold text-slate-700 outline-none transition-all ${
                                isOver ? 'focus:border-red-200' : 'focus:border-indigo-200'
                              }`}
                            />
                          </div>
                          <div className="w-10">
                            {activeSavingId === cat.id && (
                              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="bg-white rounded-[3rem] py-20 border border-dashed border-slate-200 text-center">
                   <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info className="text-slate-300 w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">No budget for {selectedDate}</h2>
                  <p className="text-slate-400 max-w-xs mx-auto mt-2">
                    You haven't set up a budget planner for this specific month yet.
                  </p>
                  <button 
                    onClick={() => navigate('/budget')}
                    className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold"
                  >
                    Go to Budget Planner
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}