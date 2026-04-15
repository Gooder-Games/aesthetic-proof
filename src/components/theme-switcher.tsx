"use client";

import { useState } from "react";
import { Sparkles, Sun, Moon, Sunrise, MinusSquare } from "lucide-react";

const PRESETS = [
  { id: "frost", name: "Frost", icon: Sun, color: "text-blue-500", bg: "bg-blue-50" },
  { id: "midnight", name: "Midnight", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-950" },
  { id: "sunset", name: "Sunset", icon: Sunrise, color: "text-pink-500", bg: "bg-pink-50" },
  { id: "minimal", name: "Minimal", icon: MinusSquare, color: "text-gray-500", bg: "bg-gray-100" },
];

export function ThemeSwitcher() {
  const [activePreset, setActivePreset] = useState("frost");

  return (
    <div className="w-full flex flex-col items-center gap-12">
      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 bg-secondary/30 p-2 rounded-full border border-border backdrop-blur-sm">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePreset(p.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300 font-semibold ${
              activePreset === p.id 
              ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105" 
              : "hover:bg-primary/10 text-muted-foreground"
            }`}
          >
            <p.icon size={18} />
            {p.name}
          </button>
        ))}
      </div>

      {/* Preview Container */}
      <div className="relative w-full max-w-4xl group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="relative rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-4 shadow-2xl overflow-hidden min-h-[400px] flex items-center justify-center">
            {/* The Real Image from the API */}
            <img 
              src={`/presets/${activePreset}.png`} 
              alt={`${activePreset} preset preview`}
              className="w-full h-auto rounded-2xl shadow-2xl animate-fade-in transition-transform duration-700 hover:scale-[1.02]"
              key={activePreset} // Force re-animation on change
            />
            
            {/* Decorative Badges */}
            <div className="absolute top-8 left-8 flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-white border border-white/20">
               <Sparkles size={12} className="text-yellow-400" />
               PREMIUM PRESET: {activePreset.toUpperCase()}
            </div>
        </div>
      </div>
    </div>
  );
}
