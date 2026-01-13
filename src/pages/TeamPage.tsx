import { useState } from "react";
import { useAuth } from "../context/authContext";
import api from "../service/api";
import DashboardLayout from "../components/DashboardLayout";
import { UserPlus, Shield, Mail, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function TeamPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);

  // Guard: If personal account, redirect or show error
  if (user?.roles.includes("USER") && !user?.roles.includes("OWNER")) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Shield className="w-16 h-16 text-slate-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Business Feature Only</h2>
          <p className="text-slate-500 max-w-sm">Upgrade to a Business Account to invite team members and manage collaborators.</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/account/add-member", { 
        email, 
        roleToAssign: role 
      });
      toast.success(`Invitation sent to ${email}`);
      setEmail("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Team Management</h1>
          <p className="text-slate-500 font-medium">Add collaborators to your business account.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <UserPlus className="text-indigo-600" size={24} />
              Invite New Member
            </h2>

            <form onSubmit={handleInvite} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      required
                      placeholder="teammate@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Assigned Role</label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium appearance-none"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="USER">User (Can Edit)</option>
                    <option value="VIEWER">Viewer (Read Only)</option>
                  </select>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Invitation"}
              </button>
            </form>
          </div>
          
          <div className="bg-slate-50 p-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 size={14} /> Security Note
            </p>
            <p className="text-xs text-slate-500 mt-1 italic">Invited users must already have a CashPilot account to be added.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}