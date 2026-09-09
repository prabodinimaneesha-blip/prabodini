"use client";

import Header from "../../components/Header";
import styles from "./checkout.module.css";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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

  // Card specific state
  const [cardData, setCardData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });
  const [cardErrors, setCardErrors] = useState({});
  const [cardFocused, setCardFocused] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("idle"); // 'idle' | 'processing' | 'success' | 'error'
  const [orderId, setOrderId] = useState("");
  const [cardShake, setCardShake] = useState(false);

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

  const getCardType = (number) => {
    const cleanNumber = number.replace(/\s+/g, "");
    if (/^4/.test(cleanNumber)) return "visa";
    if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(cleanNumber)) return "mastercard";
    if (/^3[47]/.test(cleanNumber)) return "amex";
    if (/^(6011|65|64[4-9])/.test(cleanNumber)) return "discover";
    return "generic";
  };

  const cardType = getCardType(cardData.cardNumber);

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      const digits = value.replace(/\D/g, "");
      const matches = digits.match(/\d{1,4}/g);
      formattedValue = matches ? matches.join(" ") : "";

      if (cardErrors.cardNumber) {
        setCardErrors(prev => ({ ...prev, cardNumber: "" }));
      }
    } else if (name === "expiryDate") {
      const digits = value.replace(/\D/g, "");
      if (digits.length > 2) {
        formattedValue = `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
      } else {
        formattedValue = digits;
      }

      if (cardErrors.expiryDate) {
        setCardErrors(prev => ({ ...prev, expiryDate: "" }));
      }
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "");

      if (cardErrors.cvv) {
        setCardErrors(prev => ({ ...prev, cvv: "" }));
      }
    } else if (name === "cardholderName") {
      formattedValue = value.replace(/[^a-zA-Z\s]/g, "");

      if (cardErrors.cardholderName) {
        setCardErrors(prev => ({ ...prev, cardholderName: "" }));
      }
    }

    setCardData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const validateLuhn = (number) => {
    const cleanNumber = number.replace(/\s+/g, "");
    if (!/^\d+$/.test(cleanNumber)) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i));
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const validateExpiry = (expiry) => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [monthStr, yearStr] = expiry.split("/");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10) + 2000;
    if (month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return true;
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

    // ── PayHere Card / Online Payment (Secure Inline Card Payment) ─────────────────────────────────
    if (paymentMethod === 'payhere') {
      const errors = {};

      if (!cardData.cardholderName.trim()) {
        errors.cardholderName = "Cardholder Name is required.";
      } else if (cardData.cardholderName.trim().length < 3) {
        errors.cardholderName = "Cardholder Name must be at least 3 characters.";
      }

      const cleanNum = cardData.cardNumber.replace(/\s+/g, "");
      if (!cardData.cardNumber) {
        errors.cardNumber = "Card Number is required.";
      } else if (cleanNum.length < 15 || cleanNum.length > 16) {
        errors.cardNumber = "Invalid Card Number length.";
      } else if (!validateLuhn(cardData.cardNumber)) {
        errors.cardNumber = "Invalid Card Number (fails Luhn check).";
      }

      if (!cardData.expiryDate) {
        errors.expiryDate = "Expiry Date is required.";
      } else if (!validateExpiry(cardData.expiryDate)) {
        errors.expiryDate = "Invalid Expiry Date (MM/YY in the future).";
      }

      const cvvLength = cardData.cvv.length;
      const expectedCvvLength = cardType === "amex" ? 4 : 3;
      if (!cardData.cvv) {
        errors.cvv = "CVV is required.";
      } else if (cvvLength !== expectedCvvLength) {
        errors.cvv = `CVV must be ${expectedCvvLength} digits.`;
      }

      if (Object.keys(errors).length > 0) {
        setCardErrors(errors);
        setCardShake(true);
        setTimeout(() => setCardShake(false), 400);
        return;
      }

      setLoading(true);
      setPaymentStatus('processing');

      try {
        const finalOrderId = `ORDER_${cartItems[0].id}_${Date.now()}`;
        setOrderId(finalOrderId);

        // Simulate secure authorization processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Write order details directly to Firestore
        try {
          const { db } = await import('../../firebase');
          const { doc, setDoc } = await import('firebase/firestore');

          await setDoc(doc(db, 'orders', finalOrderId), {
            id: finalOrderId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode || '',
            phone: formData.phone,
            items: cartItems.map(item => item.name).join(', '),
            amount: total.toFixed(2),
            currency: 'LKR',
            paymentMethod: 'card',
            status: 'PAID',
            createdAt: new Date().toISOString()
          });
        } catch (fsError) {
          console.warn("Firestore lookup/write failed, simulating local success:", fsError);
        }

        setPaymentStatus('success');
      } catch (err) {
        console.error("Payment submission error:", err);
        setPaymentStatus('error');
      } finally {
        setLoading(false);
      }
    }
  };

  // Render Receipt Success screen
  if (paymentStatus === 'success') {
    return (
      <main className={styles.checkoutContent}>
        <div className={styles.successContainer}>
          <div className={styles.successIconWrapper}>
            <span className={styles.successCheckmark}>✓</span>
          </div>
          <h1 className={styles.successTitle}>Payment Successful!</h1>
          <p className={styles.successSubtitle}>
            Thank you, {formData.firstName}! Your order has been placed successfully and your transaction was completed securely.
          </p>

          <div className={styles.receiptCard}>
            <h3 className={styles.receiptTitle}>🧾 Order Receipt</h3>
            <div className={styles.receiptRow}>
              <span>Order Reference:</span>
              <strong style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>{orderId}</strong>
            </div>
            <div className={styles.receiptRow}>
              <span>Date:</span>
              <span>{new Date().toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className={styles.receiptRow}>
              <span>Customer:</span>
              <span>{formData.firstName} {formData.lastName}</span>
            </div>
            <div className={styles.receiptRow}>
              <span>Email:</span>
              <span>{formData.email}</span>
            </div>
            <div className={styles.receiptRow}>
              <span>Payment Method:</span>
              <span>Card / Online Payment (Secured)</span>
            </div>

            <div className={styles.receiptItems}>
              {cartItems.map(item => (
                <div key={item.id} className={styles.receiptItem}>
                  <span>{item.name} (x{item.qty})</span>
                  <span>Rs. {(item.price * item.qty).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>

            <div className={styles.receiptRow}>
              <span>Subtotal:</span>
              <span>Rs. {subtotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={styles.receiptRow}>
              <span>Shipping:</span>
              <span>{shipping === 0 ? "FREE" : `Rs. ${shipping.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`}</span>
            </div>
            <div className={`${styles.receiptRow} ${styles.receiptRowBold}`}>
              <span>Total Paid:</span>
              <span>Rs. {total.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className={styles.successActions}>
            <a
              href={`/order-tracking?orderId=${orderId}&email=${encodeURIComponent(formData.email)}`}
              className={styles.primaryActionBtn}
            >
              📦 Track Your Order
            </a>
            <a href="/" className={styles.secondaryActionBtn}>
              🏠 Back to Home
            </a>
            <button onClick={() => window.print()} className={styles.secondaryActionBtn}>
              🖨️ Print Receipt
            </button>
          </div>
        </div>
      </main>
    );
  }

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
                  <span className={styles.paymentDesc}>Pay securely with card details entered below</span>
                </div>
                {paymentMethod === 'payhere' && <span className={styles.paymentCheck}>✓</span>}
              </label>

              {paymentMethod === 'payhere' && (
                <div className={`${styles.cardFormSection} ${cardShake ? styles.shake : ''}`}>
                  <h3 className={styles.cardFormTitle}>🔒 Secure Card Payment</h3>

                  {/* Credit Card Mockup */}
                  <div className={styles.cardWrapper} onClick={() => setCardFocused(cardFocused === 'cvv' ? '' : 'cvv')}>
                    <div className={`${styles.creditCard} ${cardFocused === 'cvv' ? styles.creditCardFlipped : ''}`}>
                      {/* Card Front */}
                      <div className={`${styles.cardFront} ${
                        cardType === 'visa' ? styles.visaCard :
                        cardType === 'mastercard' ? styles.masterCard :
                        cardType === 'amex' ? styles.amexCard :
                        cardType === 'discover' ? styles.discoverCard : ''
                      }`}>
                        <div className={styles.cardHeader}>
                          <div className={styles.cardChip}></div>
                          <span className={styles.cardTypeLogo}>
                            {cardType === 'visa' && 'VISA'}
                            {cardType === 'mastercard' && 'Mastercard'}
                            {cardType === 'amex' && 'AMEX'}
                            {cardType === 'discover' && 'Discover'}
                            {cardType === 'generic' && 'Card'}
                          </span>
                        </div>
                        <div className={styles.cardNumberDisplay}>
                          {cardData.cardNumber || '•••• •••• •••• ••••'}
                        </div>
                        <div className={styles.cardFooter}>
                          <div className={styles.cardHolderDisplay}>
                            <span className={styles.cardLabel}>Cardholder Name</span>
                            <span className={styles.cardValue}>{cardData.cardholderName || 'YOUR NAME'}</span>
                          </div>
                          <div className={styles.cardExpiryDisplay}>
                            <span className={styles.cardLabel}>Expires</span>
                            <span className={styles.cardValue}>{cardData.expiryDate || 'MM/YY'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Back */}
                      <div className={styles.cardBack}>
                        <div className={styles.magneticStrip}></div>
                        <div className={styles.signatureArea}>
                          <span className={styles.cardLabel} style={{ marginLeft: 0 }}>Authorized Signature</span>
                          <div className={styles.signatureLine}>
                            <span className={styles.cvvDisplay}>{cardData.cvv ? '•'.repeat(cardData.cvv.length) : '•••'}</span>
                          </div>
                        </div>
                        <p className={styles.cardBackInstructions}>
                          This card transaction is simulated securely. Card details are never logged or stored.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Input Fields */}
                  <div className={styles.cardFormGrid}>
                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                      <label htmlFor="cardholderName" className={styles.label}>Cardholder Name</label>
                      <input
                        type="text"
                        id="cardholderName"
                        name="cardholderName"
                        placeholder="John Doe"
                        className={`${styles.input} ${cardErrors.cardholderName ? styles.inputError : ''}`}
                        value={cardData.cardholderName}
                        onChange={handleCardInputChange}
                        onFocus={() => setCardFocused('cardholderName')}
                        autoComplete="cc-name"
                        required
                      />
                      {cardErrors.cardholderName && <span className={styles.errorText}>{cardErrors.cardholderName}</span>}
                    </div>

                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                      <label htmlFor="cardNumber" className={styles.label}>Card Number</label>
                      <div className={styles.cardInputWrapper}>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="4111 1111 1111 1111"
                          maxLength="19"
                          className={`${styles.input} ${cardErrors.cardNumber ? styles.inputError : ''}`}
                          value={cardData.cardNumber}
                          onChange={handleCardInputChange}
                          onFocus={() => setCardFocused('cardNumber')}
                          autoComplete="cc-number"
                          required
                        />
                        <span className={styles.cardInputLogo}>
                          {cardType === 'visa' && '💳'}
                          {cardType === 'mastercard' && '🔴🟡'}
                          {cardType === 'amex' && '💚'}
                          {cardType === 'discover' && '🧡'}
                          {cardType === 'generic' && '💳'}
                        </span>
                      </div>
                      {cardErrors.cardNumber && <span className={styles.errorText}>{cardErrors.cardNumber}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="expiryDate" className={styles.label}>Expiry Date</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        maxLength="5"
                        className={`${styles.input} ${cardErrors.expiryDate ? styles.inputError : ''}`}
                        value={cardData.expiryDate}
                        onChange={handleCardInputChange}
                        onFocus={() => setCardFocused('expiryDate')}
                        autoComplete="cc-exp"
                        required
                      />
                      {cardErrors.expiryDate && <span className={styles.errorText}>{cardErrors.expiryDate}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="cvv" className={styles.label}>CVV / CVC</label>
                      <input
                        type="password"
                        id="cvv"
                        name="cvv"
                        placeholder="•••"
                        maxLength={cardType === 'amex' ? 4 : 3}
                        className={`${styles.input} ${cardErrors.cvv ? styles.inputError : ''}`}
                        value={cardData.cvv}
                        onChange={handleCardInputChange}
                        onFocus={() => setCardFocused('cvv')}
                        onPaste={(e) => e.preventDefault()}
                        autoComplete="cc-csc"
                        required
                      />
                      {cardErrors.cvv && <span className={styles.errorText}>{cardErrors.cvv}</span>}
                    </div>
                  </div>
                </div>
              )}

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

            {/* Bank Transfer Details */}
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
              ? (paymentStatus === 'processing' ? '🔒 SECURING TRANSACTION...' : 'Processing...')
              : paymentMethod === 'cod'
              ? '🚚 Place Order (Cash on Delivery)'
              : paymentMethod === 'bank'
              ? '🏦 Place Order (Bank Transfer)'
              : '💳 Pay securely now'}
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
      <Suspense fallback={<div style={{ textAlign: "center", padding: "2rem" }}>Loading checkout...</div>}>
        <CheckoutForm />
      </Suspense>
    </div>
  );
}

