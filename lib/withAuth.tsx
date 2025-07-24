"use client";

import { useAppContext } from "@/context/appContext";

interface WithAuthProps<P extends object> {
  WrappedComponent: React.ComponentType<P>;
  allowedRoles?: string[];
}

const withAuth = <P extends object>({ WrappedComponent }: WithAuthProps<P>) => {
  const AuthenticatedComponent = (props: P) => {
    const { userInfo, isLoading, isCsrfLoading } = useAppContext();

    // While loading, return null or a loading indicator.
    // The middleware handles redirection for unauthorized access.
    if (isLoading || isCsrfLoading || !userInfo) {
      return null; // Or a loading spinner/component
    }

    // If authenticated and authorized (middleware already handled server-side check),
    // render the wrapped component.
    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};
export default withAuth;
