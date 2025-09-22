import Wrapper from "@/components/wrapper";
import { HeroSection } from "./components/hero";
import { ServicesShowcase } from "./components/services-showcase";
import { StatsSection } from "./components/stats-section";
import { PricingSection } from "./components/pricing-section";
import { TestimonialsSection } from "./components/testimonials-section";
import { CtaSection } from "./components/cta";
import { FaqSection } from "./components/faq";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <ServicesShowcase />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}
