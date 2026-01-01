"use client";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { useForgotPassword } from "@/hooks/use-admin";
import { motion } from "framer-motion";
import { Store } from "lucide-react";
import Link from "next/link";

export default function AdminForgotPasswordPage() {
  const { mutateAsync, isPending } = useForgotPassword();

  const handleSubmit = async (email: string) => {
    await mutateAsync({ email });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-slate-50 dark:to-slate-950 px-4 py-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 1,
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
        />
      </div>

      <div className="w-full max-w-md space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <Link
            href="/admin/auth/signin"
            className="inline-flex items-center justify-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <Store className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Admin Portal</h1>
          </Link>
          <p className="text-muted-foreground">
            Forgot your admin password? No worries!
          </p>
        </motion.div>

        <ForgotPasswordForm
          onSubmit={handleSubmit}
          isLoading={isPending}
          userType="admin"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground"
        >
          Remember your password?{" "}
          <Link
            href="/admin/auth/signin"
            className="text-primary hover:underline font-medium"
          >
            Back to Login
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
