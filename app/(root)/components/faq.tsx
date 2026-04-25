"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Shield, Clock, Users, Zap } from "lucide-react";
import { TypographyH2, TypographyP } from "@/components/typography";

const faqs = [
  {
    category: "General",
    icon: HelpCircle,
    questions: [
      {
        question: "What is a Social Media Marketing (SMM) panel?",
        answer:
          "An SMM panel is a platform that provides social media marketing services like followers, likes, comments, views, and shares across various platforms including Instagram, YouTube, TikTok, Twitter, and Facebook. It's designed to help individuals and businesses grow their social media presence.",
      },
      {
        question: "Is it safe to use your services?",
        answer:
          "Yes, absolutely! All our services are completely safe and won't harm your social media accounts. We use high-quality, real users and follow platform guidelines to ensure your account remains secure.",
      },
      {
        question: "How quickly do orders start and complete?",
        answer:
          "Most orders start within minutes of placement and complete within a few hours to 24 hours, depending on the service type and quantity. You can track your order progress in real-time through your dashboard.",
      },
    ],
  },
  {
    category: "Services",
    icon: Users,
    questions: [
      {
        question: "Which social media platforms do you support?",
        answer:
          "We support all major social media platforms including Instagram, YouTube, TikTok, Twitter, Facebook, LinkedIn, and more. Each platform has various services like followers, likes, comments, views, shares, and subscribers.",
      },
      {
        question: "Are the followers and likes real?",
        answer:
          "Yes! We provide high-quality, real users with active profiles. Our followers and likes come from genuine accounts, ensuring better engagement and retention rates for your content.",
      },
      {
        question: "Can I customize my orders?",
        answer:
          "Absolutely! You can specify custom comments, target specific demographics, choose delivery speeds, and set custom requirements for most services. Our advanced options allow for personalized campaigns.",
      },
    ],
  },
  {
    category: "Payment & Billing",
    icon: Shield,
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major payment methods including credit cards, PayPal, cryptocurrency (Bitcoin, Ethereum), and bank transfers. All transactions are secure and encrypted.",
      },
      {
        question: "Are there any hidden fees?",
        answer:
          "No hidden fees! The price you see is the price you pay. We believe in transparent pricing and will never surprise you with additional charges.",
      },
    ],
  },
  {
    category: "Support",
    icon: Zap,
    questions: [
      {
        question: "How can I contact customer support?",
        answer:
          "You can reach our 24/7 customer support through live chat, email, or our support ticket system. We typically respond within minutes and are always here to help.",
      },
      {
        question: "Do you offer API access?",
        answer:
          "Yes! We provide comprehensive API access for developers and agencies. Our API allows you to integrate our services into your own applications and automate your social media marketing.",
      },
      {
        question: "Can I track my order progress?",
        answer:
          "Absolutely! You can track all your orders in real-time through your dashboard. You'll receive updates on order status, progress, and completion notifications.",
      },
    ],
  },
];

export function FaqSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <TypographyH2 className="mb-6">
            Got Questions?
            <br />
            <span className="text-primary">We've Got Answers</span>
          </TypographyH2>
          <TypographyP className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to the most common questions about our services,
            pricing, and how to get started.
          </TypographyP>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="mb-8"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <category.icon className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold">{category.category}</h3>
              </div>

              {/* FAQ Items */}
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faqIndex}
                    value={`${categoryIndex}-${faqIndex}`}
                    className="border border-border/50 rounded-lg px-6 bg-background/50"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-6">
                      <span className="font-semibold">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-background border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you 24/7. Get in touch and we'll
              answer any questions you have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/client/support"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/client/faq"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors"
              >
                View All FAQs
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
