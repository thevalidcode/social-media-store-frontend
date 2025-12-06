import { HeroSection } from "./components/hero";
import { ServicesShowcase } from "./components/services-showcase";
import { StatsSection } from "./components/stats-section";
import { TestimonialsSection } from "./components/testimonials-section";
import { FaqSection } from "./components/faq";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <ServicesShowcase />
      <TestimonialsSection />
      <FaqSection />
    </div>
  );
}
