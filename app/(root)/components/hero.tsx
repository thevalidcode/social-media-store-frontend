"use client";

import { TypographyH1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Image from "next/image";
import { InteractiveGrid } from "./interactive-grid";
import { ShineBorder } from "./shine-border";

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-32 pb-16 overflow-hidden bg-background">
      ;
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
          <div className="relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hero%20image.jpg-mE5vAT4d864MlVhdkcrk1Vn2WcNONq.jpeg"
              alt="Background Gradient"
              width={1920}
              height={1080}
              className="w-full h-auto"
              priority
            />
            <div className="absolute inset-0 flex items-end justify-center pb-16">
              <div className="bg-background/20 backdrop-blur-sm p-4 rounded-xl w-[90%] h-[70%] flex">
                <div className="flex-1 pr-2">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Browser-HZNDOssbyLixIa4lABR27yelWXveQ0.png"
                    alt="Browser Preview"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover rounded-lg"
                    priority
                  />
                </div>
                <div className="flex-1 pl-2">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Editor%20Window-sJ4sXlXpgDhv7gLvQylqH5VTb3L0rc.png"
                    alt="Code Editor"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover rounded-lg"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </ShineBorder>
      </ShineBorder>
    </section>
  );
}
