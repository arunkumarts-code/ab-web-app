"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { UserAuth } from "@/contexts/AuthContext";
import GlobalLoader from "./GlobalLoader";

export default function ProtectedRoute({
   children,
}: {
   children: React.ReactNode;
}) {
   const { user, fbToken, loading } = UserAuth();
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   useEffect(() => {
      if (!loading && !user && !fbToken) {
         if (sessionStorage.getItem('redirectLogout')) {
            sessionStorage.removeItem('redirectLogout');
         }
         else {
            const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
            sessionStorage.setItem('redirectAfterLogin', fullPath);
         }
         router.replace("/signin");
      }
   }, [user, loading, router, fbToken]);

   if (loading) {
      return <GlobalLoader />;
   }

   if (!user || !fbToken) {
      return null;
   }

   return <>{children}</>;
}