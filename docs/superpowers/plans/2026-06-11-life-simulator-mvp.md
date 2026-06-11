# Life Simulator MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first playable static web MVP for a detailed life simulator with data-driven events, seeded randomness, local saves, and a GitHub Pages build path.

**Architecture:** The app uses a client-only Vite, React, and TypeScript stack. The simulation engine is pure TypeScript and independent from React; content is structured data; React screens orchestrate setup, play, endings, and archive views. Browser persistence uses versioned localStorage.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, GitHub Actions.

---

## File Structure

- Create `package.json`: npm scripts and dependencies.
- Create `index.html`: Vite HTML entry.
- Create `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`: TypeScript and Vite configuration.
- Create `vitest.config.ts`, `src/test/setup.ts`: test configuration.
- Create `src/main.tsx`, `src/App.tsx`, `src/styles.css`: React entry, screen orchestration, and styling.
- Create `src/engine/types.ts`: shared engine and content types.
- Create `src/engine/stage.ts`: age-to-life-stage mapping.
- Create `src/engine/rng.ts`: seeded random number generator.
- Create `src/engine/conditions.ts`: condition evaluation.
- Create `src/engine/effects.ts`: centralized effect application.
- Create `src/engine/eventPicker.ts`: event eligibility and weighted selection.
- Create `src/engine/scoring.ts`: ending and score calculation.
- Create `src/engine/gameLoop.ts`: run creation and turn advancement.
- Create `src/content/base/events.ts`, `src/content/base/endings.ts`, `src/content/base/index.ts`: starter content pack.
- Create `src/state/saveSystem.ts`: versioned localStorage persistence.
- Create `src/ui/components/AttributePanel.tsx`, `src/ui/components/EventCard.tsx`, `src/ui/components/ChoiceList.tsx`, `src/ui/components/LifeTimeline.tsx`: reusable UI.
- Create `src/ui/screens/StartScreen.tsx`, `src/ui/screens/SetupScreen.tsx`, `src/ui/screens/PlayScreen.tsx`, `src/ui/screens/EndingScreen.tsx`, `src/ui/screens/ArchiveScreen.tsx`: app screens.
- Create `src/engine/*.test.ts`, `src/content/base/content.test.ts`, `src/state/saveSystem.test.ts`, `src/App.test.tsx`: focused test coverage.
- Create `.github/workflows/deploy.yml`: GitHub Pages build workflow.

## Task 1: Scaffold Vite React TypeScript App

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Create package and toolchain files**

Create package scripts:

