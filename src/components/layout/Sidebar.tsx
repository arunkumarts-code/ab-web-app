"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
   ChevronDown,
   ChevronUp,
   Gamepad2,
   X
} from "lucide-react";
import { SIDEBAR_MENU } from "@/constants/sidebar-menu";

interface SidebarProps {
   open: boolean;
   onClose: () => void;
}

export function DashboardSidebar({ open, onClose }: SidebarProps) {
   const pathname = usePathname();
   const [expanded, setExpanded] = useState<Set<string>>(new Set());

   useEffect(() => {
      const activeSections = new Set<string>();
      SIDEBAR_MENU.forEach(section => {
         if (
            section.submenu?.some(item =>
               pathname.startsWith(item.path)
            )
         ) {
            activeSections.add(section.text);
         }
      });
      setExpanded(activeSections);
   }, [pathname]);

   const toggleSection = (text: string) => {
      setExpanded(prev => {
         const next = new Set(prev);
         next.has(text) ? next.delete(text) : next.add(text);
         return next;
      });
   };

   return (
      <aside
         className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-surface shadow-float 
         transform transition-transform duration-200 ease-in-out flex flex-col shadow-lg 
         ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
         {/* Header */}
         <div className="flex items-center justify-between px-6 py-6 border-b border-border">
            <Link
               href="/"
               className="text-2xl font-bold flex items-center gap-3 cursor-pointer"
            >
               <Gamepad2 size={30} className="text-primary dark:text-gray-200"/>
               <span className="text-primary dark:text-gray-200">AndiamoBac</span>
            </Link>
            <button onClick={onClose} className="lg:hidden text-muted">
               <X className="h-5 w-5"/>
            </button>
         </div>

         {/* Menu */}
         <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-2 scrollbar-custom">
            {SIDEBAR_MENU.map(section => {
               const SectionIcon = section.icon;
               const isOpen = expanded.has(section.text);

               return (
                  <div key={section.text} className="space-y-1">
                     {/* Section Header */}
                     <button
                        onClick={() => toggleSection(section.text)}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl font-bold text-muted hover:bg-background hover:text-foreground transition-all group"
                     >
                        <SectionIcon className="h-5 w-5 group-hover:text-primary transition-colors" />
                        <span>{section.text}</span>
                        {isOpen ? (
                           <ChevronUp className="h-4 w-4 ml-auto" />
                        ) : (
                           <ChevronDown className="h-4 w-4 ml-auto" />
                        )}
                     </button>

                     {/* Submenu */}
                     {isOpen && (
                        <div className="pl-10 pr-4 py-1 space-y-1">
                           {section.submenu?.map(item => {
                              const isActive =
                                 pathname === item.path ||
                                 pathname.startsWith(item.path + "/");
                              const ItemIcon = item.icon;

                              return (
                                 <Link key={item.path} href={item.path}>
                                    <div
                                       className={`flex items-center gap-3 my-1 px-3 py-2 rounded-lg text-sm transition
                                       ${isActive
                                          ? "text-primary bg-primary/10 font-semibold"
                                          : "text-muted hover:text-primary hover:bg-background"
                                       }`}
                                    >
                                       <ItemIcon className="h-4 w-4" />
                                       <span>{item.text}</span>
                                    </div>
                                 </Link>
                              );
                           })}
                        </div>
                     )}
                  </div>
               );
            })}
         </nav>
      </aside>
   );
}

export default DashboardSidebar;
