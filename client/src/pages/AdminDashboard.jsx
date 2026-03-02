import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

function money(n) {
  return `₦${Number(n || 0).toLocaleString("en-NG")}`;
}

export default function AdminDashboard() {
  const nav = useNavigate();
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState(null);

  const token = localStorage.getItem("lb_admin_token");

  useEffect(() => {
    if (!token) nav("/admin/login");
  }, [token, nav]);

  useEffect(() => {
    async function load() {
      try {
        setBusy(true);
        setError("");

        const [oRes, mRes] = await Promise.all([
          api.adminGetOrders(),
          api.adminGetMetrics(),
        ]);

        setOrders(oRes.data || []);
        setMetrics(mRes.data || null);
      } catch (e) {
        // token expired or invalid
        setError(e.message || "Failed to load admin data");
        if (
          (e.message || "").toLowerCase().includes("not authorized") ||
          (e.message || "").toLowerCase().includes("invalid token")
        ) {
          localStorage.removeItem("lb_admin_token");
          nav("/admin/login");
        }
      } finally {
        setBusy(false);
      }
    }

    if (token) load();
  }, [token, nav]);

  const paidCount = useMemo(
    () => orders.filter((o) => o?.payment?.status === "paid").length,
    [orders],
  );

  function logout() {
    localStorage.removeItem("lb_admin_token");
    nav("/admin/login");
  }

  return (
    <div style={{ maxWidth: 1050, margin: "40px auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
          <div style={{ marginTop: 6, color: "#666" }}>
            Orders overview and revenue metrics.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={logout}
            style={{
              background: "#fff",
              color: "#111",
              border: "1px solid #ddd",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            marginTop: 16,
            background: "#fff1f1",
            border: "1px solid #ffb4b4",
            padding: 12,
            borderRadius: 10,
          }}
        >
          {error}
        </div>
      )}

      {busy ? (
        <div style={{ marginTop: 18 }}>Loading admin data…</div>
      ) : (
        <>
          {/* Metrics */}
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              marginTop: 18,
            }}
          >
            <div
              style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 14,
                background: "#fff",
              }}
            >
              <div style={{ color: "#666", fontSize: 13 }}>Total Orders</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>
                {metrics?.totalOrders ?? orders.length}
              </div>
            </div>

            <div
              style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 14,
                background: "#fff",
              }}
            >
              <div style={{ color: "#666", fontSize: 13 }}>Paid Orders</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>
                {metrics?.paidOrders ?? paidCount}
              </div>
            </div>

            <div
              style={{
                border: "1px solid #eee",
                borderRadius: 12,
                padding: 14,
                background: "#fff",
              }}
            >
              <div style={{ color: "#666", fontSize: 13 }}>
                Total Revenue (Paid)
              </div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>
                {money(metrics?.totalRevenue)}
              </div>
            </div>
          </div>

          {/* Orders table */}
          <div
            style={{
              marginTop: 18,
              background: "#fff",
              border: "1px solid #eee",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: 14,
                borderBottom: "1px solid #eee",
                fontWeight: 700,
              }}
            >
              Recent Orders
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", background: "#fafafa" }}>
                    <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                      Date
                    </th>
                    <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                      Customer
                    </th>
                    <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                      Total
                    </th>
                    <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                      Payment
                    </th>
                    <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td
                        style={{
                          padding: 12,
                          borderBottom: "1px solid #f2f2f2",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(o.createdAt).toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: 12,
                          borderBottom: "1px solid #f2f2f2",
                        }}
                      >
                        {o.customer?.name || "-"}
                      </td>
                      <td
                        style={{
                          padding: 12,
                          borderBottom: "1px solid #f2f2f2",
                        }}
                      >
                        {money(o.total)}
                      </td>
                      <td
                        style={{
                          padding: 12,
                          borderBottom: "1px solid #f2f2f2",
                        }}
                      >
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 999,
                            border: "1px solid #eee",
                            background:
                              o.payment?.status === "paid"
                                ? "#ecfdf5"
                                : "#fff7ed",
                          }}
                        >
                          {o.payment?.status || "pending"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: 12,
                          borderBottom: "1px solid #f2f2f2",
                        }}
                      >
                        {o.payment?.reference || "-"}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: 14, color: "#666" }}>
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
