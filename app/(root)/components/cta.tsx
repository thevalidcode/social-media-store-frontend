"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CtaSection() {
  return (
    <section
      className="relative py-24"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-background/70" />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Ready to Grow Your Social Presence?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
          viewport={{ once: true }}
          className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto"
        >
          Get started today and see the results for yourself. We offer a
          satisfaction guarantee.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <Button size="lg" variant="secondary">
            Get Started Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
