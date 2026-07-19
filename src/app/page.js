"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import styles from "./page.module.css";
import Link from "next/link";
import Header from "../components/Header";
import { useRouter } from "next/navigation";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleBuyNow = (product) => {
    const params = new URLSearchParams({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || (product.images ? product.images[0] : '')
    });
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      <Header />

      {/* Hero Banner */}
      <section className={`${styles.hero} ${styles.heroHome}`}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleWhite}>The Art of</span><br />
            <span className={styles.heroTitleGold}>Gifting</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Curated premium gifts for those who appreciate the finer<br />
            things in life, Exclusively at Viola Gifts.
          </p>
          <button className={styles.goldenButton}>Shop Now</button>
        </div>
      </section>

      {/* Exclusive Collection Gallery */}
      <section className={styles.gallerySection}>
        <div className={styles.gallerySectionInner}>
          <p className={styles.gallerySectionTag}>✦ Curated For You</p>
          <h2 className={styles.gallerySectionTitle}>Exclusive Collection</h2>
          <p className={styles.gallerySectionSubtitle}>
            Handpicked, beautifully crafted gifts that speak a thousand words — for every occasion.
          </p>

          <div className={styles.galleryGrid}>
            {/* Large left feature */}
            <div className={`${styles.galleryItem} ${styles.galleryItemLarge}`}>
              <img src="/gift_box_luxury.png" alt="Luxury Gift Box" className={styles.galleryImg} />
              <div className={styles.galleryOverlay}>
                <span className={styles.galleryCategory}>Gift Boxes</span>
                <h3 className={styles.galleryItemTitle}>Luxury Gift Boxes</h3>
                <p className={styles.galleryItemDesc}>Elegantly wrapped with gold ribbons & premium touches</p>
                <span className={styles.galleryBadge}>Shop Now →</span>
              </div>
            </div>

            {/* Top right */}
            <div className={styles.galleryItem}>
              <img src="/personalized_mug.png" alt="Personalized Mug" className={styles.galleryImg} />
              <div className={styles.galleryOverlay}>
                <span className={styles.galleryCategory}>Mugs</span>
                <h3 className={styles.galleryItemTitle}>Personalized Mugs</h3>
                <p className={styles.galleryItemDesc}>Floral prints & custom names, lovingly made</p>
                <span className={styles.galleryBadge}>Shop Now →</span>
              </div>
            </div>

            {/* Middle right */}
            <div className={styles.galleryItem}>
              <img src="/photo_frame_gift.png" alt="Photo Frame" className={styles.galleryImg} />
              <div className={styles.galleryOverlay}>
                <span className={styles.galleryCategory}>Photo Frames</span>
                <h3 className={styles.galleryItemTitle}>Custom Photo Frames</h3>
                <p className={styles.galleryItemDesc}>Preserve precious memories in golden borders</p>
                <span className={styles.galleryBadge}>Shop Now →</span>
              </div>
            </div>

            {/* Bottom left */}
            <div className={styles.galleryItem}>
              <img src="/keg_tag_wooden.png" alt="Keg Tags" className={styles.galleryImg} />
              <div className={styles.galleryOverlay}>
                <span className={styles.galleryCategory}>Keg Tags</span>
                <h3 className={styles.galleryItemTitle}>Handcrafted Keg Tags</h3>
                <p className={styles.galleryItemDesc}>Laser-engraved wood art, uniquely yours</p>
                <span className={styles.galleryBadge}>Shop Now →</span>
              </div>
            </div>

            {/* Bottom middle */}
            <div className={styles.galleryItem}>
              <img src="/hamper_collection.png" alt="Hamper" className={styles.galleryImg} />
              <div className={styles.galleryOverlay}>
                <span className={styles.galleryCategory}>Hampers</span>
                <h3 className={styles.galleryItemTitle}>Luxury Hampers</h3>
                <p className={styles.galleryItemDesc}>Chocolates, candles, skincare — all in one</p>
                <span className={styles.galleryBadge}>Shop Now →</span>
              </div>
            </div>

            {/* Bottom right */}
            <div className={styles.galleryItem}>
              <img src="/customized_gift_set.png" alt="Custom Gift Set" className={styles.galleryImg} />
              <div className={styles.galleryOverlay}>
                <span className={styles.galleryCategory}>Customized</span>
                <h3 className={styles.galleryItemTitle}>Custom Gift Sets</h3>
                <p className={styles.galleryItemDesc}>Monogrammed & personalized with rose gold accents</p>
                <span className={styles.galleryBadge}>Shop Now →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className={styles.productsSection}>
        <h2 className={styles.sectionTitle}>All Products</h2>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.length > 0 ? (
              products.map((product) => {
                const outOfStock = product.stock_quantity <= 0;

                return (
                  <div key={product.id} className={styles.card}>
                    <div className={styles.cardImageWrapper}>
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className={styles.cardImage}
                        />
                      ) : (
                        <div className={styles.noImage}>No Image Available</div>
                      )}
                    </div>

                    <div className={styles.cardContent}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productDescription}>{product.description}</p>

                      <div className={styles.cardFooter}>
                        <span className={styles.price}>${product.price}</span>
                        <span className={`${styles.stockInfo} ${outOfStock ? styles.outOfStock : styles.inStock}`}>
                          {outOfStock ? 'Out of Stock' : `${product.stock_quantity} in stock`}
                        </span>
                      </div>

                      <button
                        className={styles.addToCartBtn}
                        disabled={outOfStock}
                        onClick={() => handleBuyNow(product)}
                      >
                        {outOfStock ? 'Out of Stock' : 'Buy Now'}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#94a3b8' }}>
                No products found in the collection.
              </p>
            )}
          </div>
        )}
      </section>

      {/* Contact & Footer Section */}
      <section className={styles.contactSection}>
        <div className={styles.contactInner}>
          <h2 className={styles.contactTitle}>Find Us &amp; Connect</h2>
          <p className={styles.contactSubtitle}>
            We'd love to hear from you. Visit us in Colombo or reach out online.
          </p>

          <div className={styles.contactGrid}>
            {/* Location */}
            <div className={styles.contactCard}>
              <div className={styles.contactIconBox}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3 className={styles.contactCardTitle}>Our Location</h3>
              <p className={styles.contactCardText}>Colombo, Sri Lanka</p>
              <a
                href="https://www.google.com/maps/search/Colombo+Sri+Lanka"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                View on Map →
              </a>
            </div>

            {/* Phone */}
            <div className={styles.contactCard}>
              <div className={styles.contactIconBox}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 5.35 5.35l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
                </svg>
              </div>
              <h3 className={styles.contactCardTitle}>Phone / WhatsApp</h3>
              <a href="tel:+94XXXXXXXXX" className={styles.contactLink}>+94 XX XXX XXXX</a>
              <p className={styles.contactCardText}>Mon – Sat, 9am – 7pm</p>
            </div>

            {/* Email */}
            <div className={styles.contactCard}>
              <div className={styles.contactIconBox}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h3 className={styles.contactCardTitle}>Email Us</h3>
              <a href="mailto:hello@violagifts.lk" className={styles.contactLink}>hello@violagifts.lk</a>
              <p className={styles.contactCardText}>We reply within 24 hours</p>
            </div>

            {/* Facebook */}
            <div className={styles.contactCard}>
              <div className={styles.contactIconBox}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#facc15">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </div>
              <h3 className={styles.contactCardTitle}>Facebook</h3>
              <a
                href="https://facebook.com/violagifts"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                @ViolaGifts →
              </a>
              <p className={styles.contactCardText}>Follow for new arrivals &amp; offers</p>
            </div>

            {/* TikTok */}
            <div className={styles.contactCard}>
              <div className={styles.contactIconBox}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#facc15">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z"/>
                </svg>
              </div>
              <h3 className={styles.contactCardTitle}>TikTok</h3>
              <a
                href="https://tiktok.com/@violagifts"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                @ViolaGifts →
              </a>
              <p className={styles.contactCardText}>Watch our gift-wrap videos</p>
            </div>

            {/* Instagram */}
            <div className={styles.contactCard}>
              <div className={styles.contactIconBox}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </div>
              <h3 className={styles.contactCardTitle}>Instagram</h3>
              <a
                href="https://instagram.com/violagifts"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                @ViolaGifts →
              </a>
              <p className={styles.contactCardText}>Beautiful gift inspiration daily</p>
            </div>
          </div>

          {/* Map Embed */}
          <div className={styles.mapWrapper}>
            <iframe
              title="Viola Gifts Location – Colombo, Sri Lanka"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.63724762907!2d79.77304271315785!3d6.921837500000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1699000000000!5m2!1sen!2sus"
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: '12px', filter: 'grayscale(20%) contrast(1.05)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Footer bar */}
        <div className={styles.footerBar}>
          <p>© {new Date().getFullYear()} Viola Gifts · Colombo, Sri Lanka. All rights reserved.</p>
          <div className={styles.footerSocials}>
            <a href="https://facebook.com/violagifts" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://tiktok.com/@violagifts" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z"/></svg>
            </a>
            <a href="https://instagram.com/violagifts" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
