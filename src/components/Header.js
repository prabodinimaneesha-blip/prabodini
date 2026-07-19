"use client";

import Link from "next/link";
import styles from "../app/page.module.css";

export default function Header() {
  return (
    <>
      <div className={styles.promoBanner}>
        FREE PREMIUM DELIVERY ON ORDERS OVER $100
      </div>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Viola Gifts
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/customized-gifts" className={styles.navLink}>Customized Gifts</Link>
          <Link href="/photo-frames" className={styles.navLink}>Photo Frames</Link>
          <Link href="/mugs" className={styles.navLink}>Mugs</Link>
          <Link href="/keg-tags" className={styles.navLink}>Key Tags</Link>
          <Link href="/gift-boxes" className={styles.navLink}>Gift Boxes</Link>
        </nav>
        <div className={styles.headerIcons}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
      </header>
    </>
  );
}
