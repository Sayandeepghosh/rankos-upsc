"use client";

import React, { useState } from "react";
import {
  Network,
  BookOpen,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Landmark,
  FileText,
  Scale,
  Award,
  X,
  ExternalLink,
} from "lucide-react";

interface GraphNode {
  id: string;
  title: string;
  type: "Topic" | "Article" | "Judgment" | "Committee" | "CurrentAffairs" | "PYQ" | "Thinker";
  x: number;
  y: number;
  description: string;
  connectedTo: string[];
}

const GRAPH_NODES: GraphNode[] = [
  {
    id: "fed",
    title: "Federalism & Governor",
    type: "Topic",
    x: 400,
    y: 260,
    description: "Core GS-2 and PSIR theme covering Centre-State legislative and executive dynamics.",
    connectedTo: ["art163", "art200", "art356", "sarkaria", "punchhi", "bommai", "ca_sc", "pyq_gov", "psir_igp"],
  },
  {
    id: "art163",
    title: "Article 163 (Discretion)",
    type: "Article",
    x: 220,
    y: 120,
    description: "Council of Ministers to aid and advise Governor except where required to act in discretion.",
    connectedTo: ["fed"],
  },
  {
    id: "art200",
    title: "Article 200 (Assent to Bills)",
    type: "Article",
    x: 400,
    y: 90,
    description: "Options available to Governor upon passage of bill: Assent, Withhold, Return, or Reserve.",
    connectedTo: ["fed", "ca_sc"],
  },
  {
    id: "art356",
    title: "Article 356 (President's Rule)",
    type: "Article",
    x: 580,
    y: 120,
    description: "Failure of constitutional machinery in state upon Governor report.",
    connectedTo: ["fed", "bommai"],
  },
  {
    id: "sarkaria",
    title: "Sarkaria Commission (1988)",
    type: "Committee",
    x: 180,
    y: 260,
    description: "Governor should be an eminent person outside state politics; Article 356 used sparingly as measure of last resort.",
    connectedTo: ["fed"],
  },
  {
    id: "punchhi",
    title: "Punchhi Commission (2010)",
    type: "Committee",
    x: 180,
    y: 380,
    description: "Recommended 6-month timeline for Governor to decide on bills and removal only by state assembly impeachment.",
    connectedTo: ["fed"],
  },
  {
    id: "bommai",
    title: "S.R. Bommai v. UOI (1994)",
    type: "Judgment",
    x: 620,
    y: 260,
    description: "Federalism and secularism declared Basic Structure; presidential proclamation under Article 356 subject to judicial review.",
    connectedTo: ["fed", "art356"],
  },
  {
    id: "ca_sc",
    title: "SC 2023 Punjab Ruling",
    type: "CurrentAffairs",
    x: 400,
    y: 430,
    description: "Governor cannot exercise pocket veto; must immediately return reconsidered bill to elected assembly.",
    connectedTo: ["fed", "art200"],
  },
  {
    id: "pyq_gov",
    title: "2023 Mains PYQ #3",
    type: "PYQ",
    x: 620,
    y: 380,
    description: "Examine essential conditions for Governor legislative powers and indefinite delay in assenting to bills.",
    connectedTo: ["fed"],
  },
  {
    id: "psir_igp",
    title: "PSIR: Cooperative Federalism",
    type: "Thinker",
    x: 300,
    y: 400,
    description: "Granville Austin's cooperative federalism concept applied to Indian Government and Politics.",
    connectedTo: ["fed"],
  },
];

export function KnowledgeGraphView() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(GRAPH_NODES[0]);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filteredNodes = GRAPH_NODES.filter((n) => {
    if (filterType !== "ALL" && n.type !== filterType) return false;
    if (search.trim() !== "") {
      return n.title.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const getNodeColor = (type: GraphNode["type"]) => {
    switch (type) {
      case "Topic":
        return "#3b82f6"; // Blue
      case "Article":
        return "#10b981"; // Emerald
      case "Judgment":
        return "#8b5cf6"; // Purple
      case "Committee":
        return "#f59e0b"; // Amber
      case "CurrentAffairs":
        return "#ec4899"; // Pink
      case "PYQ":
        return "#ef4444"; // Red
      case "Thinker":
        return "#06b6d4"; // Cyan
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Interactive Knowledge Graph</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold font-mono">
              Interconnected Semantic Network
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Explore how Constitutional Articles, Judicial Precedents, Commissions, and Current Affairs link to static syllabus nodes.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Topic</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Article</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Judgment</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Committee</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Current Affairs</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> PYQ</span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Graph Canvas (Left 8 Cols) */}
        <div className="lg:col-span-8 p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-center justify-center relative min-h-[500px] overflow-hidden">
          <svg className="w-full h-[480px]" viewBox="0 0 800 500">
            {/* Edges */}
            {GRAPH_NODES.map((node) =>
              node.connectedTo.map((targetId) => {
                const target = GRAPH_NODES.find((n) => n.id === targetId);
                if (!target) return null;
                const isHighlighted =
                  selectedNode?.id === node.id || selectedNode?.id === target.id;
                return (
                  <line
                    key={`${node.id}-${target.id}`}
                    x1={node.x}
                    y1={node.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={isHighlighted ? "#3b82f6" : "hsl(var(--border))"}
                    strokeWidth={isHighlighted ? 2.5 : 1.2}
                    strokeDasharray={node.type === "CurrentAffairs" ? "4 4" : "none"}
                    opacity={isHighlighted ? 0.9 : 0.4}
                  />
                );
              })
            )}

            {/* Nodes */}
            {GRAPH_NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const color = getNodeColor(node.type);

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.type === "Topic" ? 28 : 20}
                    fill={color}
                    fillOpacity={isSelected ? 0.95 : 0.8}
                    stroke={isSelected ? "#ffffff" : color}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                  <text
                    x={node.x}
                    y={node.y + (node.type === "Topic" ? 40 : 32)}
                    textAnchor="middle"
                    fill="currentColor"
                    className="text-[11px] font-bold select-none"
                  >
                    {node.title.split("(")[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-3 left-3 text-[10px] font-mono text-muted-foreground bg-muted/60 px-2 py-1 rounded border border-border">
            Click any node to inspect semantic linkages and references
          </div>
        </div>

        {/* Node Detail Dossier (Right 4 Cols) */}
        {selectedNode && (
          <div className="lg:col-span-4 p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span
                className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                style={{
                  backgroundColor: `${getNodeColor(selectedNode.type)}20`,
                  color: getNodeColor(selectedNode.type),
                }}
              >
                {selectedNode.type}
              </span>
              <span className="text-xs text-muted-foreground font-mono">Semantic Anchor</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-foreground">{selectedNode.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            {/* Connected Links */}
            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-xs font-bold text-foreground block">
                Connected Nodes in Knowledge Web ({selectedNode.connectedTo.length}):
              </span>
              <div className="space-y-1.5">
                {selectedNode.connectedTo.map((tid) => {
                  const target = GRAPH_NODES.find((n) => n.id === tid);
                  if (!target) return null;
                  return (
                    <button
                      key={tid}
                      onClick={() => setSelectedNode(target)}
                      className="w-full p-2 rounded-xl bg-muted/40 hover:bg-muted/70 text-left text-xs text-foreground flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: getNodeColor(target.type) }}
                        />
                        <span className="truncate">{target.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">Jump ?</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
