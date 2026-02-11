"use client";

import { useState } from "react";
import DashboardTopbar from "./Topbar";
import DashboardSidebar from "./Sidebar";

export function DashboardLayoutComponent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex relative">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`flex flex-col w-full min-h-screen ${sidebarOpen ? "lg:pl-72" : "lg:pl-0"}`}>
        <DashboardTopbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 flex px-4 py-2 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
