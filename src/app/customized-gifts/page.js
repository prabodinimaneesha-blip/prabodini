"use client";

import Header from "../../components/Header";
import styles from "../page.module.css";
import giftStyles from "./gifts.module.css";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/navigation";

const STATIC_GIFTS = [
  {
    id: "cg1",
    name: "Engraved Jewellery Box",
    description: "A gorgeous wooden jewellery box with your name or initials laser-engraved on the lid. Lined with soft velvet inside.",
    price: "3950.00",
    tag: "Best Seller",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "cg2",
    name: "Monogram Leather Wallet",
    description: "Premium genuine leather wallet with monogram initials embossed in gold foil. A timeless gift for him or her.",
    price: "2950.00",
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "cg3",
    name: "Custom Name Necklace",
    description: "Delicate sterling silver necklace with a custom name pendant in elegant script. Beautifully gift-wrapped.",
    price: "2450.00",
    tag: "New",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "cg4",
    name: "Personalized Keepsake Box",
    description: "A beautiful wooden memory box engraved with a special date and message. Perfect for storing precious mementos.",
    price: "3450.00",
    tag: null,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "cg5",
    name: "Custom Portrait Illustration",
    description: "A stunning hand-drawn digital portrait of you, your partner, or your family — printed on premium art paper and framed.",
    price: "4950.00",
    tag: "Fan Favourite",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "cg6",
    name: "Personalised Star Map",
    description: "A framed print of the night sky exactly as it appeared on your special date — wedding, birthday, or anniversary.",
    price: "3950.00",
    tag: "Luxury",
    image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=600&auto=format&fit=crop",
  },
];

export default function CustomizedGiftsPage() {
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
      <section className={`${styles.hero} ${styles.heroCustomizedGifts}`} style={{ padding: '6rem 8% 4rem', minHeight: '320px' }}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleWhite}>Customized</span><br />
            <span className={styles.heroTitleGold}>Gifts</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Unique, heartfelt, and made just for them — because the best gifts are personal.
          </p>
        </div>
      </section>

      {/* Static Curated Gallery */}
      <section className={giftStyles.catalogSection}>
        <div className={giftStyles.catalogInner}>
          <p className={giftStyles.catalogTag}>✦ Made With Love</p>
          <h2 className={giftStyles.catalogTitle}>Customized Gifts</h2>
          <p className={giftStyles.catalogSubtitle}>
            Every gift is uniquely crafted — personalized with names, dates, and messages that make it truly one of a kind.
          </p>

          <div className={giftStyles.catalogGrid}>
            {STATIC_GIFTS.map((gift) => (
              <div key={gift.id} className={giftStyles.catalogCard}>
                {gift.tag && <span className={giftStyles.catalogBadge}>{gift.tag}</span>}
                <div className={giftStyles.catalogImgWrap}>
                  <img src={gift.image} alt={gift.name} className={giftStyles.catalogImg} />
                </div>
                <div className={giftStyles.catalogCardBody}>
                  <h3 className={giftStyles.catalogCardTitle}>{gift.name}</h3>
                  <p className={giftStyles.catalogCardDesc}>{gift.description}</p>
                  <div className={giftStyles.catalogCardFooter}>
                    <span className={giftStyles.catalogPrice}>Rs. {gift.price}</span>
                    <button className={giftStyles.catalogBtn} onClick={() => handleBuyNow(gift)}>Buy Now</button>
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
