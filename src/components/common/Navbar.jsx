import { Link } from "react-router-dom";

export default function Navbar({ title = "Furniture Room Visualizer", subtitle, actions }) {
  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div>
          <h2 style={{ margin: 0 }}>{title}</h2>
          {subtitle && <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#cbd5e1" }}>{subtitle}</p>}
        </div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/create-design">Create Design</Link>
          <Link to="/portfolio">Portfolio</Link>
          {actions}
        </div>
      </div>
    </div>
  );
}
