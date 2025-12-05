import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import api from "../service/api";
import { User as UserIcon } from "lucide-react";

export default function Topbar() {
  const { user } = useAuth();
  const [accountName, setAccountName] = useState("Loading...");

  useEffect(() => {
    if (!user?.accountId) return;

    api
      .get(`/account/${user.accountId}`)
      .then((res) => setAccountName(res.data.account.name))
      .catch(() => setAccountName("Account"));
  }, [user]);

  return (
    <div
      className="
        w-full 
        h-16 
        bg-white/90 backdrop-blur-xl 
        shadow-md border-b border-slate-200 
        px-6 flex items-center justify-between
      "
    >
      <h2 className="text-xl font-semibold text-slate-800">{accountName}</h2>

      <div className="w-12 h-12 rounded-full bg-gray-200 border flex items-center justify-center shadow overflow-hidden">
        {user?.picture ? (
          <img src={user.picture} alt="profile" className="w-full h-full object-cover" />
        ) : (
          <UserIcon className="text-gray-500 w-8 h-8" />
        )}
      </div>
    </div>
  );
}
