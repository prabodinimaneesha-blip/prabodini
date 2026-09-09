"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import styles from "../page.module.css";
import trackingStyles from "./tracking.module.css";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

// Mock orders for local testing, matching those in admin/orders
const MOCK_ORDERS = [
  {
    id: "ORD-9241",
    customer: "Sarah Jenkins",
    email: "sarah.jenkins@email.com",
    date: "2026-07-05",
    items: 3,
    total: "$124.00",
    status: "Completed",
    address: "123 Maple St, New York, NY 10001",
    products: [
      { name: "Luxury Gift Box", qty: 1, price: "$55.00" },
      { name: "Scented Candle Set", qty: 1, price: "$35.00" },
      { name: "Greeting Card", qty: 1, price: "$34.00" },
    ],
  },
  {
    id: "ORD-9240",
    customer: "Michael Chen",
    email: "michael.chen@email.com",
    date: "2026-07-04",
    items: 1,
    total: "$89.50",
    status: "Processing",
    address: "456 Oak Ave, San Francisco, CA 94102",
    products: [{ name: "Premium Watch Case", qty: 1, price: "$89.50" }],
  },
  {
    id: "ORD-9239",
    customer: "Emma Wilson",
    email: "emma.wilson@email.com",
    date: "2026-07-04",
    items: 5,
    total: "$210.00",
    status: "Completed",
    address: "789 Pine Rd, Chicago, IL 60601",
    products: [
      { name: "Flower Bouquet", qty: 2, price: "$60.00" },
      { name: "Chocolates Box", qty: 1, price: "$30.00" },
      { name: "Ribbon Wrap", qty: 2, price: "$120.00" },
    ],
  },
  {
    id: "ORD-9238",
    customer: "James Rodriguez",
    email: "james.rodriguez@email.com",
    date: "2026-07-03",
    items: 2,
    total: "$45.00",
    status: "Pending",
    address: "321 Birch Blvd, Houston, TX 77001",
    products: [
      { name: "Gift Wrap Paper", qty: 1, price: "$15.00" },
      { name: "Mini Succulent", qty: 1, price: "$30.00" },
    ],
  },
  {
    id: "ORD-9237",
    customer: "Olivia Martinez",
    email: "olivia.martinez@email.com",
    date: "2026-07-02",
    items: 4,
    total: "$178.00",
    status: "Completed",
    address: "654 Cedar Lane, Phoenix, AZ 85001",
    products: [
      { name: "Spa Gift Set", qty: 1, price: "$78.00" },
      { name: "Bath Salts", qty: 2, price: "$60.00" },
      { name: "Loofah Set", qty: 1, price: "$40.00" },
    ],
  },
  {
    id: "ORD-9236",
    customer: "Liam Anderson",
    email: "liam.anderson@email.com",
    date: "2026-07-01",
    items: 1,
    total: "$34.99",
    status: "Cancelled",
    address: "987 Elm St, Philadelphia, PA 19101",
    products: [{ name: "Personalised Mug", qty: 1, price: "$34.99" }],
  },
];

