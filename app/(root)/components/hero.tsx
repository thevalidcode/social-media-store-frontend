"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex justify-center items-center overflow-hidden min-h-[80dvh] pt-20">
      <div className="absolute inset-0 z-0">
      </div>
      <div className="relative z-20 text-center container px-4 sm:px-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
        >
          Premier SMM Panel
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut", type: "spring", stiffness: 100 }}
          className="text-muted-foreground text-lg sm:text-xl mb-6"
        >
          Elevate your growth. We lead, they follow.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut", type: "spring", stiffness: 100 }}
          className="text-muted-foreground text-sm sm:text-base mb-8 max-w-xl mx-auto"
        >
          Boost your online impact with top-tier, affordable SMM services. Join us
          to lead your industry.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut", type: "spring", stiffness: 100 }}
          className="flex justify-center"
        >
          <Link href="/auth/signin" className="group">
            <Button size="lg" className="px-6 py-3 cursor-pointer">
              Sign Up Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
