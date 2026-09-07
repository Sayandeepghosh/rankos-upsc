"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Check,
} from "lucide-react";

export function MistakeVaultView({ mistakes: initialMistakes }: { mistakes: any[] }) {
  const [mistakes, setMistakes] = useState(initialMistakes);
  const [selectedType, setSelectedType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const types = [
    "ALL",
    "Knowledge gap",
    "Poor elimination",
    "Misread question",
    "Guessing",
    "Conceptual confusion",
    "Time pressure",
  ];

  const filtered = mistakes.filter((m) => {
    if (selectedType !== "ALL" && m.mistakeType !== selectedType) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        m.questionText.toLowerCase().includes(q) ||
        m.topic.toLowerCase().includes(q) ||
        m.reasonForError.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleResolve = (id: string) => {
    setMistakes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "RESOLVED" } : m))
    );
  };

  const repeatedCount = mistakes.filter((m) => m.repetitionCount >= 2).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Mistake Vault & Error Archaeology</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 font-semibold font-mono">
              Auto-Captured
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Every incorrect MCQ, uncalibrated guess, and structural error is categorized by cognitive failure mode to prevent repetition.
          </p>
        </div>

        {/* Repetition Alert Badge */}
        {repeatedCount > 0 && (
          <div className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{repeatedCount} Repeated Mistake Pattern Detected</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-1">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedType === t
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search error questions or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-muted/60 border border-border text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Mistakes List */}
      <div className="space-y-4">
        {filtered.map((m) => {
          const isRepeated = m.repetitionCount >= 2;
          const isResolved = m.status === "RESOLVED";

          return (
            <div
              key={m.id}
              className={`p-6 rounded-2xl border transition-all space-y-4 ${
                isResolved
                  ? "bg-muted/30 border-border opacity-70"
                  : isRepeated
                  ? "bg-rose-500/5 border-rose-500/30 shadow-sm"
                  : "bg-card border-border shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-4 border-b border-border pb-3 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-muted text-primary">
                    {m.subject} • {m.topic}
                  </span>
                  <span className="text-muted-foreground">Source: {m.source}</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded ${
                      m.mistakeType === "Poor elimination"
                        ? "bg-amber-500/15 text-amber-500"
                        : "bg-rose-500/15 text-rose-500"
                    }`}
                  >
                    {m.mistakeType}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isRepeated && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                      Repeated {m.repetitionCount}x
                    </span>
                  )}
                  <button
                    onClick={() => handleResolve(m.id)}
                    className="px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isResolved ? "Resolved" : "Mark Resolved"}</span>
                  </button>
                </div>
              </div>

              {/* Question */}
              <div className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
                {m.questionText}
              </div>

              {/* Response Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 space-y-0.5">
                  <strong className="block text-[11px] uppercase font-mono">Your Response (Error):</strong>
                  <span>{m.userResponse}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 space-y-0.5">
                  <strong className="block text-[11px] uppercase font-mono">Canonical Correct Response:</strong>
                  <span>{m.correctResponse}</span>
                </div>
              </div>

              {/* Reason & Corrective Action */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs space-y-2">
                <div>
                  <strong className="text-foreground">Cognitive Root Cause:</strong>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed">{m.reasonForError}</p>
                </div>
                {m.correctiveAction && (
                  <div className="pt-2 border-t border-border/80">
                    <strong className="text-primary flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Prescribed Corrective Action:</span>
                    </strong>
                    <p className="text-foreground/90 mt-0.5 leading-relaxed">{m.correctiveAction}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
