"use client";

import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Layers,
  Quote,
  Clock,
  CheckCircle2,
  ArrowRight,
  PenTool,
  Brain,
  Lightbulb,
} from "lucide-react";

const ESSAY_DIMENSIONS = [
  "Political & Constitutional",
  "Social & Gender",
  "Economic & Fiscal",
  "Historical & Cultural",
  "Ethical & Moral",
  "Philosophical & Epistemological",
  "Scientific & Technological",
  "Environmental & Ecological",
  "International & Geopolitical",
  "Individual & Psychological",
  "Institutional & Administrative",
  "Futuristic / Way Forward",
];

export function EssayLabView({ essays }: { essays: any[] }) {
  const [selectedEssay, setSelectedEssay] = useState<any>(essays[0] || null);
  const [activeTab, setActiveTab] = useState<"dimensions" | "outline" | "quotes">("dimensions");
  const [brainstormNotes, setBrainstormNotes] = useState<Record<string, string>>({});
  const [fullText, setFullText] = useState("");

  const quoteBank = selectedEssay?.quoteBank
    ? (JSON.parse(selectedEssay.quoteBank) as { quote: string; author: string }[])
    : [];

  const anecdoteBank = selectedEssay?.anecdoteBank
    ? (JSON.parse(selectedEssay.anecdoteBank) as { title: string; story: string }[])
    : [];

  const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">UPSC Essay Paper Suite</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold font-mono">
              12-Dimensional Brainstorming
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Master multi-dimensional synthesis for philosophical and governance essays. Dissect abstract prompts into 12 distinct analytical planes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab("dimensions")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "dimensions" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            12 Dimensions Grid
          </button>
          <button
            onClick={() => setActiveTab("outline")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "outline" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Drafting Studio
          </button>
          <button
            onClick={() => setActiveTab("quotes")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "quotes" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Quotes & Anecdotes
          </button>
        </div>
      </div>

      {/* Selected Topic Bar */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-primary font-bold">
            {selectedEssay?.theme || "Philosophical Essay"} • {selectedEssay?.year ? `UPSC PYQ ${selectedEssay.year}` : "Standard Theme"}
          </span>
          <span className="text-muted-foreground font-mono">1000 - 1200 Words • 125 Marks</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground leading-relaxed">
          &ldquo;{selectedEssay?.title}&rdquo;
        </h2>
      </div>

      {/* Tab 1: 12-Dimensional Brainstorming Matrix */}
      {activeTab === "dimensions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span>12-Dimensional Brainstorming Matrix</span>
            </span>
            <span className="text-xs text-muted-foreground">
              Add arguments, case studies, or thinkers across each dimension
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ESSAY_DIMENSIONS.map((dim, idx) => (
              <div key={dim} className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center font-mono text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{dim}</span>
                  </span>
                </div>
                <textarea
                  value={brainstormNotes[dim] || ""}
                  onChange={(e) =>
                    setBrainstormNotes((prev) => ({ ...prev, [dim]: e.target.value }))
                  }
                  placeholder={`Brainstorm ${dim.toLowerCase()} arguments, data points, or examples...`}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border text-foreground outline-none focus:border-primary text-xs resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Drafting Studio */}
      {activeTab === "outline" && (
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <PenTool className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Full Essay Writing Studio</h3>
            </div>
            <span className={`font-mono text-xs font-bold ${wordCount > 1200 ? "text-amber-500" : "text-foreground"}`}>
              {wordCount} / 1200 Words
            </span>
          </div>

          <textarea
            value={fullText}
            onChange={(e) => setFullText(e.target.value)}
            placeholder="Write your complete essay here. Build smooth transitions between philosophical, political, socio-economic, and technological dimensions..."
            rows={18}
            className="w-full p-4 rounded-xl bg-muted/30 border border-border text-xs sm:text-sm font-mono text-foreground outline-none focus:border-primary leading-relaxed resize-y"
          />

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground font-mono">
              Aim for balanced paragraphs of 80-120 words with clear connective transitions.
            </span>
            <button className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90">
              Submit for AI Essay Evaluation
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Quotes & Anecdotes */}
      {activeTab === "quotes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quotes */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Quote className="w-4 h-4 text-primary" />
              <span>Curated Quotes for this Theme</span>
            </h3>
            <div className="space-y-3">
              {quoteBank.map((q, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
                  <blockquote className="italic text-foreground">&ldquo;{q.quote}&rdquo;</blockquote>
                  <span className="text-[11px] font-bold text-primary block text-right">— {q.author}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Anecdotes */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Anecdote & Story Bank (Intro & Conclusion Hooks)</span>
            </h3>
            <div className="space-y-3">
              {anecdoteBank.map((a, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs space-y-1.5">
                  <span className="font-bold text-foreground block">{a.title}</span>
                  <p className="text-muted-foreground leading-relaxed">{a.story}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
