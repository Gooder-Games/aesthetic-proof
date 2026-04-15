"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { login } from "@/app/auth/actions";
import { Sparkles, ArrowRight, AlertCircle } from "lucide-react";
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

export default function LoginPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
            <Sparkles className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Log in to your Aesthetic Proof account</p>
        </div>

        <div className="glass rounded-3xl p-8 border border-border shadow-2xl">
          <Suspense>
            <ErrorMessage />
          </Suspense>

          <form action={login} className="space-y-6">
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
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="password" className="text-sm font-semibold text-foreground/80">
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-2xl border border-border bg-background/50 px-4 py-3 text-foreground transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-bold text-white transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-xl shadow-primary/20"
            >
              Sign in
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-bold text-primary hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
