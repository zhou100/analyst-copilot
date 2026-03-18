# Build Plan

This build plan is the execution checklist for [`PRD.md`](PRD.md). If product scope, architecture, or core workflows change, update the PRD first or in the same change.

## Target timeline

- 8-10 focused build days for a strong MVP
- 2-3 extra days for polish, demo recording, and deployment

## Phase 0 - Setup

- Create the repo and add a short product brief to the root `README.md`.
- Set up `FastAPI`, `Next.js`, `Postgres`, and local environment variables.
- Load a small subset of the data and document the schema.
- Decide the first six metrics the assistant is allowed to reason about.

## Phase 1 - Warehouse and metrics

- Create clean tables or views for orders, customers, products, reviews, and daily metrics.
- Build a simple semantic layer so the model sees stable metric names.
- Add a few reference SQL queries by hand for testing.
- Seed the app with a small amount of demo data.

## Phase 2 - NL to SQL

- Build prompt templates with schema context and metric definitions.
- Add SQL validation and a denylist for destructive operations.
- Execute generated SQL and capture logs for prompt debugging.
- Add fallback behavior for ambiguous questions.

## Phase 3 - UI and explanations

- Build a question input page and answer page.
- Render SQL, table preview, chart, and short narrative explanation.
- Save query history and support re-running a past question.
- Add clear empty and error states.

## Phase 4 - Evals

- Create 25 gold questions with expected metrics or expected SQL patterns.
- Track exact match where possible and manual review for harder questions.
- Add a simple eval page or markdown report.
- Log false positives, false negatives, and common failure modes.

## Phase 5 - Polish

- Add seeded demo credentials or a no-login mode.
- Record a short demo.
- Deploy frontend and backend.
- Tighten the README with setup, screenshots, architecture, and eval results.

## Scope guardrails

- Do not build a full BI platform.
- Do not support arbitrary joins across every table.
- Do not spend too long on auth before the demo is working.

## Done looks like

- Deployed app
- 25-question eval set
- clear README
- seeded demo data
- 2-3 minute walkthrough
