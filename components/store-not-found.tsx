"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Home,
  MailQuestion,
  Zap,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

interface StoreNotFoundProps {
  reason?: "not-found" | "missing-settings" | "error";
  storeName?: string;
  showAnimation?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const floatingVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
    },
  },
};

const pulseVariants: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 3,
      repeat: Infinity,
    },
  },
};

const getErrorConfig = (reason: string) => {
  switch (reason) {
    case "missing-settings":
      return {
        icon: AlertCircle,
        title: "Store Configuration Incomplete",
        description:
          "Your store is missing some essential settings. Please complete the setup to proceed.",
        actionText: "Complete Setup",
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-50 dark:bg-amber-950/20",
        borderColor: "border-amber-200 dark:border-amber-800",
      };
    case "error":
      return {
        icon: ShieldAlert,
        title: "Something Went Wrong",
        description:
          "We encountered an error while loading your store. Our team has been notified.",
        actionText: "Try Again",
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-950/20",
        borderColor: "border-red-200 dark:border-red-800",
      };
    case "not-found":
    default:
      return {
        icon: ShieldAlert,
        title: "Store Not Found",
        description:
          "The store you're looking for doesn't exist or has been removed.",
        actionText: "Go Home",
        color: "text-slate-600 dark:text-slate-400",
        bgColor: "bg-slate-50 dark:bg-slate-950/20",
        borderColor: "border-slate-200 dark:border-slate-800",
      };
  }
};

export const StoreNotFound = ({
  reason = "not-found",
  showAnimation = true,
}: StoreNotFoundProps) => {
  const config = getErrorConfig(reason);
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-slate-50 dark:to-slate-950 px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl"
      >
        {/* Floating Background Elements */}
        {showAnimation && (
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              variants={floatingVariants}
              initial="initial"
              animate="animate"
              className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
            />
            <motion.div
              variants={floatingVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 1 }}
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
            />
          </div>
        )}

        {/* Main Card */}
        <motion.div variants={itemVariants}>
          <Card className={`border-2 ${config.borderColor} ${config.bgColor} backdrop-blur-sm shadow-lg`}>
            <div className="flex flex-col items-center justify-center space-y-6 p-8 md:p-12">
              {/* Icon Container */}
              <motion.div
                variants={itemVariants}
                className="relative w-20 h-20 md:w-24 md:h-24"
              >
                <motion.div
                  variants={pulseVariants}
                  initial="initial"
                  animate="animate"
                  className={`absolute inset-0 rounded-full opacity-20 ${config.bgColor}`}
                />
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center ${config.bgColor} border-2 ${config.borderColor} relative z-10`}
                >
                  <IconComponent
                    className={`w-10 h-10 md:w-12 md:h-12 ${config.color}`}
                  />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold text-center text-foreground"
              >
                {config.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-muted-foreground text-center max-w-xl"
              >
                {config.description}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4"
              >
                <Link href="/" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto group"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Go to Home
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <a href="https://validpanel.com" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto group"
                  >
                    <MailQuestion className="w-5 h-5 mr-2" />
                    Contact Support
                    <Zap className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                  </Button>
                </a>
              </motion.div>

              {/* Support Info */}
              <motion.div
                variants={itemVariants}
                className="w-full mt-8 pt-8 border-t border-border"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Quick Help */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      Quick Help
                    </h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Check your store URL</li>
                      <li>• Verify domain settings</li>
                      <li>• Clear browser cache</li>
                    </ul>
                  </div>

                  {/* Support Contact */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <MailQuestion className="w-4 h-4 text-primary" />
                      Need Assistance?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Reach out to our support team at{" "}
                      <a
                        href="https://validpanel.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        ValidPanel
                      </a>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          variants={itemVariants}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Error Code: STORE_NOT_FOUND • {new Date().toLocaleDateString()}
        </motion.p>
      </motion.div>
    </div>
  );
};
