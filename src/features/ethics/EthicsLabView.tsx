"use client";

import React, { useState } from "react";
import {
  Scale,
  BookOpen,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Award,
  Layers,
} from "lucide-react";

const ETHICS_LEXICON = [
  { term: "Integrity", definition: "Steadfast adherence to a strict moral or ethical code, ensuring congruence between thoughts, words, and public actions even when no one is watching.", example: "Ashok Khemka refusing to authenticate unlawful land transfers despite repeated transfers." },
  { term: "Probity", definition: "Uncompromising uprightness and complete absence of corruptive practices in public finances and administrative decisions.", example: "T.N. Seshan enforcing strict election expenditure ceilings under Model Code of Conduct." },
  { term: "Compassion", definition: "An active, empathetic desire to alleviate the suffering of the disadvantaged, transcending rigid bureaucratic procedures.", example: "Armstrong Pame building the 100km 'People Road' in Manipur using crowd-sourced public assistance." },
  { term: "Objectivity", definition: "Base administrative decisions strictly on empirical evidence, verified data, and constitutional merit, free from bias or prejudice.", example: "CAG audit reports evaluating public fund efficiency purely on factual financial evidence." },
  { term: "Empathy", definition: "The ability to understand and share the feelings of marginalized citizens, viewing public policy from their experiential lens.", example: "S.R. Sankaran dedicating his civil service life to the welfare of bonded laborers and tribal communities." },
];

const ETHICAL_PHILOSOPHERS = [
  { thinker: "Immanuel Kant (Deontology)", corePrinciple: "Categorical Imperative: Act only according to that maxim whereby you can at the same time will that it should become a universal law. Treat humans as ends in themselves, never merely as means.", answerUsage: "Use in corruption cases, whistleblowing, and human dignity dilemmas." },
  { thinker: "Jeremy Bentham & J.S. Mill (Utilitarianism)", corePrinciple: "The greatest happiness of the greatest number. Actions are right in proportion as they tend to promote happiness, wrong as they tend to produce the reverse.", answerUsage: "Use when evaluating infrastructure projects vs displacement, or emergency crisis triage." },
  { thinker: "Mahatma Gandhi (Talisman & Sarvodaya)", corePrinciple: "Recall the face of the poorest and the weakest man whom you may have seen, and ask yourself if the step you contemplate is going to be of any use to him.", answerUsage: "Essential opening hook for welfare schemes, poverty alleviation, and grassroots governance." },
  { thinker: "Aristotle (Virtue Ethics)", corePrinciple: "Golden Mean: Moral behavior is the mean between two extremes—at one end is excess and at the other is deficiency (e.g. Courage between Cowardice and Rashness).", answerUsage: "Use when addressing civil servant discretion and emotional intelligence." },
];

export function EthicsLabView({ cases }: { cases: any[] }) {
  const [activeTab, setActiveTab] = useState<"cases" | "lexicon" | "thinkers">("cases");
  const [selectedCase, setSelectedCase] = useState<any>(cases[0] || null);

  const stakeholders = selectedCase?.stakeholders ? (JSON.parse(selectedCase.stakeholders) as string[]) : [];
  const dilemmas = selectedCase?.ethicalDilemmas ? (JSON.parse(selectedCase.ethicalDilemmas) as string[]) : [];
  const options = selectedCase?.optionsAndCons
    ? (JSON.parse(selectedCase.optionsAndCons) as { option: string; verdict: string }[])
    : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Ethics & Integrity Lab (GS-IV)</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold font-mono">
              4-Step Case Solver
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Systematic administrative reasoning. Dissect ethical dilemmas, map stakeholders, evaluate options, and anchor resolutions in constitutional morality.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab("cases")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "cases" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Case Study Studio
          </button>
          <button
            onClick={() => setActiveTab("lexicon")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "lexicon" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Ethics Lexicon
          </button>
          <button
            onClick={() => setActiveTab("thinkers")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "thinkers" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Thinkers & Administrators
          </button>
        </div>
      </div>

      {/* Tab 1: Case Study Studio */}
      {activeTab === "cases" && selectedCase && (
        <div className="space-y-6">
          {/* Case Scenario Box */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-primary font-bold">{selectedCase.coreTheme}</span>
              <span className="text-muted-foreground">GS-4 Case Study Practice</span>
            </div>
            <h2 className="text-lg font-bold text-foreground">{selectedCase.title}</h2>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-muted/30 p-4 rounded-xl border border-border">
              {selectedCase.scenario}
            </p>
          </div>

          {/* 4-Step Analytical Framework Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1: Stakeholders */}
            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <span className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center font-mono">1</span>
                <span>Stakeholder Matrix</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {stakeholders.map((s, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-muted border border-border text-xs font-semibold text-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Step 2: Ethical Dilemmas */}
            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
                <span className="w-5 h-5 rounded bg-amber-500/20 flex items-center justify-center font-mono">2</span>
                <span>Ethical Dilemmas Involved</span>
              </div>
              <div className="space-y-2 text-xs">
                {dilemmas.map((d, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Options Evaluation */}
            <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3 md:col-span-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <span className="w-5 h-5 rounded bg-primary/20 text-primary flex items-center justify-center font-mono">3</span>
                <span>Options Available & Consequences Analysis</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {options.map((opt, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs space-y-2">
                    <span className="font-bold text-foreground block">Option {idx + 1}: {opt.option}</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed border-t border-border pt-1">
                      <strong>Verdict:</strong> {opt.verdict}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4: Recommended Action & Justification */}
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/30 shadow-sm space-y-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <span className="w-5 h-5 rounded bg-primary text-primary-foreground flex items-center justify-center font-mono">4</span>
                  <span>Optimal Course of Action & Ethical Justification</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">
                  UPSC Model Resolution
                </span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                {selectedCase.bestActionModel}
              </p>
              {selectedCase.quotesToUse && (
                <div className="pt-2 text-xs italic text-primary border-t border-primary/20">
                  Quote to anchor answer: &ldquo;{selectedCase.quotesToUse}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Ethics Lexicon */}
      {activeTab === "lexicon" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ETHICS_LEXICON.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary font-mono">{item.term}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">GS-IV Core</span>
              </div>
              <p className="text-foreground/90 leading-relaxed">{item.definition}</p>
              <div className="pt-2 text-[11px] text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/80">
                <strong>Exemplary Real-World Case:</strong> {item.example}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Thinkers & Philosophers */}
      {activeTab === "thinkers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ETHICAL_PHILOSOPHERS.map((p, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-2.5 text-xs">
              <div className="text-sm font-bold text-foreground">{p.thinker}</div>
              <p className="text-muted-foreground leading-relaxed italic border-l-2 border-primary/50 pl-3">
                &ldquo;{p.corePrinciple}&rdquo;
              </p>
              <div className="pt-1 text-[11px] text-foreground">
                <strong className="text-primary">Where to apply in GS-IV:</strong> {p.answerUsage}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
