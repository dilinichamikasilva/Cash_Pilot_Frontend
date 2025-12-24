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
  Info
} from "lucide-react";

export default function UpdateSpendingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Extract month/year from URL
  const month = Number(searchParams.get("month")) || new Date().getMonth() + 1;
  const year = Number(searchParams.get("year")) || new Date().getFullYear();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSavingId, setActiveSavingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, amount: number) => {
    setActiveSavingId(id);
    try {
      await updateCategorySpending({
        allocationCategoryId: id,
        actualAmount: amount
      });
      
      // Update local state to reflect the new spent value
      setCategories(prev => prev.map(c => c.id === id ? { ...c, spent: amount } : c));
      
      setSuccessMessage("Spent amount updated!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update spending");
    } finally {
      setActiveSavingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium tracking-wide">Retrieving budget data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50/50 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <button 
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-2 text-sm font-bold uppercase tracking-widest"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Planner
              </button>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Receipt className="text-indigo-600 w-8 h-8" />
                Actual Expenses
              </h1>
              <p className="text-slate-500 mt-1">Compare your performance for {month}/{year}</p>
            </div>

            <AnimatePresence>
              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2 text-sm font-bold"
                >
                  <CheckCircle2 className="w-4 h-4" /> {successMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* MAIN LIST */}
          <div className="space-y-4">
            {categories.length > 0 ? (
              categories.map((cat, index) => {
                const variance = cat.budget - cat.spent;
                const isOver = cat.spent > cat.budget;

                return (
                  <motion.div 
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      
                      {/* Left: Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-slate-800">{cat.name}</h3>
                          {isOver && (
                            <span className="bg-red-50 text-red-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border border-red-100 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Overspent
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-tighter">
                          Allocated: <span className="text-slate-600 font-bold">Rs. {cat.budget.toLocaleString()}</span>
                        </p>
                      </div>

                      {/* Middle: Variance Indicator */}
                      <div className="flex items-center gap-4 px-6 border-l border-r border-slate-50 hidden md:flex">
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Variance</p>
                          <div className={`flex items-center gap-1 font-black ${isOver ? 'text-red-500' : 'text-emerald-500'}`}>
                            {isOver ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            Rs. {Math.abs(variance).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actual Input */}
                      <div className="flex items-center gap-3">
                        <div className="relative group">
                          <label className="absolute -top-6 left-0 text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity">
                            Actual Amount
                          </label>
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">Rs.</span>
                          <input
                            type="number"
                            defaultValue={cat.spent}
                            onBlur={(e) => handleUpdate(cat.id, Number(e.target.value))}
                            className={`w-40 pl-12 pr-4 py-3 bg-slate-50 border-2 rounded-2xl font-bold text-slate-700 outline-none transition-all ${
                              isOver ? 'focus:border-red-200 focus:ring-red-50' : 'focus:border-indigo-200 focus:ring-indigo-50'
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                        
                        <div className="w-10 flex justify-center">
                          {activeSavingId === cat.id ? (
                            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <div className="p-2 bg-slate-50 rounded-xl text-slate-300">
                               <Save className="w-4 h-4" />
                            </div>
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
                <h2 className="text-xl font-bold text-slate-800">No categories found</h2>
                <p className="text-slate-400 max-w-xs mx-auto mt-2">
                  You need to create a budget allocation for this month before tracking actual expenses.
                </p>
                <button 
                  onClick={() => navigate('/budget')}
                  className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Go to Planner
                </button>
              </div>
            )}
          </div>

          <div className="mt-10 p-6 bg-indigo-900 rounded-[2.5rem] text-white flex items-center justify-between overflow-hidden relative">
            <div className="relative z-10">
              <h4 className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-1">Pro Tip</h4>
              <p className="text-sm text-indigo-50 max-w-sm">
                Values are saved automatically when you click away from the input field. 
                Any overspending will trigger an automatic alert in your dashboard.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
              <Receipt className="w-40 h-40" />
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}