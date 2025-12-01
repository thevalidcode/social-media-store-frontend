"use client";

import { useAppContext } from "@/context/appContext";
import Loading from "@/app/loading";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";

interface WithAuthProps<P extends object> {
  WrappedComponent: React.ComponentType<P>;
  excludePaths?: string[];
  userType: "admin" | "user";
}

const withAuth = <P extends object>({
  WrappedComponent,
  userType,
  excludePaths = [],
}: WithAuthProps<P>) => {
  const AuthenticatedComponent = (props: P) => {
    const { userInfo, adminInfo, isLoading, isAuthLoading } = useAppContext();
    const router = useRouter();
    const pathname = usePathname();

    // Determine if current path is public
    const isExcluded = useMemo(
      () => excludePaths.some((path) => pathname.includes(path)),
      [excludePaths, pathname]
    );

    const currentUser = userType === "admin" ? adminInfo : userInfo;
    const redirectPath =
      userType === "admin" ? "/admin/auth/signin" : "/auth/signin";

    // Only redirect after loading is complete
    useEffect(() => {
      if (!isExcluded && !isAuthLoading && !isLoading && !currentUser) {
        router.replace(redirectPath); // use replace to avoid back button issues
      }
    }, [
      isExcluded,
      isAuthLoading,
      currentUser,
      isLoading,
      redirectPath,
      router,
    ]);

    // Show loader while auth state is unknown
    if (isAuthLoading) return <Loading />;

    // If path is excluded, render immediately
    if (isExcluded) return <WrappedComponent {...props} />;

    // Wait until currentUser is available to render wrapped component
    if (!currentUser) return null;

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
