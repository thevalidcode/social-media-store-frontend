"use client";

import { useAppContext } from "@/context/appContext";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MadeInValidPanelBanner() {
  const { generalSetting } = useAppContext();

  if (!generalSetting?.showBanner) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Link href="https://validpanel.com" target="_blank">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.03, y: -2 }}
          className="cursor-pointer rounded-lg px-4 py-2 flex items-center gap-2 backdrop-blur-md border border-white/15 bg-primary shadow-lg"
        >
          {/* Infinite professional shimmer */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2"
          >
            <span className="text-xs font-medium text-white">
              Made in Valid Panel
            </span>

            <Image
              src={"/images/validpanel.jpeg"}
              alt="logo"
              width={18}
              height={18}
              className="rounded-sm opacity-90"
            />
          </motion.div>

          {/* Subtle shimmering edge bar (super premium UI pattern) */}
          <motion.div
            animate={{ opacity: [0.15, 0.5, 0.15] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-[2px] bg-gradient-to-b from-white/40 to-transparent rounded"
          />
        </motion.div>
      </Link>
    </div>
  );
}
