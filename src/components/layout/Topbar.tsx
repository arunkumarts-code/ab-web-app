"use client";

import { Bell, MenuIcon, MessageSquare, Moon, Search, Sun, User as UserIcon, LogOut as LogOutIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";

interface TopbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function DashboardTopbar({
  sidebarOpen,
  onToggleSidebar,
}: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { user, logOut } = UserAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-surface border-b border-border px-6 py-3 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Open sidebar"}
          className="rounded-lg border border-border p-2 text-muted hover:text-foreground hover:bg-background transition"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        {/* Search */}
        <form className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Type to search..."
              className="w-80 lg:w-96 bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
            />
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-muted hover:text-foreground hover:bg-background transition">
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          <Bell className="h-5 w-5" />
        </button>

        {/* Messages */}
        <button className="rounded-lg p-2 text-muted hover:text-foreground hover:bg-background transition">
          <MessageSquare className="h-5 w-5" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-foreground">
              {user?.userNickName || user?.firstName}
            </p>
            <p className="text-xs text-muted">System Admin</p>
          </div>

          <div className="relative" ref={menuRef}>
            <div className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={()=> setOpenMenu((pre)=> !pre)} >
              <img
                src={user?.userAvatar || "/images/avatar.png"}
                alt="User avatar"
                className="h-full w-full object-cover"
              />
            </div>

            {openMenu && 
              <div className="absolute right-0 mt-2 w-44 rounded-lg border border-border bg-surface shadow-md p-1 text-sm text-foreground z-50">
                <button
                  onClick={() => { router.push("/profile"); setOpenMenu(false)}}
                  className="cursor-pointer flex w-full items-center gap-2 rounded-lg px-3 py-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <UserIcon className="h-4 w-4" />
                  Profile
                </button>
                <button
                  className="cursor-pointer flex w-full items-center gap-2 rounded-lg px-3 py-2 font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  onClick={logOut}
                >
                  <LogOutIcon className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            }
          </div>     
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="cursor-pointer h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center text-primary transition hover:scale-105 active:scale-95"
        >
          <Moon className="h-4 w-4 dark:hidden text-gray-800" />
          <Sun className="h-4 w-4 hidden dark:block text-yellow-400" />
        </button>
      </div>
    </header>
  );
}

export default DashboardTopbar;
