"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, isLoading } = useAuth();
  const pathname = usePathname();
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  useEffect(() => {
    if (!isAuthPage) {
      checkAuth();
    }
  }, [checkAuth, isAuthPage]);

  if (isLoading && !isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
