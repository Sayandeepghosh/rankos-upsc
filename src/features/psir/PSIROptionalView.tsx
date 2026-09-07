"use client";

import React, { useState } from "react";
import {
  Landmark,
  BookOpen,
  Quote as QuoteIcon,
  Columns,
  Search,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  Layers,
  Award,
  Globe2,
} from "lucide-react";

interface ThinkerComparison {
  title: string;
  theme: string;
  thinkerA: string;
  thinkerB: string;
  aspects: { dimension: string; aView: string; bView: string }[];
}

const COMPARISONS: ThinkerComparison[] = [
  {
    title: "Plato vs Aristotle: Idealism vs Realism",
    theme: "Nature of the State, Forms, and Governance",
    thinkerA: "Plato",
    thinkerB: "Aristotle",
    aspects: [
      { dimension: "Epistemology & Reality", aView: "Reality is a shadow of transcendental ideas (Forms). Only philosopher kings can perceive true reality.", bView: "Reality is immanent in material substance (Form + Matter). Empirical observation of 158 constitutions." },
      { dimension: "Ideal State vs Best Practicable State", aView: "Ideal Republic ruled by Philosopher King with communism of property and family.", bView: "Polity (Rule of Middle Class). Golden mean; constitutional rule of law over men." },
      { dimension: "Private Property & Family", aView: "Abolishes property and nuclear family for ruling classes to prevent nepotism and corruption.", bView: "Private property provides moral motivation and hospitality; family is natural foundation of polis." },
      { dimension: "Rule of Law", aView: "Knowledge is above law; Philosopher King cannot be constrained by rigid statutes.", bView: "Law is reason free from passion; even the wisest ruler is susceptible to human emotion." },
    ],
  },
  {
    title: "Rawls vs Nozick: Egalitarianism vs Libertarianism",
    theme: "Social Justice, Distribution, and the Role of the State",
    thinkerA: "John Rawls",
    thinkerB: "Robert Nozick",
    aspects: [
      { dimension: "Core Theory of Justice", aView: "Justice as Fairness: Inequalities permitted only if they maximize benefit to the least advantaged (Difference Principle).", bView: "Entitlement Theory: A distribution is just if arrived at through just original acquisition and just voluntary transfer." },
      { dimension: "Nature of the State", aView: "Enabling welfare state providing equal basic liberties and fair equality of opportunity.", bView: "Minimal State (Night-Watchman): strictly limited to protection against force, theft, and enforcement of contracts." },
      { dimension: "Taxation & Redistribution", aView: "Taxation on natural talents is fair because initial genetic/social advantages are morally arbitrary.", bView: "Taxation of earnings from labor is on a par with forced labor; violates self-ownership (Wilt Chamberlain example)." },
    ],
  },
  {
    title: "Realism vs Liberalism in International Relations",
    theme: "Global Order, Power Politics, and Cooperation",
    thinkerA: "Classical Realism (Morgenthau)",
    thinkerB: "Liberal Institutionalism (Keohane/Nye)",
    aspects: [
      { dimension: "State of Global System", aView: "Anarchic system where states operate under security dilemma; power maximization is primary motive.", bView: "Complex interdependence where international institutions mitigate anarchy and reduce transaction costs." },
      { dimension: "Possibility of Peace", aView: "Peace maintained only through precarious Balance of Power (deterrence and alliances).", bView: "Democratic Peace Theory and institutional rules foster sustainable multilateral cooperation and positive-sum gains." },
    ],
  },
];

