# Product Requirements Document

## Document status

- Product: `Analyst Copilot`
- Version: `v1`
- Status: `active working spec`
- Last updated: `2026-03-18`

## How to use this document

- This PRD is the source of truth for product behavior, system boundaries, and implementation priorities.
- Future code changes should align with this document by default.
- If a code change materially affects scope, user flow, architecture, or core data contracts, update this PRD in the same change.

## Product summary

Analyst Copilot is a trust-first analytics assistant for a small ecommerce dataset. A user asks a business question in plain English and receives:

- the generated SQL
- a chart or table preview
- a short explanation of the result
- follow-up questions
- clear fallback behavior when the question is ambiguous or unsupported

The product is designed to feel like a real internal analytics tool rather than a notebook demo. It should showcase strong judgment around semantic metrics, SQL safety, and graceful abstention.

## Problem statement

Business users often know what they want to ask but not how to write SQL, pick the right metric definition, or inspect the reliability of an answer. Existing demos tend to over-index on flashy text generation and under-invest in trust, inspectability, and constrained scope.

This product solves that by:

- limiting the dataset and metric surface area
- making SQL visible by default
- grounding answers in a curated semantic layer
- rejecting unsafe or unsupported requests
- measuring quality with a curated evaluation set

## Goals

### Primary goals

- Turn natural-language business questions into trustworthy analytics answers.
- Demonstrate end-to-end product thinking across data modeling, API orchestration, UI, and evaluation.
- Support a polished demo that is easy to explain in interviews.

### Success criteria

- A seeded demo environment works locally and in deployment.
- The product answers `20-30` curated questions with acceptable quality.
- SQL is always inspectable.
- The system abstains on unsupported questions instead of hallucinating.
- A lightweight eval report shows strengths, failures, and known limitations.

## Non-goals

- Full BI platform replacement
- Open-ended support for arbitrary schemas
- Advanced role-based access control for MVP
- Complex dashboard authoring
- Multi-tenant workspace support
- Autonomous agents that modify data or run destructive SQL

## Target users

### Primary user

A product manager, analyst, founder, or interviewer who wants quick answers to ecommerce performance questions without manually writing SQL.

### Secondary user

A technical reviewer evaluating the project for product judgment, data modeling, prompt orchestration, and engineering quality.

## Core jobs to be done

- Ask a business question in plain language.
- Understand which metric definition the system used.
- Inspect the SQL behind the answer.
- See a chart or table that supports the conclusion.
- Re-run or compare previous questions.
- Trust the system to decline when the question is too ambiguous or out of scope.

## Product principles

- Trust over magic
- Explicit metrics over vague reasoning
- Clear scope over broad but brittle coverage
- Inspectable outputs over hidden model decisions
- Fast iteration over premature complexity

## MVP scope

### Included

- Seeded ecommerce demo dataset
- Curated semantic layer with explicit metric definitions
- Natural language to SQL flow for a constrained question set
- SQL validation and destructive-query blocking
- Query execution against Postgres
- Result view with SQL, chart or table preview, and short narrative
- Query history
- Eval set with `25` gold questions

### Deferred

- Authentication beyond demo mode
- Collaboration features
- Scheduled reporting
- Slack integration
- Rich dashboard building
- Follow-up memory beyond a single result context

## User experience

### Primary user flow

1. User lands on the home page and understands the product promise.
2. User enters a business question.
3. Backend resolves the request against the approved metric and schema context.
4. If the question is supported, the system returns:
   - generated SQL
   - result preview
   - chart configuration
   - short written explanation
   - suggested follow-up questions
5. If the question is unsupported or ambiguous, the system returns:
   - a short explanation of why it cannot answer safely
   - examples of supported question types
   - one or more clarifying prompts when possible
6. User can inspect history and rerun a prior question.

### UX requirements

### Home page

- Communicate the product purpose quickly.
- Show sample questions.
- Show system readiness or seed/demo status.

### Ask flow

- Single prominent question input
- Submit state, loading state, and timeout-safe fallback
- Friendly validation when input is empty or too vague

### Answer view

- Question text
- Short answer summary
- Chart or table preview
- Generated SQL
- Metrics and tables used
- Follow-up suggestions
- Error or abstention state when needed

### History view

- List of prior questions
- Timestamp and status
- Re-run action
- Ability to inspect prior SQL and output

### Eval view

- Gold questions
- Pass or fail status
- Notes for false positives and false negatives

### Supported question types for MVP

- Trend questions
- Simple comparison questions
- Segment questions on a limited set of supported dimensions
- Top or bottom ranking questions
- Quality and experience questions tied to reviews

### Unsupported question types for MVP

- Questions requiring arbitrary joins not defined in the semantic layer
- Forecasting
- Causal claims
- Write operations
- External data enrichment
- Open-ended business strategy questions with no data backing

## Data and semantic scope

### Dataset choice

The default dataset is a trimmed ecommerce model inspired by Olist-style tables.

### Core tables

- `orders`
- `order_items`
- `customers`
- `products`
- `reviews`
- derived daily metrics views

### Approved metric catalog for MVP

These metric definitions are product contracts and should stay stable unless this PRD is updated.

| Metric | Grain | Definition |
| --- | --- | --- |
| `revenue` | daily | Sum of item price plus freight value for completed order items |
| `orders` | daily | Count of distinct orders in the selected period |
| `average_order_value` | daily | Revenue divided by orders |
| `repeat_rate` | weekly | Share of customers with more than one completed order |
| `refund_rate` | weekly | Share of orders marked refunded or canceled |
| `review_score` | daily | Average submitted review score |

### Allowed dimensions for early MVP

