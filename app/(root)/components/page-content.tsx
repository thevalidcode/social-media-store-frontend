"use client";

import { motion } from "framer-motion";
import parse from "html-react-parser";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPageByType } from "@/hooks/use-pages";
import { PageStatus, PageType } from "@/types";
import { AlertCircle } from "lucide-react";

interface PageContentProps {
  pageType: PageType;
  heading?: string;
  description?: string;
  fullWidth?: boolean;
  showStatus?: boolean;
}

const shouldUseFullWidth = (pageType: PageType, fullWidth?: boolean) => {
  if (typeof fullWidth === "boolean") return fullWidth;
  return pageType === "TERMS_OF_SERVICE" || pageType === "PRIVACY_POLICY";
};

const shouldRenderEmpty = (pageType: PageType) => {
  return pageType === "TERMS_OF_SERVICE" || pageType === "PRIVACY_POLICY";
};

export function PageContent({
  pageType,
  heading,
  description,
  fullWidth,
}: PageContentProps) {
  const { data: page, isLoading } = useGetPageByType(pageType);

  const useFullWidth = shouldUseFullWidth(pageType, fullWidth);

  const renderSkeleton = () => (
    <Card className={useFullWidth ? "shadow-sm" : "shadow-sm"}>
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
        </div>
      </CardContent>
    </Card>
  );

  const renderEmpty = () => (
    <Card className="shadow-sm">
      <CardContent className="p-8 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <AlertCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          No content available
        </h2>
        <p className="text-sm text-muted-foreground">
          Content for this page has not been published yet.
        </p>
      </CardContent>
    </Card>
  );

  const renderContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {(heading || page?.title) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-foreground">
              {heading || page?.title}
            </h1>
            {(description || page?.description) && (
              <p className="text-sm text-muted-foreground">
                {description || page?.description}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="richtext-content richtext-render prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert">
        {page?.content ? parse(page.content) : null}
      </div>
    </motion.div>
  );

  // Don't render anything if no content and not a legal page
  if (!isLoading && !page?.content && !shouldRenderEmpty(pageType)) {
    return null;
  }

  return (
    <section className="bg-background">
      <div className="container mx-auto">
        <div
          className={useFullWidth ? "max-w-6xl mx-auto" : "max-w-5xl mx-auto"}
        >
          {isLoading && renderSkeleton()}
          {!isLoading &&
            !page?.content &&
            shouldRenderEmpty(pageType) &&
            renderEmpty()}
          {!isLoading &&
            page?.content &&
            (useFullWidth ? (
              <div className="rounded-2xl border bg-card shadow-sm p-6 sm:p-8">
                {renderContent()}
              </div>
            ) : (
              <Card className="shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  {renderContent()}
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
