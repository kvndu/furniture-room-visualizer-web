import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ textAlign: "center", maxWidth: "500px" }}>
        <h1 className="title">404</h1>
        <p className="subtitle">Page not found</p>
        <Link to="/" className="btn">
          Go to Login
        </Link>
      </div>
    </div>
  );
}