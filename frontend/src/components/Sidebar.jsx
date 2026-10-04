import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BrainCircuit,
  History,
  Hotel,
} from "lucide-react";

const links = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/predict", icon: BrainCircuit, label: "New Prediction" },
  { to: "/history", icon: History, label: "History" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Hotel size={20} color="#0a0f1e" />
        </div>
        <div className="sidebar-logo-text">
          <h1>HotelPredict</h1>
          <span>AI Cancellation System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
          >
            <Icon size={18} className="nav-icon" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="api-status">
          <div className="status-dot" />
          <span>API Connected</span>
        </div>
        <p style={{ marginTop: 6 }}>v1.0.0 · XGBoost Model</p>
      </div>
    </aside>
  );
}
