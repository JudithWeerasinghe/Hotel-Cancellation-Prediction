import { useEffect, useState, useMemo } from "react";
import {
  History as HistoryIcon, ChevronUp, ChevronDown,
  Search, Download, BrainCircuit
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import RiskBadge from "../components/RiskBadge";
import { getPredictionHistory } from "../services/api";

const PAGE_SIZE = 10;

function SortBtn({ field, sort, onSort }) {
  const active = sort.field === field;
  return (
    <button className="th-btn" onClick={() => onSort(field)}>
      {field.replace(/_/g, " ")}
      {active ? (
        sort.dir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
      ) : null}
    </button>
  );
}

export default function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ hotel: "", risk: "", search: "" });
  const [sort, setSort] = useState({ field: "id", dir: "desc" });
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getPredictionHistory()
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (field) => {
    setSort((s) => ({
      field,
      dir: s.field === field && s.dir === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const filtered = useMemo(() => {
    let d = [...data];
    if (filter.hotel) d = d.filter((r) => r.hotel === filter.hotel);
    if (filter.risk)  d = d.filter((r) => r.risk_level === filter.risk);
    if (filter.search) {
      const q = filter.search.toLowerCase();
      d = d.filter(
        (r) =>
          r.hotel?.toLowerCase().includes(q) ||
          r.prediction?.toLowerCase().includes(q) ||
          String(r.id).includes(q)
      );
    }
    d.sort((a, b) => {
      const va = a[sort.field] ?? "";
      const vb = b[sort.field] ?? "";
      return sort.dir === "asc"
        ? va > vb ? 1 : -1
        : va < vb ? 1 : -1;
    });
    return d;
  }, [data, filter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportCSV = () => {
    const headers = ["ID","Hotel","Lead Time","Adults","Children","Babies","ADR","Prediction","Probability","Risk","Created At"];
    const rows = filtered.map((r) => [
      r.id, r.hotel, r.lead_time, r.adults, r.children, r.babies,
      r.adr, r.prediction, r.cancellation_probability, r.risk_level, r.created_at
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "predictions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="breadcrumb">
          <span>Hotel Predict</span>
          <span className="breadcrumb-sep">›</span>
          <span>Prediction History</span>
        </div>
        <h1>Prediction History</h1>
        <p>Browse, filter and export all past booking cancellation predictions.</p>
      </div>

      <div className="table-card">
        {/* Table header */}
        <div className="table-header">
          <h2 className="table-title">
            <HistoryIcon size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />
            All Predictions
            <span style={{ marginLeft: 10, fontSize: 13, color: "var(--text-muted)", fontWeight: 400 }}>
              ({filtered.length} results)
            </span>
          </h2>
          <div className="table-actions">
            {/* Search */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={14} style={{ position: "absolute", left: 10, color: "var(--text-muted)" }} />
              <input
                className="filter-input"
                style={{ paddingLeft: 30 }}
                placeholder="Search…"
                value={filter.search}
                onChange={(e) => { setFilter((f) => ({ ...f, search: e.target.value })); setPage(1); }}
              />
            </div>
            {/* Hotel filter */}
            <select className="filter-input" value={filter.hotel}
              onChange={(e) => { setFilter((f) => ({ ...f, hotel: e.target.value })); setPage(1); }}>
              <option value="">All Hotels</option>
              <option>Resort Hotel</option>
              <option>City Hotel</option>
            </select>
            {/* Risk filter */}
            <select className="filter-input" value={filter.risk}
              onChange={(e) => { setFilter((f) => ({ ...f, risk: e.target.value })); setPage(1); }}>
              <option value="">All Risk Levels</option>
              <option>High</option>
              <option>Low</option>
            </select>
            <button className="btn btn-secondary btn-sm" onClick={exportCSV} title="Export CSV">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading-overlay">
            <div className="spinner" />
            <p>Loading predictions…</p>
          </div>
        ) : paged.length === 0 ? (
          <div className="empty-state">
            <BrainCircuit size={40} />
            <p>
              {data.length === 0
                ? "No predictions yet."
                : "No results match your filters."}
            </p>
            {data.length === 0 && (
              <button className="btn btn-primary mt-16" onClick={() => navigate("/predict")}>
                <BrainCircuit size={16} /> Make First Prediction
              </button>
            )}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th><SortBtn field="id" sort={sort} onSort={handleSort} /></th>
                <th><SortBtn field="hotel" sort={sort} onSort={handleSort} /></th>
                <th><SortBtn field="lead_time" sort={sort} onSort={handleSort} /></th>
                <th>Guests</th>
                <th><SortBtn field="adr" sort={sort} onSort={handleSort} /></th>
                <th><SortBtn field="prediction" sort={sort} onSort={handleSort} /></th>
                <th><SortBtn field="cancellation_probability" sort={sort} onSort={handleSort} /></th>
                <th><SortBtn field="risk_level" sort={sort} onSort={handleSort} /></th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className="pill pill-blue">#{p.id}</span>
                  </td>
                  <td className="td-highlight">{p.hotel}</td>
                  <td>{p.lead_time}d</td>
                  <td>{(p.adults || 0) + (p.children || 0) + (p.babies || 0)}</td>
                  <td>€{Number(p.adr || 0).toFixed(0)}</td>
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
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 60, height: 6,
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: 3,
                        overflow: "hidden"
                      }}>
                        <div style={{
                          width: `${(p.cancellation_probability || 0) * 100}%`,
                          height: "100%",
                          background: p.risk_level === "High" ? "var(--accent-red)" : "var(--accent-emerald)",
                          borderRadius: 3,
                          transition: "width 0.5s ease"
                        }} />
                      </div>
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                        {((p.cancellation_probability || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td><RiskBadge risk={p.risk_level} /></td>
                  <td style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {p.created_at
                      ? new Date(p.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && filtered.length > PAGE_SIZE && (
          <div className="pagination">
            <span className="pagination-info">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="pagination-btns">
              <button className="page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
              <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button
                    key={p}
                    className={`page-btn ${p === page ? "active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                );
              })}
              <button className="page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
              <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
