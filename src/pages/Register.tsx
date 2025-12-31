import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../service/api";
import logo from "../assets/cashPilot-logo.png";
import toast from "react-hot-toast";
import { 
  User, Mail, Globe, Phone, Briefcase, 
  Coins, Wallet, Lock, Loader2, CheckCircle2, AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize email from navigation state if it exists
  const [formData, setFormData] = useState({
    name: "",
    email: location.state?.email || "",
    country: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    accountType: "PERSONAL",
    accountName: "",
    currency: "",
    openingBalance: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false);

  // --- Modern Custom Toast Styling (Same as Login) ---
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 ${
        type === 'success' ? 'border-emerald-500' : type === 'error' ? 'border-rose-500' : 'border-indigo-500'
      }`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {type === 'success' && <CheckCircle2 className="h-10 w-10 text-emerald-500" />}
              {type === 'error' && <AlertCircle className="h-10 w-10 text-rose-500" />}
              {type === 'info' && <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-slate-900">
                {type === 'success' ? 'Welcome Aboard!' : type === 'error' ? 'Registration Error' : 'Please wait...'}
              </p>
              <p className="mt-1 text-sm text-slate-500 font-medium">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-slate-100">
          <button onClick={() => toast.dismiss(t.id)} className="w-full p-4 text-sm font-bold text-slate-400 hover:text-slate-600 focus:outline-none">Close</button>
        </div>
      </div>
    ), { duration: 4000 });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "email") {
      setEmailError("");
      setEmailAvailable(false);
    }
  };

  // Debounced email check
  useEffect(() => {
    if (!formData.email || formData.email === location.state?.email) return;

    const timer = setTimeout(async () => {
      try {
        const res = await api.post("/auth/check-email", { email: formData.email });
        if (!res.data.available) {
          setEmailError("This email is already registered");
          setEmailAvailable(false);
        } else {
          setEmailError("");
          setEmailAvailable(true);
        }
      } catch {
        setEmailAvailable(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      showToast("Account created successfully! You can now log in.", 'success');
      navigate("/login");
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed!";
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-3xl opacity-60" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl z-10"
      >
        <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 rounded-[40px] p-8 md:p-12">
          
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 mb-4">
              <img src={logo} alt="CashPilot Logo" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Join CashPilot</h1>
            <p className="text-slate-500 font-medium mt-1">Ready to take control of your finances?</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-3"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Personal Section */}
            <div className="space-y-6">
              <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Personal Details</h2>
              
              <InputField label="Full Name" name="name" icon={<User size={18}/>} value={formData.name} onChange={handleChange} placeholder="John Doe" loading={loading} />
              
              <div className="relative">
                <InputField label="Email Address" name="email" type="email" icon={<Mail size={18}/>} value={formData.email} onChange={handleChange} placeholder="john@example.com" loading={loading} error={!!emailError} />
                {emailError && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1 uppercase">{emailError}</p>}
                {emailAvailable && <p className="text-emerald-500 text-[10px] font-bold mt-1 ml-1 uppercase">Email is available</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Mobile" name="mobile" icon={<Phone size={18}/>} value={formData.mobile} onChange={handleChange} placeholder="+123..." loading={loading} />
                <InputField label="Country" name="country" icon={<Globe size={18}/>} value={formData.country} onChange={handleChange} placeholder="USA" loading={loading} />
              </div>
            </div>

            {/* Account Section */}
            <div className="space-y-6">
              <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Account Setup</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Account Name" name="accountName" icon={<Wallet size={18}/>} value={formData.accountName} onChange={handleChange} placeholder="Daily Expense" loading={loading} />
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Type</label>
                  <select name="accountType" value={formData.accountType} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none text-slate-700 font-medium">
                    <option value="PERSONAL">Personal</option>
                    <option value="BUSINESS">Business</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Currency" name="currency" icon={<Coins size={18}/>} value={formData.currency} onChange={handleChange} placeholder="USD" loading={loading} />
                <InputField label="Opening Balance" name="openingBalance" type="number" icon={<Briefcase size={18}/>} value={formData.openingBalance} onChange={handleChange} placeholder="0.00" loading={loading} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Password" name="password" type="password" icon={<Lock size={18}/>} value={formData.password} onChange={handleChange} placeholder="••••••••" loading={loading} />
                <InputField label="Confirm" name="confirmPassword" type="password" icon={<Lock size={18}/>} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" loading={loading} />
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading || !!emailError}
                className={`w-full py-4 rounded-2xl text-white font-bold transition-all shadow-xl flex items-center justify-center gap-2
                  ${loading || !!emailError 
                    ? "bg-slate-300 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 active:scale-[0.99]"}`}
              >
                {loading ? <Loader2 className="animate-spin" size={22} /> : "Create My Account"}
              </button>
            </div>
          </form>

          <p className="text-center mt-8 text-slate-500 font-medium">
            Already a pilot?{" "}
            <button onClick={() => navigate("/login")} className="text-indigo-600 font-black hover:underline decoration-2 underline-offset-4">Log In</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Sub-component for clean code
const InputField = ({ label, name, type = "text", icon, value, onChange, placeholder, loading, error = false }: any) => (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{label}</label>
    <div className="relative group">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
        {icon}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={loading}
        placeholder={placeholder}
        className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700 font-medium placeholder:text-slate-300
          ${error ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-indigo-600"}`}
      />
    </div>
  </div>
);

export default Register;