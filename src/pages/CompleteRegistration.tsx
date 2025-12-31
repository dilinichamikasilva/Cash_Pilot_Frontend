import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import api from "../service/api";
import toast from "react-hot-toast";
import { User } from "lucide-react"

const CompleteRegistration = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    country: "Sri Lanka",
    picture: "",
    currency: "LKR",
    openingBalance: 0,
    accountType: "PERSONAL",
  });

  const [loading, setLoading] = useState(false);

  // auto-fill google user data
  useEffect(() => {
    if (!user) return;

    setForm(prev => ({
      ...prev,
      name: user.name || "",
      email: user.email || "",
      picture: user.picture || "",
    }));
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        role: form.accountType === "BUSINESS" ? "OWNER" : "USER",
      };

      const res = await api.put("/auth/complete-registration", payload);

      setUser(res.data.user);
      toast.success("Registration completed!");

      navigate("/dashboard");

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 animate-fadeIn">

        {/* User Photo */}
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden shadow-xl border-4 border-white bg-gray-100">
            {form.picture ? (
              <img
                src={form.picture}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <User className="text-gray-400 w-20 h-20" />
            )}
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-center mb-2">Complete Your Registration</h1>
        <p className="text-gray-500 text-center mb-8">
          Just a few more details to finish setting up your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input 
              type="text" 
              name="name" 
              value={form.name} 
              disabled 
              className="w-full p-3 border rounded-xl bg-gray-100" />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              disabled 
              className="w-full p-3 border rounded-xl bg-gray-100" />
          </div>

          {/* Mobile */}
          <div>
            <label className="block font-medium mb-1">Mobile Number</label>
            <input
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              required
              autoComplete="off"
              placeholder="Enter your mobile number"
              className="w-full p-3 border rounded-xl"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block font-medium mb-1">Country</label>
            <select name="country" value={form.country} onChange={handleChange} className="w-full p-3 border rounded-xl">
              <option value="Sri Lanka">SRI LANKA</option>
              <option value="India">INDIA</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Australia">AUSTRALIA</option>
            </select>
          </div>

          {/* Currency */}
          <div>
            <label className="block font-medium mb-1">Currency</label>
            <select name="currency" value={form.currency} onChange={handleChange} className="w-full p-3 border rounded-xl">
              <option value="LKR">LKR - Sri Lankan Rupee</option>
              <option value="USD">USD - US Dollar</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="AUD">AUD - Australian Dollar</option>
            </select>
          </div>

          {/* Opening Balance */}
          <div>
            <label className="block font-medium mb-1">Opening Balance</label>
            <input
              type="number"
              name="openingBalance"
              value={form.openingBalance}
              onChange={handleChange}
              autoComplete="off"
              className="w-full p-3 border rounded-xl"
            />
          </div>

          {/* Account Type */}
          <div>
            <label className="block font-medium mb-1">Account Type</label>
            <select
              name="accountType"
              value={form.accountType}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            >
              <option value="PERSONAL">Personal</option>
              <option value="BUSINESS">Business</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Selecting <b>Business</b> will assign you the role of <b>Owner</b>.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold p-3 rounded-xl shadow-lg transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-teal-500 hover:scale-105"
            }`}
          >
            {loading ? "Saving..." : "Complete Registration"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteRegistration;
