import React, { useState } from "react"
import Sidebar from "./Sidebar"
import Topbar from "../components/TopBar" 
import { Menu } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100">

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white shadow-md 
                      flex items-center justify-between px-5 py-4 z-40">
        <button onClick={() => setMobileOpen(true)}>
          <Menu size={28} className="text-slate-700" />
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* MAIN AREA */}
      <div className="flex-1 relative">

        {/* TOP BAR */}
        <Topbar />

        {/* Page content */}
        <main className="px-6 md:px-10 pt-5 pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
