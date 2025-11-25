import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api";
import logo from "../assets/cashPilot-logo.png";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
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

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    
    if (name === "email") {
      setEmailError("");
      setEmailAvailable(false);
    }
  };

  //email check
  useEffect(() => {
    if (!formData.email) return;

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
        setEmailError("");
        setEmailAvailable(false);
      }
    }, 500); 

    return () => clearTimeout(timer);
  }, [formData.email]);

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (emailError) return; 

    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-10">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-8 sm:p-10">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="App Logo" className="w-36 object-contain drop-shadow-xl" />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">Create Account</h1>
        <p className="text-gray-500 text-center mb-6">Register to start managing your finances</p>

        {error && <div className="mb-4 p-3 rounded-md bg-red-100 text-red-600 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

          {/* Name & Email */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="off"
                className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div className="flex-1 mt-4 sm:mt-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="off"
                className={`w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                  emailError ? "border-red-500" : "border-gray-300"
                }`}
              />
              {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
              {emailAvailable && !emailError && <p className="text-green-600 text-sm mt-1">Email is available</p>}
            </div>
          </div>

          {/* Mobile & Country */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
              <input
                type="text"
                name="mobile"
                placeholder="+1234567890"
                value={formData.mobile}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="off"
                className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div className="flex-1 mt-4 sm:mt-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
              <input
                type="text"
                name="country"
                placeholder="USA"
                value={formData.country}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="off"
                className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Account Name & Type */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Name *</label>
              <input
                type="text"
                name="accountName"
                placeholder="My Personal Account"
                value={formData.accountName}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="off"
                className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div className="flex-1 mt-4 sm:mt-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type *</label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="PERSONAL">Personal</option>
                <option value="BUSINESS">Business</option>
              </select>
            </div>
          </div>

          {/* Currency & Opening Balance */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency *</label>
              <input
                type="text"
                name="currency"
                placeholder="USD"
                value={formData.currency}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="off"
                className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div className="flex-1 mt-4 sm:mt-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
              <input
                type="number"
                name="openingBalance"
                placeholder="0"
                value={formData.openingBalance}
                onChange={handleChange}
                disabled={loading}
                autoComplete="off"
                className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="off"
                className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div className="flex-1 mt-4 sm:mt-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="off"
                className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !!emailError}
            className={`w-full text-white font-semibold p-4 rounded-xl shadow-lg transition-transform transform ${
              loading || emailError
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 hover:scale-105"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{" "}
          <span
            className="text-blue-600 font-medium hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default Register;
