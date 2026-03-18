# Analyst Copilot

Build a data analyst assistant that turns business questions into trustworthy answers with SQL, charts, and short written explanations.

## Current status

The first PR sets up the project foundation:

- `frontend/` runs a Next.js app with a product-style landing page and environment-based API wiring.
- `backend/` runs a FastAPI app with health and metric catalog endpoints.
- `docker-compose.yml` starts a local Postgres instance for warehouse work.
- The first six approved metrics are now explicit: revenue, orders, average order value, repeat rate, refund rate, and review score.

## Repo layout

- `frontend/`: Next.js application shell
- `backend/`: FastAPI API and semantic metric catalog
- `Build-Plan.md`: phased implementation plan
- `docker-compose.yml`: local Postgres for development

## Local setup

1. Copy `.env.example` to `.env`.
2. Copy `frontend/.env.local.example` to `frontend/.env.local`.
3. Start Postgres:

   ```bash
   docker compose up -d
   ```

4. Create a Python virtual environment and install backend dependencies:

   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   python -m pip install -r backend/requirements.txt
   ```

5. Start the API from the repo root:

   ```bash
   python -m uvicorn backend.app.main:app --reload --port 8000
   ```

6. In a second terminal, start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

7. Open `http://localhost:3000`.

## First API endpoints

- `GET /api/health`
- `GET /api/metrics`

## Why build this

- It combines classic analytics skills with LLM product work.
- It is easy to explain in interviews.
- It gives you a clean end-to-end story: warehouse, semantic layer, model orchestration, UI, and evals.

## Core user story

A user asks a question like `Why did revenue drop last week?` and the app returns:

- the generated SQL
- a chart
- a short explanation
- follow-up questions

## Suggested data

- Start with the Olist ecommerce dataset.
- If you want a smaller setup, use a trimmed subset with `orders`, `order_items`, `products`, `customers`, and `reviews`.
- If you want a stronger business story, create a simple semantic layer for revenue, orders, AOV, repeat rate, refund rate, and review score.

## MVP scope

- Load a small warehouse into Postgres.
- Build a schema-aware prompt that generates SQL from natural language.
- Validate or reject unsafe SQL before execution.
- Execute the query and render a chart plus written summary.
- Store a small set of gold evaluation questions.
- Add a history view for past questions and answers.

## Suggested stack

- Backend: `FastAPI`
- Database: `Postgres`
- Modeling: `dbt` or SQL models
- Frontend: `Next.js`
- Charts: `Plotly` or `Recharts`
- LLM: OpenAI API
- Deploy: `Vercel` plus `Render`, `Railway`, or `Fly.io`

## Strong README features

- Generated SQL is always visible.
- The app explains which tables and metrics it used.
- Queries can be saved and shared.
- Failed or ambiguous questions get graceful fallback messaging.
- A small eval report shows accuracy on curated questions.

## Demo flow

1. Open a seeded demo workspace.
2. Ask three business questions with different difficulty levels.
3. Inspect the SQL and chart for one answer.
4. Show one example where the app abstains instead of hallucinating.
5. Open the eval page and show accuracy on the gold set.

## Stretch goals

- Slack bot or CLI mode
- dashboard pinning
- scheduled weekly email summary
- follow-up question memory
- anomaly detection on key metrics

## Definition of success

You can answer 20-30 curated business questions with a demo that feels like a real product rather than a notebook.
