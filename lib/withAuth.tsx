"use client";

import Loading from "@/app/loading";
import { useAppContext } from "@/context/appContext";
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
    const { userInfo, adminInfo, isLoading } = useAppContext();
    const router = useRouter();
    const pathname = usePathname();

    const isExcluded = useMemo(
      () => excludePaths.some((path) => pathname.includes(path)),
      [excludePaths, pathname]
    );

    const currentUser = userType === "admin" ? adminInfo : userInfo;
    const redirectPath =
      userType === "admin" ? "/admin/auth/signin" : "/auth/signin";

    // useEffect must always run, regardless of conditions
    useEffect(() => {
      if (!isExcluded && !isLoading && !currentUser) {
        router.push(redirectPath);
      }
    }, [isExcluded, isLoading, currentUser, redirectPath, router]);

    if (isExcluded) {
      return <WrappedComponent {...props} />;
    }

    if (isLoading) {
      return <Loading />;
    }

    if (!currentUser) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
