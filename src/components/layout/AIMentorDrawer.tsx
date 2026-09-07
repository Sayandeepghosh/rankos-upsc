"use client";

import React, { useState } from "react";
import { X, Sparkles, Send, Bot, User, RefreshCw, Zap } from "lucide-react";
import { MENTOR_PERSONAS } from "@/lib/ai/prompts";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIMentorDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [persona, setPersona] = useState<keyof typeof MENTOR_PERSONAS>("Mentor");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to RankOS AI Mentor. I have real-time visibility into your syllabus coverage (65%), active 3-day revision backlog, and your Environment accuracy dip (42%). How can I assist your preparation right now?",
    },
  ]);

  if (!isOpen) return null;

  const currentPersona = MENTOR_PERSONAS[persona];

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona,
          prompt: userText,
          history: messages,
        }),
      });

      const data = await res.json();
      if (data.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Based on your preparation profile: Prioritize your Environment revision sheet drill on Wildlife Protection Act schedules, then complete your PSIR Plato answer outline.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "UPSC Mentor Insight: Your main bottleneck today is memory retention in Environment & Modern History. Dedicate your 16:00 study slot strictly to active recall rather than reading fresh material.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "What should I study right now?",
    "Why is my Environment score falling?",
    "Generate 3 active recall questions on Rawls",
    "Give me a 3-day recovery plan",
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 z-50 bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-3.5 border-b border-border flex items-center justify-between bg-muted/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-base">
            {currentPersona.avatar}
          </div>
          <div>
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
              {currentPersona.name}
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                Active
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">{currentPersona.title}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Persona Selector Carousel */}
      <div className="p-2 border-b border-border bg-muted/20 flex gap-1.5 overflow-x-auto no-scrollbar">
        {Object.entries(MENTOR_PERSONAS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setPersona(key as keyof typeof MENTOR_PERSONAS)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              persona === key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{val.avatar}</span>
            <span>{key}</span>
          </button>
        ))}
      </div>

      {/* Quick Context Summary */}
      <div className="px-3 py-2 bg-primary/5 border-b border-primary/10 flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500" /> Syllabus: 65% • Accuracy: 64%
        </span>
        <span className="text-primary font-semibold">UPSC Air 1 Grounding</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 text-xs ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                {currentPersona.avatar}
              </div>
            )}
            <div
              className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none font-medium"
                  : "bg-muted/70 border border-border text-foreground rounded-tl-none"
              }`}
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-[10px] shrink-0 mt-0.5 text-foreground">
                <User className="w-3 h-3" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
            <span>Consulting UPSC strategy engine & syllabus graphs...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="p-2 border-t border-border bg-muted/10 flex gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => setInput(qp)}
            className="px-2 py-1 rounded-md bg-muted text-[10px] text-muted-foreground hover:text-foreground whitespace-nowrap border border-border hover:border-primary/40 transition-colors"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-border bg-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Ask ${currentPersona.name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-muted/70 border border-border text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-opacity"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
