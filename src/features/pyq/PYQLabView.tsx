"use client";

import React, { useState } from "react";
import {
  History,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  FileText,
  Sparkles,
  X,
} from "lucide-react";

export function PYQLabView({ pyqs }: { pyqs: any[] }) {
  const [selectedStage, setSelectedStage] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePYQ, setActivePYQ] = useState<any | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const filtered = pyqs.filter((p) => {
    if (selectedStage !== "ALL" && p.stage !== selectedStage) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        p.questionText.toLowerCase().includes(q) ||
        p.topic.toLowerCase().includes(q) ||
        p.recurringTheme?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">PYQ Intelligence Engine</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold font-mono">
              Frequency & Trend Analytics
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Official UPSC questions structured by recurrence, directive verb, and syllabus linkage. Use frequency as prioritization evidence without false predictions.
          </p>
        </div>
      </div>

      {/* Analytics Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-semibold">Highest Yield Theme</span>
            <div className="text-sm font-bold text-foreground mt-1">
              Rawls & Social Justice (PSIR)
            </div>
            <span className="text-[11px] text-emerald-500 font-mono">14 Times Tested • Stable</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-semibold">Rising GS-2 Theme</span>
            <div className="text-sm font-bold text-foreground mt-1">
              Gubernatorial Discretion & Article 200
            </div>
            <span className="text-[11px] text-emerald-500 font-mono">8 Times Tested • Rising Trend</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-semibold">Rising GS-3 Theme</span>
            <div className="text-sm font-bold text-foreground mt-1">
              Wildlife Protection 2022 Amendment
            </div>
            <span className="text-[11px] text-amber-500 font-mono">7 Times Tested • Rising Trend</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-1">
          {["ALL", "Prelims", "Mains", "Optional", "Essay"].map((stage) => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStage === stage
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {stage}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search PYQ text, theme, year..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-muted/60 border border-border text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* PYQ List */}
      <div className="space-y-3">
        {filtered.map((pyq) => (
          <div
            key={pyq.id}
            onClick={() => {
              setActivePYQ(pyq);
              setShowSolution(false);
            }}
            className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-primary text-primary-foreground">
                  UPSC {pyq.year}
                </span>
                <span className="font-semibold text-foreground px-2 py-0.5 rounded bg-muted">
                  {pyq.paper}
                </span>
                <span className="text-muted-foreground font-mono">
                  {pyq.marks} Marks
                </span>
                {pyq.directive && (
                  <span className="text-primary font-semibold">
                    Directive: {pyq.directive}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-semibold">
                  {pyq.frequencyCount}x Recurring
                </span>
                <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  Trend: {pyq.trend}
                </span>
              </div>
            </div>

            <div className="text-sm font-semibold text-foreground leading-relaxed">
              {pyq.questionText}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
              <span>Theme: <strong className="text-foreground">{pyq.recurringTheme}</strong></span>
              <span className="text-primary font-semibold flex items-center gap-1">
                <span>Inspect Solution Outline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* PYQ Solution Modal */}
      {activePYQ && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-primary">
                  UPSC {activePYQ.year} • {activePYQ.paper} • {activePYQ.marks} Marks
                </span>
                <h3 className="text-sm font-bold text-foreground mt-1">{activePYQ.topic}</h3>
              </div>
              <button
                onClick={() => setActivePYQ(null)}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
              {activePYQ.questionText}
            </div>

            {!showSolution ? (
              <div className="text-center py-4">
                <button
                  onClick={() => setShowSolution(true)}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 flex items-center gap-2 mx-auto"
                >
                  <Eye className="w-4 h-4" />
                  <span>Reveal Model Outline & Key Anchors</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-2 text-xs animate-in fade-in">
                <span className="font-bold text-primary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Model Answer Dimensions & Essential Citations:</span>
                </span>
                <div className="space-y-1 text-muted-foreground leading-relaxed">
                  <p>• <strong>Directives:</strong> Directly address {activePYQ.directive || "the core theme"} using structural subheadings.</p>
                  <p>• <strong>Constitutional/Theoretical Basis:</strong> Cite relevant statutory provisions, Articles, or primary texts.</p>
                  <p>• <strong>Committees & Precedents:</strong> Cite 2nd ARC / Law Commission / Supreme Court rulings.</p>
                  <p>• <strong>Way Forward:</strong> Synthesize with a futuristic institutional solution.</p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-border">
              <button
                onClick={() => setActivePYQ(null)}
                className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
