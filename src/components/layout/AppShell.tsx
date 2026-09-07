"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, NAV_ITEMS } from "./Sidebar";
import { Header } from "./Header";
import { GlobalSearch } from "./GlobalSearch";
import { AIMentorDrawer } from "./AIMentorDrawer";
import { NotificationDrawer } from "./NotificationDrawer";
import { MobileNav } from "./MobileNav";
import { X, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Keyboard shortcuts (Cmd+K for search, Cmd+J for AI mentor)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault();
        setMentorOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isFullscreenPage = pathname?.startsWith("/onboarding") || pathname?.startsWith("/login");

  if (isFullscreenPage) {
    return (
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar onOpenMentor={() => setMentorOpen(true)} />
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden flex">
          <div className="w-72 bg-card border-r border-border h-full flex flex-col p-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="font-bold text-sm text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center font-bold">R</span>
                RankOS UPSC
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium ${
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Header
          onOpenSearch={() => setSearchOpen(true)}
          onOpenNotifications={() => setNotifOpen(true)}
          onOpenMentor={() => setMentorOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile Bottom Bar */}
      <MobileNav />

      {/* Floating AI Mentor Quick Bubble (Desktop & Mobile) */}
      <button
        onClick={() => setMentorOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-6 z-30 p-3 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-primary/50 group"
        title="Open AI Mentor (Cmd+J)"
      >
        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="hidden lg:inline text-xs font-bold pr-1">Ask Mentor</span>
      </button>

      {/* Modals & Slide-overs */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AIMentorDrawer isOpen={mentorOpen} onClose={() => setMentorOpen(false)} />
      <NotificationDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}
