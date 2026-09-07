"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Sun, BookOpen, CheckCircle2, RotateCcw } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const PRIMARY_MOBILE_ITEMS = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Today", href: "/today", icon: Sun },
    { label: "Syllabus", href: "/syllabus", icon: BookOpen },
    { label: "Prelims", href: "/prelims", icon: CheckCircle2 },
    { label: "Revision", href: "/revision", icon: RotateCcw },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-card/95 backdrop-blur-lg border-t border-border z-40 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {PRIMARY_MOBILE_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
