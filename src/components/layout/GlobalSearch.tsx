"use client";

import React, { useState, useEffect } from "react";
import { Search, X, BookOpen, UserCheck, AlertTriangle, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SearchResult {
  category: "Syllabus" | "Thinker" | "PYQ" | "Mistake" | "Current Affairs";
  title: string;
  subtitle: string;
  href: string;
}

const SEARCH_ITEMS: SearchResult[] = [
  { category: "Syllabus", title: "Parliamentary Committees & Executive Accountability", subtitle: "GS-2 • Polity • High Importance", href: "/syllabus" },
  { category: "Syllabus", title: "Governor Discretionary Powers & Article 200/356", subtitle: "GS-2 • Federalism", href: "/syllabus" },
  { category: "Syllabus", title: "Wildlife Protection Act 1972 & 2022 Amendments", subtitle: "GS-3 • Environment & CITES", href: "/syllabus" },
  { category: "Thinker", title: "Plato: Theory of Ideas & Philosopher King", subtitle: "PSIR Paper 1A • Ancient Greece", href: "/psir" },
  { category: "Thinker", title: "John Rawls: Justice as Fairness & Difference Principle", subtitle: "PSIR Paper 1A • Egalitarian Liberalism", href: "/psir" },
  { category: "Thinker", title: "Robert Nozick: Entitlement Theory & Minimal State", subtitle: "PSIR Paper 1A • Libertarianism", href: "/psir" },
  { category: "PYQ", title: "2021 GS-1: Committee on Subordinate Legislation", subtitle: "Prelims PYQ • Question #42", href: "/pyq" },
  { category: "PYQ", title: "2023 GS-2: Essential conditions for Governor legislative powers", subtitle: "Mains PYQ • 10 Marks", href: "/pyq" },
  { category: "Mistake", title: "WPA 2022 schedule reduction details (Knowledge gap)", subtitle: "Environment • Review Due", href: "/mistakes" },
  { category: "Current Affairs", title: "Supreme Court Clarifies Governor Powers on Withholding Assent", subtitle: "Polity • Article 200", href: "/current-affairs" },
];

export function GlobalSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filtered = query.trim() === ""
    ? SEARCH_ITEMS.slice(0, 6)
    : SEARCH_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-border flex items-center gap-3">
          <Search className="w-5 h-5 text-muted-foreground ml-1" />
          <input
            autoFocus
            type="text"
            placeholder="Search syllabus, thinkers, PYQs, mistakes, current affairs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground/60"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] bg-muted border border-border px-1.5 py-0.5 rounded font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No matching resources found for &quot;{query}&quot;. Try searching for &quot;Polity&quot;, &quot;Plato&quot;, or &quot;Rawls&quot;.
            </div>
          ) : (
            filtered.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/70 transition-colors group"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    {item.category === "Syllabus" && <BookOpen className="w-3.5 h-3.5" />}
                    {item.category === "Thinker" && <UserCheck className="w-3.5 h-3.5" />}
                    {item.category === "PYQ" && <FileText className="w-3.5 h-3.5" />}
                    {item.category === "Mistake" && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                    {item.category === "Current Affairs" && <BookOpen className="w-3.5 h-3.5" />}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">{item.subtitle}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    {item.category}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-border bg-muted/30 text-[11px] text-muted-foreground flex items-center justify-between">
          <span>Navigate with arrows • Press enter to jump</span>
          <span className="font-mono">RankOS Intelligence Index</span>
        </div>
      </div>
    </div>
  );
}
