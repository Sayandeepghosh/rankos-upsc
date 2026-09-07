"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  BookOpen,
  Award,
  RefreshCw,
  RotateCcw,
  Check,
  ChevronRight,
  HelpCircle,
  X,
  TrendingUp,
} from "lucide-react";

const DIRECTIVE_GUIDE: Record<string, string> = {
  Discuss: "Present a debate from multiple perspectives (pros and cons), weigh the evidence, and give a reasoned conclusion.",
  Analyse: "Break down the issue into component parts, examine each element closely, and show how they relate to the whole.",
  "Critically Analyse": "Go beyond mere analysis to question assumptions, identify flaws or unaddressed challenges, and balance arguments impartially.",
  Examine: "Investigate closely, uncover underlying facts or causes, and state clearly what the current reality is.",
  Evaluate: "Appraise the value, effectiveness, or impact based on clear criteria (e.g. constitutional principles or social outcomes).",
  Comment: "Give your reasoned opinion based on facts and sound logic, synthesizing the key takeaways.",
  Elucidate: "Make clear or explain in detail, using illustrative examples, data, and case laws.",
  Justify: "Provide strong constitutional, economic, or ethical grounds to support a position.",
};

export function MainsWorkspaceView({ questions }: { questions: any[] }) {
  const [selectedQuestion, setSelectedQuestion] = useState<any>(questions[0] || null);
  const [answerText, setAnswerText] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(selectedQuestion?.allottedMinutes * 60 || 420);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(
    selectedQuestion?.answers?.[0]?.evaluations?.[0]
      ? {
          overallScore: selectedQuestion.answers[0].evaluations[0].overallScore,
          maxMarks: selectedQuestion.marks,
          understandingScore: selectedQuestion.answers[0].evaluations[0].understandingScore,
          structureScore: selectedQuestion.answers[0].evaluations[0].structureScore,
          dimensionsScore: selectedQuestion.answers[0].evaluations[0].dimensionsScore,
          constitutionScore: selectedQuestion.answers[0].evaluations[0].constitutionScore,
          examplesDataScore: selectedQuestion.answers[0].evaluations[0].examplesDataScore,
          conclusionScore: selectedQuestion.answers[0].evaluations[0].conclusionScore,
          strengths: JSON.parse(selectedQuestion.answers[0].evaluations[0].strengths || "[]"),
          majorWeaknesses: JSON.parse(selectedQuestion.answers[0].evaluations[0].majorWeaknesses || "[]"),
          missingDimensions: JSON.parse(selectedQuestion.answers[0].evaluations[0].missingDimensions || "[]"),
          betterStructure: selectedQuestion.answers[0].evaluations[0].betterStructure,
          enrichmentPoints: JSON.parse(selectedQuestion.answers[0].evaluations[0].enrichmentPoints || "[]"),
          modelAnswer: selectedQuestion.answers[0].evaluations[0].modelAnswer,
          improvementSummary: selectedQuestion.answers[0].evaluations[0].improvementSummary,
        }
      : null
  );
  const [loading, setLoading] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(1);
  const [showDirectiveGuide, setShowDirectiveGuide] = useState(false);
  const [compareVersions, setCompareVersions] = useState(false);

  useEffect(() => {
    if (selectedQuestion) {
      setSecondsLeft(selectedQuestion.allottedMinutes * 60);
      setIsTimerRunning(false);
      const latestAnswer = selectedQuestion.answers?.[0];
      if (latestAnswer) {
        setAnswerText(latestAnswer.answerText);
        setCurrentVersion(latestAnswer.version);
        const ev = latestAnswer.evaluations?.[0];
        if (ev) {
          setEvaluation({
            overallScore: ev.overallScore,
            maxMarks: selectedQuestion.marks,
            understandingScore: ev.understandingScore,
            structureScore: ev.structureScore,
            dimensionsScore: ev.dimensionsScore,
            constitutionScore: ev.constitutionScore,
            examplesDataScore: ev.examplesDataScore,
            conclusionScore: ev.conclusionScore,
            strengths: JSON.parse(ev.strengths || "[]"),
            majorWeaknesses: JSON.parse(ev.majorWeaknesses || "[]"),
            missingDimensions: JSON.parse(ev.missingDimensions || "[]"),
            betterStructure: ev.betterStructure,
            enrichmentPoints: JSON.parse(ev.enrichmentPoints || "[]"),
            modelAnswer: ev.modelAnswer,
            improvementSummary: ev.improvementSummary,
          });
        }
      } else {
        setAnswerText("");
        setEvaluation(null);
        setCurrentVersion(1);
      }
    }
  }, [selectedQuestion]);

  // Timer Countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsLeft]);

  const wordCount = answerText.trim().split(/\s+/).filter(Boolean).length;

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/mains/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: selectedQuestion.id,
          answerText,
          timeTakenSec: selectedQuestion.allottedMinutes * 60 - secondsLeft,
          version: currentVersion,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEvaluation(data.evaluation);
        setIsTimerRunning(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartRewrite = () => {
    setCurrentVersion((v) => v + 1);
    setSecondsLeft(selectedQuestion.allottedMinutes * 60);
    setIsTimerRunning(true);
    // Keep baseline text or clear for rewrite
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Mains Answer Writing Lab</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold font-mono">
              Strict 16-Point Rubric
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Exam conditions workspace. Strict UPSC evaluation: multidimensional analysis, constitutional grounding, and answer improvement loop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDirectiveGuide(true)}
            className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground border border-border text-xs font-semibold flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span>Directive Keywords Guide</span>
          </button>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Question Bank & Attempt History */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Mains Practice Queue
            </span>
            <div className="space-y-2">
              {questions.map((q) => {
                const isSelected = selectedQuestion?.id === q.id;
                const hasAnswers = q.answers?.length > 0;
                const bestScore = q.answers?.[0]?.overallScore || 0;

                return (
                  <div
                    key={q.id}
                    onClick={() => setSelectedQuestion(q)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border-primary shadow-sm"
                        : "bg-muted/30 border-border hover:border-primary/40 hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="px-1.5 py-0.2 rounded bg-muted font-bold text-primary">
                        {q.paper}
                      </span>
                      <span className="font-semibold text-muted-foreground">
                        {q.marks} Marks • {q.wordLimit} Words
                      </span>
                    </div>
                    <div className="text-xs font-bold text-foreground line-clamp-2">
                      {q.questionText}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-primary">
                        Directive: {q.directive}
                      </span>
                      {hasAnswers ? (
                        <span className="text-emerald-500 font-mono font-bold">
                          Best: {bestScore.toFixed(1)}/{q.marks}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Unattempted</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 8 Cols: Answer Editor & Evaluator */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Question Box */}
          <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground font-mono font-bold text-xs">
                  {selectedQuestion?.paper}
                </span>
                <span className="text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                  Directive: {selectedQuestion?.directive}
                </span>
                <span className="text-xs text-muted-foreground">
                  Attempt #{currentVersion}
                </span>
              </div>

              {/* Timer Pill */}
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 border ${
                    secondsLeft <= 60
                      ? "bg-rose-500/15 border-rose-500 text-rose-500 animate-pulse"
                      : "bg-muted border-border text-foreground"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimer(secondsLeft)}</span>
                </div>
                <button
                  onClick={() => setIsTimerRunning((r) => !r)}
                  className="px-2 py-1 rounded-lg bg-muted text-xs font-semibold hover:bg-muted/80"
                >
                  {isTimerRunning ? "Pause" : "Start Clock"}
                </button>
              </div>
            </div>

            <div className="text-sm font-semibold text-foreground leading-relaxed">
              {selectedQuestion?.questionText}
            </div>

            {/* Writing Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Distraction-free Answer Sheet</span>
                <span
                  className={`font-mono font-bold ${
                    wordCount > selectedQuestion?.wordLimit
                      ? "text-amber-500"
                      : "text-foreground"
                  }`}
                >
                  {wordCount} / {selectedQuestion?.wordLimit} words
                </span>
              </div>

              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Write your answer here (Introduction, Multi-dimensional body paragraphs, Constitutional references, and Conclusion)..."
                rows={12}
                className="w-full p-4 rounded-xl bg-muted/30 border border-border text-xs sm:text-sm text-foreground outline-none focus:border-primary font-mono leading-relaxed resize-y transition-colors"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-[11px] text-muted-foreground font-mono">
                Adhere to 7-min budget for 10-markers • Use sub-headings
              </span>

              <div className="flex items-center gap-2">
                {evaluation && (
                  <button
                    onClick={handleStartRewrite}
                    className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground border border-border text-xs font-semibold flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Rewrite (Attempt #{currentVersion + 1})</span>
                  </button>
                )}

                <button
                  onClick={handleSubmitAnswer}
                  disabled={!answerText.trim() || loading}
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2 shadow-sm transition-all"
                >
                  {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{loading ? "Strict AI Evaluating..." : "Submit for Strict Evaluation"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Strict AI Evaluation Results */}
          {evaluation && (
            <div className="p-6 rounded-2xl bg-card border border-primary/30 shadow-sm space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center font-extrabold text-primary font-mono text-lg">
                    {evaluation.overallScore.toFixed(1)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <span>Strict UPSC Evaluation Report</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono">
                        Attempt #{currentVersion}
                      </span>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Assessed against 16 UPSC criteria • Score: {evaluation.overallScore} / {evaluation.maxMarks}
                    </p>
                  </div>
                </div>

                {evaluation.improvementSummary && (
                  <div className="text-xs font-mono text-emerald-500 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {evaluation.improvementSummary}
                  </div>
                )}
              </div>

              {/* Sub-Scores Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                  <div className="text-[10px] text-muted-foreground">Understanding</div>
                  <div className="text-sm font-mono font-bold mt-1 text-foreground">
                    {evaluation.understandingScore} / 10
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                  <div className="text-[10px] text-muted-foreground">Structure</div>
                  <div className="text-sm font-mono font-bold mt-1 text-foreground">
                    {evaluation.structureScore} / 10
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                  <div className="text-[10px] text-muted-foreground">Dimensions</div>
                  <div className="text-sm font-mono font-bold mt-1 text-foreground">
                    {evaluation.dimensionsScore} / 10
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                  <div className="text-[10px] text-muted-foreground">Constitutional</div>
                  <div className="text-sm font-mono font-bold mt-1 text-foreground">
                    {evaluation.constitutionScore} / 10
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                  <div className="text-[10px] text-muted-foreground">Examples/Data</div>
                  <div className="text-sm font-mono font-bold mt-1 text-foreground">
                    {evaluation.examplesDataScore} / 10
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                  <div className="text-[10px] text-muted-foreground">Conclusion</div>
                  <div className="text-sm font-mono font-bold mt-1 text-foreground">
                    {evaluation.conclusionScore} / 10
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Strengths */}
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Demonstrated Strengths</span>
                  </span>
                  <ul className="space-y-1.5 list-disc list-inside text-foreground/90">
                    {evaluation.strengths.map((s: string, i: number) => (
                      <li key={i} className="leading-relaxed">{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Major Weaknesses */}
                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                  <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Critical Weaknesses</span>
                  </span>
                  <ul className="space-y-1.5 list-disc list-inside text-foreground/90">
                    {evaluation.majorWeaknesses.map((w: string, i: number) => (
                      <li key={i} className="leading-relaxed">{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Dimensions */}
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-2">
                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Missing Dimensions (Value Addition Required)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {evaluation.missingDimensions.map((d: string, i: number) => (
                    <div key={i} className="p-2 rounded-lg bg-card border border-border text-foreground">
                      {d}
                    </div>
                  ))}
                </div>
              </div>

              {/* Better Structure Outline */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs space-y-2">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>UPSC Optimal Answer Structure Outline</span>
                </span>
                <pre className="whitespace-pre-line font-mono text-[11px] text-muted-foreground leading-relaxed">
                  {evaluation.betterStructure}
                </pre>
              </div>

              {/* Model Answer Preview */}
              {evaluation.modelAnswer && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs space-y-2">
                  <span className="font-bold text-primary">Model Value Additions & Enrichment Points:</span>
                  <div className="text-foreground/90 whitespace-pre-line leading-relaxed">
                    {evaluation.modelAnswer}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Directive Keyword Guide Drawer */}
      {showDirectiveGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary" />
                <span>UPSC Directive Keywords Playbook</span>
              </h3>
              <button onClick={() => setShowDirectiveGuide(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {Object.entries(DIRECTIVE_GUIDE).map(([directive, explanation]) => (
                <div key={directive} className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
                  <span className="font-bold text-primary font-mono text-sm">{directive}</span>
                  <p className="text-muted-foreground leading-relaxed">{explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
