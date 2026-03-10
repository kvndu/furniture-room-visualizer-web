import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(form.email, form.password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ width: "100%", maxWidth: "420px" }}>
        <h1 className="title">Furniture Room Visualizer</h1>
        <p className="subtitle">Login to manage your room designs</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p style={{ color: "red", marginBottom: "14px" }}>{error}</p>
          )}

          <button className="btn" style={{ width: "100%" }} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}