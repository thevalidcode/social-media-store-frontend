import { HeroSection } from "./components/hero";
import { ServicesShowcase } from "./components/services-showcase";
import { TestimonialsSection } from "./components/testimonials-section";
import { FaqSection } from "./components/faq";
import { HomeOnboarding } from "./components/home-onboarding";

export default function Home() {
  return (
    <main className="bg-background">
      <HomeOnboarding />
      <HeroSection />
      <div className="space-y-10 pt-10 sm:space-y-12 sm:pt-12">
        <ServicesShowcase />
        <TestimonialsSection />
        <FaqSection />
      </div>
    </main>
  );
}
