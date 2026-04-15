"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { signup } from "@/app/auth/actions";
import { Sparkles, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

function ErrorMessage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  if (!error) return null;
  return (
    <div className="mb-6 flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive animate-fade-in border border-destructive/20">
      <AlertCircle size={18} />
      {error}
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 shadow-sm border border-indigo-500/20">
            <Sparkles className="text-primary" size={24} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create your account</h1>
          <p className="text-muted-foreground">Start turning reviews into stunning images</p>
        </div>

        <div className="glass rounded-3xl p-8 border border-border shadow-2xl">
          <Suspense>
            <ErrorMessage />
          </Suspense>

          <form action={signup} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-foreground/80 ml-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-2xl border border-border bg-background/50 px-4 py-3 text-foreground transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-foreground/80 ml-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full rounded-2xl border border-border bg-background/50 px-4 py-3 text-foreground transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                placeholder="••••••••"
              />
              <p className="text-xs text-muted-foreground mt-1 ml-1 flex items-center gap-1">
                <ShieldCheck size={12} />
                Min 8 characters required
              </p>
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-bold text-white transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-xl shadow-primary/20"
            >
              Get Started for Free
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p className="mb-4">No credit card required to start generating.</p>
            <p>
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
