"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useViewMode } from "@/components/providers/ViewModeContext";
import {
  Flame,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Play,
  Check,
  Award,
  ChevronRight,
  ChevronDown,
  Layers,
  X,
  SlidersHorizontal,
  BookOpen,
  FileText,
  Zap,
  Target,
  Brain,
  ShieldCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export function CommandCenterDashboard({
  user,
  readiness,
  mockTest,
}: {
  user: any;
  readiness: any[];
  mockTest: any;
}) {
  const { isSimpleMode, toggleSimpleMode } = useViewMode();
  const [tasks, setTasks] = useState(user?.tasks || []);
  const [selectedMetric, setSelectedMetric] = useState<any | null>(null);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const [showProDetails, setShowProDetails] = useState(false);

  const pendingTasks = tasks.filter((t: any) => t.status !== "COMPLETED");
  const completedTasks = tasks.filter((t: any) => t.status === "COMPLETED");
  const dueRevisions = (user?.revisions || []).filter(
    (r: any) => r.status === "DUE" || r.status === "OVERDUE"
  );
  const weakMistakes = user?.mistakes || [];

  // Active next task (highest priority pending task)
  const currentFocusTask = pendingTasks[0] || tasks[0];

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    setLoadingTaskId(taskId);
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";

    try {
      const res = await fetch("/api/study/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: newStatus }),
      });

      if (res.ok) {
        setTasks((prev: any[]) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTaskId(null);
    }
  };

  const chartData = (user?.analytics || []).map((a: any) => {
    const d = new Date(a.date);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return {
      day: days[d.getDay()],
      minutes: a.studyMinutes,
      hours: Number((a.studyMinutes / 60).toFixed(1)),
    };
  });

  const overallReadiness =
    readiness.find((r) => r.metricType === "OVERALL")?.score || 66.8;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* 1. Clean Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Hello, {user?.name?.split(" ")[0] || "Aspirant"}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
              AIR 1 Goal
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {isSimpleMode
              ? "Focus on these 3 steps today. Everything else is scheduled."
              : "Command Center — Strategy & Analytics Cockpit."}
          </p>
        </div>

        {/* Header Right: Countdown & Mode Pill */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-card border border-border shadow-sm flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <div className="text-xs">
              <span className="text-muted-foreground mr-1.5">Prelims 2027:</span>
              <span className="font-mono font-bold text-foreground">623 Days</span>
            </div>
          </div>

          <button
            onClick={toggleSimpleMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isSimpleMode
                ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                : "bg-muted text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {isSimpleMode ? (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simple View</span>
              </>
            ) : (
              <>
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Pro Cockpit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================================
          SIMPLE MODE: Calm, intuitive, highly actionable 3-step experience
         ========================================================================= */}
      {isSimpleMode ? (
        <div className="space-y-6">
          {/* A. Hero: "WHAT TO STUDY RIGHT NOW" */}
          {currentFocusTask ? (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-card via-card to-primary/5 border border-primary/30 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Target className="w-4 h-4" />
                      Current Step 1: Study
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-semibold">
                      {currentFocusTask.priority} Priority
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {currentFocusTask.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 text-foreground font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      {currentFocusTask.subject} &bull; {currentFocusTask.topic}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {currentFocusTask.plannedMinutes} Minutes
                    </span>
                    <span>&bull;</span>
                    <span>{currentFocusTask.reason}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/today`}
                    className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm shadow-primary/30"
                  >
                    <Play className="w-4 h-4 fill-primary-foreground" />
                    <span>Start 25m Timer</span>
                  </Link>
                  <button
                    onClick={() =>
                      handleToggleTask(currentFocusTask.id, currentFocusTask.status)
                    }
                    disabled={loadingTaskId === currentFocusTask.id}
                    className={`px-4 py-3 rounded-xl border font-semibold text-sm transition-all flex items-center gap-2 ${
                      currentFocusTask.status === "COMPLETED"
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-500"
                        : "bg-muted/70 hover:bg-muted border-border text-foreground"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      {currentFocusTask.status === "COMPLETED" ? "Done" : "Mark Done"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-card border border-border text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-lg text-foreground">
                All daily tasks completed!
              </h3>
              <p className="text-xs text-muted-foreground">
                Outstanding consistency. Take rest or review flashcards below.
              </p>
            </div>
          )}

          {/* B. Today's 3-Step Clear Action Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Core Study */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  Step 1: Core Study
                </span>
                <span className="text-xs font-mono font-bold text-foreground">
                  {completedTasks.length}/{tasks.length} Done
                </span>
              </div>
              <div className="text-sm font-bold text-foreground line-clamp-1">
                {currentFocusTask?.topic || "Polity Preamble"}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                Deep conceptual reading from standard source (Laxmikanth).
              </p>
              <div className="pt-2">
                <Link
                  href="/today"
                  className="w-full py-2 px-3 rounded-xl bg-muted/60 hover:bg-muted border border-border text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Open Study Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Step 2: Spaced Revision */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Step 2: Spaced Revise
                </span>
                <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  {dueRevisions.length} Due Today
                </span>
              </div>
              <div className="text-sm font-bold text-foreground line-clamp-1">
                {dueRevisions[0]?.topic || "Fundamental Rights & DPSP"}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                Active recall with SM-2 flashcards to protect retention from decay.
              </p>
              <div className="pt-2">
                <Link
                  href="/revision"
                  className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Start 3 Flashcards (15m)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Step 3: Practice Test */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Step 3: Test Yourself
                </span>
                <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  Daily Drill
                </span>
              </div>
              <div className="text-sm font-bold text-foreground line-clamp-1">
                5 Prelims MCQs or 1 Mains Answer
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                Immediate testing locks knowledge into long-term memory.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <Link
                  href="/prelims"
                  className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 transition-all text-center"
                >
                  <span>5 MCQs</span>
                </Link>
                <Link
                  href="/mains"
                  className="flex-1 py-2 px-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-xs font-semibold text-primary flex items-center justify-center gap-1 transition-all text-center"
                >
                  <span>Mains (10m)</span>
                </Link>
              </div>
            </div>
          </div>

          {/* C. Clean Readiness Indicator + 1-Sentence Diagnosis */}
          <div className="p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center shrink-0">
                <span className="text-lg font-black font-mono text-primary">
                  {overallReadiness.toFixed(0)}%
                </span>
                <span className="text-[9px] uppercase font-bold text-muted-foreground">
                  Ready
                </span>
              </div>
              <div>
                <div className="font-bold text-sm text-foreground flex items-center gap-2">
                  <span>Overall Exam Readiness Status: Competitive</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Strongest: Polity &amp; Modern History &bull; Focus area: Economy Banking (2 weak questions in Mistake Vault).
                </p>
              </div>
            </div>

            <Link
              href="/analytics"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0 self-start sm:self-auto"
            >
              <span>View Full Diagnostic</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* D. Expandable Pro Analytics Section */}
          <div className="pt-2">
            <button
              onClick={() => setShowProDetails(!showProDetails)}
              className="w-full py-3 px-4 rounded-2xl bg-muted/30 hover:bg-muted/60 border border-border/80 text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span>
                  {showProDetails
                    ? "Hide In-Depth Readiness Matrix & Study Velocity Charts"
                    : "Show In-Depth Readiness Matrix & Study Velocity Charts"}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showProDetails ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
      ) : null}

      {/* =========================================================================
          PRO COCKPIT / EXPANDED VIEW: Complete analytical data & charts
         ========================================================================= */}
      {!isSimpleMode || showProDetails ? (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Readiness Metric Cards (Transparent Formula Breakdown) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <span>Preparation Readiness Matrix (Click for Drivers)</span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                Target Band: <strong className="text-foreground">Competitive</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {readiness.map((rm) => {
                const isHigh = rm.score >= 70;
                const isMedium = rm.score >= 50 && rm.score < 70;
                return (
                  <button
                    key={rm.metricType}
                    onClick={() => setSelectedMetric(rm)}
                    className="p-3.5 rounded-2xl bg-card border border-border hover:border-primary/50 text-left transition-all hover:shadow-md group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                        {rm.metricType === "OVERALL" ? "Overall OS" : rm.metricType}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                          isHigh
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : isMedium
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {rm.score.toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-xl font-extrabold font-mono tracking-tight text-foreground">
                      {rm.score.toFixed(1)}
                      <span className="text-xs text-muted-foreground font-sans font-normal ml-0.5">
                        /100
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isHigh
                            ? "bg-emerald-500"
                            : isMedium
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${rm.score}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{rm.targetBand}</span>
                      <span className="text-primary font-medium group-hover:underline">
                        Inspect &rarr;
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Mission & Urgent Action Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Task List & Velocity Chart */}
            <div className="lg:col-span-2 space-y-6">
              {/* Task list */}
              <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground">
                        Today&apos;s Full Task Queue
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Prioritized by AI Daily Commander &bull; {completedTasks.length} of {tasks.length} Completed
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/today"
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Full Schedule</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {tasks.map((task: any) => {
                    const isCompleted = task.status === "COMPLETED";
                    const isUrgent = task.priority === "Urgent";
                    return (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                          isCompleted
                            ? "bg-muted/40 border-border opacity-70"
                            : isUrgent
                            ? "bg-rose-500/5 border-rose-500/30 hover:border-rose-500/50"
                            : "bg-card border-border hover:border-primary/40 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <button
                            onClick={() => handleToggleTask(task.id, task.status)}
                            disabled={loadingTaskId === task.id}
                            className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                              isCompleted
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "border-border hover:border-primary text-transparent"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold ${
                                  isCompleted
                                    ? "line-through text-muted-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {task.title}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-mono">
                                {task.subject}
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                                  task.priority === "Urgent"
                                    ? "bg-rose-500/15 text-rose-500"
                                    : task.priority === "High"
                                    ? "bg-amber-500/15 text-amber-500"
                                    : "bg-primary/10 text-primary"
                                }`}
                              >
                                {task.priority}
                              </span>
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {task.plannedMinutes}m
                              </span>
                              <span>&bull;</span>
                              <span className="italic">{task.reason}</span>
                            </div>
                          </div>
                        </div>

                        <Link
                          href="/today"
                          className="p-1.5 rounded-lg bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors shrink-0"
                          title="Start timer for this task"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekly Study Velocity Chart */}
              <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Weekly Study Velocity (Minutes/Day)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Target: 360 mins (6.0 hrs) daily &bull; 14-day continuity streak
                    </p>
                  </div>
                  <div className="text-xs font-bold font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    5.8h Daily Avg
                  </div>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="day"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        domain={[0, 450]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "0.75rem",
                          fontSize: "12px",
                        }}
                        formatter={(value: any) => [
                          `${value} mins (${(Number(value) / 60).toFixed(1)} hrs)`,
                          "Study Time",
                        ]}
                      />
                      <ReferenceLine
                        y={360}
                        stroke="#f59e0b"
                        strokeDasharray="3 3"
                        label={{ value: "6h Goal", fill: "#f59e0b", fontSize: 10 }}
                      />
                      <Bar
                        dataKey="minutes"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Urgent Revisions & Mistakes */}
            <div className="space-y-4">
              {/* Urgent Revisions Card */}
              <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Urgent Spaced Revisions
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    {dueRevisions.length} Due
                  </span>
                </div>

                <div className="space-y-2">
                  {dueRevisions.map((rev: any) => {
                    const isOverdue = rev.status === "OVERDUE";
                    return (
                      <div
                        key={rev.id}
                        className="p-2.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-foreground truncate">
                            {rev.topic}
                          </div>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                            <span>Rev #{rev.revisionNumber}</span>
                            <span>&bull;</span>
                            <span
                              className={
                                isOverdue
                                  ? "text-rose-500 font-bold"
                                  : "text-amber-500 font-medium"
                              }
                            >
                              {isOverdue ? "Overdue" : "Due Today"}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/revision?scheduleId=${rev.id}`}
                          className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 shrink-0"
                        >
                          Recall
                        </Link>
                      </div>
                    );
                  })}
                </div>
                <Link
                  href="/revision"
                  className="block text-center text-xs text-primary font-semibold hover:underline pt-1"
                >
                  Open Spaced Repetition Deck &rarr;
                </Link>
              </div>

              {/* Weak Topics / Mistake Alert */}
              <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-500">
                    <AlertTriangle className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Weak Topics Vault
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                    {weakMistakes.length} Active
                  </span>
                </div>

                <div className="space-y-2">
                  {weakMistakes.map((m: any) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs"
                    >
                      <div className="font-semibold text-foreground flex items-center justify-between">
                        <span className="truncate">{m.topic}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-500 font-mono">
                          {m.mistakeType}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                        {m.reasonForError}
                      </p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/mistakes"
                  className="block text-center text-xs text-rose-500 font-semibold hover:underline pt-1"
                >
                  Inspect Mistake Vault &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Metric Breakdown Modal (For Pro Mode inspect) */}
      {selectedMetric && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-base text-foreground">
                  {selectedMetric.metricType} Readiness Drivers
                </h3>
                <p className="text-xs text-muted-foreground">
                  Mathematical decomposition of your score
                </p>
              </div>
              <button
                onClick={() => setSelectedMetric(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                <span className="text-xs font-medium text-foreground">
                  Calculated Score
                </span>
                <span className="text-sm font-mono font-bold text-primary">
                  {selectedMetric.score.toFixed(1)} / 100
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                <span className="text-xs font-medium text-foreground">
                  Readiness Band
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {selectedMetric.targetBand}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedMetric(null)}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
