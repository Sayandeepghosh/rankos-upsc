"use client";

import React from "react";
import { X, Bell, RotateCcw, AlertTriangle, Award, ExternalLink } from "lucide-react";
import Link from "next/link";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "REVISION" | "MISTAKE" | "TEST" | "INFO";
  link: string;
  time: string;
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "3 Urgent Revisions Due Today",
    message: "Polity: Governor Discretion, Environment: WPA, and PSIR: Plato need immediate active recall review.",
    type: "REVISION",
    link: "/revision",
    time: "2 hours ago",
  },
  {
    id: "2",
    title: "Weakness Alert Detected",
    message: "Environment MCQ accuracy dropped to 42%. Personalized remediation drill has been injected into Today Mission.",
    type: "MISTAKE",
    link: "/mistakes",
    time: "4 hours ago",
  },
  {
    id: "3",
    title: "Full Mock Test Scheduled",
    message: "GS-1 Full Length Mock #05 is scheduled for Sunday 09:30 AM.",
    type: "TEST",
    link: "/tests",
    time: "1 day ago",
  },
];

export function NotificationDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-80 z-50 bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2 font-bold text-sm text-foreground">
          <Bell className="w-4 h-4 text-primary" />
          <span>Notifications</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-500 font-mono">
            3 new
          </span>
        </div>
        <button onClick={onClose} className="p-1 rounded text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {SAMPLE_NOTIFICATIONS.map((n) => (
          <Link
            key={n.id}
            href={n.link}
            onClick={onClose}
            className="block p-3 rounded-xl border border-border bg-card hover:bg-muted/60 transition-colors group"
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 p-1.5 rounded-lg bg-muted border border-border shrink-0">
                {n.type === "REVISION" && <RotateCcw className="w-3.5 h-3.5 text-amber-500" />}
                {n.type === "MISTAKE" && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                {n.type === "TEST" && <Award className="w-3.5 h-3.5 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                  <span className="truncate">{n.title}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                <div className="text-[10px] text-muted-foreground/60 mt-1.5 font-mono">{n.time}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="p-3 border-t border-border bg-muted/20 text-center">
        <button
          onClick={onClose}
          className="text-xs text-primary hover:underline font-semibold"
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
}
