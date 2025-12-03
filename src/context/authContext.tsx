// import { createContext, useContext, useState, useEffect } from "react";
// import api from "../service/api";

// interface AuthContextType {
//   user: any;
//   setUser: (user: any) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: any }) => {
//   const [user, setUser] = useState<any>(null);

//   // Load user from backend using token
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (!token) return;

//     api.get("/auth/me")
//       .then((res) => setUser(res.data))
//       .catch(() => {
//         localStorage.removeItem("accessToken");
//         setUser(null);
//       });
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };


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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      setUser(decoded); // user appears immediately
    } catch {
      localStorage.removeItem("accessToken");
      setUser(null);
      setLoading(false);
      return;
    }

    api
      .get("/auth/me" , { headers: { Authorization: `Bearer ${token}` } })
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
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

