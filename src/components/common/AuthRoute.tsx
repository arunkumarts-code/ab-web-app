"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/contexts/AuthContext";
import GlobalLoader from "./GlobalLoader";

export default function AuthRoute({
   children,
}: {
   children: React.ReactNode;
}) {
   const { user, loading } = UserAuth();
   const router = useRouter();

   useEffect(() => {
      if (loading) return;

      if (user) {
         const redirectUrl = sessionStorage.getItem("redirectAfterLogin") ?? "/dashboard";
         sessionStorage.removeItem("redirectAfterLogin");

         router.replace(redirectUrl);
      }
   }, [user, loading, router]);

   if (loading || user) {
      return <GlobalLoader />;
   }

   return <>{children}</>;
}