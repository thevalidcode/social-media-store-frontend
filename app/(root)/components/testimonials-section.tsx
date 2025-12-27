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
    name: "Sarah Johnson",
    role: "Influencer",
    avatar: "/api/placeholder/40/40",
    content:
      "This platform transformed my Instagram growth! I went from 5K to 50K followers in just 3 months. The quality is incredible and the support team is amazing.",
    rating: 5,
    platform: "Instagram",
    platformIcon: Instagram,
    growth: "+900% followers",
  },
  {
    name: "Mike Chen",
    role: "YouTuber",
    avatar: "/api/placeholder/40/40",
    content:
      "Best SMM service I've ever used. The YouTube subscribers are real and engaged. My channel growth has been phenomenal since I started using their services.",
    rating: 5,
    platform: "YouTube",
    platformIcon: Youtube,
    growth: "+2.5M views",
  },
  {
    name: "Emma Rodriguez",
    role: "Business Owner",
    avatar: "/api/placeholder/40/40",
    content:
      "As a small business owner, I needed to boost my social media presence quickly. This platform delivered exactly what I needed - real engagement and real results.",
    rating: 5,
    platform: "Twitter",
    platformIcon: Twitter,
    growth: "+300% engagement",
  },
  {
    name: "David Park",
    role: "Content Creator",
    avatar: "/api/placeholder/40/40",
    content:
      "The customer support is outstanding and the delivery is lightning fast. I've tried many SMM services, but this one is by far the most reliable and effective.",
    rating: 5,
    platform: "Instagram",
    platformIcon: Instagram,
    growth: "+150K followers",
  },
  {
    name: "Lisa Thompson",
    role: "Marketing Manager",
    avatar: "/api/placeholder/40/40",
    content:
      "We use this platform for all our client campaigns. The results speak for themselves - increased engagement, better reach, and satisfied clients every time.",
    rating: 5,
    platform: "YouTube",
    platformIcon: Youtube,
    growth: "+500% reach",
  },
  {
    name: "Alex Kumar",
    role: "Entrepreneur",
    avatar: "/api/placeholder/40/40",
    content:
      "The API integration made it so easy to automate our social media growth. The quality of followers and engagement is top-notch. Highly recommended!",
    rating: 5,
    platform: "Twitter",
    platformIcon: Twitter,
    growth: "+200% growth",
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
            What Our Customers
            <br />
            <span className="text-primary">Are Saying</span>
          </TypographyH2>
          <TypographyP className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of satisfied customers who have transformed their
            social media presence with our services.
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

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center md:gap-8 gap-4 md:px-8 px-4 py-4 rounded-2xl bg-muted/50 border border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4.9/5</div>
              <div className="text-sm text-muted-foreground">
                Average Rating
              </div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">
                Happy Customers
              </div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">
                Satisfaction Rate
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

