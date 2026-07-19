"use client";

import Header from "../../components/Header";
import styles from "../page.module.css";
import mugStyles from "./mugs.module.css";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/navigation";

const STATIC_MUGS = [
  {
    id: "sm1",
    name: "Couple Names Mug",
    description: "A beautifully printed ceramic mug with both names in elegant gold script. Perfect anniversary or Valentine's Day gift.",
    price: "24.99",
    tag: "Best Seller",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "sm2",
    name: "Floral Watercolor Mug",
    description: "Delicate watercolor floral pattern customized with your name. Comes in a premium gift box.",
    price: "19.99",
    tag: "New",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "sm3",
    name: "Photo Print Mug",
    description: "Turn your favorite memory into a stunning full-wrap photo print mug. Food-safe, dishwasher-safe coating.",
    price: "22.99",
    tag: null,
    image: "https://images.unsplash.com/photo-1572119865084-43c285814d63?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "sm4",
    name: "Minimalist Name Mug",
    description: "Clean, modern typography with your name or message. Available in white or black matte finish.",
    price: "18.99",
    tag: null,
    image: "https://images.unsplash.com/photo-1517256673644-36ad11246d21?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "sm5",
    name: "Birthday Surprise Mug",
    description: "A heat-sensitive color-changing mug that reveals your custom message or photo when filled with a hot drink.",
    price: "27.99",
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "sm6",
    name: "Pet Portrait Mug",
    description: "Feature your beloved pet as a custom illustration on a premium ceramic mug — an adorable personal keepsake.",
    price: "29.99",
    tag: "Fan Favourite",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=600&auto=format&fit=crop",
  },
];

export default function MugsPage() {
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
      <section className={`${styles.hero} ${styles.heroMugs}`} style={{ padding: '6rem 8% 4rem', minHeight: '320px' }}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleWhite}>Customized</span><br />
            <span className={styles.heroTitleGold}>Mugs</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Start every morning with a mug that's made just for you — names, photos, and messages printed with love.
          </p>
        </div>
      </section>

      {/* Static Curated Gallery */}
      <section className={mugStyles.catalogSection}>
        <div className={mugStyles.catalogInner}>
          <p className={mugStyles.catalogTag}>✦ Our Collection</p>
          <h2 className={mugStyles.catalogTitle}>Customized Mugs</h2>
          <p className={mugStyles.catalogSubtitle}>
            Each mug is crafted individually — personalized with your name, photo, or message.
          </p>

          <div className={mugStyles.catalogGrid}>
            {STATIC_MUGS.map((mug) => (
              <div key={mug.id} className={mugStyles.catalogCard}>
                {mug.tag && <span className={mugStyles.catalogBadge}>{mug.tag}</span>}
                <div className={mugStyles.catalogImgWrap}>
                  <img src={mug.image} alt={mug.name} className={mugStyles.catalogImg} />
                </div>
                <div className={mugStyles.catalogCardBody}>
                  <h3 className={mugStyles.catalogCardTitle}>{mug.name}</h3>
                  <p className={mugStyles.catalogCardDesc}>{mug.description}</p>
                  <div className={mugStyles.catalogCardFooter}>
                    <span className={mugStyles.catalogPrice}>${mug.price}</span>
                    <button className={mugStyles.catalogBtn} onClick={() => handleBuyNow(mug)}>Buy Now</button>
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
