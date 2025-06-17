"use client";

import { TypographyH1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { InteractiveGrid } from "./interactive-grid";
import { ShineBorder } from "./shine-border";

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-32 pb-16 overflow-hidden bg-background">
      <InteractiveGrid
        containerClassName="absolute inset-0"
        className="opacity-30"
        points={40}
      />
      <ShineBorder
        className="relative z-10 max-w-6xl mx-auto px-6"
        borderClassName="border border-border rounded-xl overflow-hidden"
      >
        <div className="text-center mb-16">
          <TypographyH1>
            Protect Your Privacy, Share What
            <br />
            Matters
          </TypographyH1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Easily crop out sensitive information on your screen during work
            calls. Keep your focus on what you want to share while maintaining
            full control over your privacy.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              className="gap-2 border-border bg-background/5 hover:bg-background/10"
            >
              <Play className="w-4 h-4" />
              Demo
            </Button>
            <Button
              variant="secondary"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Download
            </Button>
          </div>
        </div>

        <ShineBorder
          className="relative mx-auto"
          borderClassName="border border-border rounded-xl overflow-hidden"
        >
          <div>
            <h1>Hero</h1>
          </div>
        </ShineBorder>
      </ShineBorder>
    </section>
  );
}
