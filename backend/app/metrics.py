from pydantic import BaseModel


class MetricDefinition(BaseModel):
    name: str
    label: str
    grain: str
    description: str
    formula: str
    tables: list[str]


METRIC_CATALOG: list[MetricDefinition] = [
    MetricDefinition(
        name="revenue",
        label="Revenue",
        grain="daily",
        description="Net merchandise value captured from completed order items.",
        formula="SUM(order_items.price + order_items.freight_value)",
        tables=["orders", "order_items"],
    ),
    MetricDefinition(
        name="orders",
        label="Orders",
        grain="daily",
        description="Count of distinct placed orders in the selected time window.",
        formula="COUNT(DISTINCT orders.order_id)",
        tables=["orders"],
    ),
    MetricDefinition(
        name="average_order_value",
        label="Average Order Value",
        grain="daily",
        description="Average revenue per completed order.",
        formula="revenue / orders",
        tables=["orders", "order_items"],
    ),
    MetricDefinition(
        name="repeat_rate",
        label="Repeat Rate",
        grain="weekly",
        description="Share of customers with more than one completed order.",
        formula="repeat_customers / total_customers",
        tables=["orders", "customers"],
    ),
    MetricDefinition(
        name="refund_rate",
        label="Refund Rate",
        grain="weekly",
        description="Share of orders marked as refunded or canceled.",
        formula="refunded_orders / total_orders",
        tables=["orders"],
    ),
    MetricDefinition(
        name="review_score",
        label="Review Score",
        grain="daily",
        description="Average post-purchase review score from submitted reviews.",
        formula="AVG(reviews.review_score)",
        tables=["reviews", "orders"],
    ),
]
