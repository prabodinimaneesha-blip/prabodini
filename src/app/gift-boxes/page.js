"use client";

import Header from "../../components/Header";
import styles from "../page.module.css";
import boxStyles from "./boxes.module.css";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/navigation";

const STATIC_BOXES = [
  {
    id: "gb1",
    name: "Rose Gold Luxury Box",
    description: "An exquisite rose gold gift box filled with curated luxury items — chocolates, candles, and a scented bath set. Tied with a satin ribbon.",
    price: "79.99",
    tag: "Best Seller",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "gb2",
    name: "Birthday Surprise Box",
    description: "A vibrant birthday-themed gift box packed with treats, confetti, a personalized card, and a mini balloon bouquet.",
    price: "59.99",
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "gb3",
    name: "Wedding Hamper Box",
    description: "An elegant white & gold bridal hamper with champagne, artisan chocolates, candles, and a lace ribbon. Perfect for the happy couple.",
    price: "99.99",
    tag: "Luxury",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "gb4",
    name: "Self-Care Gift Box",
    description: "A wellness gift box with premium skincare products, a scented candle, herbal tea, and a cozy eye mask — perfect for pampering.",
    price: "64.99",
    tag: "New",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "gb5",
    name: "Gourmet Chocolate Box",
    description: "A selection of hand-crafted artisan chocolates in a gorgeous keepsake box — dark, milk, and white varieties with premium fillings.",
    price: "44.99",
    tag: "Fan Favourite",
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "gb6",
    name: "Floral & Fragrance Box",
    description: "A stunning arrangement of preserved dried flowers paired with a luxury perfume sample set and a hand-written greeting card.",
    price: "74.99",
    tag: null,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
  },
];

export default function GiftBoxesPage() {
  const [dbProducts, setDbProducts] = useState([]);
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
        setDbProducts(productsList);
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

      {/* Hero */}
      <section className={`${styles.hero} ${styles.heroGiftBoxes}`} style={{ padding: '6rem 8% 4rem', minHeight: '320px' }}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleWhite}>Elegant</span><br />
            <span className={styles.heroTitleGold}>Gift Boxes</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Beautifully curated collections for every occasion — wrapped with love and delivered with joy.
          </p>
        </div>
      </section>

      {/* Static Curated Gallery */}
      <section className={boxStyles.catalogSection}>
        <div className={boxStyles.catalogInner}>
          <p className={boxStyles.catalogTag}>✦ Curated Collections</p>
          <h2 className={boxStyles.catalogTitle}>Gift Boxes</h2>
          <p className={boxStyles.catalogSubtitle}>
            Each box is thoughtfully assembled with premium items — perfect for birthdays, weddings, anniversaries, and more.
          </p>

          <div className={boxStyles.catalogGrid}>
            {STATIC_BOXES.map((box) => (
              <div key={box.id} className={boxStyles.catalogCard}>
                {box.tag && <span className={boxStyles.catalogBadge}>{box.tag}</span>}
                <div className={boxStyles.catalogImgWrap}>
                  <img src={box.image} alt={box.name} className={boxStyles.catalogImg} />
                </div>
                <div className={boxStyles.catalogCardBody}>
                  <h3 className={boxStyles.catalogCardTitle}>{box.name}</h3>
                  <p className={boxStyles.catalogCardDesc}>{box.description}</p>
                  <div className={boxStyles.catalogCardFooter}>
                    <span className={boxStyles.catalogPrice}>${box.price}</span>
                    <button className={boxStyles.catalogBtn} onClick={() => handleBuyNow(box)}>Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Firebase DB Products */}
      {!loading && dbProducts.length > 0 && (
        <section className={styles.productsSection}>
          <h2 className={styles.sectionTitle}>More Products</h2>
          <div className={styles.grid}>
            {dbProducts.map((product) => {
              const outOfStock = product.stock_quantity <= 0;
              return (
                <div key={product.id} className={styles.card}>
                  <div className={styles.cardImageWrapper}>
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.name} className={styles.cardImage} />
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
                    <button className={styles.addToCartBtn} disabled={outOfStock} onClick={() => handleBuyNow(product)}>
                      {outOfStock ? 'Out of Stock' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
