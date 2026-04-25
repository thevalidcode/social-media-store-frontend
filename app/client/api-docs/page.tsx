"use client";

import APISection from "@/app/(root)/components/APIPage";
import Loading from "@/app/loading";
import { FeatureGate } from "@/components/FeatureGate";
import { useAppContext } from "@/context/appContext";

export default function ApiDocsClientPage() {
  const { storeInfo, isStoreGeneralSettingsLoading } = useAppContext();

  if (isStoreGeneralSettingsLoading) return <Loading />;

  const apiAccessAllowed = storeInfo?.features?.api_access ?? false;

  return (
    <FeatureGate
      isAllowed={apiAccessAllowed}
      featureLabel="API access is unavailable"
      description="This store plan does not include API access."
      variant="page"
    >
      <div>
        <APISection />
      </div>
    </FeatureGate>
  );
}
