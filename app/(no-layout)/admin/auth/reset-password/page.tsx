"use client";

import Loading from "@/app/loading";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { useResetPassword } from "@/hooks/use-admin";
import { motion } from "framer-motion";
import { Store } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutateAsync, isPending } = useResetPassword();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleSubmit = async (
    password: string,
    token: string,
    email: string
  ) => {
    await mutateAsync({ password, token, email });
    // Redirect handled by form after success
    setTimeout(() => {
      router.push("/admin/auth");
    }, 2000);
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
            href="/admin/auth"
            className="inline-flex items-center justify-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <Store className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Admin Portal</h1>
          </Link>
          <p className="text-muted-foreground">
            Create a new password for your admin account
          </p>
        </motion.div>

        <ResetPasswordForm
          onSubmit={handleSubmit}
          isLoading={isPending}
          userType="admin"
          token={token}
          email={email}
        />
      </div>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
