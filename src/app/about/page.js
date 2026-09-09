"use client";

import Header from "../../components/Header";
import styles from "../page.module.css";
import aboutStyles from "./about.module.css";

export default function AboutUsPage() {
  return (
    <div className={aboutStyles.aboutContainer}>
      <Header />

      {/* Hero Section */}
      <section className={aboutStyles.aboutHero}>
        <div className={aboutStyles.heroContent}>
          <span className={aboutStyles.heroTag}>Our Story</span>
          <h1 className={aboutStyles.heroTitle}>About Viola Gifts</h1>
          <p className={aboutStyles.heroSubtitle}>
            Crafting memories and personalizing joy. We believe every gift should tell a beautiful, unique story.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className={aboutStyles.aboutContent}>
        
        {/* Story Grid */}
        <section className={aboutStyles.storySection}>
          <div className={aboutStyles.storyText}>
            <h2>The Art of Personalization</h2>
            <p>
              Founded in Colombo, Sri Lanka, Viola Gifts was born out of a simple passion: to make gifting more personal, meaningful, and unforgettable. In a world of mass production, we believe that a custom-engraved key tag, a carefully framed photograph, or a personalized mug carries a warmth that standard gifts simply cannot match.
            </p>
            <p>
              Every product in our collection is curated with premium materials and designed to be customized. From elegant custom photo frames to personalized mugs, key tags, and complete gift boxes, our team inspects and prepares each order by hand to ensure it reaches your loved ones in absolute perfection.
            </p>
            <p>
              We are dedicated to providing transparency, top-tier craftsmanship, and friendly customer support. Thank you for letting us be a part of your celebrations, anniversaries, and precious milestones.
            </p>
          </div>
          <div className={aboutStyles.storyImageWrapper}>
            <img 
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop" 
              alt="Gifting Craftsmanship" 
              className={aboutStyles.storyImage}
            />
          </div>
        </section>

        {/* Core Values */}
        <section className={aboutStyles.valuesSection}>
          <h2 className={aboutStyles.valuesTitle}>Our Core Values</h2>
          <div className={aboutStyles.valuesGrid}>
            <div className={aboutStyles.valueCard}>
              <div className={aboutStyles.valueIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>Quality First</h3>
              <p>We source only the finest wood, ceramics, and metal to create durable keepsakes that stand the test of time.</p>
            </div>
            
            <div className={aboutStyles.valueCard}>
              <div className={aboutStyles.valueIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3>Transparency</h3>
              <p>No hidden fees, real-time order tracking, and clear customer support. We value the trust you place in us.</p>
            </div>

            <div className={aboutStyles.valueCard}>
              <div className={aboutStyles.valueIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <h3>Made with Love</h3>
              <p>Each customized detail is carefully reviewed, engraved, and gift-wrapped with meticulous attention by our local team.</p>
            </div>
          </div>
        </section>

        {/* Stat Counter section */}
        <section className={aboutStyles.statsSection}>
          <div>
            <div className={aboutStyles.statNumber}>10,000+</div>
            <div className={aboutStyles.statLabel}>Gifts Delivered</div>
          </div>
          <div>
            <div className={aboutStyles.statNumber}>99.4%</div>
            <div className={aboutStyles.statLabel}>Happy Customers</div>
          </div>
          <div>
            <div className={aboutStyles.statNumber}>24h</div>
            <div className={aboutStyles.statLabel}>Support Response</div>
          </div>
          <div>
            <div className={aboutStyles.statNumber}>100%</div>
            <div className={aboutStyles.statLabel}>Safe & Secure Pay</div>
          </div>
        </section>

      </main>


    </div>
  );
}
