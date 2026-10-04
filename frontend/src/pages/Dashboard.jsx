import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BrainCircuit, TrendingUp, TrendingDown,
  CalendarCheck, ArrowRight, Clock
} from "lucide-react";
import StatCard from "../components/StatCard";
import RiskBadge from "../components/RiskBadge";
import { getPredictionHistory } from "../services/api";

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getPredictionHistory()
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  const total = history.length;
  const highRisk = history.filter((p) => p.risk_level === "High").length;
  const lowRisk = total - highRisk;
  const highPct = total ? Math.round((highRisk / total) * 100) : 0;
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = history.filter((p) => p.created_at?.slice(0, 10) === today).length;

  const recent = history.slice(0, 5);

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div className="hero-banner">
        <div className="hero-tags">
          <span className="hero-tag">XGBoost Model</span>
          <span className="hero-tag">Real-time Prediction</span>
          <span className="hero-tag">SQLite History</span>
        </div>
        <h2>Hotel Cancellation Predictor</h2>
        <p>
          AI-powered system to predict the likelihood of hotel booking cancellations.
          Make smarter overbooking decisions and reduce revenue loss.
        </p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate("/predict")}>
          <BrainCircuit size={18} />
          Start New Prediction
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          icon={BrainCircuit}
          value={total}
          label="Total Predictions"
          sub="All time"
          accentColor="var(--accent-blue)"
          iconBg="rgba(59,130,246,0.12)"
        />
        <StatCard
          icon={TrendingUp}
          value={`${highPct}%`}
          label="High Risk Rate"
          sub={`${highRisk} bookings`}
          accentColor="var(--accent-red)"
          iconBg="rgba(239,68,68,0.12)"
        />
        <StatCard
          icon={TrendingDown}
          value={`${100 - highPct}%`}
          label="Low Risk Rate"
          sub={`${lowRisk} bookings`}
          accentColor="var(--accent-emerald)"
          iconBg="rgba(16,185,129,0.12)"
        />
        <StatCard
          icon={CalendarCheck}
          value={todayCount}
          label="Today's Predictions"
          sub={new Date().toLocaleDateString()}
          accentColor="var(--accent-gold)"
          iconBg="rgba(245,158,11,0.12)"
        />
      </div>

      {/* Recent Predictions */}
      <div className="section-header">
        <h2 className="section-title">Recent Predictions</h2>
        <span className="section-link" onClick={() => navigate("/history")}>
          View all <ArrowRight size={14} />
        </span>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="loading-overlay">
            <div className="spinner" />
            <p>Loading history…</p>
          </div>
        ) : recent.length === 0 ? (
          <div className="empty-state">
            <BrainCircuit size={40} />
            <p>No predictions yet. Make your first prediction!</p>
            <button className="btn btn-primary mt-16" onClick={() => navigate("/predict")}>
              <BrainCircuit size={16} /> Start Predicting
            </button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Hotel</th>
                <th>Lead Time</th>
                <th>Guests</th>
                <th>ADR</th>
                <th>Prediction</th>
                <th>Risk</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((p) => (
                <tr key={p.id}>
                  <td className="td-highlight">{p.hotel}</td>
                  <td>{p.lead_time}d</td>
                  <td>{p.adults + (p.children || 0) + (p.babies || 0)}</td>
                  <td>€{p.adr?.toFixed(0)}</td>
                  <td>
                    <span
                      className="pill"
                      style={
                        p.prediction === "Cancelled"
                          ? { background: "rgba(239,68,68,0.12)", color: "var(--accent-red)" }
                          : { background: "rgba(16,185,129,0.12)", color: "var(--accent-emerald)" }
                      }
                    >
                      {p.prediction}
                    </span>
                  </td>
                  <td><RiskBadge risk={p.risk_level} /></td>
                  <td>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)", fontSize: 12 }}>
                      <Clock size={12} />
                      {p.created_at ? new Date(p.created_at).toLocaleTimeString() : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
