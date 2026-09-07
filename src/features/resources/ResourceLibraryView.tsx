"use client";

import React, { useState } from "react";
import {
  Bookmark,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Clock,
  ExternalLink,
  ShieldAlert,
  Search,
} from "lucide-react";

export function ResourceLibraryView({ resources: initialResources }: { resources: any[] }) {
  const [resources, setResources] = useState(initialResources);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New resource state
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Polity");
  const [newType, setNewType] = useState("Book");
  const [newPriority, setNewPriority] = useState("Essential");
  const [newTotalPages, setNewTotalPages] = useState(500);

  const filtered = resources.filter((r) => {
    if (search.trim() === "") return true;
    const q = search.toLowerCase();
    return r.title.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q);
  });

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    const newRes = {
      id: `res-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      resourceType: newType,
      priority: newPriority,
      pagesRead: 0,
      totalPages: newTotalPages,
      status: "NOT_STARTED",
      estimatedMins: newTotalPages * 3,
      notes: "Standard subject reading anchor.",
    };
    setResources((prev) => [newRes, ...prev]);
    setShowAddModal(false);
    setNewTitle("");
  };

  const handleUpdatePages = (id: string, pages: number) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              pagesRead: pages,
              status: pages >= r.totalPages ? "COMPLETED" : "IN_PROGRESS",
            }
          : r
      )
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Curated Resource Library</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold font-mono">
              Overload Guard Active
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            UPSC preparation demands depth over breadth. Master one standard anchor book per subject before collecting supplementary materials.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Resource Overload Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold block text-sm">Resource Overload Prevention Protocol</strong>
          <p className="leading-relaxed">
            &quot;Reading 1 book 5 times is infinitely superior to reading 5 books 1 time.&quot; You currently have 3 essential books in progress. Do not add supplementary reference notes until your baseline reading completion crosses 75%.
          </p>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((res) => {
          const pct = Math.round(((res.pagesRead || 0) / (res.totalPages || 100)) * 100);
          const isCompleted = res.status === "COMPLETED" || pct >= 100;

          return (
            <div key={res.id} className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-muted text-primary">
                    {res.subject}
                  </span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded ${
                      res.priority === "Essential"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {res.priority}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-foreground leading-snug">{res.title}</h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {res.notes || "Standard UPSC preparation anchor."}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-border">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Reading Progress</span>
                    <span className="font-mono font-bold text-foreground">
                      {res.pagesRead} / {res.totalPages} pages ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isCompleted ? "bg-emerald-500" : "bg-primary"}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <input
                    type="range"
                    min={0}
                    max={res.totalPages}
                    value={res.pagesRead}
                    onChange={(e) => handleUpdatePages(res.id, Number(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-muted text-foreground">
                    {isCompleted ? "Completed" : "In Progress"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateResource} className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-foreground">Add Preparation Resource</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-muted-foreground block mb-1 font-semibold">Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Indian Economy by Nitin Singhania / Ramesh Singh"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-muted-foreground block mb-1 font-semibold">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none"
                  >
                    <option value="Polity">Polity</option>
                    <option value="Economy">Economy</option>
                    <option value="Environment">Environment</option>
                    <option value="History">History</option>
                    <option value="Ethics">Ethics</option>
                    <option value="PSIR">PSIR</option>
                  </select>
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1 font-semibold">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none"
                  >
                    <option value="Essential">Essential (Core Anchor)</option>
                    <option value="Supplementary">Supplementary (Reference)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-muted-foreground block mb-1 font-semibold">Total Pages</label>
                <input
                  type="number"
                  min={20}
                  max={2000}
                  value={newTotalPages}
                  onChange={(e) => setNewTotalPages(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
              >
                Add to Library
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
