"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Quote,
  Instagram,
  Youtube,
  Twitter,
  TrendingUp,
} from "lucide-react";
import { TypographyH2, TypographyP } from "@/components/typography";

const testimonials = [
  {
    name: "Store Customer",
    role: "Instagram buyer",
    avatar: "/api/placeholder/40/40",
    content:
      "Checkout was straightforward and I could follow order progress without opening support tickets.",
    rating: 5,
    platform: "Instagram",
    platformIcon: Instagram,
    growth: "Verified order flow",
  },
  {
    name: "Store Customer",
    role: "YouTube buyer",
    avatar: "/api/placeholder/40/40",
    content:
      "Adding funds and placing an order took only a few steps, and status updates were easy to read.",
    rating: 5,
    platform: "YouTube",
    platformIcon: Youtube,
    growth: "Simple payment path",
  },
  {
    name: "Store Customer",
    role: "Twitter buyer",
    avatar: "/api/placeholder/40/40",
    content:
      "The interface is clean and the service options are clearly explained before checkout.",
    rating: 5,
    platform: "Twitter",
    platformIcon: Twitter,
    growth: "Clear service detail",
  },
  {
    name: "Store Customer",
    role: "Instagram buyer",
    avatar: "/api/placeholder/40/40",
    content:
      "Manual gateway instructions were clear, and payment status changed exactly as expected after review.",
    rating: 5,
    platform: "Instagram",
    platformIcon: Instagram,
    growth: "Manual payment support",
  },
  {
    name: "Store Customer",
    role: "YouTube buyer",
    avatar: "/api/placeholder/40/40",
    content:
      "Order history and wallet activity gave enough context to manage repeat purchases confidently.",
    rating: 5,
    platform: "YouTube",
    platformIcon: Youtube,
    growth: "Easy repeat orders",
  },
  {
    name: "Store Customer",
    role: "Twitter buyer",
    avatar: "/api/placeholder/40/40",
    content:
      "The storefront feels like a production tool, not a template, and that made onboarding faster for our team.",
    rating: 5,
    platform: "Twitter",
    platformIcon: Twitter,
    growth: "Professional UX",
  },
];

export function TestimonialsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            Customer Stories
            <TrendingUp className="w-4 h-4" />
          </div>
          <TypographyH2 className="mb-6">
            Feedback From
            <br />
            <span className="text-primary">Real Store Usage</span>
          </TypographyH2>
          <TypographyP className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Example feedback focused on usability, payment flow clarity, and
            order visibility.
          </TypographyP>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Card className="h-full border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <Quote className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground text-center mb-6 italic">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>

                  {/* Platform & Growth */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <testimonial.platformIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {testimonial.platform}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      {testimonial.growth}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
