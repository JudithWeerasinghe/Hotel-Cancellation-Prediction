export default function RiskBadge({ risk }) {
  const isHigh = risk === "High";
  return (
    <span className={`risk-badge ${isHigh ? "high" : "low"}`}>
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: isHigh ? "var(--accent-red)" : "var(--accent-emerald)",
          display: "inline-block",
        }}
      />
      {risk} Risk
    </span>
  );
}
