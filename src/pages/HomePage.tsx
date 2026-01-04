import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  Menu, 
  X, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Layers, 
  PieChart,
  BookOpen, 
  Code2, 
  HelpCircle, 
  History,
} from "lucide-react";

import logo from "../assets/cashPilot-logo.png";
import heroBg from "../assets/bg.jpg";

const HomePage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#features" },
    { name: "Docs", href: "#docs" },
  ];

  const features = [
    { title: "Dashboard Overview", desc: "Instant snapshot of your balances and cash flow.", icon: <BarChart3 className="w-6 h-6" /> },
    { title: "Expense Tracking", desc: "Automatically categorize and track all spending.", icon: <Zap className="w-6 h-6" /> },
    { title: "Smart Budgeting", desc: "Create budgets and receive spending alerts.", icon: <PieChart className="w-6 h-6" /> },
    { title: "Reports & Charts", desc: "Visual insights and downloadable reports.", icon: <Layers className="w-6 h-6" /> },
    { title: "Account Sync", icon: <ShieldCheck className="w-6 h-6" />, desc: "Bank-grade security for multiple account syncing." },
    { title: "Multi-Currency", icon: <Globe className="w-6 h-6" />, desc: "Perfect for global users & businesses." }
  ];

  return (
    <div className="font-sans text-slate-900 bg-[#FDFDFD] min-h-screen selection:bg-teal-100">
      
      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="CashPilot" className="w-12 h-12 object-contain" />
            <span className="font-bold text-xl tracking-tight text-slate-800">CashPilot</span>
          </div>

          <nav className="hidden md:flex gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => navigate("/login")}
              className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate("/register")}
              className="bg-slate-900 text-white px-7 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              Get Started
            </button>
          </div>

          <button className="md:hidden text-slate-800" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {navLinks.map((link) => (
                  <a key={link.name} href={link.href} className="text-lg font-medium" onClick={() => setIsOpen(false)}>{link.name}</a>
                ))}
                <button onClick={() => navigate("/login")} className="w-full bg-slate-100 py-3 rounded-xl font-bold">Login</button>
                <button onClick={() => navigate("/register")} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Get Started</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 -z-10">
            <img src={heroBg} alt="Background" className="w-full h-full object-cover opacity-[0.07] scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FDFDFD] via-transparent to-[#FDFDFD]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-6 tracking-wide uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                Financial Control Reimagined
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Smart finance for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">everyone.</span>
              </h1>
              <p className="mt-8 text-lg text-slate-600 leading-relaxed max-w-lg">
                Managing money shouldn't be a second job. CashPilot automates your tracking and gives you crystal clear insights into your growth.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate("/register")}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center gap-2 group"
                >
                  Start Your Pilot <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-teal-100 rounded-[3rem] blur-3xl opacity-50 -z-10" />
              <div className="bg-white/80 backdrop-blur-xl border border-white p-4 rounded-[2.5rem] shadow-2xl">
                <div className="bg-slate-50 rounded-[2rem] h-[400px] flex items-center justify-center border border-slate-100 overflow-hidden relative">
                  <img src={heroBg} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm" alt="preview-bg" />
                  <div className="text-center p-10 relative z-10">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-md mx-auto mb-6 flex items-center justify-center">
                      <BarChart3 className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Visual Insights</h3>
                    <p className="text-slate-500 text-sm mt-2">Personalized Financial Dashboard</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Built for the modern economy</h2>
              <p className="text-slate-600 text-lg">Stop juggling spreadsheets. Use the tools designed for high-speed financial management.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1 }} className="group p-8 bg-white border border-slate-100 rounded-[2rem] hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-24 relative overflow-hidden bg-white">
          
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                Master your flow in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500">seconds.</span>
              </h2>
              <p className="text-slate-500 text-lg md:text-xl font-medium">
                No complex setups. No steep learning curves. Just pure financial clarity.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-16 relative">
              
              <div className="hidden lg:block absolute top-24 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent -z-10" />

              {[
                { 
                  title: "Create Account", 
                  desc: "Join the platform in seconds. Define your starting balance and primary currency.",
                  gradient: "from-fuchsia-500 to-purple-600",
                  shadow: "shadow-purple-200"
                },
                { 
                  title: "Log Daily", 
                  desc: "Track every dollar with a few taps. Categorize income and expenses on the go.",
                  gradient: "from-blue-500 to-cyan-500",
                  shadow: "shadow-blue-200"
                },
                { 
                  title: "Visualize Growth", 
                  desc: "Watch your wealth build through beautiful, interactive charts and insights.",
                  gradient: "from-teal-400 to-emerald-500",
                  shadow: "shadow-teal-200"
                }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  {...fadeInUp} 
                  transition={{ delay: i * 0.2 }}
                  className="flex flex-col items-center text-center group relative"
                >
                  
                  <div className="relative mb-10">
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                    <div className={`relative w-20 h-20 bg-gradient-to-br ${item.gradient} text-white rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-2xl ${item.shadow} transform group-hover:-translate-y-2 transition-transform duration-500`}>
                      {i + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-extrabold text-slate-800 mb-4">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            
            <motion.div 
              {...fadeInUp}
              className="mt-32 relative group"
            >
              
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-400 rounded-[4rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              
              <div className="relative bg-slate-900 rounded-[3.5rem] p-10 md:p-20 overflow-hidden">
               
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-20 translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 max-w-3xl mx-auto text-center">
                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
                    Ready to take the <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">pilot's seat?</span>
                  </h2>
                  <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-xl mx-auto">
                    Join a community of smart savers. No credit card required. No strings attached.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button 
                      onClick={() => navigate("/register")}
                      className="group relative px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl flex items-center gap-3 overflow-hidden"
                    >
                      <span className="relative z-10">Get Started for Free</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                    </button>
                    
                    <button className="px-10 py-5 text-white/70 hover:text-white font-bold transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* DOCUMENTATION SECTION */}
        <section id="docs" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div {...fadeInUp} className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">Documentation & Resources</h2>
                <p className="text-slate-600 text-lg">Everything you need to integrate, manage, and master your financial data.</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "User Guide", desc: "Master the basics of tracking and budgeting.", icon: <BookOpen className="w-6 h-6 text-orange-500" />, color: "bg-orange-50" },
                { title: "API Reference", desc: "Connect your custom apps to our secure endpoints.", icon: <Code2 className="w-6 h-6 text-blue-500" />, color: "bg-blue-50" },
                { title: "Help Center", desc: "Frequently asked questions and troubleshooting.", icon: <HelpCircle className="w-6 h-6 text-teal-500" />, color: "bg-teal-50" },
                { title: "Changelog", desc: "See what's new in the latest update.", icon: <History className="w-6 h-6 text-purple-500" />, color: "bg-purple-50" }
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ y: -5 }} className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group">
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6`}>{item.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{item.desc}</p>
                  <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Explore Docs →</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <img src={logo} className="w-12 mb-6 grayscale invert" alt="Logo" />
            <h3 className="text-2xl font-bold mb-4">CashPilot</h3>
            <p className="text-slate-400 max-w-sm">The world's most intuitive financial platform for creators and small businesses.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Security</a></li>
              <li><a href="#docs" className="hover:text-white transition">Docs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-slate-800 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} CashPilot. Designed for the future of finance.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;