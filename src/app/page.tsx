import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, Image as ImageIcon, Zap, Code2, Layout, Palette } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl px-6 py-24 md:py-32 flex flex-col items-center text-center">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 -z-10 h-[1000px] w-full pointer-events-none">
          <div className="absolute top-0 right-1/4 h-[500px] w-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-1/4 h-[400px] w-[400px] bg-indigo-500/10 blur-[100px] rounded-full" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary mb-8 animate-fade-in shadow-sm shadow-primary/10">
          <Sparkles size={14} />
          <span>Universal Design Engine is Here</span>
        </div>

        <h1 className="max-w-5xl text-5xl font-extrabold tracking-tight md:text-8xl mb-8 leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          Universal Reviews. <br />
          <span className="text-primary">Stunning</span> Design.
        </h1>
        
        <p className="max-w-2xl text-lg text-muted-foreground md:text-2xl mb-12 font-medium">
          The first API that understands your brand. Automatically generate high-conversion testimonial images that blend perfectly into <span className="text-foreground">any theme</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-24 relative z-10">
          <Link
            href="/signup"
            className="group flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-5 text-xl font-bold text-white transition-all hover:bg-primary/90 hover:scale-105 shadow-2xl shadow-primary/30"
          >
            Start Generating Free
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/docs"
            className="flex items-center justify-center gap-2 rounded-full border border-border bg-background/50 backdrop-blur-md px-8 py-5 text-xl font-bold transition-all hover:bg-secondary/80"
          >
            Documentation
          </Link>
        </div>

        {/* Interactive Showcase */}
        <div className="w-full mb-32 animate-fade-in-up">
           <ThemeSwitcher />
        </div>
      </section>

      {/* Universal Design Section */}
      <section className="w-full py-24 px-6 border-y border-border bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">One API. Infinite Faces.</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether your website is a dark mode dashboard, a minimal blog, or a colorful landing page, Aesthetic Proof adapts instantly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Midnight", desc: "Sleek indigo glass for dark mode lovers.", icon: Zap, img: "/presets/midnight.png" },
              { title: "Frost", desc: "Ultra-clean whites for a professional finish.", icon: Sparkles, img: "/presets/frost.png" },
              { title: "Sunset", desc: "Vibrant accents for high-energy brands.", icon: Palette, img: "/presets/sunset.png" },
              { title: "Minimal", desc: "Brutalist design for sharp, modern sites.", icon: Layout, img: "/presets/minimal.png" },
            ].map((feature) => (
              <div key={feature.title} className="group flex flex-col p-2 rounded-3xl bg-card border border-border shadow-xl hover:border-primary/50 transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-video w-full overflow-hidden rounded-2xl mb-6 shadow-inner bg-secondary/30">
                   <img src={feature.img} alt={feature.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="px-6 pb-6 pt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <feature.icon size={20} className="text-primary" />
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="w-full py-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-primary font-bold mb-6 text-lg">
               <Code2 size={24} />
               <span>Developer First</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Implement in <span className="text-indigo-500">60 seconds</span>.</h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Native support for transparent backgrounds and compact cropping means you can generate reviews that look like native code, not clunky images.
            </p>
            
            <ul className="space-y-6">
              {[
                "Automatic Transparent PNGs",
                "Compact Modes for Sidebar Embeds",
                "Full CSS-like Style Customization",
                "Secure Service-Role Integration"
              ].map((item) => (
                <li key={item} className="flex items-center gap-4 text-lg font-semibold">
                   <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <CheckCircle2 size={20} />
                   </div>
                   {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-[3rem] opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative rounded-[2rem] border border-border bg-zinc-950 p-8 shadow-2xl overflow-hidden font-mono text-sm">
               <div className="flex gap-2 mb-6">
                  <div className="h-3 w-3 rounded-full bg-red-500/50" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                  <div className="h-3 w-3 rounded-full bg-green-500/50" />
               </div>
               <pre className="text-zinc-400 leading-6">
                  <span className="text-indigo-400">curl</span> -X POST https://api.aesthetic.proof/generate \<br />
                  &nbsp;&nbsp;-H <span className="text-emerald-400">"Authorization: Bearer ap_key"</span> \<br />
                  &nbsp;&nbsp;-d <span className="text-zinc-500">{"{"}</span> <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-400">"preset":</span> <span className="text-emerald-400">"frost"</span>, <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-400">"theme":</span> <span className="text-emerald-400">"transparent"</span>, <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-400">"compact":</span> <span className="text-indigo-400">true</span> <br />
                  &nbsp;&nbsp;<span className="text-zinc-500">{"}"}</span>
               </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full py-32 px-6 text-center border-t border-border overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[400px] w-[600px] bg-primary/10 blur-[130px] rounded-full" />
        
        <h2 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1]">Ready to Beautify <br />Your Proof?</h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          Join high-performance teams using Aesthetic Proof to automate their visual social proof at scale.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-12 py-6 text-2xl font-bold text-white transition-all hover:bg-primary/90 hover:scale-105 shadow-2xl shadow-primary/30"
        >
          Get Started Now
          <ArrowRight size={28} />
        </Link>
      </section>
    </div>
  );
}

