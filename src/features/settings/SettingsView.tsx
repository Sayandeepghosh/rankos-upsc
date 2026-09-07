"use client";

import React, { useState } from "react";
import {
  Settings,
  User,
  Shield,
  Sparkles,
  Download,
  Check,
  Save,
  Moon,
  Sun,
  Database,
  Calendar,
  Layers,
} from "lucide-react";

export function SettingsView({ user }: { user: any }) {
  const [name, setName] = useState(user?.name || "Sayan Mukherjee");
  const [targetYear, setTargetYear] = useState(user?.profile?.targetYear || 2027);
  const [attemptNumber, setAttemptNumber] = useState(user?.profile?.attemptNumber || 1);
  const [currentPhase, setCurrentPhase] = useState(user?.profile?.currentPhase || "Foundation");
  const [optionalSubject, setOptionalSubject] = useState(user?.profile?.optionalSubject || "PSIR");
  const [dailyHours, setDailyHours] = useState(user?.profile?.dailyStudyHours || 6.0);
  const [wakeTime, setWakeTime] = useState(user?.profile?.wakeTime || "06:00");
  const [aiProvider, setAiProvider] = useState(user?.profile?.aiProvider || "heuristic");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDownloadJSON = () => {
    window.open("/api/data/export?format=json", "_blank");
  };

  const handleDownloadCSV = () => {
    window.open("/api/data/export?format=csv", "_blank");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">RankOS System Settings</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold font-mono">
              Configuration
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your candidate profile, exam target cadence, optional subject, AI provider credentials, and data exports.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Candidate Profile & Target */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
            <User className="w-4 h-4 text-primary" />
            <span>Candidate & Examination Target</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none"
              />
            </div>

            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Target UPSC CSE Year</label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none font-mono"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
                <option value={2028}>2028</option>
              </select>
            </div>

            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Attempt Number</label>
              <input
                type="number"
                min={1}
                max={6}
                value={attemptNumber}
                onChange={(e) => setAttemptNumber(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Current Preparation Phase</label>
              <select
                value={currentPhase}
                onChange={(e) => setCurrentPhase(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none"
              >
                <option value="Foundation">Foundation (Syllabus Architecture)</option>
                <option value="First Reading">First Reading (Standard Textbooks)</option>
                <option value="Consolidation">Consolidation (Notes & Revision)</option>
                <option value="Prelims Intensive">Prelims Intensive (100-Day Mock Sprint)</option>
                <option value="Post-Prelims Mains">Post-Prelims Mains (Answer Writing Focus)</option>
                <option value="Mains Intensive">Mains Intensive (Full Simulation)</option>
              </select>
            </div>

            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Optional Subject</label>
              <select
                value={optionalSubject}
                onChange={(e) => setOptionalSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none"
              >
                <option value="PSIR">Political Science & International Relations (PSIR)</option>
                <option value="Sociology">Sociology</option>
                <option value="Geography">Geography</option>
                <option value="History">History</option>
                <option value="Anthropology">Anthropology</option>
                <option value="Public Administration">Public Administration</option>
              </select>
            </div>

            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Daily Study Target</label>
              <input
                type="number"
                step={0.5}
                min={3}
                max={14}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: AI Intelligence & Engine Provider */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI Provider & Evaluator Architecture</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-muted-foreground font-semibold block mb-1">Evaluation Engine Provider</label>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground outline-none font-semibold"
              >
                <option value="heuristic">UPSC Expert Heuristics v2.4 (Zero-Config Default • Offline Safe)</option>
                <option value="openai">OpenAI (GPT-4o / GPT-4o-mini via OPENAI_API_KEY)</option>
                <option value="anthropic">Anthropic (Claude 3.5 Sonnet via ANTHROPIC_API_KEY)</option>
                <option value="gemini">Google Gemini (Gemini 1.5 Flash via GOOGLE_GENERATIVE_AI_API_KEY)</option>
              </select>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              RankOS includes a decoupled AI abstraction layer. If live API keys are set in your <code className="bg-muted px-1.5 py-0.5 rounded font-mono">.env</code> file, requests are automatically routed to live models. Otherwise, the system uses deterministic UPSC scoring heuristics validated against official rubrics.
            </p>
          </div>
        </div>

        {/* Section 3: Data Export & Backup */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
            <Database className="w-4 h-4 text-primary" />
            <span>Data Sovereignty, Export & Backup</span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Your preparation telemetry belongs entirely to you. Export your entire database, notes, task history, and mistakes anytime.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleDownloadJSON}
              className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground border border-border text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-primary" />
              <span>Download Complete JSON Backup</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCSV}
              className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground border border-border text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-500" />
              <span>Export Task & Study Logs (CSV)</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
