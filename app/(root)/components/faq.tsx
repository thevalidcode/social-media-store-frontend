"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

// Simplified animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariant = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

export default function FaqSection() {
  const faqs = [
    {
      question: "What services do you offer?",
      answer:
        "We specialize in high-quality social media services and digital marketing solutions that help enhance your online presence. Our comprehensive range includes follower growth, engagement services, and content optimization to help you achieve your goals.",
    },
    {
      question: "How quickly will I see results?",
      answer:
        "Most of our services begin delivering results within 24-48 hours of order completion. We provide regular updates throughout the process so you can track progress and see the impact on your social media performance.",
    },
    {
      question: "Can I customize my order?",
      answer:
        "Yes, we offer flexible customization options to meet your specific needs. Whether you require targeted demographics, custom package sizes, or specific delivery schedules, our team will work with you to create the perfect solution.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and various secure digital payment methods. All transactions are processed through encrypted, secure payment gateways to ensure your financial information remains protected.",
    },
    {
      question: "Are your services safe and compliant?",
      answer:
        "Absolutely. We use only safe, platform-compliant methods that adhere to industry best practices and social media guidelines. We also provide a satisfaction guarantee and ongoing support to ensure you have peace of mind with your investment.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about our services and how we can
            help you succeed.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="bg-card rounded-xl border shadow-sm overflow-hidden"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariant}>
                <AccordionItem
                  value={`item-${index + 1}`}
                  className="border-b last:border-b-0"
                >
                  <AccordionTrigger className="text-left hover:no-underline px-6 py-5 text-base font-medium hover:bg-muted/50 transition-colors data-[state=open]:bg-muted/30">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pt-0 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground">
            Still have questions?{" "}
            <a
              href="#contact"
              className="text-primary hover:underline font-medium"
            >
              Get in touch
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
