import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import ChartBox from "../components/ChartBox";
import TransactionItem from "../components/TransactionItem";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-10">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-10">
        <StatCard title="Account Balance" value="Rs. 125,000" gradient="from-indigo-500 to-purple-500" />
        <StatCard title="Today's Expense" value="Rs. 3,200" gradient="from-rose-500 to-pink-500" />
        <StatCard title="This Month Spending" value="Rs. 45,900" gradient="from-sky-500 to-cyan-500" />
        <StatCard title="Remaining Budget" value="Rs. 22,000" gradient="from-emerald-500 to-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <ChartBox title="Monthly Expense Trend" />
        <ChartBox title="Category Breakdown" />
      </div>

      <div className="mt-10 bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Recent Transactions</h2>
        <div className="space-y-3">
          <TransactionItem category="Food" amount="- Rs. 1,200" />
          <TransactionItem category="Transport" amount="- Rs. 600" />
          <TransactionItem category="Salary" amount="+ Rs. 45,000" />
        </div>
      </div>
    </DashboardLayout>
  );
}
