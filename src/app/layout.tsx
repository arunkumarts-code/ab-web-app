import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeContextProvider } from "@/contexts/ThemeContext";
import { AuthContextProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "AndiamoBac App",
  description: "AndiamoBac app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scrollbar-custom">
      <body>
        <ThemeContextProvider>
          <AuthContextProvider>
            {children}
          </AuthContextProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
