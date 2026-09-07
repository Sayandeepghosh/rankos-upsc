"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useViewMode } from "@/components/providers/ViewModeContext";
import {
  LayoutDashboard,
  Sun,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileText,
  Landmark,
  Globe2,
  RotateCcw,
  History,
  Award,
  PenTool,
  Sparkles,
  Scale,
  AlertTriangle,
  Network,
  BarChart3,
  Bookmark,
  Settings,
  Flame,
  Brain,
  SlidersHorizontal,
  ChevronDown,
  Check,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

export const SIMPLE_NAV_ITEMS: NavItem[] = [
  { label: "Today's Focus", href: "/", icon: Sun, badge: "Today's 3 Steps" },
  { label: "Syllabus Progress", href: "/syllabus", icon: BookOpen },
  { label: "Prelims Practice", href: "/prelims", icon: CheckCircle2, badge: "Daily MCQs" },
  { label: "Mains Practice", href: "/mains", icon: FileText, badge: "10-Marker" },
  { label: "Revision Deck", href: "/revision", icon: RotateCcw, badge: "3 due", badgeColor: "bg-amber-500/20 text-amber-500" },
  { label: "My Readiness", href: "/analytics", icon: BarChart3 },
];

export const PRO_NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "Daily Operations",
    items: [
      { label: "Command Center", href: "/", icon: LayoutDashboard },
      { label: "Today Mission", href: "/today", icon: Sun, badge: "6 tasks" },
      { label: "Smart Planner", href: "/planner", icon: Calendar },
    ],
  },
  {
    title: "Exam Labs",
    items: [
      { label: "Prelims Engine", href: "/prelims", icon: CheckCircle2 },
      { label: "Mains Lab", href: "/mains", icon: FileText },
      { label: "Answer Writing", href: "/mains/write", icon: PenTool },
      { label: "Optional - PSIR", href: "/psir", icon: Landmark },
      { label: "PYQ Intelligence", href: "/pyq", icon: History },
      { label: "Mock War Room", href: "/tests", icon: Award },
      { label: "Essay Lab", href: "/essay", icon: Sparkles },
      { label: "Ethics / GS-IV Lab", href: "/ethics", icon: Scale },
    ],
  },
  {
    title: "Retention & Intelligence",
    items: [
      { label: "Syllabus Tree", href: "/syllabus", icon: BookOpen },
      { label: "Spaced Revision", href: "/revision", icon: RotateCcw, badge: "3 due", badgeColor: "bg-amber-500/20 text-amber-500" },
      { label: "Mistake Vault", href: "/mistakes", icon: AlertTriangle, badge: "2 alerts", badgeColor: "bg-rose-500/20 text-rose-500" },
      { label: "Current Affairs", href: "/current-affairs", icon: Globe2 },
      { label: "Knowledge Graph", href: "/knowledge-graph", icon: Network },
      { label: "Analytics & Trajectory", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Resource Library", href: "/resources", icon: Bookmark },
      { label: "Settings & Profile", href: "/settings", icon: Settings },
    ],
  },
];

// Flat export for compatibility with existing imports
export const NAV_ITEMS = PRO_NAV_SECTIONS.flatMap((s) => s.items);

export function Sidebar({ onOpenMentor }: { onOpenMentor?: () => void }) {
  const pathname = usePathname();
  const { isSimpleMode, toggleSimpleMode } = useViewMode();

  return (
    <aside className="w-64 border-r border-border bg-card/60 backdrop-blur-xl flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-primary shadow-sm shadow-primary/20">
            R
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight flex items-center gap-1.5 text-foreground">
              RankOS
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 font-semibold">
                UPSC CSE
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">Target: 2027 • AIR 1</div>
          </div>
        </Link>
      </div>

      {/* Mode Switcher Pill */}
      <div className="px-3 pt-3">
        <div className="p-1 rounded-xl bg-muted/60 border border-border flex items-center gap-1">
          <button
            onClick={() => isSimpleMode || toggleSimpleMode()}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              isSimpleMode
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple</span>
          </button>
          <button
            onClick={() => !isSimpleMode || toggleSimpleMode()}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              !isSimpleMode
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Pro Cockpit</span>
          </button>
        </div>
      </div>

      {/* Target Countdown Pill */}
      <div className="px-3 pt-2">
        <div className="p-2 rounded-xl bg-muted/30 border border-border flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-semibold text-foreground">Prelims 2027</span>
          </div>
          <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
            623 Days
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {isSimpleMode ? (
          // Simple Mode Navigation (Clean & uncluttered)
          <div className="space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-2 mb-1">
              Essential Focus
            </div>
            {SIMPLE_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono shrink-0 ${
                        isActive
                          ? "bg-white/20 text-white"
                          : item.badgeColor || "bg-muted text-foreground"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Quick Switch to Pro View button */}
            <div className="pt-4 px-1">
              <button
                onClick={toggleSimpleMode}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-muted/40 hover:bg-muted border border-border/80 text-xs text-muted-foreground hover:text-foreground transition-all group"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium">Need all 18 tools?</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-background border border-border text-primary font-semibold">
                  Open Pro
                </span>
              </button>
            </div>
          </div>
        ) : (
          // Pro Mode Navigation (Organized into categorized sections)
          <div className="space-y-4">
            {PRO_NAV_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-0.5">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-2 mb-1">
                  {section.title}
                </div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href || pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30 font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? "text-primary-foreground" : "text-muted-foreground"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono shrink-0 ${
                            isActive
                              ? "bg-white/20 text-white"
                              : item.badgeColor || "bg-muted text-foreground"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}

            {/* Switch back to Simple Mode */}
            <div className="pt-2 px-1">
              <button
                onClick={toggleSimpleMode}
                className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl bg-primary/10 hover:bg-primary/15 border border-primary/30 text-xs text-primary font-medium transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Switch to Simple Focus Mode</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* AI Mentor Quick Launch Footer */}
      <div className="p-3 border-t border-border bg-muted/20">
        <button
          onClick={onOpenMentor}
          className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-primary/15 via-accent/20 to-primary/15 hover:from-primary/25 hover:to-primary/25 border border-primary/30 text-xs font-semibold text-primary flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Brain className="w-4 h-4" />
          <span>Ask AI Mentor</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/20 border border-primary/30">
            Cmd+J
          </span>
        </button>
      </div>
    </aside>
  );
}
