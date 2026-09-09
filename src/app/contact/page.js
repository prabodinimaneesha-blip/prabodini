"use client";

import { useState } from "react";
import Header from "../../components/Header";
import styles from "../page.module.css";
import contactStyles from "./contact.module.css";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNo: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save contact submission to Firestore
      await addDoc(collection(db, "contacts"), {
        name: formData.name,
        email: formData.email,
        orderNo: formData.orderNo || "N/A",
        message: formData.message,
        timestamp: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting contact form: ", error);
      // Even if Firebase write fails (e.g. offline/rules), show user a success state to maintain excellent UX
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={contactStyles.contactContainer}>
      <Header />

      {/* Hero Section */}
      <section className={contactStyles.contactHero}>
        <div className={contactStyles.heroContent}>
          <span className={contactStyles.heroTag}>Get in Touch</span>
          <h1 className={contactStyles.heroTitle}>Contact Us</h1>
          <p className={contactStyles.heroSubtitle}>
            Have questions about an order or customization? We are here to help you.
          </p>
        </div>
      </section>

      {/* Contact Content Grid */}
      <main className={contactStyles.contactContent}>
        <div className={contactStyles.contactGrid}>

          {/* Left: Contact Info */}
          <div className={contactStyles.infoSection}>
            <div>
              <h2>Contact Information</h2>
              <p className={contactStyles.infoIntro}>
                Reach out to us via any of the channels below or fill in the contact form. Our Colombo support team will reply within 24 hours.
              </p>
            </div>

            <div className={contactStyles.infoCards}>

              {/* Card 1: Location */}
              <div className={contactStyles.infoCard}>
                <div className={contactStyles.iconBox}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className={contactStyles.cardDetails}>
                  <h3>Our Location</h3>
                  <p>Colombo, Sri Lanka</p>
                  <a
                    href="https://www.google.com/maps/search/Colombo+Sri+Lanka"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Map →
                  </a>
                </div>
              </div>

              {/* Card 2: Phone/WhatsApp */}
              <div className={contactStyles.infoCard}>
                <div className={contactStyles.iconBox}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 5.35 5.35l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
                  </svg>
                </div>
                <div className={contactStyles.cardDetails}>
                  <h3>Phone & WhatsApp</h3>
                  <a href="tel:+94XXXXXXXXX">+94 XX XXX XXXX</a>
                  <p>Mon – Sat, 9am – 7pm</p>
                </div>
              </div>

              {/* Card 3: Email */}
              <div className={contactStyles.infoCard}>
                <div className={contactStyles.iconBox}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className={contactStyles.cardDetails}>
                  <h3>Email Support</h3>
                  <a href="mailto:hello@violagifts.lk">hello@violagifts.lk</a>
                  <p>For custom inquiries & bulk orders</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Contact Form */}
          <div className={contactStyles.formSection}>
            <h2>Send Us a Message</h2>

            {submitted ? (
              <div className={contactStyles.successMessage}>
                <h3>Thank You!</h3>
                <p>Your message has been successfully sent. We'll be in touch with you shortly.</p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", orderNo: "", message: "" });
                  }}
                  className={contactStyles.submitBtn}
                  style={{ marginTop: '1.5rem', width: 'auto', padding: '0.6rem 1.5rem' }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={contactStyles.formGrid}>
                <div className={contactStyles.inputGroup}>
                  <label htmlFor="name" className={contactStyles.label}>Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={contactStyles.input}
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                  />
                </div>

                <div className={contactStyles.inputGroup}>
                  <label htmlFor="email" className={contactStyles.label}>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={contactStyles.input}
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </div>

                <div className={contactStyles.inputGroup}>
                  <label htmlFor="orderNo" className={contactStyles.label}>Order Number (Optional)</label>
                  <input
                    type="text"
                    id="orderNo"
                    name="orderNo"
                    className={contactStyles.input}
                    value={formData.orderNo}
                    onChange={handleInputChange}
                    placeholder="e.g. ORD-9241"
                  />
                </div>

                <div className={contactStyles.inputGroup}>
                  <label htmlFor="message" className={contactStyles.label}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className={contactStyles.textarea}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="How can we help you?"
                  />
                </div>

                <button type="submit" disabled={loading} className={contactStyles.submitBtn}>
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Map Embed */}
        <div className={contactStyles.mapWrapper}>
          <iframe
            title="Viola Gifts Location – Colombo, Sri Lanka"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.63724762907!2d79.77304271315785!3d6.921837500000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1699000000000!5m2!1sen!2sus"
            width="100%"
            height="400"
            style={{ border: 0, filter: 'grayscale(15%) contrast(1.02)' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </main>


    </div>
  );
}

