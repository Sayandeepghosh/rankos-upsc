"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Search,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Award,
  Filter,
  Eye,
  X,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { LIFECYCLE_STAGES } from "@/lib/mastery/calculator";

export function SyllabusTreeView({ papers }: { papers: any[] }) {
  const [selectedPaperCode, setSelectedPaperCode] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"tree" | "heatmap">("tree");
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "GS2-POL-PARL": true,
    "GS2-POL-FED": true,
    "GS3-ENV-BIO": true,
    "PSIR1A-WPT": true,
  });
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const filteredPapers = papers.filter((p) => {
    if (selectedPaperCode !== "ALL" && p.code !== selectedPaperCode) return false;
    return true;
  });

  // Collect all topic nodes for heatmap view
  const allTopicNodes: any[] = [];
  papers.forEach((p) => {
    p.syllabusNodes.forEach((n: any) => {
      if (n.nodeType === "Topic" || n.nodeType === "Unit") {
        allTopicNodes.push({ ...n, paperCode: p.code });
      }
    });
  });

  const getMasteryColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500 text-white border-emerald-600";
    if (score >= 65) return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40";
    if (score >= 45) return "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40";
    return "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/40";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Syllabus Knowledge Tree</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold font-mono">
              13-Stage Lifecycle OS
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Hierarchical mapping of UPSC Prelims, Mains GS I–IV, CSAT, and PSIR Optional. Track retention decay, mastery scores, and lifecycle stages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
            <button
              onClick={() => setViewMode("tree")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "tree" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Hierarchical Tree
            </button>
            <button
              onClick={() => setViewMode("heatmap")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "heatmap" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Mastery Heatmap
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedPaperCode("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedPaperCode === "ALL" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All Papers
          </button>
          {papers.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPaperCode(p.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedPaperCode === p.code ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.code}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter syllabus nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-muted/60 border border-border text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* View 1: Mastery Heatmap Grid */}
      {viewMode === "heatmap" ? (
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Visual Mastery Heatmap Matrix
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" /> &gt;80% Exam Ready
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500" /> 65-80% Consolidated
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500" /> 45-65% Revision Needed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500/30 border border-rose-500" /> &lt;45% Weak / Unstarted
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {allTopicNodes.map((node) => {
              const prog = node.progress?.[0];
              const score = prog?.masteryScore || 0;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedTopic(node)}
                  className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] ${getMasteryColor(score)}`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono opacity-80 mb-1">
                    <span>{node.paperCode}</span>
                    <span className="font-bold">{score.toFixed(0)}%</span>
                  </div>
                  <div className="text-xs font-bold truncate">{node.title}</div>
                  <div className="text-[10px] opacity-75 mt-1 truncate">
                    {prog?.stageName || "Not Started"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* View 2: Hierarchical Tree */
        <div className="space-y-4">
          {filteredPapers.map((paper) => {
            // Find root units (parentId == null)
            const rootUnits = paper.syllabusNodes.filter((n: any) => !n.parentId);

            if (rootUnits.length === 0) return null;

            return (
              <div key={paper.id} className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-primary text-primary-foreground font-mono font-bold text-xs">
                      {paper.code}
                    </span>
                    <h2 className="text-sm font-bold text-foreground">{paper.title}</h2>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {rootUnits.length} Units Mapped
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {rootUnits.map((unit: any) => {
                    const isExpanded = expandedNodes[unit.id] || expandedNodes[unit.code];
                    const childTopics = paper.syllabusNodes.filter((n: any) => n.parentId === unit.id);
                    const unitProgress = unit.progress?.[0];

                    return (
                      <div key={unit.id} className="border border-border/80 rounded-xl overflow-hidden bg-muted/20">
                        {/* Unit Row */}
                        <div
                          onClick={() => toggleExpand(unit.id)}
                          className="p-3 bg-muted/40 hover:bg-muted/70 flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            {childTopics.length > 0 ? (
                              isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              )
                            ) : (
                              <span className="w-4" />
                            )}
                            <div>
                              <div className="text-xs font-bold text-foreground flex items-center gap-2">
                                <span>{unit.title}</span>
                                {unit.code && (
                                  <span className="text-[10px] font-mono text-muted-foreground">
                                    [{unit.code}]
                                  </span>
                                )}
                              </div>
                              {unit.description && (
                                <div className="text-[11px] text-muted-foreground mt-0.5">
                                  {unit.description}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                              {unit.pyqFrequency} PYQs
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTopic(unit);
                              }}
                              className="p-1 rounded text-muted-foreground hover:text-foreground"
                              title="Inspect Node Lifecycle"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Child Topics */}
                        {isExpanded && childTopics.length > 0 && (
                          <div className="p-2 space-y-2 bg-card/60 pl-8 border-t border-border">
                            {childTopics.map((topic: any) => {
                              const prog = topic.progress?.[0];
                              const score = prog?.masteryScore || 0;
                              const isWeak = prog?.lifecycleStage === 10;

                              return (
                                <div
                                  key={topic.id}
                                  onClick={() => setSelectedTopic(topic)}
                                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                    isWeak
                                      ? "bg-rose-500/5 border-rose-500/30 hover:border-rose-500/60"
                                      : "bg-card border-border hover:border-primary/40 hover:shadow-sm"
                                  }`}
                                >
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-foreground truncate">
                                        {topic.title}
                                      </span>
                                      <span
                                        className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                          isWeak
                                            ? "bg-rose-500/20 text-rose-500"
                                            : "bg-primary/10 text-primary"
                                        }`}
                                      >
                                        Stage {prog?.lifecycleStage || 1}: {prog?.stageName || "Not Started"}
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                                      <span>Recall: {prog?.recallScore || 0}%</span>
                                      <span>•</span>
                                      <span>MCQ Accuracy: {prog?.accuracy || 0}%</span>
                                      <span>•</span>
                                      <span>Mains Score: {prog?.answerScore || 0}%</span>
                                      <span>•</span>
                                      <span>PYQs: {prog?.pyqsAttempted || 0} attempted</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 shrink-0">
                                    <div className="text-right">
                                      <div className="text-sm font-extrabold font-mono text-foreground">
                                        {score.toFixed(1)}%
                                      </div>
                                      <div className="text-[10px] text-muted-foreground">Mastery</div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Topic Lifecycle Detail Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-primary font-bold">
                  {selectedTopic.code || "Syllabus Topic"}
                </span>
                <h3 className="text-lg font-bold text-foreground">{selectedTopic.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedTopic.description}</p>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 13-Stage Lifecycle Flow */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>13-Stage Lifecycle Progression</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 text-xs">
                {LIFECYCLE_STAGES.map((s) => {
                  const currentStage = selectedTopic.progress?.[0]?.lifecycleStage || 1;
                  const isCurrent = s.stage === currentStage;
                  const isDone = s.stage < currentStage;

                  return (
                    <div
                      key={s.stage}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        isCurrent
                          ? "bg-primary text-primary-foreground border-primary font-bold shadow-sm"
                          : isDone
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold"
                          : "bg-muted/30 border-border text-muted-foreground opacity-60"
                      }`}
                    >
                      <div className="text-[10px] font-mono">Stage {s.stage}</div>
                      <div className="truncate text-[11px]">{s.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weighted Mastery Formula Breakdown */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
              <div className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Weighted Mastery Calculation</span>
                <span className="font-mono text-primary text-sm font-extrabold">
                  {selectedTopic.progress?.[0]?.masteryScore?.toFixed(1) || 0}%
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-card border border-border">
                  <div className="text-[10px] text-muted-foreground">Recall (25%)</div>
                  <div className="font-mono font-bold mt-1">{selectedTopic.progress?.[0]?.recallScore || 0}%</div>
                </div>
                <div className="p-2 rounded-lg bg-card border border-border">
                  <div className="text-[10px] text-muted-foreground">MCQ Testing (25%)</div>
                  <div className="font-mono font-bold mt-1">{selectedTopic.progress?.[0]?.accuracy || 0}%</div>
                </div>
                <div className="p-2 rounded-lg bg-card border border-border">
                  <div className="text-[10px] text-muted-foreground">Answer Writing (20%)</div>
                  <div className="font-mono font-bold mt-1">{selectedTopic.progress?.[0]?.answerScore || 0}%</div>
                </div>
                <div className="p-2 rounded-lg bg-card border border-border">
                  <div className="text-[10px] text-muted-foreground">Revision Health (15%)</div>
                  <div className="font-mono font-bold mt-1">{selectedTopic.progress?.[0]?.revisionHealth || 0}%</div>
                </div>
                <div className="p-2 rounded-lg bg-card border border-border">
                  <div className="text-[10px] text-muted-foreground">PYQ Score (15%)</div>
                  <div className="font-mono font-bold mt-1">{selectedTopic.progress?.[0]?.pyqPerformance || 0}%</div>
                </div>
              </div>
            </div>

            {/* Direct Action Hub */}
            <div className="pt-2 border-t border-border flex flex-wrap items-center justify-end gap-2">
              <Link
                href={`/prelims?topicId=${selectedTopic.id}`}
                className="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 border border-border text-xs font-semibold text-foreground flex items-center gap-1.5"
              >
                <span>MCQ Drill</span>
              </Link>
              <Link
                href={`/pyq?topicId=${selectedTopic.id}`}
                className="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 border border-border text-xs font-semibold text-foreground flex items-center gap-1.5"
              >
                <span>Practice PYQs</span>
              </Link>
              <Link
                href={`/mains/write?topicId=${selectedTopic.id}`}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5"
              >
                <span>Write Mains Answer</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
