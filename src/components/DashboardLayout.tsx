import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "../components/TopBar"; 
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true); // Desktop sidebar state (expanded/collapsed)
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile drawer state

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100">
      
      {/* SIDEBAR  */}
      <Sidebar 
        open={open} 
        setOpen={setOpen} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* TOP BAR  */}
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        {/* PAGE CONTENT */}
        <main className="flex-1 px-6 md:px-10 pt-5 pb-10">
          {children}
        </main>
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
