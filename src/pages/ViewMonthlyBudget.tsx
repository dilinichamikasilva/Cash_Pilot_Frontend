import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { getMonthlyAllocation } from "../service/budgetService";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Calendar, 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  Search,
  AlertCircle,
  Loader2,
  Download 
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../service/api"; 
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ViewMonthlyBudget = () => {
  const { user, loading: authLoading } = useAuth();
  const accountId = user?.accountId;
  const [searchParams] = useSearchParams();

  const initialMonth = Number(searchParams.get("month")) || new Date().getMonth() + 1;
  const initialYear = Number(searchParams.get("year")) || new Date().getFullYear();

  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [data, setData] = useState<any>(null);
  const [currency, setCurrency] = useState("Rs."); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!accountId) {
      setLoading(false);
      return;
    }
    fetchData(month, year); 
  }, [accountId, authLoading]);

  const fetchData = async (m: number, y: number) => {
    if (!accountId) return;
    setLoading(true);
    try {
      const [res, accountRes] = await Promise.all([
        getMonthlyAllocation(accountId, m, y),
        api.get(`/account/${accountId}`)
      ]);

      if (res && res.allocation && res.totals) {
        setData(res);
      } else {
        setData(null);
      }
      
      if (accountRes.data?.account?.currency) {
        setCurrency(accountRes.data.account.currency);
      }
    } catch (err) {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleView = () => fetchData(month, year);

  // --- PDF GENERATION 
  const generatePDF = () => {
    if (!data) return;

    const doc = new jsPDF();
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month - 1));

    
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); 
    doc.text("CashPilot Financial Report", 14, 20);
    
   
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Period: ${monthName} ${year}`, 14, 28);
    doc.text(`Account ID: ${accountId}`, 14, 34);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 40);

    
    autoTable(doc, {
      startY: 50,
      head: [['Financial Summary', 'Amount']],
      body: [
        ['Total Monthly Budget', `${currency} ${data.allocation.totalAllocated.toLocaleString()}`],
        ['Total Amount Allocated', `${currency} ${data.totals.allocatedSum.toLocaleString()}`],
        ['Remaining Balance', `${currency} ${data.totals.remaining.toLocaleString()}`],
      ],
      headStyles: { fillColor: [79, 70, 229] },
      theme: 'striped'
    });

    
    const tableRows = data.categories.map((cat: any) => [
      cat.name,
      `${currency} ${cat.budget.toLocaleString()}`,
      `${currency} ${cat.spent.toLocaleString()}`,
      `${cat.budget > 0 ? ((cat.spent / cat.budget) * 100).toFixed(1) : 0}%`
    ]);

    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text("Category Breakdown", 14, (doc as any).lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Category Name', 'Budgeted', 'Actual Spent', 'Usage %']],
      body: tableRows,
      headStyles: { fillColor: [51, 65, 85] },
      didParseCell: (data) => {
       
        if (data.column.index === 3 && parseFloat(data.cell.text[0]) > 100) {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    // Save the PDF
    doc.save(`CashPilot_Report_${monthName}_${year}.pdf`);
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50/50 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
            <div className="flex items-center gap-4">
              <Link to="/budget" className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                <ChevronLeft className="w-6 h-6 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Report</h1>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                   {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2024, month - 1))} {year}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* PDF BUTTON */}
              {data && (
                <button
                  onClick={generatePDF}
                  className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                >
                  <Download className="w-4 h-4 text-indigo-600" />
                  Export PDF
                </button>
              )}

              <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer px-4"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(2024, m-1))}</option>
                  ))}
                </select>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer px-4 border-l border-slate-100"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <button
                  onClick={handleView}
                  className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-all active:scale-95"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!data ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No Record Found</h3>
                <p className="text-slate-500">We couldn't find any budget allocations for this period.</p>
              </motion.div>
            ) : (
              <motion.div variants={containerVars} initial="hidden" animate="show" className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Total Budget", val: data.allocation.totalAllocated, icon: <Wallet className="text-blue-600" />, bg: "bg-blue-50" },
                    { label: "Total Allocated", val: data.totals.allocatedSum, icon: <TrendingUp className="text-amber-600" />, bg: "bg-amber-50" },
                    { label: "Remaining", val: data.totals.remaining, icon: <ArrowUpRight className="text-emerald-600" />, bg: "bg-emerald-50", isEmph: true },
                  ].map((metric, i) => (
                    <motion.div key={i} variants={itemVars} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                      <div className={`w-12 h-12 ${metric.bg} rounded-2xl flex items-center justify-center mb-4`}>
                        {metric.icon}
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{metric.label}</p>
                      <h2 className={`text-2xl font-black mt-1 ${metric.isEmph && metric.val < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                        {currency} {metric.val.toLocaleString()}
                      </h2>
                    </motion.div>
                  ))}
                </div>

                <motion.div variants={itemVars} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-50">
                    <h3 className="text-xl font-bold text-slate-900">Category Breakdown</h3>
                  </div>
                  <div className="p-8 pt-4">
                    <div className="space-y-8">
                      {data.categories.map((cat: any) => {
                        const usagePercent = cat.budget > 0 ? Math.min((cat.spent / cat.budget) * 100, 100) : 0;
                        const isOver = cat.spent > cat.budget;

                        return (
                          <div key={cat.id} className="group">
                            <div className="flex justify-between items-end mb-3">
                              <div>
                                <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{cat.name}</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase">
                                  Spent {currency} {cat.spent.toLocaleString()} of {currency} {cat.budget.toLocaleString()}
                                </p>
                              </div>
                              <div className={`text-sm font-black ${isOver ? 'text-red-500' : 'text-slate-900'}`}>
                                {usagePercent.toFixed(0)}%
                              </div>
                            </div>
                            
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${usagePercent}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${
                                  isOver ? 'bg-red-500' : usagePercent > 80 ? 'bg-amber-500' : 'bg-indigo-500'
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-6 flex justify-center">
                      <p className="text-xs font-bold text-slate-400 flex items-center gap-2 tracking-widest uppercase">
                        <Calendar className="w-3 h-3" /> Report generated for {data.allocation.month}/{data.allocation.year}
                      </p>
                  </div>
                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewMonthlyBudget;