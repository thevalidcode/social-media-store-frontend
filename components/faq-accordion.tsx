
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Faq {
  question: string;
  answer: string;
  uid?: string;
}

interface AccordionDemoProps {
  data: Faq[];
  title?: string;
}

export function AccordionDemo({ data, title }: AccordionDemoProps) {
  if (!data || data.length === 0) return null;

  return (
    <section className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {title && (
        <h2 className="text-3xl font-bold mb-8 text-center tracking-tight">
          {title}
        </h2>
      )}
      <Accordion type="single" collapsible className="w-full border-t">
        {data.map((faq, index) => (
          <AccordionItem
            key={faq.uid || index}
            value={`item-${index + 1}`}
            className="border-b"
          >
            <AccordionTrigger className="py-6 text-left font-semibold text-lg hover:no-underline">
              <span className="flex-1 pr-4">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="pb-6 pr-8">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
