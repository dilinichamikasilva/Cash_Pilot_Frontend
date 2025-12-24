import { createContext, useContext, useState, useEffect } from "react";
import api from "../service/api";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  roles: string[];
  accountId: string;
  country?: string;
  mobile?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  logout: () => Promise<void>; // Added logout to the interface
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Logout Function
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      
      // 1. Invalidate token on server
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // 2. Clear tokens from storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // 3. Reset state
      setUser(null);

      // 4. Force a clean redirect to login (clears memory)
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      // Map decoded JWT fields to your User interface if they differ
      setUser(decoded); 
    } catch {
      localStorage.removeItem("accessToken");
      setUser(null);
      setLoading(false);
      return;
    }

    api
      .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};