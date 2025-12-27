"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Music,
  TrendingUp,
  Users,
  Zap,
  Star,
  ArrowRight,
  Play,
} from "lucide-react";
import { TypographyH1, TypographyP } from "@/components/typography";

export function HeroSection() {
  const socialIcons = [
    { icon: Instagram, color: "text-pink-500", delay: 0.1 },
    { icon: Youtube, color: "text-red-500", delay: 0.2 },
    { icon: Twitter, color: "text-blue-400", delay: 0.3 },
    { icon: Facebook, color: "text-blue-600", delay: 0.4 },
    { icon: Music, color: "text-black dark:text-white", delay: 0.5 },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Social Icons */}
        {socialIcons.map((social, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{
              opacity: [0, 0.1, 0.2, 0.1, 0],
              scale: [0, 1, 1.2, 1, 0],
              rotate: [0, 180, 360],
              x: [0, 100, -50, 0],
              y: [0, -100, 50, 0],
            }}
            transition={{
              duration: 8,
              delay: social.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute top-1/4 left-1/4 w-12 h-12 sm:w-16 sm:h-16 ${social.color} opacity-20`}
          >
            <social.icon className="w-full h-full" />
          </motion.div>
        ))}

        {/* Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-20 w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Hero Content */}
      <div className="relative min-h-screen grid place-items-center z-10 pt-24 lg:pt-24 pb-12 sm:pb-16 lg:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 sm:mb-8"
            >
              <Star className="w-4 h-4 fill-current" />
              #1 Social Media Marketing Platform
              <TrendingUp className="w-4 h-4" />
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 sm:mb-8"
            >
              <TypographyH1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
                Dominate Social Media
                <br />
                <span className="text-primary">Like Never Before</span>
              </TypographyH1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8 sm:mb-12"
            >
              <TypographyP className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Get{" "}
                <span className="text-primary font-semibold">
                  real followers
                </span>
                ,
                <span className="text-primary font-semibold">
                  {" "}
                  authentic likes
                </span>
                , and
                <span className="text-primary font-semibold">
                  {" "}
                  genuine engagement{" "}
                </span>
                across all major platforms. Start growing today!
              </TypographyP>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mb-10 sm:mb-12 lg:mb-16"
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2">
                  1M+
                </div>
                <div className="text-sm sm:text-base text-muted-foreground font-medium">
                  Orders Completed
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2">
                  50K+
                </div>
                <div className="text-sm sm:text-base text-muted-foreground font-medium">
                  Happy Customers
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2">
                  99.9%
                </div>
                <div className="text-sm sm:text-base text-muted-foreground font-medium">
                  Success Rate
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16 lg:mb-20"
            >
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold group"
                >
                  Start Growing Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/client/services" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold group"
                >
                  <Play className="mr-2 w-5 h-5" />
                  View Services
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trust Indicators Section - Separate from main hero */}
      <div className="relative z-10 bg-card/30 backdrop-blur-sm border-y border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-12 font-medium">
              Trusted by leading brands worldwide
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              <div className="flex flex-col items-center gap-3 p-4 sm:p-6 rounded-lg bg-background/50 border border-border/30 hover:border-primary/20 transition-colors duration-300">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                <span className="font-semibold text-sm sm:text-base">
                  Instant Delivery
                </span>
                <p className="text-xs sm:text-sm text-muted-foreground text-center">
                  Get results within minutes, not days
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 sm:p-6 rounded-lg bg-background/50 border border-border/30 hover:border-primary/20 transition-colors duration-300">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                <span className="font-semibold text-sm sm:text-base">
                  Real Users
                </span>
                <p className="text-xs sm:text-sm text-muted-foreground text-center">
                  Genuine engagement from real people
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 sm:p-6 rounded-lg bg-background/50 border border-border/30 hover:border-primary/20 transition-colors duration-300">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 fill-current" />
                <span className="font-semibold text-sm sm:text-base">
                  24/7 Support
                </span>
                <p className="text-xs sm:text-sm text-muted-foreground text-center">
                  Round-the-clock customer assistance
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
