"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Check,
  Star,
  Zap,
  Crown,
  ArrowRight,
  Users,
  Shield,
  Clock,
} from "lucide-react";

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for individuals and small businesses",
    price: "Free",
    period: "forever",
    icon: Users,
    color: "border-blue-200 dark:border-blue-800",
    badge: null,
    features: [
      "Up to 100 orders/month",
      "Basic support",
      "Standard delivery",
      "All major platforms",
      "Basic analytics",
    ],
    limitations: ["Limited to 100 orders", "Standard support only"],
    cta: "Get Started Free",
    href: "/auth/signup",
  },
  {
    name: "Professional",
    description: "Ideal for growing businesses and influencers",
    price: "$29",
    period: "month",
    icon: Zap,
    color: "border-primary",
    badge: "Most Popular",
    features: [
      "Up to 1,000 orders/month",
      "Priority support",
      "Faster delivery",
      "All platforms + premium",
      "Advanced analytics",
      "API access",
      "Custom branding",
    ],
    limitations: [],
    cta: "Start Professional",
    href: "/auth/signup?plan=professional",
  },
  {
    name: "Enterprise",
    description: "For agencies and large-scale operations",
    price: "$99",
    period: "month",
    icon: Crown,
    color: "border-yellow-200 dark:border-yellow-800",
    badge: "Best Value",
    features: [
      "Unlimited orders",
      "24/7 dedicated support",
      "Instant delivery",
      "All platforms + exclusive",
      "Full analytics suite",
      "Full API access",
      "White-label solution",
      "Custom integrations",
      "Account manager",
    ],
    limitations: [],
    cta: "Contact Sales",
    href: "/client/support",
  },
];

const guarantees = [
  {
    icon: Shield,
    title: "100% Safe",
    description: "All services are completely safe and won't harm your account",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Most orders start within minutes and complete within hours",
  },
  {
    icon: Star,
    title: "Quality Guarantee",
    description: "High-quality, real users with excellent retention rates",
  },
];

export function PricingSection() {
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
            <Star className="w-4 h-4 fill-current" />
            Flexible Pricing
            <Zap className="w-4 h-4" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Choose Your
            <br />
            <span className="text-primary">Growth Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free and scale as you grow. No hidden fees, no long-term
            contracts. Cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <Card
                className={`h-full border-2 ${plan.color} ${plan.badge === "Most Popular" ? "ring-2 ring-primary/20 shadow-xl" : ""}`}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`p-3 rounded-2xl ${plan.badge === "Most Popular" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      <plan.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Pricing */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period !== "forever" && (
                        <span className="text-muted-foreground">
                          /{plan.period}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link href={plan.href} className="block">
                    <Button
                      className={`w-full ${plan.badge === "Most Popular" ? "bg-primary hover:bg-primary/90" : ""}`}
                      variant={
                        plan.badge === "Most Popular" ? "default" : "outline"
                      }
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {guarantees.map((guarantee, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
                <guarantee.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{guarantee.title}</h3>
              <p className="text-muted-foreground text-sm">
                {guarantee.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Need a custom plan? We've got you covered.
          </p>
          <Link href="/client/support">
            <Button variant="outline" size="lg" className="px-8 py-4">
              Contact Sales Team
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

