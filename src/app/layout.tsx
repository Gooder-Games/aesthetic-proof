import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Aesthetic Proof | Generative Review Images via API",
    template: "%s | Aesthetic Proof"
  },
  description: "Turn boring text reviews into stunning, high-converting social proof graphics with an edge-first generative API.",
  keywords: ["social proof", "review generator", "testimonial API", "generative UI", "SaaS marketing", "image generation"],
  authors: [{ name: "Aesthetic Proof Team" }],
  creator: "Aesthetic Proof",
  publisher: "Aesthetic Proof",
  metadataBase: new URL("https://aesthetic-proof.gooder.games"),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Aesthetic Proof | Generative Review Images API",
    description: "Generate stunning review images for your SaaS with a simple API call.",
    url: "https://aesthetic-proof.gooder.games",
    siteName: "Aesthetic Proof",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aesthetic Proof Preview Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aesthetic Proof | Stunning Review Image API",
    description: "Turn boring text reviews into stunning graphics with a single API call.",
    creator: "@AestheticProof",
    images: ["/og-image.png"],
  },
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
