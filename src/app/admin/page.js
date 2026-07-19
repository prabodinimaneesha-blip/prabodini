"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "./admin.module.css";
import Link from "next/link";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [metrics, setMetrics] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0
  });

  // Mock recent orders for the dashboard view
  const recentOrders = [
    { id: "ORD-9241", customer: "Sarah Jenkins", date: "2026-07-05", total: "$124.00", status: "Completed" },
    { id: "ORD-9240", customer: "Michael Chen", date: "2026-07-04", total: "$89.50", status: "Processing" },
    { id: "ORD-9239", customer: "Emma Wilson", date: "2026-07-04", total: "$210.00", status: "Completed" },
    { id: "ORD-9238", customer: "James Rodriguez", date: "2026-07-03", total: "$45.00", status: "Pending" },
  ];

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const productsSnapshot = await getDocs(collection(db, "products"));
        
        // Example mock aggregations - in a real app, you'd fetch from orders/customers collections
        setMetrics({
          revenue: 12450.00, // Mock total revenue
          orders: 142,       // Mock total orders
          products: productsSnapshot.size, // Actual product count from Firestore
          customers: 89      // Mock total customers
        });
      } catch (error) {
        console.error("Error fetching admin data: ", error);
      }
    }
    
    fetchDashboardData();
  }, []);

  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed': return styles.statusCompleted;
      case 'Processing': return styles.statusProcessing;
      case 'Pending': return styles.statusPending;
      default: return '';
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '123') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.loginContainer}>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <h2 className={styles.loginTitle}>Admin Login</h2>
          {loginError && <p className={styles.error}>{loginError}</p>}
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="username">Username</label>
            <input
              className={styles.input}
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              className={styles.input}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.button}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>Viola Admin</div>
        <nav className={styles.navMenu}>
          <Link href="/admin" className={`${styles.navLink} ${styles.activeLink}`}>
            Dashboard
          </Link>
          <Link href="#" className={styles.navLink}>
            Products
          </Link>
          <Link href="#" className={styles.navLink}>
            Orders
          </Link>
          <Link href="#" className={styles.navLink}>
            Customers
          </Link>
          <Link href="/" className={styles.navLink} style={{ marginTop: 'auto' }}>
            ← Back to Store
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>Dashboard Overview</h1>
          <p className={styles.subtitle}>Welcome back! Here's what's happening with your store today.</p>
        </header>

        {/* Metrics Grid */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Total Revenue</span>
            <span className={styles.metricValue}>${metrics.revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Total Orders</span>
            <span className={styles.metricValue}>{metrics.orders}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Total Products</span>
            <span className={styles.metricValue}>{metrics.products}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricTitle}>Total Customers</span>
            <span className={styles.metricValue}>{metrics.customers}</span>
          </div>
        </div>

        {/* Recent Orders Section */}
        <section>
          <h2 className={styles.sectionTitle}>Recent Orders</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Order ID</th>
                  <th className={styles.th}>Customer</th>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th}>Total</th>
                  <th className={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className={styles.tr}>
                    <td className={styles.td} style={{ fontWeight: 600 }}>{order.id}</td>
                    <td className={styles.td}>{order.customer}</td>
                    <td className={styles.td}>{order.date}</td>
                    <td className={styles.td}>{order.total}</td>
                    <td className={styles.td}>
                      <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
