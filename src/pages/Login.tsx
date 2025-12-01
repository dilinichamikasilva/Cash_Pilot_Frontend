import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import api from "../service/api";
import logo from "../assets/cashPilot-logo.png";
import GoogleLogin from "../components/GoogleLogin"
import toast from "react-hot-toast";



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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await api.post("/auth/login", { email, password });
      const { user, accessToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      setUser(user);

      toast.success("Logged in successfully! 🎉");
      navigate("/dashboard");

    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed!";
      setError(message)
      toast.error(message);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 animate-fadeIn">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="App Logo"
            className="w-32 drop-shadow-xl"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Login to continue managing your finances
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-100 text-red-600 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`w-full text-white font-semibold p-3 rounded-xl shadow-lg transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-teal-500 hover:scale-105"
              }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        
        <div className="flex justify-center">
          <GoogleLogin />
        </div>

        {/* Register Link */}
        <p className="text-gray-500 text-center mt-6">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 font-medium hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

