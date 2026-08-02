"use client";

import Header from "../../components/Header";
import styles from "../page.module.css";
import frameStyles from "./frames.module.css";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/navigation";

const STATIC_FRAMES = [
  {
    id: "sf1",
    name: "Rustic Wood Frame",
    description: "Handcrafted wooden frame with a warm walnut finish. Holds a 6×8 inch print. Perfect for living room walls.",
    price: "2450.00",
    tag: "Best Seller",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "sf2",
    name: "Gold Ornate Frame",
    description: "Elegant gold-finished frame with intricate border detailing. Luxurious centrepiece for any photo or artwork.",
    price: "3250.00",
    tag: "Luxury",
    image: "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "sf3",
    name: "Couple Collage Frame",
    description: "Multi-panel collage frame holding 4 photos. Customize with your names & anniversary date engraved.",
    price: "3850.00",
    tag: "New",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "sf4",
    name: "Minimalist White Frame",
    description: "Sleek matte white frame with a clean, modern aesthetic. Available in 4×6, 5×7, and 8×10 sizes.",
    price: "1950.00",
    tag: null,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "sf5",
    name: "Engraved Name Frame",
    description: "Premium MDF frame with laser-engraved personal name or quote along the border. A truly unique keepsake.",
    price: "2850.00",
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "sf6",
    name: "Family Tree Frame",
    description: "Multi-photo family tree design frame that holds up to 7 photos — a beautiful tribute to your family story.",
    price: "4250.00",
    tag: "Fan Favourite",
    image: "https://images.unsplash.com/photo-1568199382579-a8a82fcb3f75?q=80&w=600&auto=format&fit=crop",
  },
];

export default function PhotoFramesPage() {
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
      <section className={`${styles.hero} ${styles.heroPhotoFrames}`} style={{ padding: '6rem 8% 4rem', minHeight: '320px' }}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleWhite}>Customized</span><br />
            <span className={styles.heroTitleGold}>Photo Frames</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Frame your most cherished memories — personalized with names, dates, and heartfelt messages.
          </p>
        </div>
      </section>

      {/* Static Curated Gallery */}
      <section className={frameStyles.catalogSection}>
        <div className={frameStyles.catalogInner}>
          <p className={frameStyles.catalogTag}>✦ Our Collection</p>
          <h2 className={frameStyles.catalogTitle}>Customized Photo Frames</h2>
          <p className={frameStyles.catalogSubtitle}>
            Each frame is crafted with care — personalized with names, messages, and dates that matter most to you.
          </p>

          <div className={frameStyles.catalogGrid}>
            {STATIC_FRAMES.map((frame) => (
              <div key={frame.id} className={frameStyles.catalogCard}>
                {frame.tag && <span className={frameStyles.catalogBadge}>{frame.tag}</span>}
                <div className={frameStyles.catalogImgWrap}>
                  <img src={frame.image} alt={frame.name} className={frameStyles.catalogImg} />
                </div>
                <div className={frameStyles.catalogCardBody}>
                  <h3 className={frameStyles.catalogCardTitle}>{frame.name}</h3>
                  <p className={frameStyles.catalogCardDesc}>{frame.description}</p>
                  <div className={frameStyles.catalogCardFooter}>
                    <span className={frameStyles.catalogPrice}>Rs. {frame.price}</span>
                    <button className={frameStyles.catalogBtn} onClick={() => handleBuyNow(frame)}>Buy Now</button>
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
                      <span className={styles.price}>Rs. {product.price}</span>
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
