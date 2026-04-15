"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`absolute right-4 rounded-xl p-2 transition-all ${
        copied 
          ? "bg-green-500 text-white" 
          : "bg-secondary hover:bg-primary hover:text-white"
      }`}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}
