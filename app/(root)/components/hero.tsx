"use client";

import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import Wrapper from "@/components/wrapper";

function FloatingPaths({ position }: { position: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  // Simplified and more visible SVG paths
  const paths = Array.from({ length: 6 }, (_, i) => {
    const baseX = position > 0 ? i * 120 : 800 - i * 120; // Better horizontal distribution
    const baseY = 50 + i * 30; // More controlled vertical spacing
    const opacity = 0.2 + i * 0.1; // Higher base opacity for visibility
    const strokeWidth = 2 + i * 0.5; // Thicker strokes for better visibility

    return {
      id: i,
      // Simple curved path that's guaranteed to be visible
      d: `M${baseX - 100},${baseY} Q${baseX},${baseY + 40} ${
        baseX + 100
      },${baseY} Q${baseX + 200},${baseY - 40} ${baseX + 300},${baseY}`,
      strokeWidth,
      opacity,
      delay: i * 0.4,
    };
  });

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      ref={ref}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        style={{
          willChange: "transform",
        }}
      >
        {/* Accessibility title for screen readers */}
        <title>Animated Background Decoration Paths</title>

        {/* Define a more visible gradient */}
        <defs>
          <linearGradient
            id={`pathGradient-${position}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {paths.map((path) => (
          <motion.path
            key={`floating-path-${position}-${path.id}`}
            d={path.d}
            stroke={`url(#pathGradient-${position})`}
            strokeWidth={path.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={
              isInView
                ? {
                    pathLength: [0, 1, 0.8, 0],
                    opacity: [0, path.opacity, path.opacity, 0],
                  }
                : {
                    pathLength: 0,
                    opacity: 0,
                  }
            }
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: path.delay,
              repeatDelay: 1,
            }}
            style={{
              // Hardware acceleration for smooth performance
              transform: "translateZ(0)",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function HeroSection() {
  return (
    <>
      <section className="relative flex  justify-center items-center overflow-hidden min-h-[80dvh] pt-32 bg-gradient-to-br from-background via-background to-muted/20">
        {/* Animated background paths with better visibility */}
        <div className="absolute inset-0 opacity-80">
          <FloatingPaths position={1} />
        </div>
        <div className="absolute inset-0 opacity-60">
          <FloatingPaths position={-1} />
        </div>

        {/* Subtle gradient overlay for better text readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-background/90 via-background/30 to-background/70" />

        {/* Main content with improved z-index management */}
        <div className="relative z-10 text-center container px-4 sm:px-6 max-w-6xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
            }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight"
          >
            Grow Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 animate-pulse">
              Social Media
            </span>{" "}
            with Likes & Followers
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
            }}
            className="text-muted-foreground text-base sm:text-lg md:text-xl lg:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed"
          >
            Build your own marketplace for social media services. Sell Instagram
            followers, TikTok views, Twitter likes, and more. Start your shop in
            minutes with our powerful platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/auth/signin" className="group">
              <Button
                size="xl"
                className="bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70 transform transition-all duration-300 group-hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
                {/* Arrow icon for better UX */}
                <svg
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </Link>

            {/* Secondary CTA for better conversion */}
            <Link href="#features" className="group">
              <Button
                variant="outline"
                size="xl"
                className="border-primary/20 text-primary hover:bg-primary/5 transition-all duration-300 group-hover:scale-105"
              >
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services section with improved spacing */}
      <Wrapper className="max-w-[95rem]">{/* <CardsCarousel /> */}</Wrapper>

      {/* Features section with improved spacing */}
      {/* <section className="w-full">
        <FeaturesSection />
      </section> */}
    </>
  );
}