// Helper to determine active step in the tracking stepper (0 to 4)
const getStatusStep = (status) => {
  const cleanStatus = (status || "").toLowerCase();
  if (cleanStatus === "pending") return 0;
  if (cleanStatus === "paid" || cleanStatus === "payment completed") return 1;
  if (cleanStatus === "processing") return 2;
  if (cleanStatus === "dispatched" || cleanStatus === "shipped") return 3;
  if (cleanStatus === "completed" || cleanStatus === "delivered") return 4;
  return 1; // default to paid/processing if it is a general paid order
};

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const performLookup = async (targetOrderId, targetEmail) => {
    setLoading(true);
    setSearched(true);
    setOrderData(null);

    try {
      // 1. Try to fetch order from Firestore first
      const orderRef = doc(db, "orders", targetOrderId);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        const data = orderSnap.data();
        if (!data.email || data.email.toLowerCase() === targetEmail) {
          setOrderData({
            id: targetOrderId,
            customer: data.first_name ? `${data.first_name} ${data.last_name || ""}` : (data.firstName ? `${data.firstName} ${data.lastName || ""}` : "Customer"),
            email: data.email || targetEmail,
            date: data.paidAt ? data.paidAt.split("T")[0] : (data.createdAt ? data.createdAt.split("T")[0] : new Date().toISOString().split("T")[0]),
            total: data.amount ? `LKR ${parseFloat(data.amount).toLocaleString('en-LK', { minimumFractionDigits: 2 })}` : "N/A",
            status: data.status || "Paid",
            address: data.address ? `${data.address}, ${data.city || ""}, Sri Lanka` : "Colombo, Sri Lanka",
            products: data.items ? [{ name: data.items, qty: 1, price: `LKR ${data.amount}` }] : [{ name: "Gift Item", qty: 1, price: `LKR ${data.amount}` }],
          });
          setLoading(false);
          return;
        }
      }
    } catch (fsError) {
      console.warn("Firestore lookup failed, attempting local mock data:", fsError);
    }

    // 2. Check local mock data (from ORD-9241, etc.)
    const foundMock = MOCK_ORDERS.find(
      (order) =>
        order.id.toLowerCase() === targetOrderId.toLowerCase() &&
        order.email.toLowerCase() === targetEmail
    );

    if (foundMock) {
      setOrderData(foundMock);
    } else {
      // 3. Dynamic generator for test orders starting with 'ORDER_' to support interactive flow validation
      if (targetOrderId.toUpperCase().startsWith("ORDER_")) {
        setOrderData({
          id: targetOrderId,
          customer: "Test Customer",
          email: targetEmail,
          date: new Date().toISOString().split("T")[0],
          total: "LKR 4,500.00",
          status: "Paid",
          address: "45/2 Galle Road, Colombo 03, Sri Lanka",
          products: [
            { name: "Premium Customized Gift Pack", qty: 1, price: "LKR 4,500.00" }
          ]
        });
      }
    }

    setLoading(false);
  };

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    if (!orderId || !email) return;
    performLookup(orderId.trim(), email.trim().toLowerCase());
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryOrderId = params.get("orderId");
      const queryEmail = params.get("email");
      if (queryOrderId && queryEmail) {
        const cleanOrderId = queryOrderId.trim();
        const cleanEmail = queryEmail.trim().toLowerCase();
        setOrderId(cleanOrderId);
        setEmail(cleanEmail);
        performLookup(cleanOrderId, cleanEmail);
      }
    }
  }, []);

  const currentStep = orderData ? getStatusStep(orderData.status) : 0;
  const isCancelled = orderData && orderData.status.toLowerCase() === "cancelled";

  return (
    <div className={trackingStyles.trackingContainer}>
      <Header />

      <main className={trackingStyles.trackingContent}>
        <h1 className={trackingStyles.pageTitle}>Order Tracking</h1>
        <p className={trackingStyles.pageSubtitle}>
          Enter your order reference number and contact email to track your delivery status in real-time.
        </p>

        {/* Search form section */}
        <section className={trackingStyles.searchSection}>
          <form onSubmit={handleTrack} className={trackingStyles.searchForm}>
            <div className={trackingStyles.inputGroup}>
              <label htmlFor="orderId" className={trackingStyles.label}>Order ID / Reference</label>
              <input
                type="text"
                id="orderId"
                className={trackingStyles.input}
                placeholder="e.g. ORD-9241"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <div className={trackingStyles.inputGroup}>
              <label htmlFor="email" className={trackingStyles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                className={trackingStyles.input}
                placeholder="sarah.jenkins@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading} className={trackingStyles.trackBtn}>
              {loading ? "Searching..." : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  Track Order
                </>
              )}
            </button>
          </form>
        </section>

        {/* Tracking Details display */}
        {searched && !loading && (
          orderData ? (
            <div className={trackingStyles.resultSection}>
              
              {/* Order Header Summary */}
              <div className={trackingStyles.orderHeader}>
                <div className={trackingStyles.orderMeta}>
                  <h2>Order Reference: {orderData.id}</h2>
                  <div className={trackingStyles.orderDate}>Ordered on: {orderData.date}</div>
                </div>
                <span className={`${trackingStyles.orderStatusBadge} ${
                  orderData.status.toLowerCase() === "completed" ? trackingStyles.statusCompleted :
                  orderData.status.toLowerCase() === "processing" ? trackingStyles.statusProcessing :
                  orderData.status.toLowerCase() === "pending" ? trackingStyles.statusPending :
                  orderData.status.toLowerCase() === "cancelled" ? trackingStyles.statusCancelled :
                  trackingStyles.statusPaid
                }`}>
                  Status: {orderData.status}
                </span>
              </div>

              {/* Progress Stepper (Skip if cancelled) */}
              {!isCancelled ? (
                <div className={trackingStyles.stepperContainer}>
                  <div className={trackingStyles.stepper}>
                    {/* Stepper Progress Fill Line */}
                    <div 
                      className={trackingStyles.stepperProgressLine} 
                      style={{ 
                        width: typeof window !== "undefined" && window.innerWidth <= 768 
                          ? "4px" 
                          : `${(currentStep / 4) * 90}%` 
                      }} 
                    />

                    {/* Step 1: Placed */}
                    <div className={`${trackingStyles.step} ${currentStep >= 0 ? (currentStep === 0 ? trackingStyles.stepActive : trackingStyles.stepCompleted) : ""}`}>
                      <div className={trackingStyles.stepIcon}>
                        {currentStep > 0 ? "✓" : "1"}
                      </div>
                      <div className={trackingStyles.stepTitle}>Order Placed</div>
                      <div className={trackingStyles.stepDate}>{orderData.date}</div>
                    </div>

                    {/* Step 2: Paid */}
                    <div className={`${trackingStyles.step} ${currentStep >= 1 ? (currentStep === 1 ? trackingStyles.stepActive : trackingStyles.stepCompleted) : ""}`}>
                      <div className={trackingStyles.stepIcon}>
                        {currentStep > 1 ? "✓" : "2"}
                      </div>
                      <div className={trackingStyles.stepTitle}>Payment Verified</div>
                      <div className={trackingStyles.stepDate}>{currentStep >= 1 ? orderData.date : "--"}</div>
                    </div>

                    {/* Step 3: Processing */}
                    <div className={`${trackingStyles.step} ${currentStep >= 2 ? (currentStep === 2 ? trackingStyles.stepActive : trackingStyles.stepCompleted) : ""}`}>
                      <div className={trackingStyles.stepIcon}>
                        {currentStep > 2 ? "✓" : "3"}
                      </div>
                      <div className={trackingStyles.stepTitle}>Customizing Item</div>
                      <div className={trackingStyles.stepDate}>{currentStep >= 2 ? orderData.date : "--"}</div>
                    </div>

                    {/* Step 4: Dispatched */}
                    <div className={`${trackingStyles.step} ${currentStep >= 3 ? (currentStep === 3 ? trackingStyles.stepActive : trackingStyles.stepCompleted) : ""}`}>
                      <div className={trackingStyles.stepIcon}>
                        {currentStep > 3 ? "✓" : "4"}
                      </div>
                      <div className={trackingStyles.stepTitle}>On the Way</div>
                      <div className={trackingStyles.stepDate}>{currentStep >= 3 ? orderData.date : "--"}</div>
                    </div>

                    {/* Step 5: Completed */}
                    <div className={`${trackingStyles.step} ${currentStep >= 4 ? (currentStep === 4 ? trackingStyles.stepActive : trackingStyles.stepCompleted) : ""}`}>
                      <div className={trackingStyles.stepIcon}>
                        {currentStep === 4 ? "✓" : "5"}
                      </div>
                      <div className={trackingStyles.stepTitle}>Delivered</div>
                      <div className={trackingStyles.stepDate}>{currentStep === 4 ? orderData.date : "--"}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={trackingStyles.notFoundSection} style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#b91c1c" }}>
                  <h3>Order Cancelled</h3>
                  <p>This order has been cancelled. If you believe this is an error, please contact support.</p>
                </div>
              )}

              {/* Order Details & Delivery Summary Grid */}
              <div className={trackingStyles.detailsGrid}>
                {/* Products list */}
                <div className={trackingStyles.productsBlock}>
                  <h3 className={trackingStyles.blockTitle}>Items Ordered</h3>
                  <div className={trackingStyles.productList}>
                    {orderData.products.map((item, idx) => (
                      <div key={idx} className={trackingStyles.productItem}>
                        <div className={trackingStyles.productInfo}>
                          <span className={trackingStyles.productName}>{item.name}</span>
                          <span className={trackingStyles.productQty}>Qty: {item.qty}</span>
                        </div>
                        <span className={trackingStyles.productPrice}>{item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className={trackingStyles.pricingSummary}>
                    <div className={trackingStyles.summaryRow}>
                      <span>Subtotal</span>
                      <span>{orderData.total}</span>
                    </div>
                    <div className={trackingStyles.summaryRow}>
                      <span>Delivery Fee</span>
                      <span>FREE</span>
                    </div>
                    <div className={`${trackingStyles.summaryRow} ${trackingStyles.totalRow}`}>
                      <span>Grand Total</span>
                      <span>{orderData.total}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className={trackingStyles.deliveryBlock}>
                  <h3 className={trackingStyles.blockTitle}>Delivery Summary</h3>
                  <div className={trackingStyles.addressDetails}>
                    <p><strong>Customer Name:</strong> {orderData.customer}</p>
                    <p><strong>Shipping Address:</strong></p>
                    <p style={{ color: "#64748b", background: "#f8fafc", padding: "1rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                      {orderData.address}
                    </p>
                    <p style={{ marginTop: '1rem' }}><strong>Shipping Partner:</strong> Viola Premium Delivery Service</p>
                    <p><strong>Tracking Number:</strong> TRK-{orderData.id.replace("ORD-", "")}</p>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className={trackingStyles.notFoundSection}>
              <h3>Order Not Found</h3>
              <p>We couldn't find any orders matching reference <strong>"{orderId}"</strong> and email <strong>"{email}"</strong>. Please verify details and try again.</p>
            </div>
          )
        )}
      </main>


    </div>
  );
}
