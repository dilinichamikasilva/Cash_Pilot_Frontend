import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Code2, 
  HelpCircle, 
  History, 
  ArrowLeft,
  ShieldCheck,
  Zap,
  Terminal,
  Lock
} from "lucide-react";

const DocsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState("guide");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) setActiveTab(tab);
  }, [location]);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    navigate(`/docs?tab=${id}`, { replace: true });
  };

  const menuItems = [
    { id: "guide", title: "User Guide", icon: <BookOpen className="w-5 h-5" /> },
    { id: "api", title: "API Reference", icon: <Code2 className="w-5 h-5" /> },
    { id: "help", title: "Help Center", icon: <HelpCircle className="w-5 h-5" /> },
    { id: "changelog", title: "Changelog", icon: <History className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* HEADER */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-all font-bold group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Home
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Documentation v1.0</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-12">
        {/* SIDEBAR */}
        <aside className="lg:col-span-3">
          <div className="sticky top-28 space-y-2">
            <h3 className="px-4 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Docs</h3>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === item.id 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200 scale-[1.02]" 
                  : "text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-100"
                }`}
              >
                {item.icon}
                {item.title}
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="lg:col-span-9 bg-white rounded-[3rem] p-8 md:p-16 shadow-sm border border-slate-100 min-h-[70vh]">
          <AnimatePresence mode="wait">
            {activeTab === "guide" && (
              <motion.div 
                key="guide"
                initial={{ opacity: 0, x: 10 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <h1 className="text-4xl font-black text-slate-900 mb-6">User Guide</h1>
                <p className="text-slate-500 text-lg mb-10 leading-relaxed">Everything you need to know about managing your personal wealth with CashPilot.</p>
                
                <div className="grid gap-10">
                  <section className="group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Zap className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-extrabold">Initial Onboarding</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed pl-14">
                      When you first sign up, define your <span className="text-slate-900 font-bold">Base Currency</span>. 
                      This cannot be changed later as it anchors all your conversion analytics. Enter your 
                      current liquid cash as your <span className="text-slate-900 font-bold">Opening Balance</span>.
                    </p>
                  </section>

                  <section className="group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                        <History className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-extrabold">Manual Transactions</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed pl-14">
                      CashPilot focuses on <span className="font-bold">privacy through manual entry</span>. 
                      To log an expense, click the "+" button, enter the amount, and select a category. 
                      Your net worth updates in real-time.
                    </p>
                  </section>
                </div>
              </motion.div>
            )}

            {activeTab === "api" && (
              <motion.div key="api" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-4xl font-black text-slate-900 mb-6">API Reference</h1>
                <div className="p-6 bg-slate-900 rounded-3xl mb-8 relative overflow-hidden group">
                  <Terminal className="absolute top-4 right-4 text-slate-700 w-12 h-12" />
                  <code className="text-blue-400 text-sm block mb-2">// Sample Request</code>
                  <code className="text-slate-300 text-sm block">GET https://api.cashpilot.com/v1/user/summary</code>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl mb-8">
                  <p className="text-amber-800 text-sm font-medium">
                    <span className="font-black underline">Note:</span> The public API is currently in developer preview. 
                    Tokens are available upon request for early testers.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "help" && (
              <motion.div key="help" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-4xl font-black text-slate-900 mb-6">Help Center</h1>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { q: "Is my data stored locally?", a: "No, we use encrypted cloud storage so you can access your data across all devices.", icon: <ShieldCheck className="text-teal-500" /> },
                    { q: "Can I export my data?", a: "Yes, you can download your entire transaction history as a CSV/Excel file anytime.", icon: <Zap className="text-orange-500" /> },
                    { q: "How do I delete my account?", a: "Under Profile Settings, you can permanently wipe all data from our servers.", icon: <Lock className="text-red-500" /> },
                    { q: "Support Hours?", a: "Our team typically responds to tickets within 24 hours via email support.", icon: <HelpCircle className="text-blue-500" /> }
                  ].map((faq, i) => (
                    <div key={i} className="p-6 rounded-[2rem] border border-slate-100 hover:bg-slate-50 transition-colors">
                      <div className="mb-4">{faq.icon}</div>
                      <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "changelog" && (
              <motion.div key="changelog" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-4xl font-black text-slate-900 mb-6">Changelog</h1>
                <div className="relative pl-8 border-l-2 border-slate-100 space-y-12">
                  <div className="relative">
                    <div className="absolute -left-[41px] top-0 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-sm" />
                    <span className="text-sm font-black text-blue-600 uppercase">Version 1.0.0 — Jan 2026</span>
                    <h3 className="text-xl font-bold mt-2">Initial Product Launch</h3>
                    <ul className="mt-4 space-y-2 text-slate-500 text-sm list-disc list-inside">
                      <li>Real-time Dashboard Analytics</li>
                      <li>Manual Transaction Logging</li>
                      <li>Multi-currency Baseline Support</li>
                      <li>Secure JWT Authentication</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DocsPage;