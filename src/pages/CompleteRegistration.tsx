import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import api from "../service/api";
import toast from "react-hot-toast";

const CompleteRegistration = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    country: "Sri Lanka",
    picture: "",
  });

  const [loading, setLoading] = useState(false);

  // auto-fill google user data
  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      email: user.email || "",
      mobile: "",
      country: "Sri Lanka",
      picture: user.picture || "",
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put("/auth/complete-registration", form);

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
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 animate-fadeIn relative">

        {/* User Photo */}
        <div className="relative flex justify-center mb-5">
          <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg border-4 border-white bg-gray-100">
            {form.picture ? (
              <img src={form.picture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No Photo
              </div>
            )}
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          Complete Your Registration
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Just a few more details to finish setting up your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              disabled
              className="w-full p-3 border border-gray-300 bg-gray-100 rounded-xl cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              disabled
              className="w-full p-3 border border-gray-300 bg-gray-100 rounded-xl cursor-not-allowed"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              required
              className="w-full p-3 border border-gray-300 rounded-xl"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Country</label>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl"
            >
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Australia">Australia</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold p-3 rounded-xl shadow-lg transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-teal-500 hover:scale-105"
              }`}>
            {loading ? "Saving..." : "Complete Registration"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default CompleteRegistration;
