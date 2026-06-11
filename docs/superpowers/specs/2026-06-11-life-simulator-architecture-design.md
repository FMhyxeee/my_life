# Life Simulator Web Game Architecture Design

Date: 2026-06-11

## Scope

This design covers the technical architecture for a browser-based life simulation game deployed on GitHub Pages. The first version is a static, client-only web game with local saves. It does not include account login, cloud saves, multiplayer, server-side leaderboards, or generated story content.

The game should support a more detailed version of the "life restart simulator" style: players advance through life by making choices, receiving random or conditional events, accumulating long-term state, and reaching endings shaped by attributes, history, luck, and previous choices.

## Goals

- Run entirely as a static site on GitHub Pages.
- Use a data-driven event system so new life events can be added without editing UI code.
- Keep simulation logic separate from presentation components.
- Support reproducible runs through seeded randomness.
- Persist progress, settings, unlocked endings, and run history in the browser.
- Make the engine testable without requiring a browser UI.

## Non-Goals

- No backend service in the first version.
- No account system or cloud synchronization.
- No real-money mechanics.
- No procedural text generation dependency.
- No complex visual novel editor in the first version.

## Recommended Stack

The first implementation should use:

- Vite for local development and production builds.
- React for interactive screens and reusable UI components.
- TypeScript for engine, state, and content schemas.
- Vitest for engine and content validation tests.
- GitHub Actions for build and GitHub Pages deployment.

React is recommended over plain HTML because the game will need reusable screens, stateful interactions, conditional panels, timelines, result summaries, and eventually content browsing tools. TypeScript is important because most bugs in this project will come from malformed content, invalid effects, or state transitions.

## High-Level Architecture

The game should be structured as a deterministic simulation engine surrounded by UI and content data:

```text
Player choice
  -> apply choice effects
  -> advance game state
  -> evaluate age, stage, attributes, tags, and history
  -> filter eligible events
  -> select an event by weight, luck, and seeded randomness
  -> render event and choices
  -> repeat until ending
```

The project should avoid a single hard-coded branching story tree. Instead, it should use an event pool where each event declares when it can appear, how likely it is, what choices it offers, and how those choices affect the run.

## Proposed File Structure

```text
src/
  engine/
    gameLoop.ts
    rng.ts
    conditions.ts
    effects.ts
    eventPicker.ts
    scoring.ts

  content/
    schemas/
      eventSchema.ts
      endingSchema.ts
      stateSchema.ts
    packs/
      base/
        events/
        endings.ts
        startingProfiles.ts

  state/
    runState.ts
    saveSystem.ts
    selectors.ts

  ui/
    screens/
      StartScreen.tsx
      SetupScreen.tsx
      PlayScreen.tsx
      EndingScreen.tsx
      ArchiveScreen.tsx
    components/
      AttributePanel.tsx
      EventCard.tsx
      ChoiceList.tsx
      LifeTimeline.tsx
      SaveControls.tsx

  tests/
    engine/
    content/
```

The exact file names can change during implementation, but the boundaries should stay stable: engine logic should not import UI components, and content data should be validated before being used by the engine.

## Game State Model

The first version should track a compact but extensible state object:

```text
identity:
  seed, name, birthYear, currentAge, currentStage

core attributes:
  health, intelligence, charm, wealth, mindset, luck

long-term tracks:
  education, career, family, relationships, reputation, risk

hidden or semi-hidden variables:
  stress, classBackground, personalityLeanings, values

tags:
  notable facts such as only_child, chronic_illness, elite_school, startup_failure

history:
  event ids, selected choice ids, important milestones, ending unlocks
```

The state model should be conservative in the first release. More attributes can be added later, but early content should prove that tags and history can influence future event eligibility and probability.

## Content Model

Events should be declared as structured data, not embedded in React components. A typical event should include:

