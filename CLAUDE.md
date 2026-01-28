# Project: Encourage

## Purpose

Encourage is a personal journaling web app that helps users reflect on their day and build healthier thought patterns through structured reflection. The MVP is intentionally simple, fast, and private-by-default (local-first). Later, it will add AI-assisted reflections with strict safety rails.

## Target User

- Individuals who want a lightweight daily journal with gentle, actionable reflection prompts.
- Built with “startup production” discipline (clean architecture, validation, CI), even as a solo project.

## Product Principles

- **Local-first & private:** data stays in the browser for MVP.
- **Small, shippable slices:** each change should move the product forward end-to-end.
- **Reliable over clever:** structured outputs, validation, and error states first.
- **Clear UX:** minimal UI, readable typography, strong empty/loading/error states.

## Current Scope (MVP)

### Core user flows

1. Create a journal entry
2. View a list of past entries (newest first)
3. View entry detail
4. Generate a structured “Reflection” for an entry (initially mocked; later real LLM)
5. Show reflection in UI with loading + failure states

## Key Features

### Implement now

- Create journal entries (content + createdAt)
- Persist entries in localStorage
- List entries and navigate to details
- Entry detail page with content rendering
- “Generate reflection” feature:
  - Reflection output MUST be strict JSON with fields:
    - emotion
    - core_thought
    - reframe
    - one_action
  - Validate reflection JSON with Zod
  - Retry once if invalid
  - Friendly UI error if it still fails

### Implement next (near-term)

- Replace mocked reflection with real LLM call (provider-agnostic wrapper)
- Add eval harness (basic regression tests for JSON validity & required fields)
- Add simple safeguards: refusal patterns, non-therapy disclaimer, crisis resources

## Tech Stack

- Next.js 14+ (App Router) + TypeScript
- Tailwind CSS
- Zod for schema validation
- localStorage for persistence (no backend for MVP)
- GitHub Actions CI (lint + build)
- (future) Postgres + pgvector / Supabase for sync + embeddings

## Architecture Decisions

- **Local storage abstraction:** all persistence goes through `src/lib/store.ts` so DB swap later is easy.
- **Provider-agnostic AI wrapper:** LLM calls live behind `src/lib/llm.ts` (even if mocked now).
- **Strict outputs:** reflection must be validated with Zod before showing in UI.
- **Minimal UI:** Tailwind, simple components, avoid heavy UI libraries early.

## Folder Structure

- `src/app/` routes (App Router)
- `src/app/api/` server routes (e.g., reflection endpoint)
- `src/components/` reusable UI components
- `src/lib/` app logic (store, types, llm, schemas, utils)

Suggested:

- `src/lib/types.ts` (JournalEntry, Reflection types)
- `src/lib/reflectionSchema.ts` (Zod schema)
- `src/lib/store.ts` (localStorage adapter)
- `src/lib/llm.ts` (mock now; real later)

## Conventions

- Keep Tailwind classes readable (aim ~3–8 per element)
- Prefer semantic HTML, good spacing, no clutter
- Use `"use client"` only when needed (localStorage, hooks, event handlers)
- Keep PRs small; squash merge; CI must pass

## Coding Standards

- Prefer pure functions in `lib/` and thin UI wrappers in `app/`
- Add simple guards for browser-only APIs (localStorage)
- Handle empty/loading/error states explicitly
- No secrets committed; use `.env.local` + `.env.example`

## Safety & UX Notes (for future AI)

- App is not therapy and should not diagnose
- If user content suggests self-harm ideation, show a supportive message + crisis resources
- Refuse requests for self-harm instructions
- Avoid authoritative spiritual/medical claims; keep “faith-friendly” prompts opt-in

## Ticketing Style (how to implement work)

- Describe tasks as end-to-end user-visible “slices”
- Each ticket should have:
  - Goal
  - Steps
  - Acceptance criteria
  - Notes (edge cases / error states)
