import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aesthetic Proof | Micro-API for Beautiful Review Images",
  description: "Generate stunning review images for your SaaS with a simple API call.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className={`${inter.className} min-h-screen bg-background text-foreground flex flex-col pt-24`}>
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <footer className="py-12 px-6 border-t border-border mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="font-bold tracking-tight">Aesthetic Proof</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Aesthetic Proof. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
