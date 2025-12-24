import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import api from "../service/api";
import logo from "../assets/cashPilot-logo.png";
import GoogleLogin from "../components/GoogleLogin";
import toast from "react-hot-toast";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Keep your logic exactly as it was
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await api.post("/auth/login", { email, password });
      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(user);

      toast.success("Logged in successfully! 🎉");
      navigate("/dashboard");
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed!";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-3xl opacity-50" />

      <div className="w-full max-w-[440px] z-10">
        {/* Logo Container */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-4">
            <img src={logo} alt="CashPilot Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your pilot's share with ease</p>
        </div>

        <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-[32px] p-8 md:p-10">
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none text-slate-700 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="password"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none text-slate-700 font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full relative flex items-center justify-center gap-2 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-100
                ${loading 
                  ? "bg-indigo-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"}`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="flex justify-center">
            <GoogleLogin />
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-slate-500 text-center mt-8 font-medium">
          New to CashPilot?{" "}
          <button
            type="button"
            className="text-indigo-600 font-bold hover:underline decoration-2 underline-offset-4"
            onClick={() => navigate("/register")}
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;