import { StoreNotFound } from "@/components/store-not-found";

/**
 * This page is displayed when:
 * 1. A store cannot be found in the database
 * 2. Store settings are missing or incomplete
 * 3. A critical error occurs while loading store data
 * 
 * Usage:
 * - Redirect from middleware or API when store lookup fails
 * - Use as fallback when store ID is invalid
 * - Handle missing required store configuration
 */

interface StoreNotFoundPageProps {
  searchParams?: {
    reason?: "not-found" | "missing-settings" | "error";
    storeName?: string;
  };
}

export default function StoreNotFoundPage({
  searchParams,
}: StoreNotFoundPageProps) {
  const reason = (searchParams?.reason as "not-found" | "missing-settings" | "error") || "not-found";
  const storeName = searchParams?.storeName;

  return <StoreNotFound reason={reason} storeName={storeName} />;
}
