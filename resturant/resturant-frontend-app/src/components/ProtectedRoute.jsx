"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const roleRoutes = {
  owner: ["/dashboard/admin"],
  staff: ["/dashboard/staff"],
  customer: ["/dashboard/customer"],
};

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate dashboard based on role
        switch (user.role) {
          case "owner":
            router.push("/dashboard/admin");
            break;
          case "staff":
            router.push("/dashboard/staff");
            break;
          case "customer":
            router.push("/dashboard/customer");
            break;
          default:
            router.push("/login");
        }
      }
    }
  }, [user, loading, router, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user && (!requiredRole || user.role === requiredRole)) {
    return children;
  }

  return null;
}
