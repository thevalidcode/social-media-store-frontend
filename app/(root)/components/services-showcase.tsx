"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Music,
  Users,
  Heart,
  MessageCircle,
  Eye,
  Share2,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react";
import { TypographyH2, TypographyP } from "@/components/typography";

const services = [
  {
    id: "followers",
    title: "Followers & Subscribers",
    description:
      "Grow your audience with real, active followers across all major platforms",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    platforms: [
      { name: "Instagram", icon: Instagram, color: "text-pink-500" },
      { name: "YouTube", icon: Youtube, color: "text-red-500" },
      { name: "TikTok", icon: Music, color: "text-black dark:text-white" },
      { name: "Twitter", icon: Twitter, color: "text-blue-400" },
    ],
    features: ["Real Users", "Fast Delivery", "High Retention", "24/7 Support"],
    price: "From $2.99",
  },
  {
    id: "likes",
    title: "Likes & Reactions",
    description:
      "Boost engagement with authentic likes and reactions to make your content viral",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    platforms: [
      { name: "Instagram", icon: Instagram, color: "text-pink-500" },
      { name: "Facebook", icon: Facebook, color: "text-blue-600" },
      { name: "YouTube", icon: Youtube, color: "text-red-500" },
      { name: "TikTok", icon: Music, color: "text-black dark:text-white" },
    ],
    features: ["Instant Start", "High Quality", "Safe & Secure", "Money Back"],
    price: "From $0.99",
  },
  {
    id: "comments",
    title: "Comments & Reviews",
    description:
      "Generate meaningful comments and reviews to build trust and credibility",
    icon: MessageCircle,
    color: "from-green-500 to-emerald-500",
    platforms: [
      { name: "Instagram", icon: Instagram, color: "text-pink-500" },
      { name: "YouTube", icon: Youtube, color: "text-red-500" },
      { name: "Facebook", icon: Facebook, color: "text-blue-600" },
      { name: "TikTok", icon: Music, color: "text-black dark:text-white" },
    ],
    features: [
      "Custom Comments",
      "Natural Language",
      "Varied Styles",
      "Real Users",
    ],
    price: "From $1.99",
  },
  {
    id: "views",
    title: "Views & Watch Time",
    description:
      "Increase your content reach with views and watch time to boost algorithm performance",
    icon: Eye,
    color: "from-purple-500 to-violet-500",
    platforms: [
      { name: "YouTube", icon: Youtube, color: "text-red-500" },
      { name: "TikTok", icon: Music, color: "text-black dark:text-white" },
      { name: "Instagram", icon: Instagram, color: "text-pink-500" },
      { name: "Facebook", icon: Facebook, color: "text-blue-600" },
    ],
    features: [
      "High Retention",
      "Real Views",
      "Fast Delivery",
      "Algorithm Safe",
    ],
    price: "From $1.49",
  },
  {
    id: "shares",
    title: "Shares & Retweets",
    description:
      "Amplify your content reach with shares and retweets to maximize visibility",
    icon: Share2,
    color: "from-orange-500 to-amber-500",
    platforms: [
      { name: "Twitter", icon: Twitter, color: "text-blue-400" },
      { name: "Facebook", icon: Facebook, color: "text-blue-600" },
      { name: "Instagram", icon: Instagram, color: "text-pink-500" },
      { name: "TikTok", icon: Music, color: "text-black dark:text-white" },
    ],
    features: [
      "Real Shares",
      "Organic Growth",
      "Safe Methods",
      "Quick Results",
    ],
    price: "From $2.49",
  },
];

export function ServicesShowcase() {
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
            Premium Services
            <Zap className="w-4 h-4" />
          </div>
          <TypographyH2 className="mb-6">
            Complete Social Media
            <br />
            <span className="text-primary">Growth Solutions</span>
          </TypographyH2>
          <TypographyP className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From followers to engagement, we provide everything you need to
            dominate social media and grow your brand.
          </TypographyP>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Card className="h-full border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                <CardContent className="p-6">
                  {/* Service Header */}
                  <div className="text-center mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} mb-4`}
                    >
                      <service.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {service.description}
                    </p>
                    <div className="text-2xl font-bold text-primary">
                      {service.price}
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
                      Available Platforms
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {service.platforms.map((platform, platformIndex) => (
                        <div
                          key={platformIndex}
                          className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border/50"
                        >
                          <platform.icon
                            className={`w-4 h-4 ${platform.color}`}
                          />
                          <span className="text-xs font-medium">
                            {platform.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
                      Key Features
                    </h4>
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link href="/client/services" className="block">
                    <Button className="w-full group-hover:bg-primary/90 transition-colors">
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link href="/client/services">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg font-semibold group"
            >
              Explore All Services
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
