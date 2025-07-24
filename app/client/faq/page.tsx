"use client";

import Loading from "@/app/loading";
import { TypographyH3, TypographyP } from "@/components/typography";
import { useGetFaqs } from "@/hooks/use-faqs";
import { AccordionDemo as FaqAccordion } from "@/components/faq-accordion";

export default function FaqPage() {
  const { data: faqs, isLoading, error } = useGetFaqs();

  if (error) {
    return <div>{error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!faqs || faqs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <TypographyH3>No FAQs found</TypographyH3>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <TypographyH3>Frequently Asked Questions</TypographyH3>
        <TypographyP className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about our products, services, and platform. If you can't find what you're looking for, feel free to reach out to our support team.
        </TypographyP>
      </div>

      <FaqAccordion data={faqs} />
    </div>
  );
}
