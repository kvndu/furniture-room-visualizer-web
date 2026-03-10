import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDesign } from "../hooks/useDesign";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { designs } = useDesign();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const recentDesigns = designs.slice(-3).reverse();

  return (
    <>
      <div className="navbar">
        <div className="navbar-inner">
          <div>
            <h2 style={{ margin: 0 }}>Furniture Room Visualizer</h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#cbd5e1" }}>
              Smart interior planning dashboard
            </p>
          </div>

          <div className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/create-design">Create Design</Link>
            <Link to="/portfolio">Portfolio</Link>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="page dashboard-page">
        <div className="container">
          <div className="dashboard-hero">
            <div>
              <h1 className="title" style={{ marginBottom: "8px" }}>
                Welcome back, {user?.name || "Designer"}
              </h1>
              <p className="subtitle" style={{ marginBottom: 0 }}>
                Plan rooms, manage furniture layouts, and organize your saved designs in one place.
              </p>
            </div>

            <div className="dashboard-hero-badge">
              <span className="badge">System Active</span>
            </div>
          </div>

          <div className="dashboard-stats">
            <div className="dashboard-stat-card stat-primary">
              <div className="stat-top">
                <span className="stat-label">Total Designs</span>
                <span className="stat-icon">📁</span>
              </div>
              <h2 className="stat-value">{designs.length}</h2>
              <p className="stat-desc">Saved room projects available in your portfolio</p>
            </div>

            <div className="dashboard-stat-card stat-success">
              <div className="stat-top">
                <span className="stat-label">Quick Create</span>
                <span className="stat-icon">✨</span>
              </div>
              <h2 className="stat-value">New</h2>
              <p className="stat-desc">Start building a room layout with interactive furniture tools</p>
              <Link to="/create-design" className="btn">
                Create Design
              </Link>
            </div>

            <div className="dashboard-stat-card stat-dark">
              <div className="stat-top">
                <span className="stat-label">Portfolio Access</span>
                <span className="stat-icon">🗂️</span>
              </div>
              <h2 className="stat-value">Open</h2>
              <p className="stat-desc">Review, edit, and manage all saved interior designs</p>
              <Link to="/portfolio" className="btn btn-secondary">
                View Portfolio
              </Link>
            </div>
          </div>

          <div className="dashboard-main-grid">
            <div className="dashboard-panel">
              <div className="panel-header">
                <div>
                  <h3 className="section-title" style={{ marginBottom: "6px" }}>
                    Designer Overview
                  </h3>
                  <p className="panel-subtext">Profile and workspace summary</p>
                </div>
              </div>

              <div className="summary-list">
                <div className="summary-item">
                  <span>Name</span>
                  <strong>{user?.name || "Interior Designer"}</strong>
                </div>

                <div className="summary-item">
                  <span>Email</span>
                  <strong>{user?.email || "designer@furnico.com"}</strong>
                </div>

                <div className="summary-item">
                  <span>Total Saved Designs</span>
                  <strong>{designs.length}</strong>
                </div>

                <div className="summary-item">
                  <span>Workspace Status</span>
                  <span className="badge">Ready</span>
                </div>
              </div>
            </div>

            <div className="dashboard-panel">
              <div className="panel-header">
                <div>
                  <h3 className="section-title" style={{ marginBottom: "6px" }}>
                    Recent Designs
                  </h3>
                  <p className="panel-subtext">Latest saved room projects</p>
                </div>
              </div>

              {recentDesigns.length === 0 ? (
                <div className="empty-state-box">
                  <div className="empty-state-icon">🛋️</div>
                  <h4 style={{ marginBottom: "8px" }}>No designs yet</h4>
                  <p style={{ color: "#6b7280", marginBottom: "16px" }}>
                    Create your first room design to see it here.
                  </p>
                  <Link to="/create-design" className="btn">
                    Start Designing
                  </Link>
                </div>
              ) : (
                <div className="recent-designs-list">
                  {recentDesigns.map((design) => (
                    <div key={design.id} className="recent-design-card">
                      <div className="recent-design-content">
                        <div>
                          <h4 className="recent-design-title">
                            {design.roomName || "Untitled Room"}
                          </h4>
                          <p className="recent-design-meta">
                            {design.roomType} • {design.width || "-"}m x {design.length || "-"}m
                          </p>
                          <p className="recent-design-meta">
                            Furniture: {design.furnitureCount || 0}
                          </p>
                        </div>

                        <div
                          className="wall-color-preview"
                          style={{ background: design.wallColor || "#dbeafe" }}
                          title="Wall Color"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-actions-panel">
            <div className="panel-header">
              <div>
                <h3 className="section-title" style={{ marginBottom: "6px" }}>
                  Quick Actions
                </h3>
                <p className="panel-subtext">Fast access to the most used features</p>
              </div>
            </div>

            <div className="quick-actions-grid">
              <Link to="/create-design" className="quick-action-card">
                <div className="quick-action-icon">🧱</div>
                <h4>Create Design</h4>
                <p>Start a new interior layout project</p>
              </Link>

              <Link to="/portfolio" className="quick-action-card">
                <div className="quick-action-icon">📦</div>
                <h4>Open Portfolio</h4>
                <p>View all saved room designs</p>
              </Link>

              <Link to="/dashboard" className="quick-action-card">
                <div className="quick-action-icon">📊</div>
                <h4>Refresh Dashboard</h4>
                <p>Reload the latest overview data</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}