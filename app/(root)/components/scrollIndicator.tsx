"use client";
import { useScroll, motion, useSpring } from "framer-motion";
import { useRef } from "react";

export default function ScrollIndicator() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      ref={ref}
      className="fixed top-[72px] left-0 w-full h-1 bg-gray-200 z-50 origin-top-left"
      style={{ scaleX: scaleX, originX: 0 }}
    >
      <div className="w-full h-full bg-indigo-600" />
    </motion.div>
  );
}
