import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import api from "../service/api";
import logo from "../assets/cashPilot-logo.png";
import GoogleLogin from "../components/GoogleLogin";
import toast from "react-hot-toast";
import { Mail, Lock, Loader2, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false); // New state for forgot password

  //  Toast Component
  const showToast = (message: string, type: 'success' | 'error' | 'redirect') => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 ${
          type === 'success' ? 'border-emerald-500' : type === 'error' ? 'border-rose-500' : 'border-indigo-500'
        }`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {type === 'success' && <CheckCircle2 className="h-10 w-10 text-emerald-500" />}
              {type === 'error' && <AlertCircle className="h-10 w-10 text-rose-500" />}
              {type === 'redirect' && <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-slate-900">
                {type === 'success' ? 'Success!' : type === 'error' ? 'Authentication Error' : 'Hang on...'}
              </p>
              <p className="mt-1 text-sm text-slate-500 font-medium">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-slate-100">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-bold text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    ), { duration: 4000 });
  };

  // --- Forgot Password Logic ---
  const handleForgotPassword = async () => {
    if (!email) {
      showToast("Please enter your email address in the field below first.", 'error');
      setError("Email required to reset password");
      return;
    }

    setIsResetting(true);
    setError("");
    
    try {
      await api.post("/auth/forgot-password", { email });
      showToast("A reset link has been sent to your email address.", 'success');
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to send reset email.";
      showToast(msg, 'error');
      setError(msg);
    } finally {
      setIsResetting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(user);

      showToast("Logged in successfully! Welcome back.", 'success');
      navigate("/dashboard");
      
    } catch (err: any) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "Login failed!";

      if (status === 404) {
        showToast("Account not found. Redirecting to registration...", 'redirect');
        setTimeout(() => navigate("/register", { state: { email } }), 2000);
        return; 
      }

      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-3xl opacity-50" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-4 transform hover:rotate-6 transition-transform">
            <img src={logo} alt="CashPilot Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your pilot's share with ease</p>
        </div>

        <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-[32px] p-8 md:p-10 relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold flex items-center gap-3"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none text-slate-700 font-medium disabled:opacity-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  disabled={loading || isResetting}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  disabled={isResetting}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 disabled:text-slate-400"
                >
                  {isResetting ? "Sending..." : "Forgot?"}
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="password"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none text-slate-700 font-medium disabled:opacity-50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading || isResetting}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || isResetting}
              className={`w-full relative flex items-center justify-center gap-2 text-white font-bold py-4 rounded-2xl transition-all shadow-xl
                ${(loading || isResetting)
                  ? "bg-indigo-400 cursor-not-allowed shadow-none" 
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 active:scale-[0.98]"}`}
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

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">or</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin />
          </div>
        </div>

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
      </motion.div>
    </div>
  );
};

export default Login;