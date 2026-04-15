"use client";

import { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const snippets = {
  bash: `curl -X POST https://api.aesthetic-proof.com/v1/generate \\
  -H "Authorization: Bearer ap_your_secret_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Jane Doe",
    "text": "Aesthetic Proof is simply amazing!",
    "preset": "midnight"
  }' \\
  --output feedback.png`,
  javascript: `const response = await fetch("https://api.aesthetic-proof.com/v1/generate", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ap_your_secret_key",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "Jane Doe",
    text: "Aesthetic Proof is simply amazing!",
    preset: "midnight"
  })
});

const buffer = await response.arrayBuffer();
// Save or serve the buffer as a PNG image`,
  python: `import requests

url = "https://api.aesthetic-proof.com/v1/generate"
headers = {
    "Authorization": "Bearer ap_your_secret_key",
    "Content-Type": "application/json"
}
data = {
    "name": "Jane Doe",
    "text": "Aesthetic Proof is simply amazing!",
    "preset": "midnight"
}

response = requests.post(url, json=data, headers=headers)

with open("feedback.png", "wb") as f:
    f.write(response.content)`
};

export function CodeTabs() {
  const [activeTab, setActiveTab] = useState<keyof typeof snippets>("bash");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "bash", label: "cURL" },
    { id: "javascript", label: "Node.js" },
    { id: "python", label: "Python" }
  ] as const;

  return (
    <div className="glass rounded-3xl border border-border p-1 overflow-hidden shadow-xl bg-card/10 flex flex-col">
      <div className="flex items-center justify-between border-b border-border/50 px-2 py-2">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as keyof typeof snippets)}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-xl transition-all",
                activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors mr-1"
          title="Copy code"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="p-4 bg-black/90 text-zinc-300 font-mono text-[12px] leading-relaxed overflow-x-auto">
        <pre><code>{snippets[activeTab]}</code></pre>
      </div>
    </div>
  );
}
