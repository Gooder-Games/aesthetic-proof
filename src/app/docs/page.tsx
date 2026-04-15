import Link from "next/link";
import { 
  Code2, 
  Terminal, 
  Cpu, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation | Aesthetic Proof",
  description: "Learn how to use the Aesthetic Proof API to generate stunning review images.",
};

export default function DocsPage() {
  const codeSnippet = `
curl -X POST https://aesthetic-proof.com/api/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Jane Doe",
    "handle": "janedoe",
    "avatar_url": "https://example.com/avatar.jpg",
    "text": "Aesthetic Proof is simply amazing!",
    "rating": 5,
    "theme": "dark"
  }'
  `.trim();

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-20 flex flex-col gap-24 animate-fade-in">
      {/* Intro */}
      <section className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
          <Code2 size={14} />
          <span>Developer Tools</span>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-8">API Documentation</h1>
        <p className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed">
          Integrate beautifully styled review images into your application with a single POST request.
        </p>
      </section>

      {/* Endpoint Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Terminal size={24} className="text-primary" />
              Generate Image
            </h2>
            <div className="glass rounded-2xl border border-border p-6 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">POST</span>
                <code className="text-sm font-mono font-bold">/api/v1/generate</code>
              </div>
              <span className="text-sm text-muted-foreground">Consumes 1 Credit</span>
            </div>
            
            <p className="text-muted-foreground mb-8">
              Returns a 1200x630 pixel PNG image containing a beautifully styled review card.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-6">Request Headers</h3>
            <div className="glass rounded-2xl border border-border overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="bg-secondary/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 font-bold">Header</th>
                      <th className="px-6 py-3 font-bold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="px-6 py-4 font-mono font-bold">Authorization</td>
                      <td className="px-6 py-4 text-muted-foreground">Bearer <span className="text-foreground">YOUR_API_KEY</span></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-mono font-bold">Content-Type</td>
                      <td className="px-6 py-4 text-muted-foreground">application/json</td>
                    </tr>
                  </tbody>
               </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-6">JSON Payload Parameters</h3>
            <div className="space-y-4">
              {[
                { name: "name", type: "string", desc: "Customer's full name" },
                { name: "handle", type: "string", desc: "Customer's social media handle (optional)" },
                { name: "avatar_url", type: "string", desc: "Public URL to the customer avatar" },
                { name: "text", type: "string", desc: "The review text content" },
                { name: "rating", type: "number", desc: "Rating from 1 to 5" },
                { name: "theme", type: "string", desc: "'light' | 'dark' | 'transparent'" },
                { name: "compact", type: "boolean", desc: "If true, crops the image to 840x460 (best for embedding)." },
                { name: "preset", type: "string", desc: "'midnight' | 'frost' | 'sunset' | 'minimal' (Presets apply pre-defined aesthetic styles)." },
                { name: "styles", type: "object", desc: "Advanced CSS-like customization: cardBackground, textColor, accentColor, borderRadius, elevation (0-3)." },
              ].map((param) => (
                <div key={param.name} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-border/50 bg-card/5 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-primary">{param.name}</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{param.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{param.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar / Quick Snippet */}
        <div className="space-y-8">
           <div className="glass rounded-3xl border border-border p-8 shadow-xl bg-card/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                Quick Example
              </h3>
              <div className="relative group">
                <pre className="text-[12px] font-mono p-4 rounded-xl bg-black text-zinc-300 overflow-x-auto">
                  <code>{codeSnippet}</code>
                </pre>
                <button className="absolute top-2 right-2 p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors" title="Copy code">
                  <Terminal size={14} />
                </button>
              </div>
           </div>

           <div className="glass rounded-3xl border border-border p-8 shadow-xl bg-indigo-500/5">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <ShieldAlert size={18} className="text-primary" />
                Rate Limiting
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Standard API usage is limited by your credit balance. Ensure you have positive credits in your dashboard before calling the endpoint.
              </p>
              <Link href="/dashboard" className="inline-flex items-center gap-1 mt-6 text-sm font-bold text-primary hover:underline group">
                Go to Dashboard
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
