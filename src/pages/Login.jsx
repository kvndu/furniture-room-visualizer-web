import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // TODO:
      // me thanata oyage real auth logic eka danna
      // example:
      // await supabase.auth.signInWithPassword({ email, password })

      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    } catch (err) {
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 35%, #f8fbff 100%)"
      }}
    >
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top left, rgba(37,99,235,0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(59,130,246,0.16), transparent 34%)"
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(37,99,235,0.14)",
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(8px)",
              color: "#1d4ed8",
              fontWeight: 800,
              fontSize: "14px"
            }}
          >
            <span style={{ fontSize: "18px" }}>🪑</span>
            Furniture Room Visualizer
          </div>

          <div style={{ marginTop: "54px", maxWidth: "640px" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "#2563eb",
                textTransform: "uppercase",
                marginBottom: "14px"
              }}
            >
              Welcome Back
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "58px",
                lineHeight: 1.05,
                fontWeight: 900,
                color: "#0f172a"
              }}
            >
              Design rooms faster with a cleaner workspace.
            </h1>

            <p
              style={{
                marginTop: "20px",
                marginBottom: 0,
                fontSize: "18px",
                lineHeight: 1.7,
                color: "#475569",
                maxWidth: "560px"
              }}
            >
              Sign in to continue building 2D room layouts, preview them in 3D, manage your saved drafts,
              and organize your best concepts inside your portfolio.
            </p>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(140px, 1fr))",
            gap: "14px",
            maxWidth: "700px"
          }}
        >
          <FeatureCard icon="📐" title="2D Planning" text="Create clean layouts quickly." />
          <FeatureCard icon="🧊" title="3D Preview" text="Visualize rooms from every angle." />
          <FeatureCard icon="💾" title="Saved Drafts" text="Continue your work anytime." />
        </div>
      </section>

      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "470px",
            background: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(255,255,255,0.75)",
            borderRadius: "30px",
            padding: "30px",
            boxShadow: "0 30px 80px rgba(15,23,42,0.16)",
            backdropFilter: "blur(14px)"
          }}
        >
          <div style={{ marginBottom: "22px" }}>
            <div
              style={{
                fontSize: "31px",
                fontWeight: 900,
                color: "#0f172a",
                marginBottom: "8px"
              }}
            >
              Sign in
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#64748b",
                lineHeight: 1.6
              }}
            >
              Enter your account details to access your dashboard and continue your room designs.
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div
                style={{
                  position: "relative"
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{ ...inputStyle, paddingRight: "110px" }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#2563eb",
                    fontWeight: 800,
                    cursor: "pointer",
                    padding: "6px 8px"
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#475569",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            {error ? (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "14px",
                  border: "1px solid #fecaca",
                  background: "#fef2f2",
                  color: "#b91c1c",
                  fontSize: "14px",
                  fontWeight: 700
                }}
              >
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "4px",
                border: "none",
                background: loading
                  ? "linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%)"
                  : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#ffffff",
                padding: "15px 18px",
                borderRadius: "16px",
                fontWeight: 900,
                fontSize: "15px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 14px 28px rgba(37,99,235,0.22)"
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.72)",
        border: "1px solid rgba(255,255,255,0.78)",
        borderRadius: "22px",
        padding: "18px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 16px 30px rgba(15,23,42,0.06)"
      }}
    >
      <div style={{ fontSize: "24px", marginBottom: "10px" }}>{icon}</div>
      <div
        style={{
          fontSize: "16px",
          fontWeight: 900,
          color: "#0f172a",
          marginBottom: "6px"
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: "13px",
          color: "#64748b",
          lineHeight: 1.55
        }}
      >
        {text}
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 800,
  color: "#334155",
  marginBottom: "8px"
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box"
};