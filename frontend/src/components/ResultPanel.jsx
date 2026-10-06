import { Activity } from "lucide-react";
import ProbabilityGauge from "./ProbabilityGauge";
import RiskBadge from "./RiskBadge";

export default function ResultPanel({ result, loading }) {
  if (loading) {
    return (
      <div className="result-panel">
        <div className="loading-overlay">
          <div className="spinner" />
          <p>Analysing booking...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-panel result-panel-empty">
        <div className="result-empty">
          <div className="result-empty-icon">
            <Activity size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-secondary)" }}>
              Prediction results will appear here
            </h3>
            <p>Complete the form and submit to see the cancellation risk.</p>
          </div>
        </div>
      </div>
    );
  }

  const isCancelled = result.prediction === "Cancelled";
  const isHigh = result.risk_level === "High";

  return (
    <div
      className="result-panel has-result"
      style={{
        "--result-border": isHigh
          ? "rgba(239,68,68,0.3)"
          : "rgba(16,185,129,0.3)",
        "--result-shadow": isHigh
          ? "0 8px 40px rgba(239,68,68,0.12)"
          : "0 8px 40px rgba(16,185,129,0.1)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          AI Prediction
        </span>
        <h2
          className={`prediction-label ${isCancelled ? "cancelled" : "not-cancelled"}`}
        >
          {result.prediction}
        </h2>
      </div>

      <ProbabilityGauge probability={result.cancellation_probability} />

      <RiskBadge risk={result.risk_level} />

      <div className="result-stats">
        <div className="result-stat">
          <div className="result-stat-label">Probability</div>
          <div className="result-stat-value">
            {(result.cancellation_probability * 100).toFixed(1)}%
          </div>
        </div>
        <div className="result-stat">
          <div className="result-stat-label">Confidence</div>
          <div className="result-stat-value">
            {(Math.abs(result.cancellation_probability - 0.5) * 200).toFixed(0)}%
          </div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "var(--text-muted)", maxWidth: 280, textAlign: "center", lineHeight: 1.6 }}>
        {isCancelled
          ? "⚠️ This booking has a high risk of cancellation. Consider sending a confirmation reminder."
          : "✅ This booking is unlikely to be cancelled. No additional action needed."}
      </p>
    </div>
  );
}
