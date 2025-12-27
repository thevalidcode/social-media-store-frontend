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
      <Link
        href="https://validpanel.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          whileHover={{ y: -1 }}
          className="
            flex items-center gap-2
            rounded-md
            px-3 py-2
            bg-white/90 dark:bg-neutral-900/90
            backdrop-blur
            border border-neutral-200/60 dark:border-neutral-700/60
            shadow-sm
            cursor-pointer
          "
        >
          <Image
            src="/images/validpanel.jpeg"
            alt="Valid Panel"
            width={16}
            height={16}
            className="rounded-sm opacity-80"
          />

          <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
            Built with
            <span className="ml-1 font-semibold text-neutral-900 dark:text-white">
              Valid Panel
            </span>
          </span>
        </motion.div>
      </Link>
    </div>
  );
}
