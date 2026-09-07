"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  User,
  UserPlus,
  LogIn,
  Check,
  ArrowRight,
  Sparkles,
  Calendar,
  BookOpen,
  Clock,
  HardDrive,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"switch" | "create">("switch");
  const [users, setUsers] = useState<any[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [targetYear, setTargetYear] = useState(2027);
  const [optionalSubject, setOptionalSubject] = useState("PSIR");
  const [dailyStudyHours, setDailyStudyHours] = useState(6.0);
  const [currentPhase, setCurrentPhase] = useState("Foundation");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
        setActiveUserId(data.activeUserId);
        if (data.users.length === 0) {
          setActiveTab("create");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (userId: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setActiveUserId(userId);
        setSuccessMsg(data.message || "Signed in!");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 500);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          targetYear,
          optionalSubject,
          dailyStudyHours,
          currentPhase,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Account created! Redirecting to Command Center...");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 700);
      } else {
        setError(data.error || "Failed to create account");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full space-y-6">
        {/* Top Header Card */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 text-primary font-black text-xl shadow-md">
            R
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            RankOS Local Account
          </h1>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Choose an existing aspirant profile or create a new local account.
          </p>

          {/* Privacy Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Stored Locally on Your Device (100% Private)</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="p-1 rounded-xl bg-muted/60 border border-border flex items-center gap-1">
          <button
            onClick={() => {
              setActiveTab("switch");
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === "switch"
                ? "bg-card text-foreground shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Switch Profile ({users.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("create");
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === "create"
                ? "bg-card text-foreground shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Profile</span>
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Existing Profiles */}
        {activeTab === "switch" && (
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Active Aspirant
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
                Loading local profiles...
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <p className="text-xs text-muted-foreground">
                  No local profiles found yet.
                </p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Create your first profile &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {users.map((u) => {
                  const isActive = u.id === activeUserId;
                  const initials = u.name
                    .split(" ")
                    .map((p: string) => p[0])
                    .join("")
                    .slice(0, 2);

                  return (
                    <div
                      key={u.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isActive
                          ? "bg-primary/5 border-primary/40 shadow-sm"
                          : "bg-muted/30 border-border hover:border-border/80"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground truncate">
                              {u.name}
                            </span>
                            {isActive && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                            <span>Target {u.profile?.targetYear || 2027}</span>
                            <span>&bull;</span>
                            <span>{u.profile?.optionalSubject || "PSIR"}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLogin(u.id)}
                        disabled={submitting}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                          isActive
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-muted hover:bg-muted/80 text-foreground border border-border"
                        }`}
                      >
                        {isActive ? "Continue" : "Switch"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Create New Profile Form */}
        {activeTab === "create" && (
          <form
            onSubmit={handleCreate}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              New Aspirant Profile Details
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sayan Mukherjee"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Email (Local identifier)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sayan@aspirant.local"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Target Year
                  </label>
                  <select
                    value={targetYear}
                    onChange={(e) => setTargetYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                    <option value={2028}>2028</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Optional Subject
                  </label>
                  <select
                    value={optionalSubject}
                    onChange={(e) => setOptionalSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="PSIR">PSIR</option>
                    <option value="Geography">Geography</option>
                    <option value="Sociology">Sociology</option>
                    <option value="History">History</option>
                    <option value="Public Administration">Public Admin</option>
                    <option value="Anthropology">Anthropology</option>
                    <option value="Philosophy">Philosophy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Daily Goal (Hours)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={16}
                    step={0.5}
                    value={dailyStudyHours}
                    onChange={(e) => setDailyStudyHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Current Phase
                  </label>
                  <select
                    value={currentPhase}
                    onChange={(e) => setCurrentPhase(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="Foundation">Foundation</option>
                    <option value="Consolidation">Consolidation</option>
                    <option value="Prelims Sprint">Prelims Sprint</option>
                    <option value="Mains Intensive">Mains Intensive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
              >
                {submitting ? (
                  <span>Saving local account...</span>
                ) : (
                  <>
                    <span>Create Profile &amp; Start</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer info */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground font-medium"
          >
            &larr; Back to Command Center
          </Link>
        </div>
      </div>
    </div>
  );
}
