"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sun,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Plus,
  Zap,
  ShieldCheck,
  AlertCircle,
  Star,
  Layers,
  ChevronRight,
  Flame,
  Check,
  Calendar,
} from "lucide-react";

export function TodayMissionView({
  initialTasks,
  recentSessions,
  user,
}: {
  initialTasks: any[];
  recentSessions: any[];
  user: any;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [sessions, setSessions] = useState(recentSessions);
  const [activeTask, setActiveTask] = useState<any | null>(initialTasks[2] || initialTasks[0] || null);

  // Timer State
  const [timerMode, setTimerMode] = useState<"Pomodoro25" | "Pomodoro50" | "DeepWork90">("DeepWork90");
  const [secondsLeft, setSecondsLeft] = useState(90 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [distractions, setDistractions] = useState(0);
  const [sessionRating, setSessionRating] = useState(5);
  const [sessionNote, setSessionNote] = useState("");
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [noZeroDayActive, setNoZeroDayActive] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSubject, setNewTaskSubject] = useState("Polity");
  const [newTaskTopic, setNewTaskTopic] = useState("");
  const [newTaskType, setNewTaskType] = useState("Learning");
  const [newTaskMinutes, setNewTaskMinutes] = useState(60);
  const [newTaskReason, setNewTaskReason] = useState("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerMode === "Pomodoro25") setSecondsLeft(25 * 60);
    else if (timerMode === "Pomodoro50") setSecondsLeft(50 * 60);
    else if (timerMode === "DeepWork90") setSecondsLeft(90 * 60);
    setIsRunning(false);
  }, [timerMode]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setShowCompleteModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    try {
      const res = await fetch("/api/study/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: newStatus }),
      });
      if (res.ok) {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogSession = async () => {
    const totalPlanned = timerMode === "Pomodoro25" ? 25 : timerMode === "Pomodoro50" ? 50 : 90;
    const actual = Math.max(5, Math.round((totalPlanned * 60 - secondsLeft) / 60));

    try {
      const res = await fetch("/api/study/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: activeTask?.id,
          subject: activeTask?.subject || "General",
          topic: activeTask?.topic || "Deep Work",
          sessionType: timerMode,
          plannedMinutes: totalPlanned,
          actualMinutes: actual,
          distractions,
          rating: sessionRating,
          notes: sessionNote,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSessions((prev) => [data.session, ...prev]);

        // Auto-complete task if selected
        if (activeTask) {
          await handleToggleTaskStatus(activeTask.id, "PENDING");
        }

        setShowCompleteModal(false);
        setDistractions(0);
        setSessionNote("");
        if (timerMode === "Pomodoro25") setSecondsLeft(25 * 60);
        else if (timerMode === "Pomodoro50") setSecondsLeft(50 * 60);
        else setSecondsLeft(90 * 60);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleActivateNoZeroDay = async () => {
    try {
      const res = await fetch("/api/study/no-zero-day", { method: "POST" });
      if (res.ok) {
        setNoZeroDayActive(true);
        const taskRes = await fetch("/api/study/tasks");
        const data = await taskRes.json();
        if (data.tasks) setTasks(data.tasks);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/study/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle,
          subject: newTaskSubject,
          topic: newTaskTopic,
          taskType: newTaskType,
          estimatedMinutes: newTaskMinutes,
          reason: newTaskReason || "Manual assignment for today.",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setTasks((prev) => [data.task, ...prev]);
        setShowNewTaskModal(false);
        setNewTaskTitle("");
        setNewTaskTopic("");
        setNewTaskReason("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;
  const totalCompletedMinutes = sessions.reduce((acc, s) => acc + s.actualMinutes, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Today&apos;s Mission & Deep Work</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-semibold font-mono">
              Live
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Execute high-yield time blocks. Log focus metrics, active recall, and zero-distraction streaks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleActivateNoZeroDay}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>No Zero Day Mode</span>
          </button>

          <button
            onClick={() => setShowNewTaskModal(true)}
            className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-2 hover:bg-primary/90 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Study Task</span>
          </button>
        </div>
      </div>

      {noZeroDayActive && (
        <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              <strong>No Zero Day Mode Activated:</strong> Previous unstarted tasks safely rescheduled to prevent backlog guilt. Minimum vital survival deck generated (20m recall + 10 MCQs + 1 concept).
            </span>
          </div>
          <span className="font-mono text-[10px] bg-amber-500/20 px-2 py-0.5 rounded">Active Today</span>
        </div>
      )}

      {/* Grid: Left = Deep Work Timer, Right = Mission Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Deep Work Timer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm text-center space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Focus Console</span>
              </span>
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                <button
                  onClick={() => setTimerMode("Pomodoro25")}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                    timerMode === "Pomodoro25" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  25m
                </button>
                <button
                  onClick={() => setTimerMode("Pomodoro50")}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                    timerMode === "Pomodoro50" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  50m
                </button>
                <button
                  onClick={() => setTimerMode("DeepWork90")}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                    timerMode === "DeepWork90" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  90m
                </button>
              </div>
            </div>

            {/* Active Task Name */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-primary font-bold">
                Target Task
              </span>
              <div className="text-sm font-bold text-foreground truncate">
                {activeTask?.title || "Free Deep Work Session"}
              </div>
              <div className="text-xs text-muted-foreground">
                {activeTask?.subject} • {activeTask?.topic}
              </div>
            </div>

            {/* Big Countdown Clock */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tighter text-foreground selection:bg-none">
                {formatTimer(secondsLeft)}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-muted-foreground font-medium">
                  {isRunning ? "Focus session in progress" : "Paused"}
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsRunning((prev) => !prev)}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all ${
                  isRunning
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isRunning ? "Pause Session" : "Start Session"}</span>
              </button>

              <button
                onClick={() => {
                  setIsRunning(false);
                  if (timerMode === "Pomodoro25") setSecondsLeft(25 * 60);
                  else if (timerMode === "Pomodoro50") setSecondsLeft(50 * 60);
                  else setSecondsLeft(90 * 60);
                }}
                className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowCompleteModal(true)}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold"
              >
                Finish Early
              </button>
            </div>

            {/* Distraction Tracker */}
            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Distractions Logged:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-foreground">{distractions}</span>
                <button
                  onClick={() => setDistractions((d) => d + 1)}
                  className="px-2 py-0.5 rounded bg-muted hover:bg-muted/80 border border-border text-[11px] font-medium"
                >
                  +1 Distraction
                </button>
              </div>
            </div>
          </div>

          {/* Today's Logged Sessions */}
          <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-muted-foreground">
                Today Focus History
              </span>
              <span className="font-mono text-primary font-bold">{totalCompletedMinutes} mins logged</span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sessions.length === 0 ? (
                <div className="text-xs text-muted-foreground p-3 text-center">No completed sessions logged yet today.</div>
              ) : (
                sessions.map((s: any) => (
                  <div key={s.id} className="p-2.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-foreground truncate">{s.topic}</div>
                      <div className="text-[10px] text-muted-foreground">{s.sessionType} • Distractions: {s.distractions}</div>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-500 shrink-0">
                      <span>+{s.actualMinutes}m</span>
                      <div className="flex text-amber-500">
                        {Array.from({ length: s.rating }).map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Mission Schedule */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">Time-Blocked Daily Plan</h2>
                <p className="text-xs text-muted-foreground">
                  {completedCount} of {tasks.length} tasks completed • Balanced across GS, PSIR, Revision & Testing
                </p>
              </div>
              <div className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                {Math.round((completedCount / (tasks.length || 1)) * 100)}% Done
              </div>
            </div>

            <div className="space-y-3">
              {tasks.map((task: any) => {
                const isCompleted = task.status === "COMPLETED";
                const isCurrent = activeTask?.id === task.id;
                const isUrgent = task.priority === "Urgent";

                return (
                  <div
                    key={task.id}
                    onClick={() => setActiveTask(task)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                        : isCompleted
                        ? "border-border bg-muted/30 opacity-70"
                        : isUrgent
                        ? "border-rose-500/40 bg-rose-500/5 hover:border-rose-500/70"
                        : "border-border bg-card hover:border-border/80 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleTaskStatus(task.id, task.status);
                          }}
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                            isCompleted
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "border-border hover:border-primary text-transparent"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-bold ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                              {task.title}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                              {task.timeSlot}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-primary/15 text-primary">
                              {task.taskType}
                            </span>
                          </div>

                          <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                            <strong className="text-foreground/80">Commander Reason:</strong> {task.reason}
                          </p>

                          {task.expectedOutput && (
                            <div className="mt-2 p-2 rounded-lg bg-muted/50 border border-border/80 text-[11px] text-foreground/90 flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                              <span>{task.expectedOutput}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono font-bold text-muted-foreground">
                          {task.estimatedMinutes}m
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTask(task);
                            setIsRunning(true);
                          }}
                          className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                          title="Launch timer for this task"
                        >
                          <Play className="w-3 h-3 fill-primary-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Session Completion Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Session Finished! Log Your Focus</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Rate your mental depth and add any notes for your active recall queue.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Focus Rating (1 - 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSessionRating(star)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        sessionRating >= star ? "text-amber-500 border-amber-500/40 bg-amber-500/10" : "text-muted-foreground border-border"
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Session Takeaways / Synthesis
                </label>
                <textarea
                  value={sessionNote}
                  onChange={(e) => setSessionNote(e.target.value)}
                  placeholder="Key concepts grasped, confusing provisions, or recall cues..."
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-xs text-foreground outline-none h-20 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleLogSession}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
              >
                Save & Mark Task Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Study Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateTask} className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-foreground">Add Custom Study Task</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-muted-foreground block mb-1 font-semibold">Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Monetary Policy Committee & Inflation Targeting"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-muted-foreground block mb-1 font-semibold">Subject</label>
                  <select
                    value={newTaskSubject}
                    onChange={(e) => setNewTaskSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none"
                  >
                    <option value="Polity">Polity & Constitution</option>
                    <option value="Economy">Economy & Macro</option>
                    <option value="Environment">Environment & Ecology</option>
                    <option value="Modern History">Modern History</option>
                    <option value="Ethics">Ethics (GS-4)</option>
                    <option value="PSIR">PSIR Optional</option>
                  </select>
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1 font-semibold">Task Type</label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none"
                  >
                    <option value="Learning">Learning</option>
                    <option value="Recall">Active Recall</option>
                    <option value="Revision">Revision</option>
                    <option value="MCQ Practice">MCQ Practice</option>
                    <option value="Answer Writing">Answer Writing</option>
                    <option value="PYQ Practice">PYQ Practice</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-semibold">Topic / Core Unit</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Macroeconomics - Monetary Policy"
                  value={newTaskTopic}
                  onChange={(e) => setNewTaskTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-muted-foreground block mb-1 font-semibold">Estimated Minutes</label>
                  <input
                    type="number"
                    min={15}
                    max={240}
                    value={newTaskMinutes}
                    onChange={(e) => setNewTaskMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-semibold">Reason for Selection</label>
                <input
                  type="text"
                  placeholder="Why is this prioritized today?"
                  value={newTaskReason}
                  onChange={(e) => setNewTaskReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
              >
                Add to Daily Plan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
