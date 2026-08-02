"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../admin.module.css";
import pageStyles from "./orders.module.css";

const mockOrders = [
  {
    id: "ORD-9241",
    customer: "Sarah Jenkins",
    email: "sarah.jenkins@email.com",
    date: "2026-07-05",
    items: 3,
    total: "Rs. 12,400.00",
    status: "Completed",
    address: "123 Maple St, New York, NY 10001",
    products: [
      { name: "Luxury Gift Box", qty: 1, price: "Rs. 5,500.00" },
      { name: "Scented Candle Set", qty: 1, price: "Rs. 3,500.00" },
      { name: "Greeting Card", qty: 1, price: "Rs. 3,400.00" },
    ],
  },
  {
    id: "ORD-9240",
    customer: "Michael Chen",
    email: "michael.chen@email.com",
    date: "2026-07-04",
    items: 1,
    total: "Rs. 8,950.00",
    status: "Processing",
    address: "456 Oak Ave, San Francisco, CA 94102",
    products: [{ name: "Premium Watch Case", qty: 1, price: "Rs. 8,950.00" }],
  },
  {
    id: "ORD-9239",
    customer: "Emma Wilson",
    email: "emma.wilson@email.com",
    date: "2026-07-04",
    items: 5,
    total: "Rs. 21,000.00",
    status: "Completed",
    address: "789 Pine Rd, Chicago, IL 60601",
    products: [
      { name: "Flower Bouquet", qty: 2, price: "Rs. 6,000.00" },
      { name: "Chocolates Box", qty: 1, price: "Rs. 3,000.00" },
      { name: "Ribbon Wrap", qty: 2, price: "Rs. 12,000.00" },
    ],
  },
  {
    id: "ORD-9238",
    customer: "James Rodriguez",
    email: "james.rodriguez@email.com",
    date: "2026-07-03",
    items: 2,
    total: "Rs. 4,500.00",
    status: "Pending",
    address: "321 Birch Blvd, Houston, TX 77001",
    products: [
      { name: "Gift Wrap Paper", qty: 1, price: "Rs. 1,500.00" },
      { name: "Mini Succulent", qty: 1, price: "Rs. 3,000.00" },
    ],
  },
  {
    id: "ORD-9237",
    customer: "Olivia Martinez",
    email: "olivia.martinez@email.com",
    date: "2026-07-02",
    items: 4,
    total: "Rs. 17,800.00",
    status: "Completed",
    address: "654 Cedar Lane, Phoenix, AZ 85001",
    products: [
      { name: "Spa Gift Set", qty: 1, price: "Rs. 7,800.00" },
      { name: "Bath Salts", qty: 2, price: "Rs. 6,000.00" },
      { name: "Loofah Set", qty: 1, price: "Rs. 4,000.00" },
    ],
  },
  {
    id: "ORD-9236",
    customer: "Liam Anderson",
    email: "liam.anderson@email.com",
    date: "2026-07-01",
    items: 1,
    total: "Rs. 3,499.00",
    status: "Cancelled",
    address: "987 Elm St, Philadelphia, PA 19101",
    products: [{ name: "Personalised Mug", qty: 1, price: "Rs. 3,499.00" }],
  },
];

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed": return styles.statusCompleted;
      case "Processing": return styles.statusProcessing;
      case "Pending": return styles.statusPending;
      case "Cancelled": return pageStyles.statusCancelled;
      default: return "";
    }
  };

  return (
    <div className={styles.dashboardContainer}>

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
          <Link href="/admin/orders" className={`${styles.navLink} ${styles.activeLink}`}>Orders</Link>
          <Link href="/admin/customers" className={styles.navLink}>Customers</Link>
          <Link href="/" className={styles.navLink} style={{ marginTop: "auto" }}>← Back to Store</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>Orders</h1>
          <p className={styles.subtitle}>Track and manage all customer orders.</p>
        </header>

        <div className={pageStyles.filterBar}>
          <input className={pageStyles.searchInput} type="text" placeholder="Search by order ID or customer..." />
          <select className={pageStyles.filterSelect}>
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Order ID</th>
                <th className={styles.th}>Customer</th>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>Items</th>
                <th className={styles.th}>Total</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr key={order.id} className={styles.tr}>
                  <td className={styles.td} style={{ fontWeight: 600 }}>{order.id}</td>
                  <td className={styles.td}>{order.customer}</td>
                  <td className={styles.td}>{order.date}</td>
                  <td className={styles.td}>{order.items}</td>
                  <td className={styles.td}>{order.total}</td>
                  <td className={styles.td}>
                    <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <button
                      className={pageStyles.viewBtn}
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className={pageStyles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div className={pageStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={pageStyles.modalHeader}>
              <div>
                <h2 className={pageStyles.modalTitle}>Order {selectedOrder.id}</h2>
                <p className={pageStyles.modalDate}>Placed on {selectedOrder.date}</p>
              </div>
              <button className={pageStyles.closeBtn} onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className={pageStyles.modalBody}>
              {/* Customer Info */}
              <div className={pageStyles.infoSection}>
                <h3 className={pageStyles.sectionLabel}>Customer</h3>
                <p className={pageStyles.infoText}><strong>{selectedOrder.customer}</strong></p>
                <p className={pageStyles.infoText}>{selectedOrder.email}</p>
                <p className={pageStyles.infoText}>{selectedOrder.address}</p>
              </div>

              {/* Order Status */}
              <div className={pageStyles.infoSection}>
                <h3 className={pageStyles.sectionLabel}>Status</h3>
                <span className={`${styles.statusBadge} ${getStatusClass(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Products */}
              <div className={pageStyles.infoSection}>
                <h3 className={pageStyles.sectionLabel}>Items Ordered</h3>
                <table className={pageStyles.itemsTable}>
                  <thead>
                    <tr>
                      <th className={pageStyles.itemsTh}>Product</th>
                      <th className={pageStyles.itemsTh}>Qty</th>
                      <th className={pageStyles.itemsTh}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.products.map((p, i) => (
                      <tr key={i} className={pageStyles.itemsTr}>
                        <td className={pageStyles.itemsTd}>{p.name}</td>
                        <td className={pageStyles.itemsTd}>{p.qty}</td>
                        <td className={pageStyles.itemsTd}>{p.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className={pageStyles.totalRow}>
                <span>Order Total</span>
                <span className={pageStyles.totalAmount}>{selectedOrder.total}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
