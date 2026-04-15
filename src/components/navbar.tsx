"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { signOut } from "@/app/auth/actions";
import { motion } from "framer-motion";
import { LayoutGrid, FileText, House, LogOut, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } finally {
        setLoading(false);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const navItems = [
    { name: "Home", href: "/", icon: House },
    { name: "Docs", href: "/docs", icon: FileText },
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="glass flex items-center justify-between rounded-full px-6 py-2 shadow-lg transition-all duration-300">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:rotate-12">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground hidden sm:block">
              Aesthetic Proof
            </span>
          </Link>

          {/* Center Nav */}
          <div className="hidden items-center gap-1 md:flex bg-secondary/20 p-1 rounded-full border border-border/50">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive 
                      ? "bg-background text-primary shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  <item.icon size={16} className={isActive ? "text-primary" : ""} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4 min-w-[140px] justify-end">
            {loading ? (
              <div className="h-10 w-32 animate-pulse rounded-full bg-secondary/50" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <div className="hidden flex-col items-end mr-2 md:flex">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Authenticated</span>
                  <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                    {user.email?.split("@")[0]}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-border/50">
                  <Link
                    href="/dashboard"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-primary shadow-sm transition-all hover:scale-105"
                    title="Dashboard"
                  >
                    <UserIcon size={18} />
                  </Link>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-destructive hover:bg-background"
                      title="Sign Out"
                    >
                      <LogOut size={18} />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-bold text-muted-foreground transition-colors hover:text-foreground px-2"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary/90 hover:scale-105 shadow-xl shadow-primary/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
