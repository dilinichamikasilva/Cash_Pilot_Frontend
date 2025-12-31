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

  const [formData, setFormData] = useState({
    name: "",
    email: location.state?.email || "",
    country: "Sri Lanka",
    mobile: "",
    password: "",
    confirmPassword: "",
    accountType: "PERSONAL",
    accountName: "Primary Account",
    currency: "LKR",
    openingBalance: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false);

  // --- Premium Custom Toast ---
  const showToast = (message: string, type: 'success' | 'error') => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 ${
        type === 'success' ? 'border-emerald-500' : 'border-rose-500'
      }`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {type === 'success' ? <CheckCircle2 className="h-10 w-10 text-emerald-500" /> : <AlertCircle className="h-10 w-10 text-rose-500" />}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-slate-900">
                {type === 'success' ? 'Welcome!' : 'Registration Error'}
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

  // Email availability check
  useEffect(() => {
    if (!formData.email || formData.email.length < 5) return;
    const timer = setTimeout(async () => {
      try {
        const res = await api.post("/auth/check-email", { email: formData.email });
        if (!res.data.available) {
          setEmailError("Email already registered");
          setEmailAvailable(false);
        } else {
          setEmailError("");
          setEmailAvailable(true);
        }
      } catch { setEmailAvailable(false); }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      showToast("Account created! Please log in.", "success");
      navigate("/login");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      showToast(msg, "error");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-3xl opacity-60" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl z-10">
        <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 rounded-[40px] p-8 md:p-12">
          
          {/* Header (Same as Complete Reg) */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 mb-4 shadow-sm">
              <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-slate-500 font-medium mt-1">Join CashPilot and start your financial journey.</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-3">
                <AlertCircle size={18} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Personal Details */}
              <InputField label="Full Name" name="name" icon={<User size={18}/>} value={formData.name} onChange={handleChange} placeholder="John Doe" loading={loading} />
              
              <div className="relative">
                <InputField label="Email Address" name="email" type="email" icon={<Mail size={18}/>} value={formData.email} onChange={handleChange} placeholder="john@example.com" loading={loading} error={!!emailError} />
                {emailError && <p className="text-rose-500 text-[10px] font-black mt-1 ml-1 uppercase">{emailError}</p>}
                {emailAvailable && <p className="text-emerald-500 text-[10px] font-black mt-1 ml-1 uppercase">Email is available</p>}
              </div>

              <InputField label="Mobile Number" name="mobile" icon={<Phone size={18}/>} value={formData.mobile} onChange={handleChange} placeholder="+94..." loading={loading} />

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Country</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                    <Globe size={18} />
                  </span>
                  <select name="country" value={formData.country} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none text-slate-700 font-medium appearance-none">
                    <option value="Sri Lanka">SRI LANKA</option>
                    <option value="India">INDIA</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Australia">AUSTRALIA</option>
                  </select>
                </div>
              </div>

              {/* Account Details */}
              <InputField label="Opening Balance" name="openingBalance" type="number" icon={<Wallet size={18}/>} value={formData.openingBalance} onChange={handleChange} placeholder="0.00" loading={loading} />
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Currency</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                    <Coins size={18} />
                  </span>
                  <select name="currency" value={formData.currency} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none text-slate-700 font-medium appearance-none">
                    <option value="LKR">LKR - Sri Lankan Rupee</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>
              </div>

              {/* Passwords */}
              <InputField label="Password" name="password" type="password" icon={<Lock size={18}/>} value={formData.password} onChange={handleChange} placeholder="••••••••" loading={loading} />
              <InputField label="Confirm Password" name="confirmPassword" type="password" icon={<Lock size={18}/>} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" loading={loading} />
            </div>

            {/* Account Type Selector (Matching Complete Registration) */}
            <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Account Purpose</label>
              <div className="grid grid-cols-2 gap-4">
                {["PERSONAL", "BUSINESS"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({...formData, accountType: type})}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.accountType === type 
                      ? "border-indigo-600 bg-white shadow-lg shadow-indigo-100" 
                      : "border-transparent bg-slate-100 text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    {type === "PERSONAL" ? <User size={20}/> : <Briefcase size={20}/>}
                    <span className={`text-xs font-black uppercase tracking-tighter ${formData.accountType === type ? "text-indigo-600" : ""}`}>
                      {type}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!emailError}
              className={`w-full py-4 rounded-2xl text-white font-bold transition-all shadow-xl flex items-center justify-center gap-2
                ${loading || !!emailError ? "bg-slate-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99]"}`}
            >
              {loading ? <Loader2 className="animate-spin" size={22} /> : "Create My Account"}
            </button>
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

// Reusable Field with autocomplete="off"
const InputField = ({ label, name, type = "text", icon, value, onChange, placeholder, loading, error = false, disabled = false }: any) => (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{label}</label>
    <div className="relative group">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
        {icon}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={loading || disabled}
        autoComplete="off"
        placeholder={placeholder}
        className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700 font-medium placeholder:text-slate-300
          ${error ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-indigo-600"}`}
      />
    </div>
  </div>
);

export default Register;