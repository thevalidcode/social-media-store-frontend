"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { Lock, Sparkles, ArrowUpRight, X } from "lucide-react";

import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type FeatureGateVariant =
  | "card"
  | "inline"
  | "tooltip"
  | "popover"
  | "overlay"
  | "dialog";

type FeatureGateProps = {
  isAllowed?: boolean;
  featureLabel: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  variant?: FeatureGateVariant;
  className?: string;
  children?: React.ReactNode;
};

const DEFAULT_CTA = "Upgrade plan";
const DEFAULT_PRICING_URL = "https://validpanel.com/pricing";

export function FeatureGate({
  isAllowed = false,
  featureLabel,
  description,
  ctaLabel = DEFAULT_CTA,
  ctaHref = DEFAULT_PRICING_URL,
  variant = "card",
  className,
  children,
}: FeatureGateProps) {
  const [showDialog, setShowDialog] = useState(false);

  if (isAllowed) return <>{children}</>;

  // Tooltip variant - Shows tooltip on hover
  if (variant === "tooltip") {
    return (
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className={cn("relative", className)}>
            <div className="pointer-events-none opacity-50 select-none">
              {children}
            </div>
            <div className="absolute inset-0 cursor-not-allowed" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs p-0 overflow-hidden border-border"
        >
          <div className="bg-card p-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Lock className="h-3.5 w-3.5" />
              </div>
              <div className="text-xs font-semibold text-foreground">
                {featureLabel} is locked
              </div>
            </div>
            {description && (
              <p className="text-xs text-muted-foreground leading-relaxed text-wrap">
                {description}
              </p>
            )}
            <Button asChild size="sm" className="w-full text-xs h-7">
              <Link href={ctaHref} target="_blank" rel="noopener noreferrer">
                {ctaLabel}
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Overlay variant - Shows disabled control with click-to-reveal overlay
  if (variant === "overlay") {
    return (
      <div className={cn("relative group", className)}>
        <div className="pointer-events-none opacity-50 select-none blur-[0.5px]">
          {children}
        </div>
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => setShowDialog(true)}
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg border border-border shadow-sm">
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Click to unlock
              </span>
            </div>
          </div>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Lock className="h-4 w-4" />
                </div>
                {featureLabel} is locked
              </DialogTitle>
              <DialogDescription className="pt-2">
                {description ||
                  `Upgrade your plan to access ${featureLabel.toLowerCase()}.`}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button
                asChild
                className="flex-1 gap-2"
                size="lg"
                variant="default"
              >
                <Link href={ctaHref} target="_blank" rel="noopener noreferrer">
                  {ctaLabel}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                onClick={() => setShowDialog(false)}
                variant="outline"
                size="lg"
                className="sm:w-auto"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Popover variant - Shows disabled control with inline popover on click
  if (variant === "popover") {
    const [showPopover, setShowPopover] = useState(false);

    return (
      <div className={cn("relative", className)}>
        <div className="pointer-events-none opacity-50 select-none">
          {children}
        </div>
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => setShowPopover(!showPopover)}
        />
        {showPopover && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
            <div className="relative bg-card border border-border rounded-lg shadow-lg p-4 space-y-3">
              <button
                title="buton"
                onClick={() => setShowPopover(false)}
                className="absolute right-2 top-2 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-start gap-3 pr-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Lock className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-foreground">
                    {featureLabel} is locked
                  </div>
                  {description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
              </div>
              <Button asChild size="sm" className="w-full">
                <Link href={ctaHref} target="_blank" rel="noopener noreferrer">
                  {ctaLabel}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dialog variant - Only shows a button that opens dialog
  if (variant === "dialog") {
    return (
      <>
        <Button
          onClick={() => setShowDialog(true)}
          variant="outline"
          className={cn("gap-2", className)}
        >
          <Lock className="h-4 w-4" />
          {featureLabel}
        </Button>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Lock className="h-4 w-4" />
                </div>
                {featureLabel} is locked
              </DialogTitle>
              <DialogDescription className="pt-2">
                {description ||
                  `Upgrade your plan to access ${featureLabel.toLowerCase()}.`}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button
                asChild
                className="flex-1 gap-2"
                size="lg"
                variant="default"
              >
                <Link href={ctaHref} target="_blank" rel="noopener noreferrer">
                  {ctaLabel}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                onClick={() => setShowDialog(false)}
                variant="outline"
                size="lg"
                className="sm:w-auto"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Inline variant - Compact inline notification
  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-start gap-3 rounded-md border border-border bg-muted/30 px-3 py-2.5",
          "shadow-xs",
          className
        )}
      >
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Lock className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="font-semibold text-sm text-foreground">
            {featureLabel} is locked
          </div>
          {description ? (
            <p className="text-muted-foreground text-xs leading-relaxed">
              {description}
            </p>
          ) : null}
          <Button asChild variant="default" size="sm" className="mt-2">
            <Link href={ctaHref} target="_blank" rel="noopener noreferrer">
              {ctaLabel} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Card variant (default) - Full card display
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-4 sm:p-5",
        "shadow-sm transition-transform duration-200 ease-out hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 pointer-events-none" />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              {featureLabel} is locked
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Premium
              </span>
            </div>
            {description ? (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        <Button asChild size="lg" className="shrink-0 gap-2" variant="default">
          <Link href={ctaHref} target="_blank" rel="noopener noreferrer">
            {ctaLabel}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
