import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@lagosbites.com");
  const [password, setPassword] = useState("password123");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const res = await api.adminLogin({ email, password });
      localStorage.setItem("lb_admin_token", res.token);
      nav("/admin");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 20 }}>
      <h1 style={{ marginBottom: 8 }}>Admin Login</h1>
      <p style={{ marginTop: 0, color: "#666" }}>
        Sign in to manage orders and view metrics.
      </p>

      {error && (
        <div
          style={{
            background: "#fff1f1",
            border: "1px solid #ffb4b4",
            padding: 12,
            borderRadius: 10,
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleLogin}
        style={{ marginTop: 16, display: "grid", gap: 10 }}
      >
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />

        <button disabled={busy} type="submit" style={{ marginTop: 10 }}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
