"use client";

import { Toaster } from "sonner";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  X,
  ChevronRight,
} from "lucide-react";

export default function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      expand={true}
      richColors={false}
      closeButton={true}
      duration={4500}
      visibleToasts={4}
      offset={20}
      gap={14}
      theme="light"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: `
            group relative flex w-full max-w-xs sm:max-w-sm lg:max-w-md
            items-start gap-3 sm:gap-4 rounded-xl bg-white p-4 sm:p-5
            shadow-lg border border-slate-100
            backdrop-blur-sm transition-all duration-300 ease-out
            data-[mounted=true]:animate-in data-[mounted=true]:slide-in-from-right-12
            data-[mounted=true]:fade-in-0 data-[mounted=true]:duration-300
            data-[closed=true]:animate-out data-[closed=true]:slide-out-to-right-12
            data-[closed=true]:fade-out-0 data-[closed=true]:duration-200
            data-[swipe=end]:slide-out-to-right-full
            hover:shadow-xl hover:scale-[1.02] hover:border-slate-200
            data-[front=false]:scale-95 data-[front=false]:opacity-70
            dark:bg-slate-900 dark:border-slate-700 dark:shadow-2xl
            dark:hover:border-slate-600
          `,
          title: `
            text-sm sm:text-base font-semibold leading-snug
            text-slate-900 dark:text-slate-50
            group-data-[type=success]:text-emerald-900
            group-data-[type=error]:text-rose-900
            group-data-[type=warning]:text-amber-900
            group-data-[type=info]:text-blue-900
            group-data-[type=loading]:text-slate-900
            dark:group-data-[type=success]:text-emerald-100
            dark:group-data-[type=error]:text-rose-100
            dark:group-data-[type=warning]:text-amber-100
            dark:group-data-[type=info]:text-blue-100
          `,
          description: `
            text-xs sm:text-sm leading-relaxed
            text-slate-600 dark:text-slate-400
            mt-0.5 sm:mt-1
            group-data-[type=success]:text-emerald-700
            group-data-[type=error]:text-rose-700
            group-data-[type=warning]:text-amber-700
            group-data-[type=info]:text-blue-700
            group-data-[type=loading]:text-slate-600
            dark:group-data-[type=success]:text-emerald-200
            dark:group-data-[type=error]:text-rose-200
            dark:group-data-[type=warning]:text-amber-200
            dark:group-data-[type=info]:text-blue-200
          `,
          actionButton: `
            group/action inline-flex items-center justify-center gap-1.5
            shrink-0 rounded-lg
            bg-primary/90 hover:bg-primary text-primary-foreground
            px-3 sm:px-4 py-2 sm:py-2.5
            text-xs sm:text-sm font-semibold
            transition-all duration-200 ease-out
            hover:shadow-md hover:shadow-primary/20
            active:scale-95 focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-primary/50
            dark:bg-primary/70 dark:hover:bg-primary/80
          `,
          cancelButton: `
            group/cancel inline-flex items-center justify-center gap-1.5
            shrink-0 rounded-lg border border-slate-200
            bg-white hover:bg-slate-50 text-slate-700
            px-3 sm:px-4 py-2 sm:py-2.5
            text-xs sm:text-sm font-medium
            transition-all duration-200 ease-out
            hover:border-slate-300 hover:shadow-sm
            active:scale-95 focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-slate-500/50
            dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700
            dark:text-slate-200 dark:hover:border-slate-600
          `,
          closeButton: `
            absolute right-2 top-2 sm:right-3 sm:top-3
            inline-flex items-center justify-center
            rounded-lg p-1.5 sm:p-2
            text-slate-400 hover:text-slate-600 hover:bg-slate-100
            transition-all duration-200 ease-out
            hover:shadow-sm active:scale-90
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/50
            dark:hover:text-slate-300 dark:hover:bg-slate-800
            opacity-0 group-hover:opacity-100
          `,
          success: `
            group/success
            bg-gradient-to-br from-emerald-50 to-emerald-50/50
            border-l-4 border-l-emerald-500
            dark:from-emerald-950 dark:to-emerald-900/30
            dark:border-l-emerald-400
          `,
          error: `
            group/error
            bg-gradient-to-br from-rose-50 to-rose-50/50
            border-l-4 border-l-rose-500
            dark:from-rose-950 dark:to-rose-900/30
            dark:border-l-rose-400
          `,
          warning: `
            group/warning
            bg-gradient-to-br from-amber-50 to-amber-50/50
            border-l-4 border-l-amber-500
            dark:from-amber-950 dark:to-amber-900/30
            dark:border-l-amber-400
          `,
          info: `
            group/info
            bg-gradient-to-br from-blue-50 to-blue-50/50
            border-l-4 border-l-blue-500
            dark:from-blue-950 dark:to-blue-900/30
            dark:border-l-blue-400
          `,
          default: `
            group/default
            bg-gradient-to-br from-slate-50 to-slate-50/50
            border-l-4 border-l-slate-300
            dark:from-slate-800 dark:to-slate-800/50
            dark:border-l-slate-600
          `,
          loading: `
            group/loading
            bg-gradient-to-br from-slate-50 to-slate-50/50
            border-l-4 border-l-primary
            dark:from-slate-800 dark:to-slate-800/50
            dark:border-l-primary
          `,
        },
      }}
      icons={{
        success: (
          <div className="relative flex items-center justify-center flex-shrink-0">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-pulse" />
            <div className="relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
              <CheckCircle2
                className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400"
                strokeWidth={2.5}
              />
            </div>
          </div>
        ),
        error: (
          <div className="relative flex items-center justify-center flex-shrink-0">
            <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-pulse" />
            <div className="relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/40">
              <XCircle
                className="h-4 w-4 sm:h-5 sm:w-5 text-rose-600 dark:text-rose-400"
                strokeWidth={2.5}
              />
            </div>
          </div>
        ),
        warning: (
          <div className="relative flex items-center justify-center flex-shrink-0">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-pulse" />
            <div className="relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
              <AlertCircle
                className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400"
                strokeWidth={2.5}
              />
            </div>
          </div>
        ),
        info: (
          <div className="relative flex items-center justify-center flex-shrink-0">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse" />
            <div className="relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
              <Info
                className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400"
                strokeWidth={2.5}
              />
            </div>
          </div>
        ),
        loading: (
          <div className="relative flex items-center justify-center flex-shrink-0">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
            <div className="relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
              <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary dark:border-primary/40 dark:border-t-primary" />
            </div>
          </div>
        ),
      }}
    />
  );
}
