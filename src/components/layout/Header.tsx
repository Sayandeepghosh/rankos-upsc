"use client";

import React, { useState } from "react";
import { Search, Bell, Moon, Sun, Flame, Sparkles, Menu, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useViewMode } from "@/components/providers/ViewModeContext";

export function Header({
  onOpenSearch,
  onOpenNotifications,
  onOpenMentor,
  onToggleMobileMenu,
}: {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenMentor: () => void;
  onToggleMobileMenu: () => void;
}) {
  const [isDark, setIsDark] = useState(true);
  const { isSimpleMode, toggleSimpleMode } = useViewMode();

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: Mobile menu toggle + Global Search trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenSearch}
          className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-muted/60 hover:bg-muted border border-border/80 text-xs text-muted-foreground hover:text-foreground transition-all w-48 sm:w-64 md:w-80 justify-between group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="truncate">Search syllabus, thinkers, PYQs...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-background border border-border px-1.5 py-0.5 rounded font-mono font-semibold">
            Cmd+K
          </kbd>
        </button>
      </div>

      {/* Center: Mode Switcher */}
      <div className="flex items-center">
        <button
          onClick={toggleSimpleMode}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
            isSimpleMode
              ? "bg-primary/15 border-primary/40 text-primary shadow-sm"
              : "bg-muted/80 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
          title={isSimpleMode ? "Currently in Simple Mode. Click for Pro Cockpit." : "Currently in Pro Cockpit. Click for Simple Mode."}
        >
          {isSimpleMode ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Simple Mode</span>
              <span className="text-[10px] text-muted-foreground ml-1 hidden lg:inline">• Calm Focus</span>
            </>
          ) : (
            <>
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Pro Cockpit</span>
              <span className="text-[10px] text-muted-foreground ml-1 hidden lg:inline">• All 18 Tools</span>
            </>
          )}
        </button>
      </div>

      {/* Right side: Streak, Notifications, Theme, Mentor, Profile */}
      <div className="flex items-center gap-2">
        {/* Streak indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-500">
          <Flame className="w-4 h-4 fill-orange-500" />
          <span>14d Streak</span>
        </div>

        {/* AI Mentor trigger */}
        <button
          onClick={onOpenMentor}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-xs font-semibold text-primary transition-all"
          title="Open AI Mentor (Cmd+J)"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Mentor</span>
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User avatar */}
        <Link href="/settings" className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
            SM
          </div>
        </Link>
      </div>
    </header>
  );
}
