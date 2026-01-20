"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Users,
  ShoppingCart,
  Shield,
  Network,
  BookOpen,
  MessageCircle,
  HelpCircle,
  BarChart,
  CreditCard,
  Settings,
  Play,
  Sparkles,
} from "lucide-react";
import { useUpdateOnboardingCompleted } from "@/hooks/use-admin";
import { useRouter, usePathname } from "next/navigation";

const tourSteps = [
  {
    title: "Welcome to Your Dashboard",
    description:
      "This is your admin dashboard where you can manage your entire social media store. Let's take a quick tour to get you familiar with all the features.",
    target: "dashboard",
    icon: Sparkles,
    action: "Start Tour",
  },
  {
    title: "User Management",
    description:
      "Manage your store's users, view their profiles, handle permissions, and monitor user activity. This is where you can see all registered customers and their account details.",
    target: "users",
    icon: Users,
    url: "/admin/users",
    action: "View Users",
  },
  {
    title: "Order Management",
    description:
      "Track all orders, view order details, manage order statuses, and handle customer transactions. Monitor your revenue and order fulfillment here.",
    target: "orders",
    icon: ShoppingCart,
    url: "/admin/orders",
    action: "View Orders",
  },
  {
    title: "Service Configuration",
    description:
      "Add, edit, and manage the social media services you offer to customers. Configure pricing, categories, and service availability from this section.",
    target: "services",
    icon: Shield,
    url: "/admin/services",
    action: "Configure Services",
  },
  {
    title: "Provider Management",
    description:
      "Configure external service providers and manage integrations. Set up API connections and monitor provider performance and reliability.",
    target: "providers",
    icon: Network,
    url: "/admin/providers",
    action: "Manage Providers",
  },
  {
    title: "Content Management",
    description:
      "Create and manage blog posts, support articles, and frequently asked questions. Keep your customers informed with helpful content.",
    target: "blogs",
    icon: BookOpen,
    url: "/admin/blogs",
    action: "Create Content",
  },
  {
    title: "Support System",
    description:
      "Handle customer support tickets, respond to inquiries, and manage support conversations. Provide excellent customer service from this centralized location.",
    target: "support",
    icon: MessageCircle,
    url: "/admin/support",
    action: "Handle Support",
  },
  {
    title: "FAQ Management",
    description:
      "Create and organize frequently asked questions to help customers find answers quickly. Reduce support tickets by providing comprehensive self-service resources.",
    target: "faqs",
    icon: HelpCircle,
    url: "/admin/faqs",
    action: "Manage FAQs",
  },
  {
    title: "Analytics & Reports",
    description:
      "View detailed analytics and reports about your store's performance. Track revenue, user growth, popular services, and other key metrics.",
    target: "analytics",
    icon: BarChart,
    url: "/admin/analytics",
    action: "View Analytics",
  },
  {
    title: "Payment Methods",
    description:
      "Configure payment gateways, manage payment methods, and handle financial settings. Ensure smooth and secure payment processing for your customers.",
    target: "payment-methods",
    icon: CreditCard,
    url: "/admin/payment-methods",
    action: "Setup Payments",
  },
  {
    title: "Store Settings",
    description:
      "Customize your store's appearance, configure general settings, and manage store preferences. This is where you can personalize your brand and functionality.",
    target: "settings",
    icon: Settings,
    url: "/admin/settings",
    action: "Customize Store",
  },
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingTour({ isOpen, onClose }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  const updateOnboarding = useUpdateOnboardingCompleted();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined" || !isOpen) return;

    const savedStep = localStorage.getItem("onboarding_current_step");
    const savedCompleted = localStorage.getItem("onboarding_completed_steps");

    if (savedStep) {
      const parsedStep = Number(savedStep);
      if (
        !Number.isNaN(parsedStep) &&
        parsedStep >= 0 &&
        parsedStep < tourSteps.length
      ) {
        setCurrentStep(parsedStep);
      }
    }

    if (savedCompleted) {
      try {
        const parsed = JSON.parse(savedCompleted);
        if (Array.isArray(parsed)) {
          setCompletedSteps(new Set(parsed));
        }
      } catch {
        // ignore corrupted storage
      }
    }

    setHasLoadedFromStorage(true);
  }, [isOpen]);

  // Save progress to localStorage
  useEffect(() => {
    if (typeof window === "undefined" || !hasLoadedFromStorage) return;

    localStorage.setItem("onboarding_current_step", String(currentStep));

    localStorage.setItem(
      "onboarding_completed_steps",
      JSON.stringify(Array.from(completedSteps)),
    );
  }, [currentStep, completedSteps, hasLoadedFromStorage]);

  const handleNext = () => {
    // Mark current step as completed
    setCompletedSteps((prev) => new Set([...prev, currentStep]));

    if (currentStep < tourSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      // Navigate to the next step's URL if it exists
      const nextStepData = tourSteps[nextStep];
      if (nextStepData.url) {
        router.push(nextStepData.url);
      }
    } else {
      // Complete onboarding
      updateOnboarding.mutate(undefined, {
        onSuccess: () => {
          // Clear localStorage
          localStorage.removeItem("onboarding_current_step");
          localStorage.removeItem("onboarding_completed_steps");
          onClose();
        },
      });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);

      // Navigate to the previous step's URL if it exists
      const prevStepData = tourSteps[prevStep];
      if (prevStepData.url) {
        router.push(prevStepData.url);
      }
    }
  };

  const handleAction = () => {
    if (currentStepData) {
      onClose();
      // Mark as completed when user takes action
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
    }
  };

  const handleSkip = () => {
    updateOnboarding.mutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem("onboarding_current_step");
        localStorage.removeItem("onboarding_completed_steps");
        onClose();
      },
    });
  };

  const currentStepData = tourSteps[currentStep];
  const Icon = currentStepData.icon;
  const isCompleted = completedSteps.has(currentStep);

  if (!isOpen || !currentStepData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: -30 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 200,
            duration: 0.4,
          }}
          className="bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-3xl w-full mx-4 border border-border/50"
        >
          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center space-x-4">
                <motion.div
                  className={`p-3 rounded-xl ${
                    isCompleted
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 shadow-emerald-100 dark:shadow-emerald-900/20"
                      : "bg-primary/10 text-primary shadow-primary/10"
                  } shadow-lg`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-4 w-4 md:h-7 md:w-7" />
                </motion.div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-foreground mb-1">
                    {currentStepData.title}
                  </h1>
                  <p className="text-sm font-medium text-muted-foreground">
                    Step {currentStep + 1} of {tourSteps.length}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full p-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Description */}
            <div className="mb-10">
              <p className="text-foreground text-sm md:text-lg leading-relaxed font-medium">
                {currentStepData.description}
              </p>
            </div>

            {/* Progress Section */}
            <div className="mb-10">
              <div className="flex justify-between items-center text-sm font-medium text-foreground/70 mb-3">
                <span>Your Progress</span>
                <span className="text-primary font-semibold">
                  {Math.round(((currentStep + 1) / tourSteps.length) * 100)}%
                  Complete
                </span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full shadow-sm"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentStep + 1) / tourSteps.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex flex-wrap gap-3 mb-10 justify-center">
              {tourSteps.map((step, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setCurrentStep(index);
                    if (step.url) router.push(step.url);
                  }}
                  className={`relative h-4 w-4 rounded-full transition-all duration-200 ${
                    index < currentStep
                      ? "bg-emerald-500 shadow-emerald-200 dark:shadow-emerald-900/50"
                      : index === currentStep
                        ? "bg-primary shadow-primary/30"
                        : "bg-muted hover:bg-muted/80"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {index < currentStep && (
                    <CheckCircle className="h-4 w-4 text-white absolute -top-0.5 -left-0.5" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="min-w-[110px] border-border/50 hover:bg-muted/50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/30"
                >
                  Skip Tour
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                {currentStepData.url && currentStep > 0 && (
                  <Button
                    variant="secondary"
                    onClick={handleAction}
                    className="min-w-[140px] bg-secondary/80 hover:bg-secondary shadow-sm"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {currentStepData.action}
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="min-w-[130px] bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  {currentStep === tourSteps.length - 1 ? (
                    <>
                      Complete Setup
                      <CheckCircle className="h-5 w-5 ml-2" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