- date
- product category
- customer state
- order status
- review score bucket

### Data guardrails

- All model-generated queries must map to approved tables and metrics.
- The system should prefer pre-modeled views when available over raw-table joins.
- No destructive SQL is ever executed.
- Queries should be read-only and bounded.

## Functional requirements

### Frontend requirements

- Next.js app using App Router
- Environment-based API URL configuration
- Product-style landing page
- Ask page and answer page
- Reusable result components for chart, SQL, and narrative
- History page
- Empty, loading, and error states

### Backend requirements

- FastAPI service
- Health endpoint
- Metric catalog endpoint
- Query endpoint for question submission
- Query history endpoint
- Eval endpoint or eval report endpoint
- Structured error responses
- Centralized settings and environment loading

### Orchestration requirements

- Prompt templates must include schema and metric context.
- The system should first identify the likely business intent and required metrics.
- SQL generation must happen under constrained instructions.
- Generated SQL must pass validation before execution.
- Ambiguous requests should trigger abstention or clarification instead of forced SQL generation.

### Observability requirements

- Store question text, generated SQL, status, and execution metadata
- Capture prompt-debugging information for development
- Track unsupported question types and repeated failure patterns

## System design

### High-level architecture

```text
Next.js frontend
  -> FastAPI backend
    -> semantic layer + prompt orchestration
    -> SQL validation layer
    -> Postgres warehouse
    -> result formatter + explanation generator
```

### Frontend architecture

### Responsibilities

- render the product shell and ask workflow
- fetch API status and metric definitions
- submit user questions to the backend
- render answer payloads consistently
- preserve history views

### Planned pages

- `/` home and ask entry
- `/ask` dedicated question flow if needed
- `/history` past questions
- `/evals` evaluation report

### Planned frontend components

- question input
- result summary card
- SQL viewer
- chart panel
- table preview
- follow-up question list
- history list
- status banner

### Backend architecture

### Modules

- `config`: environment and runtime settings
- `metrics`: semantic metric definitions
- `api`: route layer
- `services`: orchestration, validation, execution, and formatting
- `schemas`: request and response models
- `evals`: gold questions and evaluation runners

### Planned API surface

- `GET /api/health`
- `GET /api/metrics`
- `POST /api/query`
- `GET /api/history`
- `GET /api/history/{id}`
- `GET /api/evals`

### Query pipeline

1. Receive question and normalize input.
2. Classify whether the question is in scope.
3. Resolve candidate metrics and dimensions from the semantic layer.
4. Build prompt context with schema and metric definitions.
5. Generate SQL.
6. Validate SQL against read-only and allowlist rules.
7. Execute SQL against Postgres.
8. Transform result into:
   - table preview
   - chart-ready structure
   - short explanation
   - follow-up prompts
9. Persist query history and debug metadata.

### SQL safety model

- Only allow `SELECT` style queries for MVP.
- Block DDL and DML keywords.
- Restrict accessible tables to the approved semantic scope.
- Apply row and result-size limits where appropriate.
- Return explicit fallback messages when validation fails.

### Data model direction

### Raw or staging tables

- `orders`
- `order_items`
- `customers`
- `products`
- `reviews`

### Derived models or views

- `fct_orders`
- `fct_order_items`
- `dim_customers`
- `dim_products`
- `fct_reviews`
- `daily_metrics`

### Application tables

- `query_history`
- `eval_runs`

### Example `query_history` fields

- `id`
- `question_text`
- `status`
- `sql_text`
- `metric_names`
- `execution_ms`
- `created_at`
- `error_message`

## Evaluation design

### Eval goals

- Measure quality on the exact questions shown in the demo.
- Surface regression risk as prompts and schema evolve.
- Make failure modes discussable in interviews.

### Eval approach

- `25` gold questions
- expected metrics and, where practical, expected SQL patterns
- manual review for more open-ended phrasing
- simple report page or markdown artifact

### Failure buckets to track

- wrong metric
- wrong filter
- wrong aggregation grain
- unsupported question answered when it should abstain
- valid question rejected incorrectly

## Deployment design

### Local development

- Next.js frontend on `localhost:3000`
- FastAPI backend on `localhost:8000`
- Postgres via Docker Compose on `localhost:5432`

### Hosted deployment

- frontend on Vercel
- backend on Render, Railway, or Fly.io
- managed Postgres on the same backend platform when possible

### Security and privacy assumptions

- Demo-friendly seeded data only
- No sensitive production data
- Secrets loaded through environment variables
- No user-uploaded files in MVP

## Milestones

### Milestone 1: Phase 0 foundation

- repo setup
- frontend and backend scaffolding
- local Postgres config
- semantic metric catalog

### Milestone 2: warehouse and seed data

- schema docs
- demo dataset load
- initial fact and dimension models
- first reference SQL queries

### Milestone 3: NL to SQL loop

- query endpoint
- SQL generation prompt
- safety validation
- result execution

### Milestone 4: answer experience

- ask flow
- answer page
- history
- abstention and error states

### Milestone 5: evals and polish

- gold question set
- eval reporting
- deployment
- demo walkthrough

## Open questions

- Whether to use raw SQL models only or introduce `dbt` early
- Whether chart rendering should default to `Recharts` or `Plotly`
- Whether history is stored in Postgres immediately or starts as file-backed demo data

## Current implementation status

Implemented today:

- root project scaffolding
- FastAPI app with `health` and `metrics` endpoints
- Next.js frontend shell
- local Postgres `docker-compose.yml`
- initial metric catalog for the six approved metrics

Planned next:

- seed demo data
- document warehouse schema
- add derived views and reference SQL
- implement `POST /api/query`