```json
{
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 3: Add a minimal smoke test setup**

Create `src/test/setup.ts` that imports `@testing-library/jest-dom/vitest`.

- [ ] **Step 4: Verify baseline**

Run: `npm test -- --run`

Expected: Vitest exits successfully with no test files or a clear no-tests state before app code exists.

## Task 2: Define Engine Types And Stage Mapping

**Files:**
- Create: `src/engine/types.ts`
- Create: `src/engine/stage.ts`
- Create: `src/engine/stage.test.ts`

- [ ] **Step 1: Write failing stage tests**

Test `getLifeStage(0)`, `getLifeStage(8)`, `getLifeStage(16)`, `getLifeStage(30)`, `getLifeStage(55)`, and `getLifeStage(80)`.

- [ ] **Step 2: Run stage tests to verify red**

Run: `npm test -- src/engine/stage.test.ts`

Expected: fail because `stage.ts` does not exist yet.

- [ ] **Step 3: Implement shared types and stage mapping**

Add stat, stage, condition, effect, event, ending, history, and run state types. Implement stage mapping: baby `0-2`, child `3-12`, teen `13-18`, adult `19-44`, middle `45-64`, elder `65+`.

- [ ] **Step 4: Run stage tests to verify green**

Run: `npm test -- src/engine/stage.test.ts`

Expected: pass.

## Task 3: Implement Seeded Randomness

**Files:**
- Create: `src/engine/rng.ts`
- Create: `src/engine/rng.test.ts`

- [ ] **Step 1: Write failing RNG tests**

Test that the same seed yields the same sequence and different seeds yield different first values.

- [ ] **Step 2: Run RNG tests to verify red**

Run: `npm test -- src/engine/rng.test.ts`

Expected: fail because `rng.ts` does not exist yet.

- [ ] **Step 3: Implement seeded RNG**

Implement a deterministic string-to-number seed hash plus a small PRNG with `nextFloat()`, `nextInt(max)`, `pick(items)`, and `weightedPick(items, weight)`.

- [ ] **Step 4: Run RNG tests to verify green**

Run: `npm test -- src/engine/rng.test.ts`

Expected: pass.

## Task 4: Implement Conditions And Effects

**Files:**
- Create: `src/engine/conditions.ts`
- Create: `src/engine/conditions.test.ts`
- Create: `src/engine/effects.ts`
- Create: `src/engine/effects.test.ts`

- [ ] **Step 1: Write failing condition tests**

Cover stat comparisons, required tags, excluded tags, happened event ids, and age bounds.

- [ ] **Step 2: Verify condition tests fail**

Run: `npm test -- src/engine/conditions.test.ts`

Expected: fail because condition implementation does not exist.

- [ ] **Step 3: Implement condition evaluation**

Implement object-based conditions only: stat comparison, tag inclusion, tag exclusion, event history, and age range.

- [ ] **Step 4: Verify condition tests pass**

Run: `npm test -- src/engine/conditions.test.ts`

Expected: pass.

- [ ] **Step 5: Write failing effect tests**

Cover stat clamp, tag add/remove, milestone add, time advance, and ending trigger.

- [ ] **Step 6: Verify effect tests fail**

Run: `npm test -- src/engine/effects.test.ts`

Expected: fail because effect implementation does not exist.

- [ ] **Step 7: Implement effect application**

Implement immutable effect application. Clamp visible stats and long-term tracks to `0-100`.

- [ ] **Step 8: Verify effect tests pass**

Run: `npm test -- src/engine/conditions.test.ts src/engine/effects.test.ts`

Expected: pass.

## Task 5: Implement Event Selection And Game Loop

**Files:**
- Create: `src/engine/eventPicker.ts`
- Create: `src/engine/eventPicker.test.ts`
- Create: `src/engine/scoring.ts`
- Create: `src/engine/scoring.test.ts`
- Create: `src/engine/gameLoop.ts`
- Create: `src/engine/gameLoop.test.ts`

- [ ] **Step 1: Write failing event picker tests**

Cover age/stage filtering, tag filtering, one-time event exclusion, fallback event use, and weighted selection stability.

- [ ] **Step 2: Verify event picker tests fail**

Run: `npm test -- src/engine/eventPicker.test.ts`

Expected: fail because event picker does not exist.

- [ ] **Step 3: Implement event eligibility and selection**

Use `isEventEligible`, `getEligibleEvents`, and `pickNextEvent`.

- [ ] **Step 4: Verify event picker tests pass**

Run: `npm test -- src/engine/eventPicker.test.ts`

Expected: pass.

- [ ] **Step 5: Write failing scoring tests**

Cover terminal ending priority, age-based ending fallback, and score calculation.

- [ ] **Step 6: Verify scoring tests fail**

Run: `npm test -- src/engine/scoring.test.ts`

Expected: fail because scoring does not exist.

- [ ] **Step 7: Implement scoring and ending selection**

Compute a final score from age, health, wealth, education, career, family, relationships, and reputation. Prefer explicit triggered ending ids when present.

- [ ] **Step 8: Verify scoring tests pass**

Run: `npm test -- src/engine/scoring.test.ts`

Expected: pass.

- [ ] **Step 9: Write failing game loop tests**

Cover new run creation, selecting a choice, recording history, advancing age, autosaving-friendly state shape, and reaching an ending.

- [ ] **Step 10: Verify game loop tests fail**

Run: `npm test -- src/engine/gameLoop.test.ts`

Expected: fail because game loop does not exist.

- [ ] **Step 11: Implement game loop**

Implement `createNewRun`, `startRun`, and `advanceRun`.

- [ ] **Step 12: Verify game loop tests pass**

Run: `npm test -- src/engine/eventPicker.test.ts src/engine/scoring.test.ts src/engine/gameLoop.test.ts`

Expected: pass.

## Task 6: Add Starter Content Pack

**Files:**
- Create: `src/content/base/events.ts`
- Create: `src/content/base/endings.ts`
- Create: `src/content/base/index.ts`
- Create: `src/content/base/content.test.ts`

- [ ] **Step 1: Write failing content validation tests**

Cover unique event ids, non-empty choices, valid choice ids, valid ending ids, and smoke-run multiple seeds.

- [ ] **Step 2: Verify content tests fail**

Run: `npm test -- src/content/base/content.test.ts`

Expected: fail because content files do not exist.

- [ ] **Step 3: Implement starter content**

Add enough content for birth/setup, childhood, teen, adult, middle age, elder, accident/health early endings, and at least three final endings.

- [ ] **Step 4: Verify content tests pass**

Run: `npm test -- src/content/base/content.test.ts`

Expected: pass.

## Task 7: Implement Local Save System

**Files:**
- Create: `src/state/saveSystem.ts`
- Create: `src/state/saveSystem.test.ts`

- [ ] **Step 1: Write failing save tests**

Cover current run save/load/clear, archive append/load, unlocked ending persistence, corrupt JSON handling, and version field.

- [ ] **Step 2: Verify save tests fail**

Run: `npm test -- src/state/saveSystem.test.ts`

Expected: fail because save system does not exist.

- [ ] **Step 3: Implement localStorage save system**

Implement `createSaveSystem(storage)` with explicit storage injection for tests.

- [ ] **Step 4: Verify save tests pass**

Run: `npm test -- src/state/saveSystem.test.ts`

Expected: pass.

## Task 8: Build React UI

**Files:**
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `src/ui/components/AttributePanel.tsx`
- Create: `src/ui/components/EventCard.tsx`
- Create: `src/ui/components/ChoiceList.tsx`
- Create: `src/ui/components/LifeTimeline.tsx`
- Create: `src/ui/screens/StartScreen.tsx`
- Create: `src/ui/screens/SetupScreen.tsx`
- Create: `src/ui/screens/PlayScreen.tsx`
- Create: `src/ui/screens/EndingScreen.tsx`
- Create: `src/ui/screens/ArchiveScreen.tsx`
- Create: `src/App.test.tsx`

- [ ] **Step 1: Write failing app flow test**

Use Testing Library to render the app, start a new life, choose at least one option, and see age or timeline change.

- [ ] **Step 2: Verify app test fails**

Run: `npm test -- src/App.test.tsx`

Expected: fail because the app UI does not exist.

- [ ] **Step 3: Implement screens and components**

Wire UI to `createNewRun`, `startRun`, `advanceRun`, and `createSaveSystem(window.localStorage)`. Keep text-heavy screens scan-friendly and responsive.

- [ ] **Step 4: Verify app test passes**

Run: `npm test -- src/App.test.tsx`

Expected: pass.

## Task 9: Add Deployment Workflow And Full Verification

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `vite.config.ts`

- [ ] **Step 1: Add GitHub Pages workflow**

Create a workflow that installs dependencies, builds the project, uploads `dist`, and deploys Pages on pushes to `main` or `master`.

- [ ] **Step 2: Run full test suite**

Run: `npm test -- --run`

Expected: all tests pass.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: TypeScript and Vite build complete successfully.

- [ ] **Step 4: Start local server and browser-check app**

Run: `npm run dev -- --port 5173`

Open `http://127.0.0.1:5173/`, verify the start screen renders, start a life, make choices, reach or approach an ending, and confirm there are no visible layout failures.

- [ ] **Step 5: Commit completed implementation**

Run:

```bash
git add .
git commit -m "Build life simulator MVP"
```

Expected: implementation commit is created on `codex/life-simulator-mvp`.

## Self-Review

- The plan covers the approved spec: static Vite app, React UI, pure TypeScript engine, data-driven events, seeded randomness, localStorage saves, testing, and GitHub Pages deployment.
- The plan keeps first-version scope client-only and excludes accounts, cloud saves, backend services, procedural generation, and a content editor.
- Types and function names are consistent across tasks: `createNewRun`, `startRun`, `advanceRun`, `createSaveSystem`, `pickNextEvent`, `applyEffects`, and `selectEnding` are introduced before UI usage.
