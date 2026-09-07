import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ViewModeProvider } from "@/components/providers/ViewModeContext";

export const metadata: Metadata = {
  title: "RankOS — UPSC CSE Preparation Operating System",
  description: "An intelligent, high-velocity operating system for serious UPSC Civil Services Examination aspirants.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <ViewModeProvider>
          <AppShell>{children}</AppShell>
        </ViewModeProvider>
      </body>
    </html>
  );
}
