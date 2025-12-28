import { HeroSection } from "./components/hero";
import { ServicesShowcase } from "./components/services-showcase";
import { StatsSection } from "./components/stats-section";
import { TestimonialsSection } from "./components/testimonials-section";
import { FaqSection } from "./components/faq";
import { HomeOnboarding } from "./components/home-onboarding";

export default function Home() {
  return (
    <div>
      <HomeOnboarding />
      <HeroSection />
      <StatsSection />
      <ServicesShowcase />
      <TestimonialsSection />
      <FaqSection />
    </div>
  );
}
