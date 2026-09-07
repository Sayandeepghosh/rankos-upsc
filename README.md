# 🏛️ RankOS — UPSC CSE Preparation Operating System

> **RankOS** is an intelligent, full-stack operating system engineered for serious UPSC Civil Services Examination (CSE) aspirants whose mission is securing a top rank (AIR < 100).
> 
> Unlike generic study planners, notes apps, or passive dashboards, RankOS actively monitors preparation velocity, diagnoses knowledge decay, detects cognitive blindspots, automatically reschedules spaced revisions, and dynamically computes what the aspirant must do next.

---

## 🎯 The Core Philosophy

```
STUDY ➔ RECALL ➔ TEST ➔ EVALUATE ➔ DETECT WEAKNESS ➔ RESCHEDULE ➔ REVISE ➔ RETEST
```

RankOS eliminates decision fatigue by continuously answering the critical questions:
- *“What should I study right now?”* — **Smart Daily Commander**
- *“What am I about to forget?”* — **Spaced Repetition Engine (SM-2 / FSRS)**
- *“Where are my marks leaking?”* — **Mistake Vault & Diagnostic Analytics**
- *“Am I actually ready for Prelims?”* — **Itemized Multi-Factor Readiness Score**
- *“How does my Mains answer compare to the topper benchmark?”* — **16-Point Rubric AI Evaluation**

---

## 📐 Architecture & Tech Stack

