"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Check,
  Eye,
  ArrowRight,
  Brain,
  FileText,
  Bookmark,
} from "lucide-react";

export function RevisionDeckView({
  user,
  schedules: initialSchedules,
}: {
  user: any;
  schedules: any[];
}) {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [activeTab, setActiveTab] = useState<"deck" | "recall" | "sheets">("recall");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [userRecallNotes, setUserRecallNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const activeSchedule = schedules[currentIndex] || schedules[0];

  const dueCount = schedules.filter((s) => s.status === "DUE").length;
  const overdueCount = schedules.filter((s) => s.status === "OVERDUE").length;
  const healthAvg = Math.round(
    schedules.reduce((acc, s) => acc + s.recallHealth, 0) / (schedules.length || 1)
  );

  const handleRateRecall = async (rating: "Forgot" | "Hard" | "Good" | "Easy") => {
    if (!activeSchedule || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/revision/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduleId: activeSchedule.id,
          rating,
          timeSpentSec: 300,
          notesReviewed: userRecallNotes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSchedules((prev) =>
          prev.map((s) =>
            s.id === activeSchedule.id
              ? {
                  ...s,
                  status: rating === "Forgot" ? "DUE" : "COMPLETED",
                  intervalDays: data.schedule.intervalDays,
                  recallHealth: data.recallHealth,
                }
              : s
          )
        );

        setIsRevealed(false);
        setUserRecallNotes("");
        if (currentIndex < schedules.length - 1) {
          setCurrentIndex((i) => i + 1);
        } else {
          setCurrentIndex(0);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Spaced Revision & Active Recall</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold font-mono">
              SM-2 / FSRS Engine
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Combat the Ebbinghaus Forgetting Curve. Active prompt-first recall replaces passive rereading.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab("recall")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "recall" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Active Recall Drill
          </button>
          <button
            onClick={() => setActiveTab("deck")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "deck" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Spaced Repetition Deck
          </button>
          <button
            onClick={() => setActiveTab("sheets")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "sheets" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            One-Page Revision Sheets
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-semibold">Revision Health</span>
            <div className="text-2xl font-extrabold font-mono text-foreground mt-0.5">
              {healthAvg}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-semibold">Due Today</span>
            <div className="text-2xl font-extrabold font-mono text-amber-500 mt-0.5">
              {dueCount} Decks
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-semibold">Overdue (Decaying)</span>
            <div className="text-2xl font-extrabold font-mono text-rose-500 mt-0.5">
              {overdueCount} Decks
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tab 1: Active Recall Flashcard Workspace */}
      {activeTab === "recall" && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-lg space-y-6">
            {/* Card Meta */}
            <div className="flex items-center justify-between border-b border-border pb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-muted text-primary">
                  Deck {currentIndex + 1} of {schedules.length}
                </span>
                <span className="font-semibold text-foreground">{activeSchedule?.subject}</span>
              </div>
              <span className="font-mono text-muted-foreground">
                Revision #{activeSchedule?.revisionNumber} • Interval: {activeSchedule?.intervalDays} days
              </span>
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                <span>Active Recall Prompt</span>
              </span>
              <div className="text-base sm:text-lg font-bold text-foreground leading-relaxed">
                {activeSchedule?.topic.includes("Governor")
                  ? "List the constitutional provisions governing the Governor's discretionary powers under Articles 163, 200, and 356, and state the core ratio of Shamsher Singh (1974)."
                  : activeSchedule?.topic.includes("Wildlife")
                  ? "Detail the structural reduction of schedules in the Wildlife (Protection) Amendment Act 2022 and explain the function of Schedule IV."
                  : activeSchedule?.topic.includes("Rawls")
                  ? "State John Rawls' two principles of justice in lexical priority and summarize Nozick's entitlement critique."
                  : `State the canonical facts, constitutional references, and committee recommendations for: ${activeSchedule?.topic}`}
              </div>
            </div>

            {/* Aspirant Active Recall Input */}
            <div className="space-y-1 text-xs">
              <label className="text-muted-foreground font-semibold block">
                Type your mental recall points (or articulate them aloud before revealing):
              </label>
              <textarea
                value={userRecallNotes}
                onChange={(e) => setUserRecallNotes(e.target.value)}
                placeholder="Recall constitutional articles, committee names, court precedents, data..."
                rows={4}
                className="w-full p-3 rounded-xl bg-muted/40 border border-border text-foreground text-xs outline-none focus:border-primary resize-none"
              />
            </div>

            {/* Reveal Answer Button */}
            {!isRevealed ? (
              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => setIsRevealed(true)}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 flex items-center gap-2 shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Reveal Canonical Solution & Notes</span>
                </button>
              </div>
            ) : (
              /* Revealed Answer & Self-Rating */
              <div className="space-y-5 animate-in fade-in">
                <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-2 text-xs">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Canonical Answer Points & Stored Notes:</span>
                  </span>
                  <div className="text-muted-foreground leading-relaxed space-y-1.5">
                    <p>• <strong>Articles:</strong> Article 163 (Discretion), Article 200 (Assent/Return/Reserve), Article 356 (President&apos;s Rule).</p>
                    <p>• <strong>Judicial Ratio:</strong> Shamsher Singh (1974) held Governor must exercise constitutional powers strictly on ministerial aid and advice except in exceptional explicit situations.</p>
                    <p>• <strong>Committees:</strong> Sarkaria (1988) and Punchhi (2010) recommended a 6-month limit on gubernatorial assent to state bills.</p>
                  </div>
                </div>

                {/* Rating Buttons */}
                <div className="space-y-2 text-center">
                  <span className="text-xs font-bold text-foreground">
                    Rate Your Memory Retention (Updates Next Interval Automatically):
                  </span>
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    <button
                      onClick={() => handleRateRecall("Forgot")}
                      disabled={loading}
                      className="p-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all"
                    >
                      Forgot (1 Day)
                    </button>
                    <button
                      onClick={() => handleRateRecall("Hard")}
                      disabled={loading}
                      className="p-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold transition-all"
                    >
                      Hard (3 Days)
                    </button>
                    <button
                      onClick={() => handleRateRecall("Good")}
                      disabled={loading}
                      className="p-2.5 rounded-xl bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary text-xs font-bold transition-all"
                    >
                      Good (7 Days)
                    </button>
                    <button
                      onClick={() => handleRateRecall("Easy")}
                      disabled={loading}
                      className="p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all"
                    >
                      Easy (16 Days)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Spaced Repetition Full Deck View */}
      {activeTab === "deck" && (
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Scheduled Repetition Intervals
            </span>
            <span className="text-xs font-mono text-muted-foreground">{schedules.length} Topics Active</span>
          </div>

          <div className="space-y-2">
            {schedules.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl bg-muted/30 border border-border flex items-center justify-between text-xs"
              >
                <div className="min-w-0">
                  <div className="font-bold text-foreground truncate">{s.topic}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span>{s.subject}</span>
                    <span>•</span>
                    <span>Revision #{s.revisionNumber}</span>
                    <span>•</span>
                    <span>Interval: {s.intervalDays} days</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        s.status === "OVERDUE"
                          ? "bg-rose-500/20 text-rose-500"
                          : s.status === "DUE"
                          ? "bg-amber-500/20 text-amber-500"
                          : "bg-emerald-500/20 text-emerald-500"
                      }`}
                    >
                      {s.status}
                    </span>
                    <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                      Health: {s.recallHealth}%
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab("recall");
                      setCurrentIndex(schedules.findIndex((item) => item.id === s.id));
                    }}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
                  >
                    Recall Drill
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: One-Page Revision Sheets */}
      {activeTab === "sheets" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                One-Page Sheet: Parliamentary Committees
              </span>
              <span className="font-mono text-[10px] bg-muted px-2 py-0.5 rounded">GS-2 Polity</span>
            </div>
            <div className="space-y-2 leading-relaxed">
              <p><strong>1. Constitutional Basis:</strong> Article 105(3) privileges & Rules of Procedure in Lok Sabha (Rule 253).</p>
              <p><strong>2. Core Functions:</strong> DRSCs scrutinize budgets, bills, and policy implementation away from media sensationalism.</p>
              <p><strong>3. Critical Empirical Data:</strong> Decline in bills referred from 71% in 15th LS to 16% in 17th LS.</p>
              <p><strong>4. Key Committees:</strong> PAC (audits CAG), Estimates (continuous economy in expenditure), Committee on Subordinate Legislation.</p>
              <p><strong>5. Reforms (2nd ARC):</strong> Mandatory referral of all major bills, research staff, fixed sitting days.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                One-Page Sheet: John Rawls Theory of Justice
              </span>
              <span className="font-mono text-[10px] bg-muted px-2 py-0.5 rounded">PSIR Paper 1A</span>
            </div>
            <div className="space-y-2 leading-relaxed">
              <p><strong>1. Context:</strong> A Theory of Justice (1971); revival of normative political philosophy against utilitarianism.</p>
              <p><strong>2. Method:</strong> Original Position behind a Veil of Ignorance; rational choice theory under uncertainty (Maximin Rule).</p>
              <p><strong>3. Two Principles:</strong> 1. Equal basic liberties. 2. Social and economic inequalities must satisfy: (a) Fair equality of opportunity, (b) Difference Principle (benefit the least advantaged).</p>
              <p><strong>4. Major Critiques:</strong> Nozick (violates self-ownership), Sen (Niti vs Nyaya), Sandel (unencumbered self).</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
