import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/cashPilot-logo.png";
import heroBg from "../assets/bg.jpg"


const HomePage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="font-sans text-gray-900 bg-[#F9FAFB] min-h-screen">

        {/* NAVBAR */}
        <header className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

            {/* Logo */}
            <div className="flex items-center gap-4">
                <img src={logo} alt="CashPilot" className="w-20 drop-shadow-lg" />
                <div className="font-extrabold text-2xl text-gray-900 tracking-wide"></div>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex gap-8 text-lg font-semibold text-gray-700">
                <a href="#" className="hover:text-[#1A73E8] transition-colors duration-300">Home</a>
                <a href="#features" className="hover:text-[#2EC4B6] transition-colors duration-300">Features</a>
                <a href="#pricing" className="hover:text-[#F2A30F] transition-colors duration-300">Pricing</a>
                <a href="#docs" className="hover:text-[#1A73E8] transition-colors duration-300">Docs</a>
            </nav>

            {/* Login Button */}
            <div className="hidden md:block">
                <button 
                    className="px-6 py-3 rounded-xl font-bold shadow-lg text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 hover:scale-105 transition-transform transform"
                    onClick={() => navigate("/login")}
                    >
                    Login
                </button>
          </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-gray-700 focus:outline-none"
                >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
                </button>
            </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
                <nav className="flex flex-col gap-4 px-6 py-4">
                    <a href="#" className="hover:text-[#1A73E8] transition-colors duration-300">Home</a>
                    <a href="#features" className="hover:text-[#2EC4B6] transition-colors duration-300">Features</a>
                    <a href="#pricing" className="hover:text-[#F2A30F] transition-colors duration-300">Pricing</a>
                    <a href="#docs" className="hover:text-[#1A73E8] transition-colors duration-300">Docs</a>
                    <button 
                        className="px-4 py-2 rounded-lg bg-[#2EC4B6] text-white font-semibold hover:bg-[#1A73E8] transition mt-2"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </nav>
            </div>
        )}
    </header>

    <main>
        {/* HERO */}
        <section 
            className="relative py-20 md:py-28 bg-no-repeat bg-center bg-cover"
            style={{
                backgroundImage: `url(${heroBg})`,
            }}
        >
            <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">

                {/* Left Text Section */}
                <div className="w-full lg:w-1/2 text-center lg:text-left z-10 relative">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                        Smart finance for you and your business.<br />
                    </h1>
                    <p className="mt-4 md:mt-6 text-gray-700 text-lg max-w-md mx-auto lg:mx-0">
                        Cash-Pilot makes managing your finances effortless. Track income, monitor expenses, and gain insights to grow your personal wealth or small business.
                    </p>
                    <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                        <button className="px-6 py-3 rounded-xl font-bold shadow-lg text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 hover:scale-105 transition-transform transform">
                            Get Started
                        </button>
                        <button className="px-6 py-3 border border-[#2EC4B6] text-[#2EC4B6] font-bold rounded-xl hover:bg-[#2EC4B6]/10 transition">
                            View Demo
                        </button>
                    </div>
                </div>

                {/* Right Dashboard Preview */}
                <div className="w-full lg:w-1/2 mt-10 lg:mt-0 relative z-10">
                    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">
                        <div className="h-72 md:h-80 bg-gradient-to-r from-[#D1D5DB] via-[#F9FAFB] to-[#D1D5DB] rounded-2xl flex items-center justify-center text-[#2D3748]">
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-semibold text-gray-900">Dashboard Preview</div>
                                <div className="text-sm text-gray-500 mt-2">(Real charts coming soon)</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/0"></div>
            </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-16 md:py-24 bg-[#F9FAFB]">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 md:mb-14">Powerful Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {[
                        ["Dashboard Overview", "Instant snapshot of your balances and cash flow."],
                        ["Expense Tracking", "Automatically categorize and track all spending."],
                        ["Smart Budgeting", "Create budgets and receive spending alerts."],
                        ["Reports & Charts", "Visual insights and downloadable reports."],
                        ["Account Sync", "Link multiple accounts in one place."],
                        ["Multi-Currency", "Perfect for global users & businesses."]
                    ].map(([title, desc]) => (
                        <div
                            key={title}
                            className="p-5 md:p-6 bg-white rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition transform"
                        >
                            <h3 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                                {title}
                            </h3>
                            <p className="text-gray-600 text-sm">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        
        {/* PRICING */}
        <section id="pricing" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Pricing Plans</h2>
                <p className="text-gray-600 mb-12">Choose a plan that fits your financial needs.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {[
                        { name: "Free", price: "$0", features: ["Track Expenses", "Basic Dashboard"] },
                        { name: "Pro", price: "$12/mo", features: ["Everything in Free", "Multi-account Sync", "Smart Budgeting"] },
                        { name: "Enterprise", price: "$49/mo", features: ["Everything in Pro", "Team Access", "Advanced Reports"] }
                    ].map((plan) => (
                        <div key={plan.name}
                            className="p-6 rounded-3xl shadow-2xl transform transition hover:-translate-y-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white flex flex-col">
                            <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                            <div className="text-3xl font-extrabold mb-4 text-yellow-400">{plan.price}</div>
                            <ul className="mb-6 space-y-2 flex-1">
                                {plan.features.map((f, i) => <li key={i}>{f}</li>)}
                            </ul>
                            <button className="w-40 mx-auto px-4 py-3 rounded-xl font-bold bg-white text-blue-600 hover:bg-gray-100 transition mt-auto">
                                Get Started
                            </button>
                        </div>

                    ))}
                </div>
            </div>
        </section>


        {/* DOCUMENTATION */}
        <section id="docs" className="py-16 md:py-24 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Documentation</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Explore guides, API references, FAQs, and changelogs to get the most out of CashPilot.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* API Docs */}
            {/* <div className="p-6 bg-white rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition transform">
                <h3 className="text-xl font-semibold text-[#2EC4B6] mb-3">API Docs</h3>
                <p className="text-gray-600 text-sm mb-4">
                Integrate CashPilot into your apps. Learn about authentication, endpoints, request & response formats, and rate limits.
                </p>
                <a href="/api-docs" className="text-[#1A73E8] font-semibold hover:underline">Learn More →</a>
            </div> */}

            {/* User Guide */}
            <div className="p-6 bg-white rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition transform">
                <h3 className="text-xl font-semibold text-[#F2A30F] mb-3">User Guide</h3>
                <p className="text-gray-600 text-sm mb-4">
                Step-by-step instructions for managing accounts, tracking expenses, creating budgets, and viewing reports.
                </p>
                <a href="/user-guide" className="text-[#F2A30F] font-semibold hover:underline">Learn More →</a>
            </div>

            {/* FAQs */}
            <div className="p-6 bg-white rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition transform">
                <h3 className="text-xl font-semibold text-[#1A73E8] mb-3">FAQs</h3>
                <p className="text-gray-600 text-sm mb-4">
                Answers to common questions about account setup, security, subscriptions, and troubleshooting.
                </p>
                <a href="/faqs" className="text-[#1A73E8] font-semibold hover:underline">Learn More →</a>
            </div>

            {/* Changelog */}
            <div className="p-6 bg-white rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition transform">
                <h3 className="text-xl font-semibold text-[#2EC4B6] mb-3">Changelog</h3>
                <p className="text-gray-600 text-sm mb-4">
                Stay updated with new features, bug fixes, and improvements in each version of CashPilot.
                </p>
                <a href="/changelog" className="text-[#2EC4B6] font-semibold hover:underline">Learn More →</a>
            </div>
            </div>
        </div>
        </section>


        {/* STATS */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            <div className="p-6 md:p-8 bg-[#F9FAFB] rounded-3xl shadow-md">
              <div className="text-3xl md:text-4xl font-extrabold text-[#1A73E8]">24k+</div>
              <div className="text-sm text-gray-600 mt-2">Active Users</div>
            </div>
            <div className="p-6 md:p-8 bg-[#F9FAFB] rounded-3xl shadow-md">
              <div className="text-3xl md:text-4xl font-extrabold text-[#2EC4B6]">1.2M</div>
              <div className="text-sm text-gray-600 mt-2">Transactions Processed</div>
            </div>
            <div className="p-6 md:p-8 bg-[#F9FAFB] rounded-3xl shadow-md">
              <div className="text-3xl md:text-4xl font-extrabold text-[#F2A30F]">99.99%</div>
              <div className="text-sm text-gray-600 mt-2">Uptime</div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img src={logo} className="w-16 mb-4" />
            <h3 className="font-bold text-xl">CashPilot</h3>
            <p className="text-sm text-gray-300 mt-2">Your trusted financial assistant.</p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 mt-6 sm:mt-0">
            <a href="#" className="hover:text-[#2EC4B6] transition">Features</a>
            <a href="#pricing" className="hover:text-[#2EC4B6] transition">Pricing</a>
            <a href="#docs" className="hover:text-[#2EC4B6] transition">API Docs</a>
            <a href="#" className="hover:text-[#2EC4B6] transition">Support</a>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 mt-6 md:mt-0">
            <a href="#" className="hover:text-[#2EC4B6] transition">Privacy Policy</a>
            <a href="#" className="hover:text-[#2EC4B6] transition">Terms of Service</a>
            <a href="#" className="hover:text-[#2EC4B6] transition">Security</a>
            <a href="#" className="hover:text-[#2EC4B6] transition">Contact</a>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400 py-6 border-t border-gray-700">
          © {new Date().getFullYear()} CashPilot. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
