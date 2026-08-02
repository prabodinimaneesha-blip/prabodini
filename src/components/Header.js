


"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Customized Gifts", href: "/customized-gifts" },
    { name: "Photo Frames", href: "/photo-frames" },
    { name: "Mugs", href: "/mugs" },
    { name: "Key Tags", href: "/key-tags" },
    { name: "Gift Boxes", href: "/gift-boxes" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Order Tracking", href: "/order-tracking" },
  ];

  return (
    <>
      <style jsx global>{`
        .promo-bar {
          background: #111827;
          color: #f9fafb;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          text-align: center;
          padding: 8px 16px;
          font-weight: 600;
        }
        .header-container {
          position: sticky;
          top: 0;
          z-index: 50;
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #f3f4f6;
        }
        .header-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* ADVANCED CREATIVE LOGO STYLE */
        .brand-logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .logo-avatar-badge {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 20px;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.25);
          border: 2px solid #ffffff;
          outline: 2px solid #ec4899;
          transition: transform 0.3s ease;
        }
        .brand-logo-container:hover .logo-avatar-badge {
          transform: scale(1.05) rotate(-5deg);
        }
        .logo-text-wrapper {
          display: flex;
          flex-direction: column;
        }
        .logo-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 24px;
          font-weight: 900;
          color: #111827;
          letter-spacing: -0.5px;
          line-height: 1;
        }
        .logo-title-accent {
          background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .logo-tagline {
          font-size: 9px;
          font-weight: 700;
          color: #000000ff;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-top: 3px;
        }

        /* Navigation Styles */
        .nav-menu {
          display: flex;
          gap: 22px;
          align-items: center;
        }
        @media (max-width: 1024px) {
          .nav-menu {
            display: none;
          }
        }
        .nav-item {
          position: relative;
          color: #000000ff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 6px 0;
          transition: color 0.2s ease;
        }
        .nav-item:hover {
          color: #1118e1ff;
        }
        .nav-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 2px;
          background: linear-gradient(90deg, #9333ea, #ec4899);
          transition: width 0.3s ease;
          border-radius: 2px;
        }
        .nav-item:hover::after {
          width: 100%;
        }
        .icon-btn {
          color: #1118e1ff;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          transition: background-color 0.2s ease, color 0.2s ease;
          text-decoration: none;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .icon-btn:hover {
          background-color: #f3f4f6;
          color: #9333ea;
        }
        .mobile-drawer {
          position: fixed;
          top: 0;
          right: -100%;
          width: 280px;
          height: 100vh;
          background-color: #fcfcfcff;
          box-shadow: -4px 0 25px rgba(76, 47, 240, 0.15);
          z-index: 100;
          transition: right 0.3s ease-in-out;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        .mobile-drawer.open {
          right: 0;
        }
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 90;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        .overlay.open {
          opacity: 1;
          visibility: visible;
        }
      `}</style>

      {/* Announcement Bar */}
      <div className="promo-bar">
        ✨ FREE PREMIUM DELIVERY ON ORDERS OVER RS. 5,000 ✨
      </div>

      {/* Header Container */}
      <header className="header-container">
        <div className="header-content">

          {/* ADVANCED ADVANCED LOGO */}
          <Link href="/" className="brand-logo-container">
            <div className="logo-avatar-badge">
              {/* ඔයා ළඟ ඇත්තම Image (logo.png) එකක් තිබුණොත් <img> tag එකෙන් replace කරන්නත් පුළුවන් */}
              🎁
            </div>
            <div className="logo-text-wrapper">
              <span className="logo-title">
                Viola <span className="logo-title-accent">Gifts</span>
              </span>
              <span className="logo-tagline">Crafted With Love</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-menu">
            {navLinks.map((link, idx) => (
              <Link key={idx} href={link.href} className="nav-item">
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link href="/login" className="icon-btn" aria-label="User Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            <Link href="/checkout" className="icon-btn" aria-label="Cart" style={{ position: "relative" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span style={{ position: "absolute", top: "4px", right: "4px", backgroundColor: "#ec4899", color: "#fff", fontSize: "10px", fontWeight: "bold", width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                0
              </span>
            </Link>

            <button className="icon-btn" onClick={() => setIsMenuOpen(true)} aria-label="Open Menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Overlay & Menu */}
      <div className={`overlay ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(false)}></div>

      <div className={`mobile-drawer ${isMenuOpen ? "open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <Link href="/" className="brand-logo-container" onClick={() => setIsMenuOpen(false)}>
            <div className="logo-avatar-badge" style={{ width: '36px', height: '36px', fontSize: '16px' }}>
              🎁
            </div>
            <div className="logo-text-wrapper">
              <span className="logo-title" style={{ fontSize: '20px' }}>
                Viola <span className="logo-title-accent">Gifts</span>
              </span>
            </div>
          </Link>
          <button className="icon-btn" onClick={() => setIsMenuOpen(false)} aria-label="Close Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {navLinks.map((link, idx) => (
            <Link key={idx} href={link.href} style={{ color: "#374151", textDecoration: "none", fontSize: "15px", fontWeight: "600", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }} onClick={() => setIsMenuOpen(false)}>
              {link.name}
            </Link>
          ))}
          <Link href="/login" style={{ color: "#9333ea", textDecoration: "none", fontSize: "15px", fontWeight: "700", padding: "12px 0" }} onClick={() => setIsMenuOpen(false)}>
            Sign In / Register →
          </Link>
        </nav>
      </div>
    </>
  );
}