import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast"

declare global {
  interface Window {
    google: any;
  }
}

const GoogleLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleCredentialResponse = async (response: any) => {
    try {
      const id_token = response.credential;

      const res = await fetch("http://localhost:5000/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Google login error:", data);
        return;
      }

      //save tokens
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      //save user
      setUser(data.user);


      //check if first time google login
       if (data.isNewUser) {
        toast.success("Welcome! Please complete your registration.");
        navigate("/complete-registration"); 
        return;
      }


      //normal login
      toast.success("Welcome Back!");
      setTimeout(() => navigate("/dashboard"), 1000);

    } catch (err) {
        toast.error("Google login failed!");
        console.error("Google login failed:", err);
    }
  };

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-btn"),
      {
        theme: "outline",
        size: "large",
        shape: "pill",
      }
    );
  }, []);

  return <div id="google-btn"></div>;
};

export default GoogleLogin;
