import AuthRoute from "@/components/common/AuthRoute";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthRoute>
      <main className="bg-background font-sans min-h-screen w-full flex items-center justify-center p-4 md:p-0 my-3">
        {children}
      </main>
    </AuthRoute>
  );
}
