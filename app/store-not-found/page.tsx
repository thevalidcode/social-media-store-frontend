"use client";

import { StoreNotFound } from "@/components/store-not-found";
import { useSearchParams } from "next/navigation";

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

export default function StoreNotFoundPage() {
  const searchParams = useSearchParams();
  const reason = (searchParams.get("reason") || "not-found") as
    | "not-found"
    | "missing-settings"
    | "error";
  const storeName = searchParams.get("storeName") || undefined;

  return <StoreNotFound reason={reason} storeName={storeName} />;
}
