"use client";

import React, { useState } from "react";
import {
  Globe2,
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Link as LinkIcon,
  RotateCcw,
  Clock,
  ArrowRight,
  ExternalLink,
  Plus,
  X,
  Check,
} from "lucide-react";

export function CurrentAffairsView({
  currentAffairs: initialCA,
  syllabusNodes,
}: {
  currentAffairs: any[];
  syllabusNodes: any[];
}) {
  const [caList, setCaList] = useState(initialCA);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [mappingModalCA, setMappingModalCA] = useState<any | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState(syllabusNodes[0]?.id || "");
  const [mappingSuccess, setMappingSuccess] = useState(false);

  const categories = [
    "ALL",
    "Polity",
    "Governance",
    "IR",
    "Economy",
    "Environment",
    "Security",
    "Ethics",
  ];

  const filtered = caList.filter((item) => {
    if (selectedCategory !== "ALL" && item.category !== selectedCategory) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.keywords?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApproveMapping = async () => {
    if (!mappingModalCA || !selectedNodeId) return;

    try {
      const res = await fetch("/api/current-affairs/map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caId: mappingModalCA.id,
          nodeId: selectedNodeId,
          approvedBy: "User_Approved",
        }),
      });

      if (res.ok) {
        const node = syllabusNodes.find((n) => n.id === selectedNodeId);
        setCaList((prev) =>
          prev.map((item) =>
            item.id === mappingModalCA.id
              ? {
                  ...item,
                  topicLinks: [
                    ...item.topicLinks,
                    { id: "new-link", node, approvedBy: "User_Approved" },
                  ],
                }
              : item
          )
        );
        setMappingSuccess(true);
        setTimeout(() => {
          setMappingSuccess(false);
          setMappingModalCA(null);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Current Affairs & Static Mapper</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold font-mono">
              360° Syllabus Integration
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Transform isolated news articles into integrated static-dynamic answer value additions across Prelims, Mains, and Optional.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search news, articles, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-muted/60 border border-border text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Current Affairs Cards Feed */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item.id} className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {item.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.source}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.publishDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-foreground mt-1">{item.title}</h2>
              </div>

              <button
                onClick={() => setMappingModalCA(item)}
                className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground border border-border text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <LinkIcon className="w-3.5 h-3.5 text-primary" />
                <span>Map to Syllabus</span>
              </button>
            </div>

            {/* Core Summary & Context */}
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
              {item.summary}
            </p>

            {/* 4-Dimensional Angles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {item.prelimsAngle && (
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                  <strong className="text-primary block font-bold">Prelims Angle:</strong>
                  <p className="text-muted-foreground leading-relaxed">{item.prelimsAngle}</p>
                </div>
              )}

              {item.mainsAngle && (
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                  <strong className="text-emerald-600 dark:text-emerald-400 block font-bold">Mains Angle:</strong>
                  <p className="text-muted-foreground leading-relaxed">{item.mainsAngle}</p>
                </div>
              )}

              {item.psirAngle && (
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                  <strong className="text-amber-600 dark:text-amber-400 block font-bold">PSIR Angle:</strong>
                  <p className="text-muted-foreground leading-relaxed">{item.psirAngle}</p>
                </div>
              )}

              {item.articlesReferenced && (
                <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                  <strong className="text-foreground block font-bold">Articles / Institutions:</strong>
                  <div className="text-muted-foreground font-mono text-[11px]">
                    {item.articlesReferenced} • {item.institutions}
                  </div>
                </div>
              )}
            </div>

            {/* Active Static Linkages */}
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-semibold">Static Syllabus Links:</span>
                {item.topicLinks?.length > 0 ? (
                  item.topicLinks.map((tl: any) => (
                    <span
                      key={tl.id}
                      className="px-2 py-0.5 rounded bg-muted text-foreground border border-border font-mono text-[11px] flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{tl.node?.title || "Syllabus Node"}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground text-[11px] italic">Not mapped yet</span>
                )}
              </div>

              <span className="text-[10px] font-mono text-muted-foreground">
                Keywords: {item.keywords}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Map to Syllabus Modal */}
      {mappingModalCA && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>AI Static Syllabus Mapper</span>
              </h3>
              <button
                onClick={() => setMappingModalCA(null)}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Select the corresponding syllabus node to anchor &quot;{mappingModalCA.title}&quot; permanently into your revision deck and knowledge graph.
            </p>

            <div className="space-y-2 text-xs">
              <label className="font-semibold text-foreground block">Target Syllabus Node</label>
              <select
                value={selectedNodeId}
                onChange={(e) => setSelectedNodeId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-muted border border-border text-foreground outline-none text-xs"
              >
                {syllabusNodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.code || n.title} — {n.title}
                  </option>
                ))}
              </select>
            </div>

            {mappingSuccess && (
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Successfully linked to static syllabus!</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setMappingModalCA(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveMapping}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
              >
                Approve Linkage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
