"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Award,
  Filter,
  BarChart2,
  Brain,
  ShieldAlert,
} from "lucide-react";

export function PrelimsEngineView({
  questions,
  pastAttempts,
}: {
  questions: any[];
  pastAttempts: any[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [eliminationMethod, setEliminationMethod] = useState<
    "Knew directly" | "Eliminated two" | "Educated guess" | "Blind guess"
  >("Knew directly");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isSubmitted) setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const handleSubmit = async () => {
    if (!selectedOptionId || isSubmitted || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/prelims/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQ.id,
          selectedOptionId,
          eliminationMethod,
          timeSpentSec: seconds,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmissionResult(data);
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setIsSubmitted(false);
    setSelectedOptionId(null);
    setSubmissionResult(null);
    setSeconds(0);
    setEliminationMethod("Knew directly");
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Prelims Elimination Engine</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold font-mono">
              UPSC Marking (+2.0 / -0.66)
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Track HOW you solve questions. Diagnose certainty vs elimination fallacies and optimize net scores under negative marking.
          </p>
        </div>

        {/* Elimination Intelligence Summary Pill */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Certain Accuracy:</span>
            <strong className="text-foreground font-mono">84%</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs flex items-center gap-2 text-rose-500">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>50:50 Elim Accuracy:</span>
            <strong className="font-mono">38%</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Quiz Box (Left) & Elimination Analytics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Question Box */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-5">
            {/* Question Top Meta */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-muted text-foreground">
                  Q{currentIndex + 1} of {questions.length}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {currentQ?.subject}
                </span>
                {currentQ?.isPYQ && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold">
                    Official PYQ {currentQ?.pyqYear}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{seconds}s</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-sm sm:text-base font-semibold text-foreground leading-relaxed whitespace-pre-line">
              {currentQ?.questionText}
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-2.5 pt-2">
              {currentQ?.options?.map((opt: any) => {
                const isSelected = selectedOptionId === opt.id;
                let optionStyle = "bg-muted/30 border-border hover:border-primary/40 hover:bg-muted/60";

                if (isSubmitted) {
                  if (opt.isCorrect) {
                    optionStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold";
                  } else if (isSelected && !opt.isCorrect) {
                    optionStyle = "bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 font-semibold";
                  } else {
                    optionStyle = "bg-muted/20 border-border opacity-60";
                  }
                } else if (isSelected) {
                  optionStyle = "bg-primary/10 border-primary text-primary font-semibold shadow-sm";
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => !isSubmitted && setSelectedOptionId(opt.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${optionStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-background border border-border flex items-center justify-center text-xs font-bold shrink-0 font-mono">
                      {opt.optionLabel}
                    </span>
                    <div className="flex-1 text-xs sm:text-sm pt-0.5">{opt.optionText}</div>
                  </div>
                );
              })}
            </div>

            {/* Elimination Method Selector (Before Submission) */}
            {!isSubmitted && (
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-primary" />
                  <span>How did you arrive at this choice? (Elimination Analytics)</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "Knew directly", label: "Knew directly (100%)" },
                    { id: "Eliminated two", label: "Eliminated two (50:50)" },
                    { id: "Educated guess", label: "Educated guess" },
                    { id: "Blind guess", label: "Blind guess" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setEliminationMethod(m.id as any)}
                      className={`p-2 rounded-lg text-[11px] font-semibold border transition-all ${
                        eliminationMethod === m.id
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground font-mono">
                GS-1 Paper: +2.0 / -0.66
              </span>

              <div className="flex items-center gap-2">
                {!isSubmitted ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedOptionId || loading}
                    className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 disabled:opacity-50 transition-opacity"
                  >
                    {loading ? "Evaluating..." : "Submit Answer"}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 flex items-center gap-1.5"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Post-Submission Detailed Feedback */}
            {isSubmitted && submissionResult && (
              <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {submissionResult.isCorrect ? (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-500 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct (+2.0 Marks)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-500 font-bold text-xs flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Incorrect (-0.66 Marks)
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    Time taken: {seconds} seconds
                  </span>
                </div>

                {!submissionResult.isCorrect && (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      <strong>Mistake Captured:</strong> Automatically logged in your Mistake Vault under &quot;{eliminationMethod === "Blind guess" ? "Guessing" : "Elimination error"}&quot;.
                    </span>
                  </div>
                )}

                {/* Explanation */}
                <div className="space-y-1 text-xs">
                  <strong className="text-foreground block">Conceptual Explanation:</strong>
                  <p className="text-muted-foreground leading-relaxed">
                    {submissionResult.explanation}
                  </p>
                </div>

                {/* Elimination Tip */}
                {submissionResult.eliminationTip && (
                  <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-foreground space-y-1">
                    <strong className="text-primary flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> UPSC Elimination Tip:
                    </strong>
                    <p className="text-muted-foreground leading-relaxed">
                      {submissionResult.eliminationTip}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Elimination Analytics Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <BarChart2 className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Elimination Accuracy Profile</h2>
            </div>

            {/* Performance Breakdown by Elimination Method */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-foreground">Knew Directly (Certain)</span>
                  <span className="font-mono font-bold text-emerald-500">84.5% Accuracy</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "84.5%" }} />
                </div>
                <span className="text-[10px] text-muted-foreground">High reliability • Net positive yield</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-foreground">Eliminated Two (50:50)</span>
                  <span className="font-mono font-bold text-rose-500">38.2% Accuracy</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: "38.2%" }} />
                </div>
                <span className="text-[10px] text-rose-500 font-medium">
                  Negative expected value (-0.14 marks/question)
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-foreground">Educated Guess</span>
                  <span className="font-mono font-bold text-amber-500">25.0% Accuracy</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "25%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-foreground">Blind Guess</span>
                  <span className="font-mono font-bold text-rose-500">10.0% Accuracy</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: "10%" }} />
                </div>
              </div>
            </div>

            {/* Strategic Recommendation */}
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs space-y-2">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span>Attempt Strategy Advisor</span>
              </span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Your 50:50 elimination is severely costing you (-19.8 marks in Mock #04). In Environment, do not guess when torn between Schedule I vs II until you master the 2022 amendments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
