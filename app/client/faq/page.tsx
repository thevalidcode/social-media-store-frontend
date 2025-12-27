"use client";

import Loading from "@/app/loading";
import { TypographyH2, TypographyH3, TypographyP } from "@/components/typography";
import { useGetFaqs } from "@/hooks/use-faqs";
import { AccordionDemo as FaqAccordion } from "@/components/faq-accordion";
import { EmptyState } from "@/components/empty-state";
import { HelpCircle } from "lucide-react";

export default function FaqPage() {
  const { data: faqs, isLoading } = useGetFaqs();

  if (isLoading) {
    return <Loading />;
  }

  if (!faqs || faqs.length === 0) {
    return (
      <EmptyState
        icon={HelpCircle}
        title="No FAQ Found"
        description="No faq has been created for this store yet."
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <TypographyH2 className="mb-4">Frequently Asked Questions</TypographyH2>
        <TypographyP className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about our products, services, and
          platform. If you can't find what you're looking for, feel free to
          reach out to our support team.
        </TypographyP>
      </div>

      <FaqAccordion data={faqs} />
    </div>
  );
}
