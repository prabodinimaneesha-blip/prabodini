"use client";

import Header from "../../components/Header";
import styles from "../page.module.css";
import tagStyles from "./tags.module.css";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/navigation";

const STATIC_TAGS = [
  {
    id: "st1",
    name: "Name Key Tag",
    description: "Custom engraved wooden or acrylic key tag with your name in elegant typography.",
    price: "12.99",
    tag: "Best Seller",
    image: "/name_key_tag.png",
  },
  {
    id: "st2",
    name: "Animal Key Tags",
    description: "Adorable animal-shaped key tags. Choose from cats, dogs, birds, and more. Perfect for kids and pet lovers.",
    price: "14.99",
    tag: "New",
    image: "https://plus.unsplash.com/premium_photo-1663839539442-48e90e4810b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "st3",
    name: "Letter Key Tag",
    description: "Sleek and minimalist key tag featuring a single initial letter. Available in multiple finishes.",
    price: "10.99",
    tag: "Trending",
    image: "https://plus.unsplash.com/premium_photo-1664392190857-1a9cbec85ee5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: "st4",
    name: "Custom Logo Key Tag",
    description: "Perfect for businesses or events. Get your company logo or event symbol engraved on high-quality metal or leather.",
    price: "18.99",
    tag: null,
    image: "https://plus.unsplash.com/premium_photo-1668902223961-e603b1188337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  }
];

export default function KegTagsPage() {
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
      
      <section className={`${styles.hero} ${styles.heroKegTags}`} style={{ padding: '6rem 8% 4rem', minHeight: '300px' }}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleWhite}>Custom</span><br />
            <span className={styles.heroTitleGold}>Key Tags</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Personalized tags for your keys and bags.
          </p>
        </div>
      </section>
      {/* Static Curated Gallery */}
      <section className={tagStyles.catalogSection}>
        <div className={tagStyles.catalogInner}>
          <p className={tagStyles.catalogTag}>✦ Our Collection</p>
          <h2 className={tagStyles.catalogTitle}>Customized Key Tags</h2>
          <p className={tagStyles.catalogSubtitle}>
            Carry your memories everywhere. Personalized key tags with names, letters, animals, and custom designs.
          </p>

          <div className={tagStyles.catalogGrid}>
            {STATIC_TAGS.map((item) => (
              <div key={item.id} className={tagStyles.catalogCard}>
                {item.tag && <span className={tagStyles.catalogBadge}>{item.tag}</span>}
                <div className={tagStyles.catalogImgWrap}>
                  <img src={item.image} alt={item.name} className={tagStyles.catalogImg} />
                </div>
                <div className={tagStyles.catalogCardBody}>
                  <h3 className={tagStyles.catalogCardTitle}>{item.name}</h3>
                  <p className={tagStyles.catalogCardDesc}>{item.description}</p>
                  <div className={tagStyles.catalogCardFooter}>
                    <span className={tagStyles.catalogPrice}>${item.price}</span>
                    <button className={tagStyles.catalogBtn} onClick={() => handleBuyNow(item)}>Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.productsSection}>
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
                      <button className={styles.addToCartBtn} disabled={outOfStock} onClick={() => handleBuyNow(product)}>
                        {outOfStock ? 'Out of Stock' : 'Buy Now'}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#94a3b8' }}>
                No products found in this category.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
