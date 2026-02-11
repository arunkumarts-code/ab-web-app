import ProtectedRoute from "@/components/common/ProtectedRoute";
import { DashboardLayoutComponent } from "@/components/layout/Layout";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <DashboardLayoutComponent>
        {children}
      </DashboardLayoutComponent>
    </ProtectedRoute>
  );
}
