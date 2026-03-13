import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, authReady } = useAuth();

  if (!authReady) {
    return (
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="card" style={{ textAlign: "center", maxWidth: "420px" }}>
          <h2 className="title" style={{ marginBottom: "8px" }}>Loading workspace...</h2>
          <p className="subtitle" style={{ marginBottom: 0 }}>
            Restoring your last session.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
