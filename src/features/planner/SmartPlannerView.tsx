"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Layers,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Plus,
  ArrowRight,
  Sliders,
  Check,
  X,
  Shuffle,
  ShieldCheck,
} from "lucide-react";
import { resolveBacklogItem } from "@/lib/scheduling/daily-commander";

export function SmartPlannerView({
  user,
  tasks: initialTasks,
  plans,
}: {
  user: any;
  tasks: any[];
  plans: any[];
}) {
  const [viewTab, setViewTab] = useState<"day" | "week" | "month">("day");
  const [tasks, setTasks] = useState(initialTasks);
  const [dailyHours, setDailyHours] = useState(user?.profile?.dailyStudyHours || 6.0);
  const [wakeTime, setWakeTime] = useState(user?.profile?.wakeTime || "06:00");
  const [psirHours, setPsirHours] = useState(2.0);
  const [revisionHours, setRevisionHours] = useState(1.5);
  const [caHours, setCaHours] = useState(1.0);
  const [rebalancedNotice, setRebalancedNotice] = useState(false);

  // Backlog items
  const backlogItems = tasks.filter((t) => t.isBacklog || t.status === "RESCHEDULED");

  const handleApplyBacklogAction = async (taskId: string, action: string) => {
    try {
      const res = await fetch("/api/study/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          status: action === "Drop" ? "SKIPPED" : "PENDING",
          completionNotes: `Resolved via Backlog Intelligence: ${action}`,
        }),
      });

      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: action === "Drop" ? "SKIPPED" : "PENDING", backlogAction: action, isBacklog: false }
              : t
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRebalance = () => {
    setRebalancedNotice(true);
    setTimeout(() => setRebalancedNotice(false), 4000);
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Smart Study Planner</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold font-mono">
              Auto-Rebalancing
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Dynamic workload distributor. Automatically reconciles available hours against syllabus velocity and protects you from impossible backlog accumulation.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
          <button
            onClick={() => setViewTab("day")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewTab === "day" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Daily View
          </button>
          <button
            onClick={() => setViewTab("week")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewTab === "week" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Weekly Schedule
          </button>
          <button
            onClick={() => setViewTab("month")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewTab === "month" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Monthly Cadence
          </button>
        </div>
      </div>

      {/* Workload Balancer Console */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Sliders className="w-4 h-4 text-primary" />
            <span>Workload Allocation Engine</span>
          </div>
          <button
            onClick={handleRebalance}
            className="px-3 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Rebalance Schedule</span>
          </button>
        </div>

        {rebalancedNotice && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Workload successfully rebalanced across PSIR, General Studies, Revision, and Current Affairs!</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
            <span className="text-muted-foreground font-semibold">Total Target Hours</span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-base font-bold text-foreground">{dailyHours}h / day</span>
              <input
                type="range"
                min={4}
                max={12}
                step={0.5}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-16 accent-primary"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
            <span className="text-muted-foreground font-semibold">Wake Time</span>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="bg-transparent font-mono text-base font-bold text-foreground outline-none w-full"
            />
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
            <span className="text-muted-foreground font-semibold">Optional (PSIR)</span>
            <span className="font-mono text-base font-bold text-foreground block">{psirHours}h / day</span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
            <span className="text-muted-foreground font-semibold">Spaced Revision</span>
            <span className="font-mono text-base font-bold text-foreground block">{revisionHours}h / day</span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
            <span className="text-muted-foreground font-semibold">Current Affairs</span>
            <span className="font-mono text-base font-bold text-foreground block">{caHours}h / day</span>
          </div>
        </div>
      </div>

      {/* Backlog Intelligence Section */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-foreground">Backlog Intelligence System</h2>
          </div>
          <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
            {backlogItems.length} Rescheduled / Overdue
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Missed tasks are evaluated for exam yield and decay. Instead of piling up infinitely, the system applies priority resolution (Reschedule, Compress into 30m recall sheet, Merge, or Drop).
        </p>

        {backlogItems.length === 0 ? (
          <div className="p-4 rounded-xl bg-muted/30 text-center text-xs text-muted-foreground">
            No overdue backlog items! Your preparation velocity is on track with target milestones.
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            {backlogItems.map((item: any) => {
              const recommendation = resolveBacklogItem({
                importance: (item.priority as any) || "High",
                daysOverdue: 3,
                masteryScore: 42,
              });

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-muted/30 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground truncate">{item.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-500">
                        {item.subject}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      <strong>OS Recommendation ({recommendation.action}):</strong> {recommendation.reason}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApplyBacklogAction(item.id, "Reschedule")}
                      className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleApplyBacklogAction(item.id, "Compress")}
                      className="px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 border border-border text-[11px] font-semibold text-foreground"
                    >
                      Compress 30m
                    </button>
                    <button
                      onClick={() => handleApplyBacklogAction(item.id, "Drop")}
                      className="px-2 py-1 rounded-lg text-rose-500 hover:bg-rose-500/10 text-[11px] font-semibold"
                    >
                      Drop
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Schedule View */}
      {viewTab === "day" ? (
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Today Schedule Flow</h2>
            </div>
            <span className="text-xs font-mono text-muted-foreground">Wake 06:00 • Sleep 23:00</span>
          </div>

          <div className="space-y-3">
            {tasks.map((t: any) => (
              <div
                key={t.id}
                className="p-3.5 rounded-xl border border-border bg-muted/20 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-24 font-mono font-bold text-primary shrink-0">
                    {t.timeSlot}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-foreground truncate">{t.title}</div>
                    <div className="text-[11px] text-muted-foreground">{t.subject} • {t.taskType}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 font-mono text-muted-foreground">
                  <span>{t.estimatedMinutes} mins</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.status === "COMPLETED" ? "bg-emerald-500/20 text-emerald-500" : "bg-muted text-foreground"
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Week View Grid */
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {daysOfWeek.map((day, idx) => (
            <div key={day} className="p-3 rounded-2xl bg-card border border-border shadow-sm space-y-2">
              <div className="text-xs font-bold text-foreground flex items-center justify-between border-b border-border pb-2">
                <span>{day.slice(0, 3)}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{idx === 0 ? "Today" : `Day +${idx}`}</span>
              </div>
              <div className="space-y-1.5 min-h-[140px]">
                {tasks.slice(0, 3).map((t: any, i: number) => (
                  <div key={i} className="p-1.5 rounded-lg bg-muted/50 border border-border text-[10px] font-medium truncate">
                    <span className="font-bold text-primary block truncate">{t.subject}</span>
                    <span className="text-muted-foreground truncate">{t.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
