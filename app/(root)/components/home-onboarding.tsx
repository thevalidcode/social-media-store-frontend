"use client";

import { useAppContext } from "@/context/appContext";
import { useUpdateOnboardingCompleted } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  ArrowRight,
  Settings,
  Store,
  Users,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function HomeOnboarding() {
  const { adminInfo, generalSetting, isStoreGeneralSettingsLoading } =
    useAppContext();
  const updateOnboarding = useUpdateOnboardingCompleted();
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding if user is admin and onboarding is not completed
    if (
      adminInfo &&
      generalSetting &&
      !generalSetting.onboardingCompleted &&
      !isStoreGeneralSettingsLoading
    ) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [adminInfo, generalSetting, isStoreGeneralSettingsLoading]);

  const handleVisitAdmin = () => {
    router.push("/admin/auth/signin");
  };

  const handleDismiss = () => {
    updateOnboarding.mutate();
    setShowOnboarding(false);
  };

  if (!showOnboarding) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl border shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>

          <CardTitle className="text-xl font-semibold">
            Store created successfully
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Your store{" "}
            <span className="font-medium text-foreground">
              {generalSetting?.storeName}
            </span>{" "}
            is ready. Complete the setup to start managing your business.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-md border bg-card p-4">
            <h3 className="mb-1 text-sm font-medium text-foreground">
              You are viewing the storefront
            </h3>
            <p className="text-sm text-muted-foreground">
              This is what your customers will see. Use the admin panel to
              manage services, orders, and settings.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">
              Recommended next steps
            </h4>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-medium text-foreground">1.</span>
                Access the admin panel
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-foreground">2.</span>
                Sign in using your Valid Panel credentials
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-foreground">3.</span>
                Complete onboarding and configure your store
              </li>
            </ul>
          </div>

          <div className="rounded-md border bg-secondary/40 p-4">
            <h4 className="mb-2 text-sm font-medium text-foreground">
              Admin capabilities
            </h4>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
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

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleVisitAdmin} size="lg" className="flex-1">
              Go to Admin Panel
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              onClick={handleDismiss}
              size="lg"
              className="flex-1"
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
