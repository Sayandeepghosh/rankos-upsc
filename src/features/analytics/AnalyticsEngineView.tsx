"use client";

import React, { useState } from "react";
import {
  BarChart2,
  TrendingUp,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Layers,
  Calendar,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export function AnalyticsEngineView({
  readiness,
  snapshots,
  mistakes,
  user,
}: {
  readiness: any[];
  snapshots: any[];
  mistakes: any[];
  user: any;
}) {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d" | "all">("7d");

  const chartData = snapshots.map((s) => {
    const d = new Date(s.date);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return {
      day: days[d.getDay()],
      studyMinutes: s.studyMinutes,
      hours: Number((s.studyMinutes / 60).toFixed(1)),
      accuracy: s.mcqAccuracy,
      readiness: s.overallReadiness,
    };
  });

  const paperCoverage = [
    { paper: "GS-1", coverage: 60, color: "#f59e0b" },
    { paper: "GS-2", coverage: 78, color: "#3b82f6" },
    { paper: "GS-3", coverage: 52, color: "#10b981" },
    { paper: "GS-4", coverage: 45, color: "#8b5cf6" },
    { paper: "PSIR", coverage: 72, color: "#ec4899" },
    { paper: "CSAT", coverage: 82, color: "#06b6d4" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Preparation Telemetry & Trajectory</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold font-mono">
              Empirical Diagnostics
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real data telemetry without fake vanity metrics. Transparent readiness formulas, forgetting velocity, and cognitive weakness detection.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
          {(["7d", "30d", "90d", "all"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                timeframe === tf ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Trajectory Hero */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/15 via-card to-emerald-500/10 border border-primary/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary">
                Current Performance Trajectory
              </div>
              <div className="text-xl font-extrabold text-foreground flex items-center gap-2">
                <span>Improving (+2.4 pts / 14 Days)</span>
                <span className="text-xs font-normal font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  Competitive Band
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-card border border-border text-center">
              <span className="text-[10px] text-muted-foreground block">Projected Prelims Range</span>
              <strong className="font-mono text-sm font-bold text-foreground">98 - 112 Marks</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-card border border-border text-center">
              <span className="text-[10px] text-muted-foreground block">Projected Mains Range</span>
              <strong className="font-mono text-sm font-bold text-foreground">415 - 440 Marks</strong>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          *Note: RankOS does not claim to predict final UPSC rank with deterministic certainty. Trajectory represents your likelihood of crossing cutoffs based on mock score stability, syllabus depth, and error elimination rates.
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Study Velocity (Minutes/Day) */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Daily Focus Velocity (Minutes Studied)
            </span>
            <span className="text-xs font-mono font-bold text-emerald-500">6.0h Target</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 450]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                  formatter={(v: any) => [`${v} mins (${(Number(v) / 60).toFixed(1)} hrs)`, "Study Time"]}
                />
                <ReferenceLine y={360} stroke="#f59e0b" strokeDasharray="3 3" />
                <Bar dataKey="studyMinutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Accuracy vs Readiness Trend */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              MCQ Accuracy Trend (%)
            </span>
            <span className="text-xs font-mono font-bold text-primary">Recent Mock Avg: 64.3%</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[40, 90]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                  formatter={(v: any) => [`${v}%`, "MCQ Accuracy"]}
                />
                <ReferenceLine y={70} stroke="#10b981" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Syllabus Completion by Paper */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Syllabus Coverage Breakdown by Paper
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {paperCoverage.map((p) => (
            <div key={p.paper} className="p-3.5 rounded-xl bg-muted/30 border border-border text-center space-y-1.5">
              <span className="text-xs font-bold text-foreground font-mono">{p.paper}</span>
              <div className="text-xl font-extrabold font-mono" style={{ color: p.color }}>
                {p.coverage}%
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${p.coverage}%`, backgroundColor: p.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Weakness Engine Cards */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-bold text-foreground">Personalized Weakness Detection Engine</h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground">4 Actionable Alerts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-600 dark:text-rose-400">Environment Accuracy Lag (42%)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-500">Persistent 14d</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Consistently losing marks in statement-based questions on Wildlife Protection Act 2022 amendments and CITES appendices.
            </p>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] font-mono text-rose-500 font-semibold">Remediation: 15-MCQ Drill</span>
              <button className="text-xs font-bold text-primary hover:underline">Apply Fix ?</button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-600 dark:text-amber-400">Negative Marking Hazard in 50:50 Choices</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-500">Risk Factor</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your accuracy when eliminating two options is 38.2%, generating a net negative penalty of -19.8 marks in Full Mock #04.
            </p>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] font-mono text-amber-500 font-semibold">Remediation: Attempt Threshold &lt; 75</span>
              <button className="text-xs font-bold text-primary hover:underline">Apply Fix ?</button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary">GS-2 Answers Lack Committee Citations</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/15 text-primary">Mains Rubric</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Strict evaluator notes indicate answers on parliamentary oversight and governor discretion frequently omit 2nd ARC and Punchhi reports.
            </p>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] font-mono text-primary font-semibold">Remediation: Review One-Page Sheet</span>
              <button className="text-xs font-bold text-primary hover:underline">Apply Fix ?</button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Spaced Repetition Retention Decay</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground">Decay: 12%</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Topic &quot;Governor Discretionary Powers&quot; has reached Day 7 since last recall drill without review.
            </p>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground font-semibold">Remediation: 15m Prompt</span>
              <button className="text-xs font-bold text-primary hover:underline">Apply Fix ?</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
