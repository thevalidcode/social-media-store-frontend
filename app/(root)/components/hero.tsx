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

export function HeroSection() {
  const socialIcons = [
    { icon: Instagram, color: "text-pink-500", delay: 0.1 },
    { icon: Youtube, color: "text-red-500", delay: 0.2 },
    { icon: Twitter, color: "text-blue-400", delay: 0.3 },
    { icon: Facebook, color: "text-blue-600", delay: 0.4 },
    { icon: Music, color: "text-black dark:text-white", delay: 0.5 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
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
            className={`absolute top-1/4 left-1/4 w-16 h-16 ${social.color} opacity-20`}
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
          className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl"
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
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Star className="w-4 h-4 fill-current" />
            #1 Social Media Marketing Platform
            <TrendingUp className="w-4 h-4" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight"
          >
            Dominate Social Media
            <br />
            <span className="text-primary">Like Never Before</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Get{" "}
            <span className="text-primary font-semibold">real followers</span>,
            <span className="text-primary font-semibold"> authentic likes</span>
            , and
            <span className="text-primary font-semibold">
              {" "}
              genuine engagement{" "}
            </span>
            across all major platforms. Start growing today!
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1M+</div>
              <div className="text-sm text-muted-foreground">
                Orders Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">
                Happy Customers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold group"
              >
                Start Growing Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/client/services">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold group"
              >
                <Play className="mr-2 w-5 h-5" />
                View Services
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 pt-8 border-t border-border/50"
          >
            <p className="text-sm text-muted-foreground mb-6">
              Trusted by leading brands worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                <span className="font-medium">Real Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-500 fill-current" />
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
