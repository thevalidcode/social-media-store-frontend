"use client";

import Link from "next/link";
import {
  ArrowRight,
  Heart,
  MessageCircle,
  Share2,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20 pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[0.95]"
            >
              Get Massive
              <br />
              <span className="text-primary">Engagement</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg text-muted-foreground max-w-md font-medium leading-relaxed"
            >
              Real followers. Real likes. Real growth.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link href="/auth/signup" className="flex-1">
                <Button
                  size="lg"
                  className="w-full h-16 px-8 text-lg font-black rounded-2xl shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all hover:scale-105 active:scale-95"
                >
                  Start Now
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/client/services" className="flex-1">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-16 px-8 text-lg font-bold rounded-2xl group"
                >
                  <span className="flex items-center justify-center gap-2">
                    Browse
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col gap-2"
            >
              {[
                "100% Real Engagement",
                "Instant Delivery",
                "Refill Guarantee",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm font-bold text-muted-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex lg:items-center lg:justify-center relative"
          >
            {/* Engagement Visualization */}
            <div className="relative w-full aspect-square">
              {/* Large Phone-like Frame */}
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-secondary to-primary p-1 shadow-2xl">
                <div className="h-full rounded-[2.8rem] bg-card overflow-hidden flex flex-col">
                  {/* Header */}
                  <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
                    <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                      Live Engagement
                    </span>
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {/* Post Simulation */}
                    <div className="space-y-4">
                      <div className="h-3 w-3/4 bg-muted rounded-full" />
                      <div className="h-40 bg-muted rounded-xl" />
                    </div>

                    {/* Engagement Metrics - Animated */}
                    <div className="space-y-4">
                      {[
                        {
                          icon: Heart,
                          label: "Likes",
                          value: 12400,
                          color: "text-red-500",
                        },
                        {
                          icon: MessageCircle,
                          label: "Comments",
                          value: 3200,
                          color: "text-blue-500",
                        },
                        {
                          icon: Share2,
                          label: "Shares",
                          value: 8900,
                          color: "text-green-500",
                        },
                      ].map((metric, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                          className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 hover:bg-muted/60 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg bg-muted/40 ${metric.color}`}
                            >
                              <metric.icon className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-sm">
                              {metric.label}
                            </span>
                          </div>
                          <motion.span
                            className="text-2xl font-black text-primary"
                            key={metric.value}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 100 }}
                          >
                            {metric.value.toLocaleString()}
                          </motion.span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Live Counter */}
                    <div className="mt-8 p-4 rounded-2xl bg-primary/10 border border-primary/20">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                        Engagement Surge
                      </p>
                      <div className="flex items-baseline gap-1">
                        <motion.span
                          className="text-3xl font-black text-primary"
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          +245%
                        </motion.span>
                        <span className="text-xs font-bold text-muted-foreground">
                          in 24h
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-border bg-muted/20 text-center">
                    <p className="text-xs font-bold text-green-500 animate-pulse">
                      ✓ Delivering engagement in real-time...
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Badges */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-8 -right-8 rounded-2xl bg-background p-4 shadow-xl border border-border"
              >
                <div className="text-center">
                  <p className="text-2xl font-black text-secondary">🚀</p>
                  <p className="text-xs font-bold mt-1">Viral Ready</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-8 -left-8 rounded-2xl bg-background p-4 shadow-xl border border-border"
              >
                <div className="text-center">
                  <p className="text-2xl font-black text-primary">⚡</p>
                  <p className="text-xs font-bold mt-1">Instant</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