export function PSIROptionalView({
  thinkers,
  quotes,
}: {
  thinkers: any[];
  quotes: any[];
}) {
  const [activeTab, setActiveTab] = useState<"thinkers" | "comparisons" | "quotes" | "scholars">("thinkers");
  const [selectedThinker, setSelectedThinker] = useState<any | null>(thinkers[0] || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyQuote = (quoteText: string, id: string) => {
    navigator.clipboard.writeText(quoteText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">PSIR Optional Command Suite</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold font-mono">
              Paper I & II Architecture
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Political Theory, Western Thinkers, Indian Government, Comparative Politics & International Relations with scholar citations and comparative frameworks.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-muted p-1 rounded-xl border border-border overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("thinkers")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "thinkers" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Thinker Profiles
          </button>
          <button
            onClick={() => setActiveTab("comparisons")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "comparisons" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Comparison Matrix
          </button>
          <button
            onClick={() => setActiveTab("quotes")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "quotes" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Quotation Bank
          </button>
          <button
            onClick={() => setActiveTab("scholars")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "scholars" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Scholar Bank
          </button>
        </div>
      </div>

      {/* Tab 1: Thinker Profiles */}
      {activeTab === "thinkers" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Thinker List */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1 mb-2">
              Philosophers & Theorists
            </div>
            {thinkers.map((t) => {
              const isSelected = selectedThinker?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedThinker(t)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary/10 border-primary shadow-sm"
                      : "bg-card border-border hover:border-primary/40 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">{t.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                      {t.school}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    Works: {t.importantWorks}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-primary font-medium">
                    <span>{t.era}</span>
                    <span>Inspect ?</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Thinker Detailed Dossier */}
          {selectedThinker && (
            <div className="lg:col-span-8 space-y-4">
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-5">
                <div className="flex items-start justify-between border-b border-border pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-foreground">{selectedThinker.name}</h2>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {selectedThinker.school}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{selectedThinker.era}</div>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">PSIR Paper 1A</span>
                </div>

                {/* Major Works & Core Concepts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
                    <span className="font-bold text-foreground block">Key Works:</span>
                    <p className="text-muted-foreground">{selectedThinker.importantWorks}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
                    <span className="font-bold text-foreground block">Core Concepts:</span>
                    <p className="text-muted-foreground">{selectedThinker.coreConcepts}</p>
                  </div>
                </div>

                {/* Famous Arguments */}
                <div className="p-4 rounded-xl bg-muted/30 border border-border text-xs space-y-1.5">
                  <strong className="text-foreground flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    <span>Central Theoretical Arguments:</span>
                  </strong>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedThinker.famousArguments}
                  </p>
                </div>

                {/* Scholarly Interpretations */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs space-y-1.5">
                  <strong className="text-primary flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Scholarly Interpretations (Must Quote in Answers):</span>
                  </strong>
                  <p className="text-foreground/90 leading-relaxed font-mono text-[11px]">
                    {selectedThinker.scholarlyViews}
                  </p>
                </div>

                {/* Criticisms & Contemporary Application */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1">
                    <span className="font-bold text-rose-600 dark:text-rose-400 block">Major Critiques:</span>
                    <p className="text-muted-foreground leading-relaxed">{selectedThinker.criticisms}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Contemporary Application:</span>
                    <p className="text-muted-foreground leading-relaxed">{selectedThinker.contemporaryUsage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Comparison Matrices */}
      {activeTab === "comparisons" && (
        <div className="space-y-6">
          {COMPARISONS.map((comp, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-base font-bold text-foreground">{comp.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{comp.theme}</p>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                  Comparison Matrix
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="p-3 font-bold w-1/4">Philosophical Dimension</th>
                      <th className="p-3 font-bold w-3/8 text-primary">{comp.thinkerA}</th>
                      <th className="p-3 font-bold w-3/8 text-emerald-500">{comp.thinkerB}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {comp.aspects.map((asp, i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="p-3 font-semibold text-foreground align-top">{asp.dimension}</td>
                        <td className="p-3 text-muted-foreground leading-relaxed align-top">{asp.aView}</td>
                        <td className="p-3 text-muted-foreground leading-relaxed align-top">{asp.bView}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: PSIR Quotation Bank */}
      {activeTab === "quotes" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              High-Impact Answer Quotes (One-Click Copy to Answer Sheet)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quotes.map((q) => (
              <div key={q.id} className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">{q.author}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    {q.theme}
                  </span>
                </div>

                <blockquote className="text-xs italic text-foreground leading-relaxed border-l-2 border-primary pl-3">
                  &ldquo;{q.quoteText}&rdquo;
                </blockquote>

                {q.usageContext && (
                  <div className="text-[11px] text-muted-foreground bg-muted/40 p-2 rounded-lg">
                    <strong>Answer-Writing Usage:</strong> {q.usageContext}
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleCopyQuote(q.quoteText, q.id)}
                    className="px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 text-xs font-semibold text-foreground flex items-center gap-1.5 transition-colors"
                  >
                    {copiedId === q.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Copy Quote</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Scholar Bank */}
      {activeTab === "scholars" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { scholar: "Ernest Barker", field: "Classical Greek Political Theory", quote: "Plato is the father of political idealism; Aristotle is the embodiment of common sense and constitutional conservatism.", usage: "Contrast the utopian nature of Republic with the practical wisdom of Politics." },
            { scholar: "Karl Popper", field: "Critique of Totalitarianism (The Open Society and Its Enemies)", quote: "Plato's political programme is pure totalitarianism; he sacrifices freedom for tribal stability.", usage: "Essential counter-argument when evaluating Plato's Philosopher King." },
            { scholar: "C.B. Macpherson", field: "Political Theory of Possessive Individualism", quote: "Hobbes and Locke reflect the seventeenth-century market society, reducing man to an owner of his capacities.", usage: "Marxist critique of liberal social contract theorists." },
            { scholar: "Amartya Sen", field: "The Idea of Justice (Niti vs Nyaya)", quote: "Justice is not merely about perfectly just institutions (Niti), but about realized elimination of manifest injustices (Nyaya).", usage: "Critique of John Rawls' transcendental institutionalism." },
          ].map((s, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground">{s.scholar}</span>
                <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {s.field}
                </span>
              </div>
              <p className="italic text-muted-foreground border-l-2 border-primary/50 pl-2 leading-relaxed">
                &quot;{s.quote}&quot;
              </p>
              <div className="pt-2 text-[11px] text-foreground/80">
                <strong>How to Cite:</strong> {s.usage}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
