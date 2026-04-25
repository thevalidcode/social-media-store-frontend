"use client";

import { useAppContext } from "@/context/appContext";
import { useUpdateOnboardingCompleted } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  ArrowRight,
  Settings,
  Store,
  Users,
  BarChart3,
  AlertCircle,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function HomeOnboarding() {
  const { generalSetting, isStoreGeneralSettingsLoading } = useAppContext();
  const updateOnboarding = useUpdateOnboardingCompleted();
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding if onboarding is not completed
    if (
      generalSetting &&
      !generalSetting.onboardingCompleted &&
      !isStoreGeneralSettingsLoading
    ) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [generalSetting, isStoreGeneralSettingsLoading]);

  const handleVisitAdmin = () => {
    router.push("/admin/auth/signin");
  };

  const handleDismiss = () => {
    updateOnboarding.mutate();
    setShowOnboarding(false);
  };

  if (!showOnboarding) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/75 p-4 sm:p-6">
      <Card className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-border shadow-xl">
        <CardHeader className="space-y-4 border-b border-border px-6 py-6 text-left sm:px-8 sm:py-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>

          <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
            Store created successfully
          </CardTitle>

          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Your store{" "}
            <span className="font-medium text-foreground">
              {generalSetting?.storeName}
            </span>{" "}
            is ready. Complete the setup to start managing your business.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 px-6 py-6 sm:px-8 sm:py-7">
          <div className="rounded-lg border border-border p-5">
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              You are viewing the storefront
            </h3>
            <p className="text-sm leading-6 text-muted-foreground">
              This is what your customers will see. Use the admin panel to
              manage services, orders, and settings.
            </p>
          </div>

          <div className="rounded-lg border border-amber-300/70 bg-amber-50/80 p-5 dark:border-amber-700 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  Security Required
                </h3>
                <p className="text-sm leading-6 text-amber-800 dark:text-amber-300">
                  You must reset your admin password before accessing the admin
                  panel.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-border p-5">
            <h4 className="text-sm font-semibold text-foreground">
              Recommended next steps
            </h4>

            <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-medium text-foreground">1.</span>
                Reset your admin password (security required)
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-foreground">2.</span>
                Sign in using your Valid Panel email and the new password
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-foreground">3.</span>
                Complete onboarding and configure your store
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-border p-5">
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Admin capabilities
            </h4>

            <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Manage customers and orders
              </div>
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Configure services
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Control store settings
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                View analytics and reports
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <Button
              onClick={() => router.push("/admin/auth/forgot-password")}
              size="lg"
              className="flex-1 py-2.5"
            >
              <Lock className="mr-2 h-4 w-4" />
              Reset Admin Password
            </Button>

            <Button
              onClick={handleVisitAdmin}
              variant="outline"
              size="lg"
              className="flex-1 py-2.5"
            >
              Go to Admin Panel
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              onClick={handleDismiss}
              size="lg"
              className="flex-1 py-2.5"
            >
              Skip for now
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            You can resume onboarding anytime from the admin panel
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