RankOS is engineered with a modular, scalable, type-safe architecture:

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/) with React Server Components (RSC) and Client Components where interactivity is required.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a focused dark mode default (`#0B0F17` background, slate cards, emerald accents) and light mode toggle.
- **Data Persistence**: [Prisma ORM](https://www.prisma.io/) with a fully normalized 40-model relational schema. Configured for SQLite for zero-setup local operation and 100% compliant with PostgreSQL.
- **Charts & Data Viz**: [Recharts](https://recharts.org/) for radar readiness profiles, mark distributions, syllabus velocity curves, and decay tracking.
- **Icons**: [Lucide React](https://lucide.dev/).
- **AI Layer**: Pluggable multi-provider abstraction supporting **Gemini (Google AI)**, **Anthropic Claude**, and **OpenAI GPT-4o**, backed by a deterministic, offline-capable UPSC heuristic evaluation engine.

---

## 🧭 Core Engines & Algorithms

### 1. Spaced Repetition System (`src/lib/scheduling/spaced-repetition.ts`)
RankOS implements an adaptive spaced repetition algorithm inspired by SuperMemo SM-2 and FSRS:
- **Interval Formula**:
  $$I_1 = 1 \text{ day}, \quad I_2 = 3 \text{ days}, \quad I_n = \lceil I_{n-1} \times EF \rceil$$
- **Easiness Factor ($EF$) Adjustment**:
  $$EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$$
  Where $q \in \{1, 2, 3, 4, 5\}$ is candidate recall confidence. $EF$ is clamped at $\ge 1.3$.
- **Retention Decay Curve**:
  $$R(t) = \exp\left(-\frac{t}{S}\right)$$
  Where $S$ is topic memory stability (days) and $t$ is days elapsed since the last review. When $R(t) < 0.65$, RankOS flags the topic as critically decayed and queues an emergency active recall session.

### 2. 13-Stage Syllabus Lifecycle & Mastery Index (`src/lib/mastery/calculator.ts`)
Every micro-topic progresses through an exhaustive 13-stage mastery journey:
1. `NOT_STARTED`
2. `PLANNED`
3. `FIRST_READING`
4. `NOTES_CREATED`
5. `ACTIVE_RECALL_1`
6. `REVISION_1`
7. `PYQ_PRACTICED`
8. `REVISION_2`
9. `TESTED_PRELIMS`
10. `TESTED_MAINS`
11. `REVISION_3`
12. `WEAKNESS_RESOLVED`
13. `HIGH_RETENTION_MASTERED`

The **Mastery Score** (0–100%) integrates stage weight (40%), recall confidence (20%), Prelims accuracy (20%), Mains score (10%), and current affairs linkage (10%), penalized by time decay.

### 3. Prelims Diagnostic Marking Engine (`src/lib/prelims/marking.ts`)
- **UPSC Standard Negative Marking**:
  - GS-1: $+2.00$ for correct, $-0.66$ for incorrect.
  - CSAT: $+2.50$ for correct, $-0.83$ for incorrect.
- **Trap Detection**:
  - Automatically classifies errors into 8 root causes: *Factual Gap*, *Extreme Word Trap*, *Misread Question*, *Conceptual Confusion*, *Second Guess Reversal*, *Overthinking*, *Silly Mistake*, or *CSAT Calculation Error*.
  - Automatically logs failed attempts into the **Mistake Vault** with one-click creation of corrective flashcards.

### 4. 16-Point Mains Answer Rubric (`src/lib/mains/rubric.ts`)
Evaluates answers out of 10 marks (150 words) or 15 marks (250 words) across 16 authentic UPSC criteria:
- Directive comprehension (*Critically Examine*, *Discuss*, *Elucidate*, *Comment*)
- Introduction (Definition / Context / Constitutional Article / Data)
- Multi-dimensional breakdown (PESTLE: Political, Economic, Social, Tech, Legal, Environmental)
- Constitutional Articles / Judicial Case Laws / Committees / Reports
- Diagrams, schematics, and flowcharts
- Balanced, forward-looking conclusion (SDGs / Vision 2047 / Constitutional morality)

---

## 🗂️ Application Navigation & Modules

RankOS is organized into 18 primary navigation centers:

| Navigation Item | Route | Key Features |
| :--- | :--- | :--- |
| **Command Center** | `/` | Readiness breakdown, daily focus, quick action widgets, recent velocity, countdown clock |
| **Today's Mission** | `/today` | Smart Daily Commander, No-Zero-Day protocol, time-blocked session launcher |
| **Syllabus Tree** | `/syllabus` | GS-1 to GS-4, CSAT, and PSIR Optional complete micro-topic hierarchy with mastery bars |
| **Smart Planner** | `/planner` | Multi-phase macro/micro schedule, dynamic backlog manager, timeline generator |
| **Prelims Engine** | `/prelims` | Timed practice simulator, elimination technique analytics, question filters |
| **Mains Workspace** | `/mains` | 16-point rubric evaluator, rich Markdown answer editor, structural guidance |
| **PSIR Optional** | `/psir` | Western & Indian Political Thought, Paper 1A/1B, Paper 2A/2B scholar matrix |
| **Current Affairs** | `/current-affairs` | Static-to-dynamic syllabus mapper, issue-wise notes, Prelims pointers |
| **Revision Deck** | `/revision` | Spaced repetition flashcards, Leitner box queue, overdue decay warnings |
| **PYQ Lab** | `/pyq` | 2013–2024 trend radar, weightage heatmaps, recurring theme filters |
| **Mock War Room** | `/tests` | Full-length and sectional test simulator, time allocation audits |
| **Essay Lab** | `/essay` | Philosophical & socio-economic frameworks, quote repository, brainstormer |
| **Ethics Lab** | `/ethics` | GS-4 case study framework, ethical thinkers, constitutional values bank |
| **Mistake Vault** | `/mistakes` | Error taxonomy, anti-patterns, repeat-mistake prevention drills |
| **Knowledge Graph**| `/knowledge-graph`| Inter-subject nexus (e.g., Environment ↔ Economy ↔ Ethics) |
| **Analytics Engine**| `/analytics` | Radar readiness profiles, score distributions, speed-accuracy curves |
| **Resource Library**| `/resources` | Standard reference tracker (Laxmikanth, Spectrum, Ramesh Singh, etc.) |
| **Settings** | `/settings` | Target year, optional subject, daily study target, API keys, data export |

### Omnipresent Command & Control:
- **Global Search (`Cmd+K` / `Ctrl+K`)**: Instant search across syllabus nodes, thinkers, questions, and notes.
- **AI UPSC Mentor (`Cmd+J` / `Ctrl+J`)**: Floating drawer with 7 specialist personas:
  1. *AIR 1 Ranker* — High-leverage, practical strategy
  2. *Strict Evaluator* — Brutally honest, standard UPSC marking
  3. *Prelims Elimination Specialist* — Option elimination logic
  4. *Mains Answer Architect* — Multi-dimensional structure & flow
  5. *PSIR Scholar* — Scholarly debates and theoretical synthesis
  6. *Ethics Counselor* — Case study resolution & moral philosophy
  7. *Burnout Therapist* — Psychological grounding & consistency coaching

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/rankos-upsc.git
cd rankos-upsc
npm install
```

### 2. Configure Environment
Copy the example environment file:
```bash
cp .env.example .env
```
Default configuration works immediately with local SQLite:
```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Add your AI API key (Gemini, Anthropic, or OpenAI)
# If omitted, RankOS seamlessly runs its built-in deterministic UPSC evaluation engine
GEMINI_API_KEY=""
ANTHROPIC_API_KEY=""
OPENAI_API_KEY=""
```

### 3. Initialize & Seed the Database
```bash
npx prisma db push
npm run seed
```
This populates RankOS with:
- Standard GS-1, GS-2, GS-3, GS-4, CSAT, and PSIR syllabus trees
- Authentic Prelims MCQs with elimination rationales
- Real PYQs and topper-calibrated Mains questions
- Western and Indian political thinkers with quotes and theoretical debates
- Pre-configured current affairs dossiers mapped to syllabus nodes

### 4. Run Verification Tests
```bash
npm test
```
All core preparation engines (Mastery, Spaced Repetition, Prelims Marking, Mains Rubric, Priority Resolver, Backlog Handler, Readiness) will run and report 100% pass.

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production
```bash
npm run build
npm start
```

---

## 📊 Database Schema Highlights

Defined in `prisma/schema.prisma`:
- **Core Entities**: `User`, `UserProfile`, `ExamTarget`, `PreparationPhase`
- **Syllabus & Progress**: `Paper`, `Subject`, `SyllabusNode`, `TopicProgress`
- **Execution & Daily Operations**: `StudyTask`, `StudySession`, `StudyPlan`
- **Retention & Active Recall**: `RevisionSchedule`, `RevisionAttempt`, `RecallAttempt`
- **Testing & PYQs**: `Question`, `QuestionOption`, `QuestionAttempt`, `Test`, `TestAttempt`, `PYQ`
- **Mains & Subjective**: `MainsQuestion`, `MainsAnswer`, `AnswerEvaluation`, `Essay`, `EssayAttempt`, `EthicsCase`
- **Optional (PSIR)**: `OptionalTopic`, `Thinker`, `Quote`
- **Intelligence & Analytics**: `Mistake`, `CurrentAffair`, `Note`, `Resource`, `ReadinessMetric`, `AnalyticsSnapshot`, `AIInsight`

---

## 🛡️ License

MIT License. Designed with dedication for UPSC Civil Services aspirants striving for excellence.
