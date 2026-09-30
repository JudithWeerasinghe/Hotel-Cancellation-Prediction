export default function StatCard({ icon: Icon, value, label, sub, accentColor, iconBg }) {
  return (
    <div
      className="stat-card"
      style={{
        "--stat-accent": accentColor,
        "--stat-icon-bg": iconBg,
      }}
    >
      <div className="stat-icon">
        <Icon size={20} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}
