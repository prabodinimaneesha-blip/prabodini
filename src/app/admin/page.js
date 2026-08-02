


"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isLoggedIn) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) return null;

  const stats = [
    { label: "TOTAL REVENUE", value: "Rs. 1,245,000.00" },
    { label: "TOTAL ORDERS", value: "142" },
    { label: "TOTAL PRODUCTS", value: "3" },
    { label: "TOTAL CUSTOMERS", value: "89" },
  ];

  const recentOrders = [
    { id: "ORD-9241", customer: "Sarah Jenkins", date: "2026-07-05", total: "Rs. 12,400.00", status: "Completed" },
    { id: "ORD-9240", customer: "Michael Chen", date: "2026-07-04", total: "Rs. 8,950.00", status: "Processing" },
    { id: "ORD-9239", customer: "Emma Wilson", date: "2026-07-04", total: "Rs. 21,000.00", status: "Completed" },
    { id: "ORD-9238", customer: "James Rodriguez", date: "2026-07-03", total: "Rs. 4,500.00", status: "Pending" },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" };
      case "Processing":
        return { bg: "#e0e7ff", color: "#3730a3", border: "#c7d2fe" };
      case "Pending":
        return { bg: "#fef3c7", color: "#92400e", border: "#fde68a" };
      default:
        return { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    router.push("/admin/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: "260px", backgroundColor: "#ffffff", borderRight: "1px solid #e2e8f0", padding: "24px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "36px", paddingLeft: "4px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#f472b6", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(244,114,182,0.3)" }}>
              <span style={{ fontSize: "18px" }}>🎁</span>
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "800", color: "#1e1b4b", letterSpacing: "-0.5px", lineHeight: "1.1" }}>Viola Gifts</div>
              <div style={{ fontSize: "9px", fontWeight: "700", color: "#9333ea", letterSpacing: "1px", textTransform: "uppercase" }}>Crafted With Love</div>
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", backgroundColor: "#f1f5f9", color: "#084dedff", fontWeight: "700", textDecoration: "none" }}>Dashboard</Link>
            <Link href="/admin/products" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "#000000ff", fontWeight: "500", textDecoration: "none" }}>Products</Link>
            <Link href="/admin/orders" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "#000000ff", fontWeight: "500", textDecoration: "none" }}>Orders</Link>
            <Link href="/admin/customers" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "#000000ff", fontWeight: "500", textDecoration: "none" }}>Customers</Link>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", marginTop: "24px", color: "#000000ff", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>← Back to Store</Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          style={{ width: "100%", padding: "10px 16px", backgroundColor: "#fef2f2", color: "#991b1b", border: "1px solid #fee2e2", borderRadius: "10px", fontWeight: "600", cursor: "pointer", textAlign: "left" }}
        >
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "40px 48px", overflowY: "auto" }}>
        <header style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>Dashboard Overview</h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>Welcome back! Here's what's happening with your store today.</p>
        </header>

        {/* Dynamic Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "40px" }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{ backgroundColor: "#ffffffff", padding: "24px", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", letterSpacing: "0.5px" }}>{stat.label}</span>
              <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginTop: "12px" }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Recent Orders Table */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "20px" }}>Recent Orders</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "12px 16px", fontSize: "11px", color: "#64748b", fontWeight: "700" }}>ORDER ID</th>
                <th style={{ padding: "12px 16px", fontSize: "11px", color: "#64748b", fontWeight: "700" }}>CUSTOMER</th>
                <th style={{ padding: "12px 16px", fontSize: "11px", color: "#64748b", fontWeight: "700" }}>DATE</th>
                <th style={{ padding: "12px 16px", fontSize: "11px", color: "#64748b", fontWeight: "700" }}>TOTAL</th>
                <th style={{ padding: "12px 16px", fontSize: "11px", color: "#64748b", fontWeight: "700" }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const badge = getStatusStyle(order.status);
                return (
                  <tr key={order.id} style={{ borderBottom: "1px solid #f1f5f9", fontSize: "13px" }}>
                    <td style={{ padding: "16px", fontWeight: "700", color: "#0f172a" }}>{order.id}</td>
                    <td style={{ padding: "16px", color: "#475569" }}>{order.customer}</td>
                    <td style={{ padding: "16px", color: "#64748b" }}>{order.date}</td>
                    <td style={{ padding: "16px", color: "#0f172a", fontWeight: "600" }}>{order.total}</td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ backgroundColor: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "700" }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}