"use client";

import Link from "next/link";
import styles from "../admin.module.css";
import pageStyles from "./customers.module.css";

const mockCustomers = [
  { id: "C-001", name: "Sarah Jenkins", email: "sarah.j@email.com", orders: 8, totalSpent: "$620.00", joined: "2025-03-12", status: "Active" },
  { id: "C-002", name: "Michael Chen", email: "m.chen@email.com", orders: 3, totalSpent: "$245.00", joined: "2025-05-20", status: "Active" },
  { id: "C-003", name: "Emma Wilson", email: "emma.w@email.com", orders: 12, totalSpent: "$1,140.00", joined: "2024-11-08", status: "VIP" },
  { id: "C-004", name: "James Rodriguez", email: "j.rod@email.com", orders: 1, totalSpent: "$45.00", joined: "2026-01-15", status: "New" },
  { id: "C-005", name: "Olivia Martinez", email: "o.martinez@email.com", orders: 6, totalSpent: "$480.00", joined: "2025-07-30", status: "Active" },
  { id: "C-006", name: "Liam Anderson", email: "liam.a@email.com", orders: 0, totalSpent: "$0.00", joined: "2026-06-01", status: "Inactive" },
];

export default function CustomersPage() {
  const getStatusClass = (status) => {
    switch (status) {
      case "Active": return pageStyles.statusActive;
      case "VIP": return pageStyles.statusVip;
      case "New": return pageStyles.statusNew;
      case "Inactive": return pageStyles.statusInactive;
      default: return "";
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}





      <aside className={styles.sidebar}>
        {/* Updated Viola Gifts Brand Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "36px", paddingLeft: "4px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#f472b6", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(244,114,182,0.3)" }}>
            <span style={{ fontSize: "18px" }}>🎁</span>
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#1e1b4b", letterSpacing: "-0.5px", lineHeight: "1.1" }}>Viola Gifts</div>
            <div style={{ fontSize: "9px", fontWeight: "700", color: "#9333ea", letterSpacing: "1px", textTransform: "uppercase" }}>Crafted With Love</div>
          </div>
        </div>
        <nav className={styles.navMenu}>
          <Link href="/admin" className={styles.navLink}>Dashboard</Link>
          <Link href="/admin/products" className={styles.navLink}>Products</Link>
          <Link href="/admin/orders" className={styles.navLink}>Orders</Link>
          <Link href="/admin/customers" className={`${styles.navLink} ${styles.activeLink}`}>Customers</Link>
          <Link href="/" className={styles.navLink} style={{ marginTop: "auto" }}>← Back to Store</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>Customers</h1>
          <p className={styles.subtitle}>View and manage all your store customers.</p>
        </header>

        <div className={pageStyles.filterBar}>
          <input className={pageStyles.searchInput} type="text" placeholder="Search by name or email..." />
          <select className={pageStyles.filterSelect}>
            <option value="">All Customers</option>
            <option value="active">Active</option>
            <option value="vip">VIP</option>
            <option value="new">New</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>ID</th>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Email</th>
                <th className={styles.th}>Orders</th>
                <th className={styles.th}>Total Spent</th>
                <th className={styles.th}>Joined</th>
                <th className={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockCustomers.map((customer) => (
                <tr key={customer.id} className={styles.tr}>
                  <td className={styles.td} style={{ fontWeight: 600 }}>{customer.id}</td>
                  <td className={styles.td}>{customer.name}</td>
                  <td className={styles.td} style={{ color: "#6366f1" }}>{customer.email}</td>
                  <td className={styles.td}>{customer.orders}</td>
                  <td className={styles.td}>{customer.totalSpent}</td>
                  <td className={styles.td}>{customer.joined}</td>
                  <td className={styles.td}>
                    <span className={`${styles.statusBadge} ${getStatusClass(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
