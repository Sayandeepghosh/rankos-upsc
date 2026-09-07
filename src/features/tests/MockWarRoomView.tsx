"use client";

import React, { useState } from "react";
import {
  Award,
  BarChart2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Layers,
  ChevronRight,
} from "lucide-react";

export function MockWarRoomView({ tests }: { tests: any[] }) {
  const [selectedTest, setSelectedTest] = useState<any>(tests[0] || null);
  const latestAttempt = selectedTest?.attempts?.[0];

  const topMistakes = latestAttempt?.topMistakes
    ? (JSON.parse(latestAttempt.topMistakes) as string[])
    : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Mock Test War Room</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold font-mono">
              AI Diagnostic Audit
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real test telemetry. Dissect negative marking impact, examine 50:50 elimination efficiency, and review your automated 7-day recovery roadmap.
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 flex items-center gap-2 shadow-sm">
          <Award className="w-4 h-4" />
          <span>Launch Full-Length Simulation</span>
        </button>
      </div>

      {/* Test Selector */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {tests.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTest(t)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              selectedTest?.id === t.id
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {latestAttempt ? (
        <div className="space-y-6">
          {/* Scorecard Hero Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Net Score</span>
              <div className="text-2xl font-extrabold font-mono text-primary mt-1">
                {latestAttempt.netScore.toFixed(1)}
              </div>
              <span className="text-[10px] text-muted-foreground">/ {selectedTest.totalMarks} Marks</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Accuracy Rate</span>
              <div className="text-2xl font-extrabold font-mono text-emerald-500 mt-1">
                {latestAttempt.accuracyRate.toFixed(1)}%
              </div>
              <span className="text-[10px] text-muted-foreground">Target &gt;75%</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Attempted</span>
              <div className="text-2xl font-extrabold font-mono text-foreground mt-1">
                {latestAttempt.attemptedQuestions}
              </div>
              <span className="text-[10px] text-muted-foreground">of {latestAttempt.totalQuestions} Qs</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Correct</span>
              <div className="text-2xl font-extrabold font-mono text-emerald-500 mt-1">
                {latestAttempt.correctQuestions}
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">+{latestAttempt.rawScore} marks</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Incorrect</span>
              <div className="text-2xl font-extrabold font-mono text-rose-500 mt-1">
                {latestAttempt.incorrectQuestions}
              </div>
              <span className="text-[10px] text-rose-500 font-bold">-{latestAttempt.negativeMarks} penalty</span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Skipped</span>
              <div className="text-2xl font-extrabold font-mono text-muted-foreground mt-1">
                {latestAttempt.skippedQuestions}
              </div>
              <span className="text-[10px] text-muted-foreground">Safe passes</span>
            </div>
          </div>

          {/* AI Diagnosis & 7-Day Roadmap Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Test Diagnosis */}
            <div className="p-6 rounded-2xl bg-card border border-primary/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">AI Test Diagnosis</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary">
                  RankOS Auditor
                </span>
              </div>

              <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                {latestAttempt.aiDiagnosis}
              </p>

              {/* Top 5 Mistakes */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Top Identified Error Patterns:</span>
                </span>
                <div className="space-y-1.5">
                  {topMistakes.map((m: string, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs text-foreground flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                        {idx + 1}
                      </span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 7-Day Corrective Roadmap */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-foreground">7-Day Remediation Roadmap</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                  Target: &gt;105.0 Marks
                </span>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border">
                <pre className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-line">
                  {latestAttempt.correctivePlan}
                </pre>
              </div>

              <div className="pt-2 flex justify-end">
                <button className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center gap-1.5">
                  <span>Schedule Recovery Tasks to Planner</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-muted-foreground bg-card rounded-2xl border border-border">
          No attempts recorded for this test yet. Click &quot;Launch Full-Length Simulation&quot; to begin.
        </div>
      )}
    </div>
  );
}
