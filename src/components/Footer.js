"use client";

import { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const shopLinks = [
    { name: "Customized Gifts", href: "/customized-gifts" },
    { name: "Photo Frames", href: "/photo-frames" },
    { name: "Mugs", href: "/mugs" },
    { name: "Key Tags", href: "/key-tags" },
    { name: "Gift Boxes", href: "/gift-boxes" },
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Order Tracking", href: "/order-tracking" },
    { name: "Login", href: "/login" },
    { name: "Register", href: "/register" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/94700000000",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "https://tiktok.com",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.56a8.17 8.17 0 0 0 4.77 1.52V6.64a4.85 4.85 0 0 1-1-.05z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .footer-wrapper {
          background: #080412;
          background: radial-gradient(circle at 15% 0%, rgba(147, 51, 234, 0.18) 0%, transparent 40%),
                      radial-gradient(circle at 85% 90%, rgba(236, 72, 153, 0.15) 0%, transparent 40%),
                      linear-gradient(180deg, #0a0515 0%, #120924 60%, #0d061a 100%);
          color: #e2d9f3;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Ambient Glow Spheres */
        .footer-glow-1 {
          position: absolute;
          top: -100px;
          left: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0) 70%);
          pointer-events: none;
          filter: blur(40px);
        }

        .footer-glow-2 {
          position: absolute;
          bottom: -100px;
          right: -100px;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.18) 0%, rgba(236, 72, 153, 0) 70%);
          pointer-events: none;
          filter: blur(50px);
        }

        /* Neon Top Glow Divider */
        .footer-divider-top {
          height: 3px;
          width: 100%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(168, 85, 247, 0.3) 15%, 
            #a855f7 40%, 
            #ec4899 60%, 
            rgba(236, 72, 153, 0.3) 85%, 
            transparent 100%
          );
          box-shadow: 0 0 15px rgba(236, 72, 153, 0.5);
        }

        .footer-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 64px 28px 48px;
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1.7fr;
          gap: 48px;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 1100px) {
          .footer-main {
            grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
            gap: 36px;
          }
        }

        @media (max-width: 900px) {
          .footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 600px) {
          .footer-main {
            grid-template-columns: 1fr;
            gap: 36px;
            padding: 48px 20px 32px;
          }
        }

        /* Brand Column */
        .footer-brand-logo {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          margin-bottom: 20px;
        }

        .footer-logo-badge {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 0 25px rgba(168, 85, 247, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.25);
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }

        .footer-brand-logo:hover .footer-logo-badge {
          transform: scale(1.1) rotate(-6deg);
          box-shadow: 0 0 35px rgba(236, 72, 153, 0.7);
        }

        .footer-logo-text {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 28px;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -0.5px;
        }

        .footer-logo-accent {
          background: linear-gradient(135deg, #c084fc 0%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .footer-logo-sub {
          font-size: 9.5px;
          font-weight: 800;
          color: #c084fc;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-top: 5px;
        }

        .footer-desc {
          font-size: 14px;
          line-height: 1.75;
          color: #a699c7;
          margin-bottom: 26px;
          max-width: 320px;
        }

        /* Social Buttons */
        .footer-social-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .footer-social-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.09);
          color: #d8b4fe;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(8px);
        }

        .footer-social-btn:hover {
          background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
          color: #ffffff;
          border-color: transparent;
          transform: translateY(-4px);
          box-shadow: 0 10px 25px -5px rgba(168, 85, 247, 0.5);
        }

        /* Navigation Columns */
        .footer-col-title {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #c084fc;
          margin-bottom: 22px;
          position: relative;
          padding-bottom: 12px;
        }

        .footer-col-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 32px;
          height: 2.5px;
          background: linear-gradient(90deg, #a855f7, #ec4899);
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(236, 72, 153, 0.6);
        }

        .footer-link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-link-item {
          display: flex;
          align-items: center;
        }

        .footer-link-item a {
          color: #a699c7;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s ease;
        }

        .footer-link-arrow {
          color: #8b5cf6;
          transition: transform 0.25s ease, color 0.25s ease;
          flex-shrink: 0;
        }

        .footer-link-item a:hover {
          color: #f3e8ff;
          transform: translateX(4px);
        }

        .footer-link-item a:hover .footer-link-arrow {
          color: #ec4899;
          transform: translateX(3px);
        }

        /* Glassmorphism Section Cards */
        .glass-card {
          background: rgba(22, 13, 41, 0.65);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .glass-card:hover {
          border-color: rgba(236, 72, 153, 0.35);
          box-shadow: 0 12px 35px -10px rgba(147, 51, 234, 0.25),
                      inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        /* Contact Items */
        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 24px;
        }

        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          transition: all 0.25s ease;
        }

        .footer-contact-item:hover {
          background: rgba(168, 85, 247, 0.12);
          border-color: rgba(168, 85, 247, 0.3);
          transform: translateY(-2px);
        }

        .footer-contact-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(236, 72, 153, 0.25) 100%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e9d5ff;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .footer-contact-text {
          font-size: 13.5px;
          color: #e2d9f3;
          line-height: 1.4;
          font-weight: 500;
        }

        .footer-contact-label {
          display: block;
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #c084fc;
          margin-bottom: 2px;
        }

        /* Newsletter */
        .footer-newsletter-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(168, 85, 247, 0.25);
          border-radius: 16px;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .footer-newsletter-card::before {
          content: '';
          position: absolute;
          top: -50px;
          right: -50px;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .footer-newsletter-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .footer-newsletter-header span {
          color: #f472b6;
        }

        .footer-newsletter-card p {
          font-size: 12.5px;
          color: #a699c7;
          margin: 0 0 16px;
          line-height: 1.5;
        }

        .footer-newsletter-form {
          display: flex;
          gap: 8px;
        }

        .footer-input-wrapper {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .footer-input-icon {
          position: absolute;
          left: 12px;
          color: #a78bfa;
          pointer-events: none;
        }

        .footer-newsletter-input {
          width: 100%;
          background: rgba(10, 5, 21, 0.7);
          border: 1px solid rgba(168, 85, 247, 0.25);
          border-radius: 10px;
          padding: 10px 12px 10px 38px;
          color: #ffffff;
          font-size: 13px;
          outline: none;
          transition: all 0.25s ease;
          font-family: inherit;
        }

        .footer-newsletter-input::placeholder {
          color: #7e6e9f;
        }

        .footer-newsletter-input:focus {
          border-color: #a855f7;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.35);
          background: rgba(15, 8, 30, 0.85);
        }

        .footer-newsletter-btn {
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
          box-shadow: 0 4px 14px rgba(236, 72, 153, 0.35);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .footer-newsletter-btn:hover {
          opacity: 0.95;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(236, 72, 153, 0.5);
        }

        .footer-newsletter-btn:active {
          transform: translateY(0);
        }

        .newsletter-success-msg {
          margin-top: 10px;
          font-size: 12px;
          color: #4ade80;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Bottom Bar */
        .footer-bottom-bar {
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(6, 3, 14, 0.7);
          position: relative;
          z-index: 2;
          backdrop-filter: blur(10px);
        }

        .footer-bottom-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 22px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-copyright {
          font-size: 13px;
          color: #8375a3;
          margin: 0;
        }

        .footer-copyright span {
          background: linear-gradient(135deg, #c084fc 0%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
        }

        .footer-policy-links {
          display: flex;
          align-items: center;
          gap: 22px;
          flex-wrap: wrap;
        }

        .footer-policy-links a {
          color: #8375a3;
          text-decoration: none;
          font-size: 12.5px;
          font-weight: 600;
          transition: all 0.2s ease;
          position: relative;
        }

        .footer-policy-links a:hover {
          color: #e9d5ff;
        }

        .footer-made-with {
          font-size: 12.5px;
          color: #8375a3;
          display: flex;
          align-items: center;
          gap: 5px;
          margin: 0;
          font-weight: 500;
        }

        .footer-heart {
          display: inline-block;
          color: #ec4899;
          animation: heartbeat 1.6s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.3); }
          30% { transform: scale(1); }
          45% { transform: scale(1.2); }
        }

        @media (max-width: 768px) {
          .footer-bottom-inner {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 12px;
          }
          .footer-newsletter-form {
            flex-direction: column;
          }
          .footer-newsletter-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <footer className="footer-wrapper">
        {/* Glow Spheres */}
        <div className="footer-glow-1"></div>
        <div className="footer-glow-2"></div>

        {/* Top Glow Bar */}
        <div className="footer-divider-top"></div>

        <div className="footer-main">
          {/* Brand Identity */}
          <div>
            <Link href="/" className="footer-brand-logo">
              <div className="footer-logo-badge">🎁</div>
              <div>
                <div className="footer-logo-text">
                  Viola <span className="footer-logo-accent">Gifts</span>
                </div>
                <div className="footer-logo-sub">Crafted With Love</div>
              </div>
            </Link>
            <p className="footer-desc">
              We create heartfelt, personalized gifts that turn precious moments into lasting memories. Every gift tells your unique story.
            </p>
            <div className="footer-social-row">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="footer-col-title">Shop</h3>
            <ul className="footer-link-list">
              {shopLinks.map((link) => (
                <li key={link.name} className="footer-link-item">
                  <Link href={link.href}>
                    <svg className="footer-link-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="footer-col-title">Company</h3>
            <ul className="footer-link-list">
              {companyLinks.map((link) => (
                <li key={link.name} className="footer-link-item">
                  <Link href={link.href}>
                    <svg className="footer-link-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch & Newsletter (Glassmorphism Section) */}
          <div className="glass-card">
            <h3 className="footer-col-title" style={{ marginBottom: "16px" }}>Get In Touch</h3>
            
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <div className="footer-contact-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="footer-contact-text">
                  <span className="footer-contact-label">Phone / WhatsApp</span>
                  +94 70 000 0000
                </div>
              </div>

              <div className="footer-contact-item">
                <div className="footer-contact-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <div className="footer-contact-text">
                  <span className="footer-contact-label">Email</span>
                  hello@violagifts.lk
                </div>
              </div>

              <div className="footer-contact-item">
                <div className="footer-contact-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="footer-contact-text">
                  <span className="footer-contact-label">Location</span>
                  Colombo, Sri Lanka
                </div>
              </div>
            </div>

            {/* Newsletter Glass Card */}
            <div className="footer-newsletter-card">
              <div className="footer-newsletter-header">
                <span>✦</span> Newsletter
              </div>
              <p>Subscribe for exclusive deals, gift ideas &amp; 10% off your first order!</p>
              
              <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                <div className="footer-input-wrapper">
                  <svg className="footer-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="footer-newsletter-input"
                    placeholder="your@email.com"
                    aria-label="Email address for newsletter"
                  />
                </div>
                <button type="submit" className="footer-newsletter-btn">
                  Subscribe
                </button>
              </form>

              {subscribed && (
                <div className="newsletter-success-msg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Thank you! You're on the VIP list ✨
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-inner">
            <p className="footer-copyright">
              &copy; {currentYear} <span>Viola Gifts</span>. All rights reserved.
            </p>
            
            <div className="footer-policy-links">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/refund-policy">Refund Policy</Link>
            </div>

            <p className="footer-made-with">
              Made with <span className="footer-heart">❤️</span> in Sri Lanka
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
