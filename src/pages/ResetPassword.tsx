import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../service/api";
import toast from "react-hot-toast";
import { Lock, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token"); // Grabs the ?token= from the email link

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      // Calls the second backend function you provided
      await api.post("/auth/reset-password", { token, password });
      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Reset failed. Link may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-white shadow-xl border border-slate-100 rounded-[32px] p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="text-indigo-600 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Set New Password</h1>
            <p className="text-slate-500 font-medium">Please enter your new password below.</p>
          </div>

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>Reset Password <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;