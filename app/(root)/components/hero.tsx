"use client";

import { motion } from "framer-motion";
import Features from "./services";

export function HeroSection() {
  return (
    <>
      <section className="relative h-[50dvh] flex  pt-30 justify-center items-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute inset-0 bg-background/70" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-5xl md:text-8xl font-bold mb-4"
          >
            Boost Your Social Presence
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
            className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          >
            Get real, high-quality followers, likes, and views for your social
            media accounts. We help you grow your audience and increase your
            engagement.
          </motion.p>
        </div>
      </section>
      <div className="">
        <Features />
      </div>
    </>
  );
}
