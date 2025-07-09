"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/sessionContext";

interface WithAuthProps<P extends object> {
  WrappedComponent: React.ComponentType<P>;
  allowedRoles?: string[];
}

const withAuth = <P extends object>({
  WrappedComponent,
  allowedRoles,
}: WithAuthProps<P>) => {
  const AuthenticatedComponent = (props: P) => {
    const { user, isLoading, isAuthenticated } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) return; // Wait for session to load
      if (!isAuthenticated) {
        console.log("Redirecting to /auth/signin");
        router.push("/auth/signin");
        return;
      }
      if (user && allowedRoles && !allowedRoles.includes(user.role)) {
        console.log("Redirecting to /unauthorized");
        router.push("/unauthorized");
        return;
      }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (
      isAuthenticated &&
      (!allowedRoles || (user && allowedRoles.includes(user.role)))
    ) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };

  return AuthenticatedComponent;
};
export default withAuth;
