"use client";

import Header from "../../components/Header";
import styles from "./checkout.module.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense } from "react";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    phone: ""
  });

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('payhere'); // 'payhere' | 'cod' | 'bank'

  useEffect(() => {
    // Read product details from query parameters
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const priceStr = searchParams.get('price');
    const image = searchParams.get('image');

    if (id && name && priceStr) {
      setCartItems([
        {
          id,
          name,
          qty: 1,
          price: parseFloat(priceStr),
          image: image || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=100&h=100&fit=crop"
        }
      ]);
    }
  }, [searchParams]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = subtotal > 5000 ? 0 : 350.00; // Free shipping over Rs. 5000
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // ── Cash on Delivery ──────────────────────────────────────────────
    if (paymentMethod === 'cod') {
      alert(
        `✅ Order Placed Successfully!\n\n` +
        `Thank you, ${formData.firstName}! Your order has been received.\n` +
        `Please have Rs. ${total.toLocaleString('en-LK', { minimumFractionDigits: 2 })} ready upon delivery.\n\n` +
        `We will contact you at ${formData.phone} to confirm the delivery date.`
      );
      return;
    }

    // ── Bank Transfer ─────────────────────────────────────────────────
    if (paymentMethod === 'bank') {
      alert(
        `🏦 Order Placed — Awaiting Bank Transfer\n\n` +
        `Please transfer Rs. ${total.toLocaleString('en-LK', { minimumFractionDigits: 2 })} to:\n\n` +
        `  Bank   : Commercial Bank of Ceylon\n` +
        `  Branch : Colombo 03\n` +
        `  A/C No : 8001 2345 6789\n` +
        `  Name   : Viola Gifts (Pvt) Ltd\n\n` +
        `Once transferred, send your receipt to orders@violagifts.lk\n` +
        `and we will process your order within 24 hours.`
      );
      return;
    }

    // ── PayHere Card / Online Payment ─────────────────────────────────
    setLoading(true);

    try {
      const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || '12345'; // Set your Merchant ID in .env.local
      const orderId = `ORDER_${cartItems[0].id}_${Date.now()}`;
      
      // 1. Generate the hash by calling our Next.js API route
      const response = await fetch('/api/payhere/hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchant_id: merchantId,
          order_id: orderId,
          amount: total.toFixed(2),
          currency: 'LKR',
        }),
      });

      const data = await response.json();

      if (!data.hash) {
        throw new Error('Failed to generate hash');
      }

      // 2. Setup PayHere payment parameters using form data
      const payment = {
        sandbox: true, // Set to false for production
        merchant_id: merchantId,
        return_url: window.location.origin + '/checkout/success', 
        cancel_url: window.location.origin + '/checkout/cancel',  
        notify_url: window.location.origin + '/api/payhere/notify',
        order_id: orderId,
        items: cartItems.map(item => item.name).join(', '),
        amount: total.toFixed(2),
        currency: 'LKR',
        hash: data.hash, 
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || '0770000000',
        address: formData.address,
        city: formData.city,
        country: 'Sri Lanka',
      };

      // 3. Define PayHere event handlers
      window.payhere.onCompleted = function onCompleted(completedOrderId) {
        console.log("Payment completed. OrderID:" + completedOrderId);
        alert("Payment successful! Thank you for your order.");
      };

      window.payhere.onDismissed = function onDismissed() {
        console.log("Payment dismissed");
      };

      window.payhere.onError = function onError(error) {
        console.log("Error:" + error);
        alert('Payment failed. Please try again.');
      };

      // 4. Trigger PayHere Checkout Modal
      window.payhere.startPayment(payment);

    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred while initiating checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className={styles.checkoutContent}>
        <h1 className={styles.pageTitle}>Secure Checkout</h1>

        <form className={styles.checkoutGrid} onSubmit={handleSubmit}>
          
          {/* Left Column: Forms */}
          <div className={styles.formContainer}>
            
            <section className={styles.formSection} style={{ marginBottom: '2rem' }}>
              <h2 className={styles.sectionTitle}>1. Shipping & Contact</h2>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="firstName" className={styles.label}>First Name</label>
                  <input type="text" id="firstName" name="firstName" className={styles.input} required value={formData.firstName} onChange={handleInputChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="lastName" className={styles.label}>Last Name</label>
                  <input type="text" id="lastName" name="lastName" className={styles.input} required value={formData.lastName} onChange={handleInputChange} />
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label htmlFor="email" className={styles.label}>Email Address</label>
                  <input type="email" id="email" name="email" className={styles.input} required value={formData.email} onChange={handleInputChange} />
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label htmlFor="phone" className={styles.label}>Phone Number</label>
                  <input type="tel" id="phone" name="phone" className={styles.input} required value={formData.phone} onChange={handleInputChange} />
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label htmlFor="address" className={styles.label}>Street Address</label>
                  <input type="text" id="address" name="address" className={styles.input} required value={formData.address} onChange={handleInputChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="city" className={styles.label}>City</label>
                  <input type="text" id="city" name="city" className={styles.input} required value={formData.city} onChange={handleInputChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="zipCode" className={styles.label}>ZIP / Postal Code</label>
                  <input type="text" id="zipCode" name="zipCode" className={styles.input} value={formData.zipCode} onChange={handleInputChange} />
                </div>
              </div>
            </section>

            {/* Payment Method Section */}
            <section className={styles.formSection}>
              <h2 className={styles.sectionTitle}>2. Payment Method</h2>

              <div className={styles.paymentOptions}>

                {/* PayHere – Card / Online */}
                <label
                  htmlFor="pay-payhere"
                  className={`${styles.paymentCard} ${
                    paymentMethod === 'payhere' ? styles.paymentCardActive : ''
                  }`}
                >
                  <input
                    type="radio"
                    id="pay-payhere"
                    name="paymentMethod"
                    value="payhere"
                    checked={paymentMethod === 'payhere'}
                    onChange={() => setPaymentMethod('payhere')}
                    className={styles.paymentRadio}
                  />
                  <span className={styles.paymentIcon}>💳</span>
                  <div className={styles.paymentInfo}>
                    <span className={styles.paymentLabel}>Card / Online Payment</span>
                    <span className={styles.paymentDesc}>Pay securely via PayHere (Visa, Master, Amex, eZ Cash &amp; more)</span>
                  </div>
                  {paymentMethod === 'payhere' && <span className={styles.paymentCheck}>✓</span>}
                </label>

                {/* Cash on Delivery */}
                <label
                  htmlFor="pay-cod"
                  className={`${styles.paymentCard} ${
                    paymentMethod === 'cod' ? styles.paymentCardActive : ''
                  }`}
                >
                  <input
                    type="radio"
                    id="pay-cod"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className={styles.paymentRadio}
                  />
                  <span className={styles.paymentIcon}>🚚</span>
                  <div className={styles.paymentInfo}>
                    <span className={styles.paymentLabel}>Cash on Delivery</span>
                    <span className={styles.paymentDesc}>Pay in cash when your order arrives at your door</span>
                  </div>
                  {paymentMethod === 'cod' && <span className={styles.paymentCheck}>✓</span>}
                </label>

                {/* Bank Transfer */}
                <label
                  htmlFor="pay-bank"
                  className={`${styles.paymentCard} ${
                    paymentMethod === 'bank' ? styles.paymentCardActive : ''
                  }`}
                >
                  <input
                    type="radio"
                    id="pay-bank"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')}
                    className={styles.paymentRadio}
                  />
                  <span className={styles.paymentIcon}>🏦</span>
                  <div className={styles.paymentInfo}>
                    <span className={styles.paymentLabel}>Bank Transfer</span>
                    <span className={styles.paymentDesc}>Direct bank deposit — order confirmed after receipt is sent</span>
                  </div>
                  {paymentMethod === 'bank' && <span className={styles.paymentCheck}>✓</span>}
                </label>

              </div>

              {/* Bank Transfer Details (shown inline when selected) */}
              {paymentMethod === 'bank' && (
                <div className={styles.bankDetails}>
                  <h3 className={styles.bankDetailsTitle}>🏦 Bank Account Details</h3>
                  <div className={styles.bankRow}><span>Bank</span><span>Commercial Bank of Ceylon</span></div>
                  <div className={styles.bankRow}><span>Branch</span><span>Colombo 03</span></div>
                  <div className={styles.bankRow}><span>Account No.</span><span>8001 2345 6789</span></div>
                  <div className={styles.bankRow}><span>Account Name</span><span>Viola Gifts (Pvt) Ltd</span></div>
                  <p className={styles.bankNote}>
                    After transferring, email your receipt to{' '}
                    <strong>orders@violagifts.lk</strong>. Your order will be processed within 24 hours.
                  </p>
                </div>
              )}

              {/* COD note */}
              {paymentMethod === 'cod' && (
                <div className={styles.codNote}>
                  <span>🛡️</span>
                  <p>Please ensure someone is available at the delivery address to receive and pay for the order. COD is available island-wide.</p>
                </div>
              )}

            </section>
          </div>

          {/* Right Column: Order Summary */}
          <aside className={styles.summarySection}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            
            <div className={styles.orderItems}>
              {cartItems.length > 0 ? (
                cartItems.map(item => (
                  <div key={item.id} className={styles.orderItem}>
                    <div className={styles.itemInfo}>
                      <img src={item.image} alt={item.name} className={styles.itemImage} />
                      <div className={styles.itemDetails}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemQty}>Qty: {item.qty}</span>
                      </div>
                    </div>
                    <span className={styles.itemPrice}>Rs. {(item.price * item.qty).toLocaleString("en-LK", { minimumFractionDigits: 2 })}</span>
                  </div>
                ))
              ) : (
                <p>Your cart is empty.</p>
              )}
            </div>

            <div className={styles.summaryTotals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `Rs. ${shipping.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>Rs. {total.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button type="submit" className={styles.checkoutBtn} disabled={loading || cartItems.length === 0}>
              {loading
                ? 'Processing...'
                : paymentMethod === 'cod'
                ? '🚚 Place Order (Cash on Delivery)'
                : paymentMethod === 'bank'
                ? '🏦 Place Order (Bank Transfer)'
                : '💳 Pay with PayHere'}
            </button>
          </aside>

        </form>
      </main>
  );
}

export default function CheckoutPage() {
  return (
    <div className={styles.checkoutContainer}>
      <Header />
      {/* Load PayHere Script */}
      <Script src="https://www.payhere.lk/lib/payhere.js" strategy="lazyOnload" />

      <Suspense fallback={<div style={{ textAlign: "center", padding: "2rem" }}>Loading checkout...</div>}>
        <CheckoutForm />
      </Suspense>
    </div>
  );
}
