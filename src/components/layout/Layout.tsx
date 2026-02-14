"use client";

import { useEffect, useState } from "react";
import DashboardTopbar from "./Topbar";
import DashboardSidebar from "./Sidebar";
import { useIsDesktop } from "@/hooks/useBreakpoint";

export function DashboardLayoutComponent({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop('lg');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const handleToggleSidebar = () => {
    if (!isDesktop) {
      setSidebarOpen(prev => !prev);
    }
  };
  
  return (
    <div className="min-h-screen flex relative">
      <DashboardSidebar open={sidebarOpen} onClose={handleToggleSidebar} />

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
