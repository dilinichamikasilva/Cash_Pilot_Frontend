import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getMonthlyAllocation, addTransaction, type CategoryItem } from "../service/budgetService";
import DashboardLayout from "../components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Save, TrendingDown, TrendingUp, AlertCircle, 
  CheckCircle2, Receipt, Info, CalendarDays, Camera, X, Plus
} from "lucide-react";

export default function UpdateSpendingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const month = Number(searchParams.get("month")) || new Date().getMonth() + 1;
  const year = Number(searchParams.get("year")) || new Date().getFullYear();
  const [selectedDate, setSelectedDate] = useState(`${year}-${String(month).padStart(2, '0')}`);

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // MODAL STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<CategoryItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // FORM STATE
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (user?.accountId) fetchBudget();
  }, [user, month, year]);

  const fetchBudget = async () => {
    setLoading(true);
    try {
      const data = await getMonthlyAllocation(user!.accountId, month, year);
      setCategories(data.categories);
    } catch (err) {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dateValue: string) => {
    setSelectedDate(dateValue);
    const [newYear, newMonth] = dateValue.split("-");
    setSearchParams({ month: String(Number(newMonth)), year: newYear });
  };

  const handleSubmitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCat) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("allocationCategoryId", selectedCat.id);
    formData.append("amount", amount);
    formData.append("paymentMethod", method);
    formData.append("description", desc);
    if (file) formData.append("billImage", file);

    try {
      await addTransaction(formData);
      setSuccessMessage("Receipt uploaded & Budget updated!");
      setIsModalOpen(false);
      fetchBudget(); 
      setTimeout(() => setSuccessMessage(null), 3000);
     
      setAmount(""); setDesc(""); setFile(null);
    } catch (err: any) {
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50/50 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <button onClick={() => navigate("/budget")} className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-2 text-sm font-bold uppercase">
                <ArrowLeft className="w-4 h-4" /> Back to Planner
              </button>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Receipt className="text-indigo-600 w-8 h-8" /> Actual Expenses
              </h1>
            </div>

            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
              <CalendarDays className="w-5 h-5 text-indigo-500 ml-2" />
              <input type="month" value={selectedDate} onChange={(e) => handleDateChange(e.target.value)} className="font-bold text-slate-700 outline-none cursor-pointer border-none text-sm" />
            </div>
          </div>

          {/* SUCCESS MESSAGE */}
          <AnimatePresence>
            {successMessage && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 font-bold justify-center">
                <CheckCircle2 className="w-5 h-5" /> {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* CATEGORY LIST */}
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800">{cat.name}</h3>
                  <p className="text-slate-400 text-sm">Spent: <span className="text-indigo-600 font-bold">Rs. {cat.spent}</span> / Rs. {cat.budget}</p>
                </div>
                
                {/* Variance Display */}
                <div className={`px-4 py-1 rounded-full text-xs font-bold ${cat.spent > cat.budget ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                   {cat.spent > cat.budget ? `Over by Rs. ${cat.spent - cat.budget}` : `Remaining: Rs. ${cat.budget - cat.spent}`}
                </div>

                <button 
                  onClick={() => { setSelectedCat(cat); setIsModalOpen(true); }}
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-600 transition-colors"
                >
                  <Plus size={18} /> Add Receipt
                </button>
              </div>
            ))}
          </div>

          {/* TRANSACTION MODAL */}
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 relative z-10 shadow-2xl">
                  <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-slate-400"><X /></button>
                  
                  <h2 className="text-2xl font-black mb-1">Add Expense Proof</h2>
                  <p className="text-slate-500 mb-6 text-sm">Category: <span className="text-indigo-600 font-bold">{selectedCat?.name}</span></p>

                  <form onSubmit={handleSubmitTransaction} className="space-y-5">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase">Amount Spent</label>
                      <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-indigo-400" placeholder="0.00" />
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase">Payment Method</label>
                      <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none">
                        <option value="CASH">Cash</option>
                        <option value="DEBIT_CARD">Debit Card</option>
                        <option value="CREDIT_CARD">Credit Card</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase">Attach Bill (Cloudinary)</label>
                      <label className="flex items-center justify-center gap-3 w-full bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl p-6 cursor-pointer hover:bg-indigo-100 transition-colors">
                        <Camera className="text-indigo-600" />
                        <span className="text-indigo-600 font-bold">{file ? file.name : "Upload Receipt Image"}</span>
                        <input type="file" hidden onChange={(e) => setFile(e.currentTarget.files![0])} accept="image/*" />
                      </label>
                    </div>

                    <button disabled={uploading} type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl hover:shadow-indigo-100 disabled:opacity-50">
                      {uploading ? "Uploading to Cloud..." : "Confirm & Save"}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </DashboardLayout>
  );
}