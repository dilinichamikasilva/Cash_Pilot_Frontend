// import { useEffect, useState } from "react";
// import { useAuth } from "../context/authContext";
// import { getMonthlyAllocation, type CategoryItem } from "../service/budgetService"; 
// import DashboardLayout from "../components/DashboardLayout";
// import StatCard from "../components/StatCard";
// import ChartBox from "../components/ChartBox";
// import { motion } from "framer-motion";
// import { ArrowDownRight, Wallet } from "lucide-react";


// interface DashboardStats {
//   totalBudget: number;
//   totalSpent: number;
//   remaining: number;
//   categories: CategoryItem[]; 
// }

// export default function Dashboard() {
//   const { user } = useAuth();
  

//   const [stats, setStats] = useState<DashboardStats>({
//     totalBudget: 0,
//     totalSpent: 0,
//     remaining: 0,
//     categories: []
//   });
  
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       if (!user?.accountId) return;
//       try {
//         const now = new Date();
//         const data = await getMonthlyAllocation(
//           user.accountId, 
//           now.getMonth() + 1, 
//           now.getFullYear()
//         );

//         const spent = data.categories.reduce((sum: number, c: CategoryItem) => sum + c.spent, 0);
        
//         setStats({
//           totalBudget: data.allocation.totalAllocated,
//           totalSpent: spent,
//           remaining: data.totals.remaining,
//           categories: data.categories
//         });
//       } catch (err) {
//         console.error("Dashboard fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [user]);

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     show: { y: 0, opacity: 1 }
//   };

//   if (loading) return (
//     <DashboardLayout>
//       <div className="flex h-[80vh] items-center justify-center">
//         <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     </DashboardLayout>
//   );

//   return (
//     <DashboardLayout>
//       <motion.div 
//         variants={containerVariants}
//         initial="hidden"
//         animate="show"
//         className="max-w-7xl mx-auto px-4 py-8"
//       >
//         {/* Header Section */}
//         <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-black text-slate-900 tracking-tight">
//               Welcome back, {user?.name?.split(' ')[0]}! 👋
//             </h1>
//             <p className="text-slate-500 font-medium">Here's what's happening with your money today.</p>
//           </div>
//           <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
//              <div className="bg-indigo-50 p-2 rounded-xl">
//                 <Wallet className="w-5 h-5 text-indigo-600" />
//              </div>
//              <div className="pr-4">
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Default Account</p>
//                 <p className="text-sm font-bold text-slate-700">Main Savings</p>
//              </div>
//           </div>
//         </header>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//           <motion.div variants={itemVariants}>
//             <StatCard title="Monthly Income" value={`Rs. ${stats.totalBudget.toLocaleString()}`} gradient="from-slate-900 to-slate-800" />
//           </motion.div>
//           <motion.div variants={itemVariants}>
//             <StatCard title="Total Spent" value={`Rs. ${stats.totalSpent.toLocaleString()}`} gradient="from-rose-500 to-orange-500" />
//           </motion.div>
//           <motion.div variants={itemVariants}>
//             <StatCard title="Available" value={`Rs. ${stats.remaining.toLocaleString()}`} gradient="from-indigo-600 to-purple-600" />
//           </motion.div>
//           <motion.div variants={itemVariants}>
//             <StatCard title="Savings Rate" value={`${stats.totalBudget > 0 ? Math.round((stats.remaining / stats.totalBudget) * 100) : 0}%`} gradient="from-emerald-500 to-teal-500" />
//           </motion.div>
//         </div>

//         {/* Analytics Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
//           <motion.div variants={itemVariants} className="lg:col-span-2">
//             <ChartBox title="Spending Trends" />
//           </motion.div>
          
//           <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
//             <h2 className="text-xl font-bold text-slate-800 mb-6">Top Categories</h2>
//             <div className="space-y-6">
//               {stats.categories.length > 0 ? (
//                 stats.categories.slice(0, 4).map((cat) => (
//                   <div key={cat.id}>
//                     <div className="flex justify-between text-sm font-bold mb-2">
//                       <span className="text-slate-600">{cat.name}</span>
//                       <span className="text-slate-900">Rs. {cat.spent.toLocaleString()}</span>
//                     </div>
//                     <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
//                       <motion.div 
//                         initial={{ width: 0 }}
//                         animate={{ width: `${Math.min((cat.spent / cat.budget) * 100, 100)}%` }}
//                         className={`h-full rounded-full ${cat.spent > cat.budget ? 'bg-rose-500' : 'bg-indigo-500'}`}
//                       />
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-slate-400 text-sm italic">No categories tracked yet.</p>
//               )}
//             </div>
//           </motion.div>
//         </div>