```ts
{
  id: "school_exam_pressure",
  stage: "teen",
  title: "升学压力",
  body: "你开始感受到来自学校和家庭的升学压力。",
  trigger: {
    minAge: 14,
    maxAge: 18,
    conditions: [
      { stat: "education", op: ">=", value: 40 },
      { stat: "mindset", op: "<", value: 70 }
    ]
  },
  weight: 12,
  choices: [
    {
      id: "study_harder",
      text: "拼命学习",
      effects: [
        { type: "stat", stat: "education", delta: 8 },
        { type: "stat", stat: "mindset", delta: -6 },
        { type: "tag", tag: "exam_focused", action: "add" }
      ]
    }
  ]
}
```

Conditions and effects should be object-based rather than free-form strings. This makes validation and testing easier, and it avoids content bugs caused by typos in expressions.

## Event Selection

Each turn should:

1. Determine the current life stage from age and milestone state.
2. Filter events by age, stage, required tags, excluded tags, attributes, and history.
3. Adjust weights using luck, personality, class background, recent events, and cooldown rules.
4. Select one event with seeded randomness.
5. Fall back to a generic life progression event if no specific event is eligible.

Important events can be marked as milestones so they are not crowded out by routine events. Routine events can use cooldowns to prevent repetition.

## Choice Effects

Effects should be applied through a centralized engine function. Supported effect types for the first version:

- Stat deltas.
- Stat set or clamp.
- Add or remove tag.
- Add history milestone.
- Adjust event weight modifiers.
- Trigger immediate ending.
- Advance time by a configured amount.

The engine should clamp numeric stats to agreed bounds, likely 0 to 100 for most visible attributes. Long-term tracks may use different ranges if needed, but each track must declare its valid bounds.

## Endings And Scoring

Endings should be selected from structured ending definitions. The ending system should consider:

- Whether a terminal event was triggered.
- Final age and cause of ending.
- Core attributes and long-term tracks.
- Tags and major milestones.
- Hidden variables such as stress or risk.

The result screen should show a readable life summary, final attributes, notable moments, unlocked ending, and a replay option using either the same seed or a fresh seed.

## Persistence

The first version should use browser localStorage for:

- Current run autosave.
- User settings.
- Unlocked endings.
- Run archive summaries.

The save format should include a version field so migrations can be added later. Import and export can be JSON-based after the core loop works.

## Routing And Deployment

GitHub Pages deployment should use a static build generated by Vite. If routing is needed, the first version should use hash-based routing such as:

```text
/#/
/#/play
/#/ending
/#/archive
```

This avoids direct-refresh 404 issues on static hosting. GitHub Actions should build the project on push to the main branch and publish the generated output to GitHub Pages.

## UI Screens

The first playable version should include:

- Start screen with new life, continue, and archive entry points.
- Setup screen for seed, optional name, and initial background if enabled.
- Play screen with current age, attributes, event text, choices, and timeline.
- Ending screen with life summary, final score, milestones, and restart controls.
- Archive screen showing unlocked endings and past run summaries.

The UI should support text-heavy play but avoid looking like a raw form. Information density should be high enough for repeated play: attributes and life history must be easy to scan.

## Testing Strategy

Engine tests should cover:

- Condition evaluation.
- Effect application and stat clamping.
- Seeded randomness reproducibility.
- Event filtering and weighted selection.
- Ending selection.

Content validation tests should cover:

- Unique event and choice ids.
- Valid stat names, tag names, and stage names.
- No empty choice lists.
- No references to undefined endings or tags when strict references are introduced.
- A smoke simulation of many full lives without runtime crashes.

UI tests can start light and focus on the main flow: start a new life, select choices, reach an ending, and restart.

## First Milestone

The first milestone should be a complete vertical slice rather than a large content batch:

```text
new run
  -> birth or setup event
  -> childhood
  -> teen years
  -> adulthood
  -> middle age
  -> old age or early ending
  -> ending summary
  -> restart
```

The content volume can be small, but the engine must prove that conditional events, tags, history, random selection, and endings all work together.

## Future Extensions

After the first version is stable, possible extensions include:

- Content pack loading.
- A lightweight content editor.
- JSON import and export for custom lives.
- More nuanced relationship, career, health, and social systems.
- Optional cloud saves through a backend service.
- Shareable run summaries.
- Daily seed challenges.

These should remain out of the first implementation unless the first playable loop is already complete and tested.
