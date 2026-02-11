import {
   LayoutGrid,
   Play,
   Wallet,
   History,
   Trophy,
   Newspaper,
   User,
   Settings,
} from "lucide-react";

export const SIDEBAR_MENU = [
   {
      text: "Main Menu",
      icon: LayoutGrid,
      path: "",
      hasSubmenu: true,
      submenu: [
         { text: "Dashboard", path: "/dashboard", icon: LayoutGrid },
         { text: "Game Area", path: "/game-area", icon: Play },
         { text: "Game Area 1", path: "/game-area1", icon: Play },
         { text: "Wallet", path: "/wallet", icon: Wallet },
         { text: "History", path: "/history", icon: History },
      ],
   },
   {
      text: "Community",
      icon: Trophy,
      path: "",
      hasSubmenu: true,
      submenu: [
         { text: "Leaderboard", path: "/leaderboard", icon: Trophy },
         { text: "News & Events", path: "/news", icon: Newspaper },
      ],
   },
   {
      text: "Settings",
      icon: User,
      path: "",
      hasSubmenu: true,
      submenu: [
         { text: "Profile", path: "/profile", icon: User },
         { text: "Preferences", path: "/preferences", icon: Settings },
      ],
   },
];
