import "./MetricCard.css";

export default function MetricCards({ metrics }) {
  const getHighlightClass = (label) => {
    if (label.toLowerCase().includes("completed")) return "metric-card--completed";
    if (label.toLowerCase().includes("overdue")) return "metric-card--overdue";
    if (label.toLowerCase().includes("pending")) return "metric-card--pending";
    if (label.toLowerCase().includes("total")) return "metric-card--total";
    if (label.toLowerCase().includes("today")) return "metric-card--pending";
    return "";
  };

  return (
    <div className="metric-cards-container">
      {metrics.map((m) => (
        <div
          key={m.label}
          className={`metric-card ${getHighlightClass(m.label)}`}
        >
          <span className="metric-label">{m.label}</span>
          <span className="metric-value">{m.value}</span>
        </div>
      ))}
    </div>
  );
}