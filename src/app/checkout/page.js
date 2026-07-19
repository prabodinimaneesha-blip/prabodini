"use client";

import Header from "../../components/Header";
import styles from "./checkout.module.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

export default function CheckoutPage() {
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
  const shipping = subtotal > 100 ? 0 : 10.00; // Free shipping over $100
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
        // Optional: Redirect to a success page
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
    <div className={styles.checkoutContainer}>
      <Header />
      {/* Load PayHere Script */}
      <Script src="https://www.payhere.lk/lib/payhere.js" strategy="lazyOnload" />

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
                    <span className={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p>Your cart is empty.</p>
              )}
            </div>

            <div className={styles.summaryTotals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" className={styles.checkoutBtn} disabled={loading || cartItems.length === 0}>
              {loading ? "Processing..." : "Pay with PayHere"}
            </button>
          </aside>

        </form>
      </main>
    </div>
  );
}
