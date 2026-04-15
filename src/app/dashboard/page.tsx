import { createClient } from "@/utils/supabase/server";
import { generateApiKey } from "./actions";
import { 
  Key, 
  Wallet, 
  ShoppingCart, 
  CheckCircle2, 
  Zap, 
  Clock, 
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Metadata } from "next";
import { CopyButton } from "@/components/copy-button";

export const metadata: Metadata = {
  title: "Dashboard | Aesthetic Proof",
  description: "Manage your API keys and credits.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Handled by middleware
  }

  // Fetch API key and credits from DB
  const { data: apiKeyData, error } = await supabase
    .from("api_keys")
    .select("*")
    .filter("user_id", "eq", user.id)
    .single();

  const creditCount = apiKeyData?.credits_left || 0;
  const apiKey = apiKeyData?.key || null;

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome, {user.email?.split("@")[0]}</h1>
        <p className="text-muted-foreground">Manage your API keys, monitor your credits, and upgrade your plan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* API Key Card */}
        <div className="lg:col-span-2 glass rounded-3xl border border-border p-8 shadow-xl flex flex-col h-full bg-card/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Key size={20} />
            </div>
            <h2 className="text-2xl font-bold">API Access</h2>
          </div>

          <div className="flex-1">
            {apiKey ? (
              <div className="space-y-6">
                <p className="text-sm font-medium text-muted-foreground">
                  Your Production API Key:
                </p>
                <div className="group relative flex items-center">
                  <input
                    type="password"
                    readOnly
                    value={apiKey}
                    className="w-full rounded-2xl border border-border bg-background/50 px-5 py-4 font-mono text-sm tracking-widest text-foreground outline-none transition-all group-hover:border-primary/50"
                  />
                  <CopyButton text={apiKey} />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck size={14} className="text-green-500" />
                  <span>Your key is encrypted and stored securely.</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-indigo-50 flex items-center justify-center text-primary mb-6">
                  <Zap size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Generate Your API Key</h3>
                <p className="text-muted-foreground mb-8 max-w-sm">
                  You haven't generated an API key yet. Click the button below to get started with Aesthetic Proof.
                </p>
                <form action={generateApiKey}>
                   <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 font-bold text-white transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-xl shadow-primary/20"
                  >
                    Create API Key
                  </button>
                </form>
              </div>
            )}
          </div>
          
          <div className="mt-8 pt-8 border-t border-border/50 grid grid-cols-2 gap-4">
             <div className="flex items-center gap-3">
                <Clock size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Created: {apiKeyData?.created_at ? new Date(apiKeyData.created_at).toLocaleDateString() : 'N/A'}</span>
             </div>
             <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-sm text-muted-foreground">Status: Active</span>
             </div>
          </div>
        </div>

        {/* Credits & Subscription Card */}
        <div className="flex flex-col gap-8">
          <div className="glass rounded-3xl border border-border p-8 shadow-xl bg-card/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
                <Wallet size={20} />
              </div>
              <h2 className="text-xl font-bold">Credits Left</h2>
            </div>
            
            <div className="mb-8">
              <span className="text-5xl font-extrabold tracking-tight">{creditCount.toLocaleString()}</span>
              <span className="text-muted-foreground ml-2">credits</span>
            </div>

            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              One credit is deducted for every image generated via the API.
            </p>

            <form action="/api/checkout" method="POST">
                <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-foreground py-4 text-sm font-bold text-background transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
                >
                <ShoppingCart size={18} />
                Buy 10,000 Credits ($19)
                </button>
            </form>
          </div>

          <div className="glass rounded-3xl border border-border p-6 shadow-xl bg-indigo-500/5">
             <h3 className="font-bold flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-primary" />
                Pro Tip
             </h3>
             <p className="text-sm text-muted-foreground leading-relaxed">
                Want to automate your social proof? Check our API documentation to see how to integrate in minutes.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