//         {/* Recent Activity */}
//         <motion.div variants={itemVariants} className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
//           <div className="relative z-10">
//             <div className="flex items-center justify-between mb-8">
//               <h2 className="text-2xl font-bold">Recent Movements</h2>
//               <button className="text-indigo-400 text-sm font-bold hover:underline">View All</button>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {stats.categories.filter(c => c.spent > 0).slice(0, 4).map((cat) => (
//                 <div key={cat.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
//                       <ArrowDownRight className="w-5 h-5 text-rose-400" />
//                     </div>
//                     <div>
//                       <p className="font-bold">{cat.name}</p>
//                       <p className="text-xs text-slate-400">Expense Tracking</p>
//                     </div>
//                   </div>
//                   <p className="font-black text-rose-400">- Rs. {cat.spent.toLocaleString()}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </motion.div>

//       </motion.div>
//     </DashboardLayout>
//   );
// }

import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { getMonthlyAllocation, type CategoryItem } from "../service/budgetService"; 
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import ChartBox from "../components/ChartBox";
import { motion } from "framer-motion";
import { ArrowDownRight, Wallet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface DashboardStats {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  categories: CategoryItem[]; 
}

export default function Dashboard() {
  const { user } = useAuth();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0,
    categories: []
  });
  
  const [loading, setLoading] = useState(true);

  // --- Consistent Custom Toast Styling ---
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 ${
        type === 'success' ? 'border-emerald-500' : type === 'error' ? 'border-rose-500' : 'border-indigo-500'
      }`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {type === 'success' && <CheckCircle2 className="h-10 w-10 text-emerald-500" />}
              {type === 'error' && <AlertCircle className="h-10 w-10 text-rose-500" />}
              {type === 'info' && <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-slate-900">
                {type === 'success' ? 'Update' : type === 'error' ? 'System Error' : 'Notification'}
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.accountId) return;
      try {
        const now = new Date();
        const data = await getMonthlyAllocation(
          user.accountId, 
          now.getMonth() + 1, 
          now.getFullYear()
        );

        const spent = data.categories.reduce((sum: number, c: CategoryItem) => sum + c.spent, 0);
        
        setStats({
          totalBudget: data.allocation.totalAllocated,
          totalSpent: spent,
          remaining: data.totals.remaining,
          categories: data.categories
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        showToast("Failed to sync your latest financial data.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold animate-pulse text-sm uppercase tracking-widest">Loading Dashboard</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-4 py-8"
      >
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-slate-500 font-medium">Here's what's happening with your money today.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
             <div className="bg-indigo-50 p-2 rounded-xl">
                <Wallet className="w-5 h-5 text-indigo-600" />
             </div>
             <div className="pr-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Default Account</p>
                <p className="text-sm font-bold text-slate-700">Main Savings</p>
             </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <motion.div variants={itemVariants}>
            <StatCard title="Monthly Income" value={`Rs. ${stats.totalBudget.toLocaleString()}`} gradient="from-slate-900 to-slate-800" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard title="Total Spent" value={`Rs. ${stats.totalSpent.toLocaleString()}`} gradient="from-rose-500 to-orange-500" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard title="Available" value={`Rs. ${stats.remaining.toLocaleString()}`} gradient="from-indigo-600 to-purple-600" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard title="Savings Rate" value={`${stats.totalBudget > 0 ? Math.round((stats.remaining / stats.totalBudget) * 100) : 0}%`} gradient="from-emerald-500 to-teal-500" />
          </motion.div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <ChartBox title="Spending Trends" />
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Top Categories</h2>
            <div className="space-y-6">
              {stats.categories.length > 0 ? (
                stats.categories.slice(0, 4).map((cat) => (
                  <div key={cat.id}>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span className="text-slate-600">{cat.name}</span>
                      <span className="text-slate-900">Rs. {cat.spent.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((cat.spent / cat.budget) * 100, 100)}%` }}
                        className={`h-full rounded-full ${cat.spent > cat.budget ? 'bg-rose-500' : 'bg-indigo-500'}`}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                   <AlertCircle className="text-slate-200 w-10 h-10 mb-2" />
                   <p className="text-slate-400 text-sm italic">No active trackers.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Recent Movements</h2>
              <button className="text-indigo-400 text-sm font-bold hover:underline transition-all">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.categories.filter(c => c.spent > 0).slice(0, 4).map((cat) => (
                <div key={cat.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                      <ArrowDownRight className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <p className="font-bold">{cat.name}</p>
                      <p className="text-xs text-slate-400">Monthly Spending</p>
                    </div>
                  </div>
                  <p className="font-black text-rose-400">- Rs. {cat.spent.toLocaleString()}</p>
                </div>
              ))}
              {stats.categories.filter(c => c.spent > 0).length === 0 && (
                 <p className="text-slate-500 text-sm py-4">No recent expenses found for this month.</p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}