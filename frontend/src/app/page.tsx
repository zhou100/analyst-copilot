import styles from "./page.module.css";

type HealthResponse = {
  status: string;
  app_name: string;
  environment: string;
  database_configured: boolean;
  openai_configured: boolean;
  metric_count: number;
};

type MetricDefinition = {
  name: string;
  label: string;
  grain: string;
  description: string;
  formula: string;
  tables: string[];
};

const sampleQuestions = [
  "Why did revenue drop last week compared with the previous four weeks?",
  "Which product category has the strongest repeat rate this quarter?",
  "Did review score improve after shipping times got shorter?",
];

const roadmapCards = [
  {
    title: "Phase 0",
    detail: "Repo setup, Postgres, environment config, and the first metric catalog.",
  },
  {
    title: "Phase 1",
    detail: "Warehouse tables, daily metric views, and hand-written reference SQL.",
  },
  {
    title: "Phase 2",
    detail: "Prompt orchestration, SQL safety rails, and result logging for evals.",
  },
];

const fallbackMetrics: MetricDefinition[] = [
  {
    name: "revenue",
    label: "Revenue",
    grain: "daily",
    description: "Net merchandise value from completed order items.",
    formula: "SUM(order_items.price + order_items.freight_value)",
    tables: ["orders", "order_items"],
  },
  {
    name: "orders",
    label: "Orders",
    grain: "daily",
    description: "Distinct placed orders inside the selected window.",
    formula: "COUNT(DISTINCT orders.order_id)",
    tables: ["orders"],
  },
  {
    name: "average_order_value",
    label: "Average Order Value",
    grain: "daily",
    description: "Revenue divided by completed orders.",
    formula: "revenue / orders",
    tables: ["orders", "order_items"],
  },
  {
    name: "repeat_rate",
    label: "Repeat Rate",
    grain: "weekly",
    description: "Share of customers with more than one completed order.",
    formula: "repeat_customers / total_customers",
    tables: ["orders", "customers"],
  },
  {
    name: "refund_rate",
    label: "Refund Rate",
    grain: "weekly",
    description: "Share of orders marked refunded or canceled.",
    formula: "refunded_orders / total_orders",
    tables: ["orders"],
  },
  {
    name: "review_score",
    label: "Review Score",
    grain: "daily",
    description: "Average post-purchase review score.",
    formula: "AVG(reviews.review_score)",
    tables: ["reviews", "orders"],
  },
];

export const dynamic = "force-dynamic";

async function getHealth(baseUrl: string): Promise<HealthResponse | null> {
  try {
    const response = await fetch(`${baseUrl}/api/health`, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    return (await response.json()) as HealthResponse;
  } catch {
    return null;
  }
}

async function getMetrics(baseUrl: string): Promise<MetricDefinition[]> {
  try {
    const response = await fetch(`${baseUrl}/api/metrics`, { cache: "no-store" });
    if (!response.ok) {
      return fallbackMetrics;
    }

    const payload = (await response.json()) as { metrics?: MetricDefinition[] };
    return payload.metrics?.length ? payload.metrics : fallbackMetrics;
  } catch {
    return fallbackMetrics;
  }
}

export default async function Home() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
    "http://127.0.0.1:8000";

  const [health, metrics] = await Promise.all([
    getHealth(apiBaseUrl),
    getMetrics(apiBaseUrl),
  ]);

  return (
    <main className={styles.shell}>
      <section className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>First PR foundation</span>
          <h1 className={styles.title}>
            Analyst Copilot starts with a trust-first semantic layer.
          </h1>
          <p className={styles.lede}>
            This starter slice wires together a FastAPI backend, a Next.js
            workspace, Postgres for local development, and the first six metrics
            the assistant is allowed to reason about.
          </p>

          <div className={styles.promptCard}>
            <div className={styles.promptHeader}>
              <span>Prototype question</span>
              <span className={styles.badge}>Phase 2 target</span>
            </div>
            <p className={styles.promptText}>
              Why did revenue drop last week compared with the previous four
              weeks?
            </p>
          </div>

          <div className={styles.questionRail}>
            {sampleQuestions.map((question) => (
              <div key={question} className={styles.questionChip}>
                {question}
              </div>
            ))}
          </div>
        </div>

        <aside className={styles.statusCard}>
          <div className={styles.statusHeader}>
            <span>System status</span>
            <span
              className={
                health?.status === "ok" ? styles.statusLive : styles.statusIdle
              }
            >
              {health?.status === "ok" ? "API live" : "API not running"}
            </span>
          </div>

          <dl className={styles.statusList}>
            <div>
              <dt>Environment</dt>
              <dd>{health?.environment ?? "development"}</dd>
            </div>
            <div>
              <dt>Metrics loaded</dt>
              <dd>{health?.metric_count ?? metrics.length}</dd>
            </div>
            <div>
              <dt>Database</dt>
              <dd>{health?.database_configured ? "Configured" : "Waiting"}</dd>
            </div>
            <div>
              <dt>OpenAI key</dt>
              <dd>{health?.openai_configured ? "Configured" : "Not set"}</dd>
            </div>
          </dl>

          <p className={styles.statusNote}>
            The app already knows which metrics are allowed, which tables back
            them, and where the API boundary will live.
          </p>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span>Metric catalog</span>
          <h2>The first six metrics are explicit and inspectable.</h2>
        </div>

        <div className={styles.metricGrid}>
          {metrics.map((metric) => (
            <article key={metric.name} className={styles.metricCard}>
              <div className={styles.metricTop}>
                <span className={styles.metricLabel}>{metric.label}</span>
                <span className={styles.metricGrain}>{metric.grain}</span>
              </div>
              <p className={styles.metricDescription}>{metric.description}</p>
              <p className={styles.metricFormula}>{metric.formula}</p>
              <p className={styles.metricTables}>
                Uses {metric.tables.join(", ")}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span>Build path</span>
          <h2>The next pull requests can stay focused.</h2>
        </div>

        <div className={styles.roadmapGrid}>
          {roadmapCards.map((card) => (
            <article key={card.title} className={styles.roadmapCard}>
              <span className={styles.roadmapPhase}>{card.title}</span>
              <p>{card.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
