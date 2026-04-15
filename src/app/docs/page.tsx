import Link from "next/link";
import { 
  Code2, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  ServerCog
} from "lucide-react";
import { Metadata } from "next";
import { CodeTabs } from "@/components/code-tabs";

export const metadata: Metadata = {
  title: "API Documentation | Aesthetic Proof",
  description: "Learn how to use the Aesthetic Proof API to generate stunning review images.",
};

export default function DocsPage() {
  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-20 flex flex-col gap-24 animate-fade-in">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Terminal size={24} className="text-primary" />
              Generate Image
            </h2>
            <div className="glass rounded-2xl border border-border p-6 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">POST</span>
                <code className="text-sm font-mono font-bold break-all">https://aesthetic-proof.gooder.games/api/v1/generate</code>
              </div>
              <span className="text-sm font-bold text-muted-foreground whitespace-nowrap hidden sm:block">Consumes 1 Credit</span>
            </div>
            
            <p className="text-muted-foreground">
              Returns a beautifully styled PNG image stream representing the review card. The default dimensions are <code className="bg-secondary px-1 text-xs rounded">1200x630</code>, or <code className="bg-secondary px-1 text-xs rounded">840x460</code> if compact mode is enabled.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-6">Request Headers</h3>
            <div className="glass rounded-2xl border border-border overflow-hidden">
               <table className="w-full text-left text-sm">
                  <thead className="bg-secondary/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 font-bold text-muted-foreground">Header</th>
                      <th className="px-6 py-3 font-bold text-muted-foreground">Required</th>
                      <th className="px-6 py-3 font-bold text-muted-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="px-6 py-4 font-mono font-bold">Authorization</td>
                      <td className="px-6 py-4 text-[10px] uppercase font-bold text-primary">Yes</td>
                      <td className="px-6 py-4 text-muted-foreground">Format: <code className="font-mono text-foreground">Bearer ap_your_secret_key</code></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-mono font-bold">Content-Type</td>
                      <td className="px-6 py-4 text-[10px] uppercase font-bold text-primary">Yes</td>
                      <td className="px-6 py-4 text-muted-foreground">Must be <code className="font-mono text-foreground">application/json</code></td>
                    </tr>
                  </tbody>
               </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-6">JSON Body Parameters</h3>
            <div className="space-y-4">
              {[
                { name: "name", type: "string", req: true, desc: "Customer's full name (e.g. 'Jane Doe')." },
                { name: "text", type: "string", req: true, desc: "The review or testimonial text." },
                { name: "handle", type: "string", req: false, desc: "Customer's social media handle (e.g. '@janedoe')." },
                { name: "avatar_url", type: "string", req: false, desc: "Direct public URL to the customer's avatar. Must be accessible to the Edge runtime." },
                { name: "rating", type: "number", req: false, desc: "Rating from 1 to 5. Will display as visual stars on the card." },
                { name: "theme", type: "string", req: false, desc: "'light' | 'dark' | 'transparent'. Defines the base contrast handling." },
                { name: "compact", type: "boolean", req: false, desc: "If true, crops the image bounding box to 840x460, ideal for responsive embedding." },
                { name: "preset", type: "string", req: false, desc: "Applies a pre-defined aesthetic override. Choose from: 'midnight', 'frost', 'sunset', or 'minimal'." },
              ].map((param) => (
                <div key={param.name} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-border/50 bg-card/5 hover:border-primary/30 transition-colors">
                  <div className="flex gap-3 min-w-[200px]">
                    <span className="font-mono font-bold text-primary">{param.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{param.type}</span>
                      {param.req && <span className="text-[10px] uppercase tracking-widest font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">Required</span>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 md:mt-0 flex-1">{param.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 glass rounded-2xl border border-border p-6 shadow-sm">
                <h4 className="font-mono font-bold text-primary mb-4 text-lg">styles Object (Optional)</h4>
                <p className="text-sm text-muted-foreground mb-6">Deep CSS-like customization. All properties are optional. If provided, overrides <code className="bg-secondary px-1 rounded">preset</code> aesthetics.</p>
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-border/50">
                    {[
                        { k: "cardBackground", v: "string", d: "Hex or rgba format (e.g., 'rgba(255,255,255,0.1)')" },
                        { k: "textColor", v: "string", d: "Hex or rgba format" },
                        { k: "secondaryTextColor", v: "string", d: "Hex or rgba format" },
                        { k: "accentColor", v: "string", d: "Hex or rgba format (Used for stars and verified badges)" },
                        { k: "borderColor", v: "string", d: "Hex or rgba format" },
                        { k: "borderRadius", v: "number", d: "Corner radius in pixels (e.g., 24)" },
                        { k: "elevation", v: "number", d: "Pre-defined shadow strengths (0, 1, 2, or 3)" },
                    ].map(s => (
                        <tr key={s.k}>
                            <td className="py-3 font-mono text-foreground/80">{s.k}</td>
                            <td className="py-3 text-[10px] font-bold text-muted-foreground uppercase">{s.v}</td>
                            <td className="py-3 text-muted-foreground text-xs">{s.d}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-6">Responses & Status Codes</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/5">
                <div className="font-bold text-green-500 flex justify-between">
                  <span>200 OK</span>
                  <span className="font-mono text-xs">image/png</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Returns the binary PNG representation of the generated card.</p>
              </div>
              <div className="p-4 rounded-xl border border-border/50 bg-card/5">
                <div className="font-bold flex justify-between">
                  <span>400 Bad Request</span>
                  <span className="font-mono text-xs">application/json</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">The JSON payload is malformed or missing required parameters.</p>
              </div>
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5">
                <div className="font-bold text-red-500 flex justify-between">
                  <span>401 Unauthorized</span>
                  <span className="font-mono text-xs">application/json</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">The Authorization header is missing, or the API key format is invalid.</p>
              </div>
              <div className="p-4 rounded-xl border border-orange-500/30 bg-orange-500/5">
                <div className="font-bold text-orange-500 flex justify-between">
                  <span>402 Payment Required</span>
                  <span className="font-mono text-xs">application/json</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Your credit balance is <code className="bg-orange-500/20 px-1 rounded">0</code>. Please refill your account on the dashboard.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-6 pt-8 border-t border-border/50">No-Code & Zapier Integration</h3>
            <p className="text-muted-foreground mb-6">
              You do not need to write code to use Aesthetic Proof. You can automatically generate images whenever a user submits a Google Form, Typeform, or Stripe purchase using **Zapier** or **Make.com**.
            </p>
            <div className="glass rounded-2xl border border-border p-6 shadow-sm">
               <ol className="space-y-4 list-decimal list-inside text-sm text-muted-foreground">
                 <li><strong className="text-foreground">Trigger:</strong> Set up your trigger step (e.g., "New Typeform Entry").</li>
                 <li><strong className="text-foreground">Action:</strong> Add a <strong>Webhooks by Zapier</strong> step and choose <strong>Custom Request</strong>.</li>
                 <li><strong className="text-foreground">Method:</strong> <code className="bg-secondary px-1 rounded">POST</code></li>
                 <li><strong className="text-foreground">URL:</strong> <code className="bg-secondary px-1 rounded">https://aesthetic-proof.gooder.games/api/v1/generate</code></li>
                 <li><strong className="text-foreground">Data:</strong> Pass standard JSON linking your trigger variables (e.g., <code className="bg-secondary px-1 rounded">{"{"} "name": "1. Name", "text": "1. Feedback" {"}"}</code>).</li>
                 <li><strong className="text-foreground">Headers:</strong> Add <code className="bg-secondary px-1 rounded">Authorization</code> mapped to <code className="bg-secondary px-1 rounded">Bearer ap_your_api_key</code>.</li>
                 <li><strong className="text-foreground">Result:</strong> Zapier will output a binary file object which you can pipe directly into a Google Drive folder or a Slack message!</li>
               </ol>
            </div>
          </section>
        </div>

        {/* Sidebar / Quick Snippet */}
        <div className="space-y-8 lg:sticky lg:top-24 lg:self-start">
           
           <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                Quick Examples
              </h3>
              <CodeTabs />
           </div>

           <div className="glass rounded-3xl border border-red-500/30 p-8 shadow-xl bg-red-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ServerCog size={64} />
              </div>
              <h3 className="font-bold flex items-center gap-2 mb-4 text-red-500">
                <ShieldAlert size={18} />
                Integration Architecture
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 relative z-10">
                Because the API requires an <code className="text-foreground">Authorization</code> secret, <strong>do not call it directly from a frontend &lt;img src="..."&gt; tag.</strong> Doing so exposes your secret key.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed font-bold border-l-2 border-red-500 pl-3">
                Action: Always proxy the request through your own secure backend API, or generate and cache the images in an S3 bucket.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
