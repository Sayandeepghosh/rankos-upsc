"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  HardDrive,
  User,
  KeyRound,
  Calendar,
  BookOpen,
  Clock,
  ArrowRight,
  ArrowLeft,
  Check,
  Flame,
  Award,
  Sparkles,
  Zap,
  Target,
  Layers,
  Compass,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();

  // Wizard Step: 1 = Auth (Username/Password), 2 = Year & Optional, 3 = Phase & Hours, 4 = Launching
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");

  // Auth State (Only username and password!)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeUser, setActiveUser] = useState<any | null>(null);

  // Existing local accounts (for quick sign-in)
  const [existingUsers, setExistingUsers] = useState<any[]>([]);

  // Prerequisite State
  const [targetYear, setTargetYear] = useState<number>(2027);
  const [optionalSubject, setOptionalSubject] = useState<string>("PSIR");
  const [attemptNumber, setAttemptNumber] = useState<number>(1);
  const [currentPhase, setCurrentPhase] = useState<string>("Foundation");
  const [dailyStudyHours, setDailyStudyHours] = useState<number>(6.0);
  const [wakeTime, setWakeTime] = useState<string>("06:00 AM");
  const [strongSubjects, setStrongSubjects] = useState<string[]>(["Polity", "Ethics"]);
  const [weakSubjects, setWeakSubjects] = useState<string[]>(["Environment", "Economy"]);

  // UI status
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in or existing users exist
    fetchExistingUsers();
  }, []);

  const fetchExistingUsers = async () => {
    try {
      const res = await fetch("/api/auth/users");
      const data = await res.json();
      if (data.users && data.users.length > 0) {
        setExistingUsers(data.users);
        // If active user is already found, check if they need prerequisites
        const active = data.users.find((u: any) => u.id === data.activeUserId);
        if (active) {
          setActiveUser(active);
          if (active.profile?.onboardingCompleted) {
            // Already onboarded
            router.push("/");
          } else {
            // Proceed to prerequisites
            setCurrentStep(2);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 1. Handle Signup (Only Username and Password)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActiveUser(data.user);
        // Move to fullscreen prerequisites step!
        setCurrentStep(2);
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActiveUser(data.user);
        if (data.onboardingCompleted) {
          router.push("/");
        } else {
          setCurrentStep(2);
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // 3. Quick Switch for existing account
  const handleQuickSelect = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setActiveUser(data.user);
        if (data.onboardingCompleted) {
          router.push("/");
        } else {
          setCurrentStep(2);
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // 4. Save Prerequisites and Launch
  const handleCompleteOnboarding = async () => {
    setLoading(true);
    setCurrentStep(4);
    setError(null);

    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: activeUser?.id,
          targetYear,
          attemptNumber,
          optionalSubject,
          dailyStudyHours,
          wakeTime,
          currentPhase,
          strongSubjects,
          weakSubjects,
        }),
      });

      if (res.ok) {
        // Wait 1.2s for pleasant animated transition
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1200);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save prerequisites");
        setCurrentStep(3);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setCurrentStep(3);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (subject: string, list: string[], setList: (l: string[]) => void) => {
    if (list.includes(subject)) {
      setList(list.filter((s) => s !== subject));
    } else {
      setList([...list, subject]);
    }
  };

  const SUBJECTS = [
    "Polity",
    "Economy",
    "Modern History",
    "Ancient & Medieval History",
    "Geography",
    "Environment & Ecology",
    "Science & Tech",
    "Ethics GS-IV",
    "CSAT",
  ];

  const OPTIONALS = [
    { name: "PSIR", desc: "Political Science & IR (Built-in Scholar Matrix)" },
    { name: "Geography", desc: "Physical, Human & Economic Geography" },
    { name: "Sociology", desc: "Sociological Thinkers & Indian Society" },
    { name: "History", desc: "Ancient, Medieval, Modern & World History" },
    { name: "Public Administration", desc: "Administrative Theories & Indian Admin" },
    { name: "Anthropology", desc: "Physical, Social & Tribal Anthropology" },
    { name: "Philosophy", desc: "Western & Indian Epistemology & Ethics" },
    { name: "Others", desc: "Literature, Law, Economics, etc." },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0B0F17] text-foreground flex flex-col justify-between p-4 sm:p-8 select-none relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center font-black text-primary text-xl shadow-lg shadow-primary/20">
            R
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight flex items-center gap-2">
              RankOS
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 font-semibold">
                v2 Beta
              </span>
            </div>
            <div className="text-xs text-muted-foreground">UPSC CSE Operating System</div>
          </div>
        </div>

        {/* Offline Privacy Guarantee Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/80 border border-border text-xs text-muted-foreground shadow-sm">
          <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[11px] font-medium hidden sm:inline">100% Local &amp; Private Storage</span>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="max-w-2xl w-full mx-auto my-auto py-8 z-10">
        {/* =========================================================================
            STEP 1: LOGIN / SIGNUP (ONLY USERNAME AND PASSWORD)
           ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in-50 zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Step 1 of 3: Local Authentication
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {authMode === "signup" ? "Create Your Local Account" : "Sign In to RankOS"}
              </h1>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {authMode === "signup"
                  ? "Signup is strictly username & password. All your study data remains local on this computer."
                  : "Welcome back! Access your preparation dashboard and revision deck."}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="p-1 rounded-2xl bg-card border border-border flex items-center gap-1 max-w-xs mx-auto shadow-sm">
              <button
                onClick={() => {
                  setAuthMode("signup");
                  setError(null);
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  authMode === "signup"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up (New)
              </button>
              <button
                onClick={() => {
                  setAuthMode("login");
                  setError(null);
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  authMode === "login"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium text-center">
                {error}
              </div>
            )}

            {/* Quick Switch Card (If accounts already exist) */}
            {authMode === "login" && existingUsers.length > 0 && (
              <div className="p-4 rounded-2xl bg-card border border-border space-y-3 shadow-sm">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Saved Local Profiles
                </div>
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {existingUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleQuickSelect(u.id)}
                      className="w-full p-2.5 rounded-xl bg-muted/40 hover:bg-muted border border-border flex items-center justify-between text-left transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-xs text-primary">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                            {u.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            Target {u.profile?.targetYear || 2027} &bull; {u.profile?.optionalSubject || "PSIR"}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-primary">Select &rarr;</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form: Username + Password ONLY */}
            <form
              onSubmit={authMode === "signup" ? handleSignup : handleLogin}
              className="p-6 rounded-3xl bg-card/80 border border-border shadow-xl space-y-4 backdrop-blur-sm"
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. sayan_upsc"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-muted/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter local password"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-muted/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {authMode === "signup" && (
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-muted/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 mt-2"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : authMode === "signup" ? (
                  <>
                    <span>Create Account &amp; Setup Prerequisites</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Sign In to RankOS</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* =========================================================================
            STEP 2: FULLSCREEN PREREQUISITES — TARGET YEAR & OPTIONAL SUBJECT
           ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Prerequisite 1 of 2: Target &amp; Curriculum
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Which UPSC Year Are You Preparing For?
              </h1>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                RankOS will calibrate your countdown timers, mastery decay formulas, and daily syllabus speed to this target.
              </p>
            </div>

            {/* Year Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { year: 2025, label: "CSE 2025", badge: "Sprint Mode", desc: "Final Mocks & Elimination" },
                { year: 2026, label: "CSE 2026", badge: "1-Year Cycle", desc: "Full Syllabus & Revisions" },
                { year: 2027, label: "CSE 2027", badge: "AIR 1 Focus", desc: "Recommended Foundation" },
                { year: 2028, label: "CSE 2028+", badge: "Long Term", desc: "Multi-Year Mastery" },
              ].map((item) => {
                const isSelected = targetYear === item.year;
                return (
                  <button
                    key={item.year}
                    onClick={() => setTargetYear(item.year)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-primary/15 border-primary shadow-md shadow-primary/20 scale-[1.02]"
                        : "bg-card border-border hover:border-border/80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-mono text-primary px-2 py-0.5 rounded-full bg-primary/10">
                        {item.badge}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="text-xl font-black font-mono text-foreground">{item.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">{item.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Optional Subject Selection */}
            <div className="p-5 rounded-3xl bg-card border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>Select Your Optional Subject</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Your 500-mark Mains optional drives your preparation trajectory.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
                  {optionalSubject}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {OPTIONALS.map((opt) => {
                  const isSelected = optionalSubject === opt.name;
                  return (
                    <button
                      key={opt.name}
                      onClick={() => setOptionalSubject(opt.name)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                        isSelected
                          ? "bg-primary/10 border-primary text-foreground"
                          : "bg-muted/40 border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-foreground">{opt.name}</div>
                        <div className="text-[11px] text-muted-foreground line-clamp-1">{opt.desc}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md shadow-primary/20"
              >
                <span>Continue to Schedule &amp; Phase</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: PREREQUISITES — PHASE, DAILY HOURS & SCHEDULE
           ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Prerequisite 2 of 2: Schedule &amp; Strategy
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Calibrate Your Daily Operating Routine
              </h1>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                RankOS will sequence your daily core study, flashcards, and testing based on your available time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Daily Study Target */}
              <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    Daily Study Target
                  </span>
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    {dailyStudyHours} Hours/Day
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[4.0, 6.0, 8.0, 10.0].map((h) => (
                    <button
                      key={h}
                      onClick={() => setDailyStudyHours(h)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        dailyStudyHours === h
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Preparation Phase */}
              <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-primary" />
                    Preparation Phase
                  </span>
                  <span className="text-xs font-mono font-bold text-foreground">
                    {currentPhase}
                  </span>
                </div>
                <select
                  value={currentPhase}
                  onChange={(e) => setCurrentPhase(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="Foundation">Foundation (NCERTs &amp; Core Theory)</option>
                  <option value="First Reading">First Reading (Standard Texts)</option>
                  <option value="Consolidation">Consolidation &amp; Notes Making</option>
                  <option value="Prelims Sprint">Prelims Sprint (Mocks &amp; Traps)</option>
                  <option value="Mains Intensive">Mains Intensive (Answer Writing)</option>
                </select>
              </div>
            </div>

            {/* Strong & Weak Subjects */}
            <div className="p-5 rounded-3xl bg-card border border-border space-y-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Select Your Focus / Weak Areas (RankOS will prioritize these)
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Click to toggle subjects that need high-priority scheduling.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {SUBJECTS.map((sub) => {
                  const isWeak = weakSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      onClick={() => toggleSubject(sub, weakSubjects, setWeakSubjects)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        isWeak
                          ? "bg-rose-500/15 border-rose-500/40 text-rose-500 font-semibold"
                          : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {isWeak ? `⚠ ${sub}` : sub}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={handleCompleteOnboarding}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/25"
              >
                <RocketIcon className="w-4 h-4" />
                <span>Launch RankOS Operating System</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: INITIALIZATION ANIMATION & LAUNCH
           ========================================================================= */}
        {currentStep === 4 && (
          <div className="text-center py-16 space-y-4 animate-in fade-in-50 duration-500">
            <div className="w-16 h-16 rounded-3xl bg-primary/20 border border-primary/40 flex items-center justify-center font-black text-2xl text-primary mx-auto animate-bounce shadow-xl shadow-primary/30">
              R
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Building Your UPSC CSE {targetYear} Operating System...
            </h2>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p>&bull; Setting up SM-2 spaced repetition decay curve</p>
              <p>&bull; Configuring {optionalSubject} Optional scholar nexus</p>
              <p>&bull; Sequencing daily {dailyStudyHours}h deep-work missions</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground/60 py-2 z-10">
        RankOS v2.0 Beta &bull; Designed for UPSC CSE Aspirants &bull; 100% Offline &amp; Private
      </footer>
    </div>
  );
}

function RocketIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}
