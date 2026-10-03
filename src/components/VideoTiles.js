"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./VideoTiles.module.css";
import { videoReels } from "../data/videoReels";

export default function VideoTiles({ onAddToCart, onBuyNow, externalReelId, onCloseExternalReel }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedReelIndex, setSelectedReelIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likedReels, setLikedReels] = useState({});
  const [progress, setProgress] = useState(0);
  const [shareToast, setShareToast] = useState(false);
  const [playPauseFlash, setPlayPauseFlash] = useState(null); // 'play' | 'pause'

  const scrollRef = useRef(null);
  const modalVideoRef = useRef(null);
  const isAutoScrolling = useRef(true);

  // Sync external reel trigger
  useEffect(() => {
    if (externalReelId) {
      const idx = videoReels.findIndex(
        r => r.id === externalReelId || r.productId === externalReelId || r.category === externalReelId
      );
      if (idx !== -1) {
        setSelectedReelIndex(idx);
        setIsPlaying(true);
        setProgress(0);
      }
    }
  }, [externalReelId]);

  // Filter video reels
  const filteredReels = activeCategory === "All"
    ? videoReels
    : videoReels.filter(r => r.category === activeCategory);

  const categories = ["All", "Gift Boxes", "Mugs", "Photo Frames", "Key Tags", "Customized Gifts"];

  // Marquee auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId;
    const speed = 0.6; // pixels per frame

    const step = () => {
      if (isAutoScrolling.current && scrollContainer) {
        scrollContainer.scrollLeft += speed;
        // If reached end, reset to start smoothly
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth - 5) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Keyboard navigation for modal player
  useEffect(() => {
    if (selectedReelIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        nextReel();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        prevReel();
      } else if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "m") {
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedReelIndex, isPlaying, isMuted, filteredReels]);

  // Handle modal video progress
  const handleTimeUpdate = () => {
    if (modalVideoRef.current) {
      const current = modalVideoRef.current.currentTime;
      const total = modalVideoRef.current.duration || 1;
      setProgress((current / total) * 100);
    }
  };

  const openModal = (index) => {
    setSelectedReelIndex(index);
    setIsPlaying(true);
    setProgress(0);
  };

  const closeModal = () => {
    setSelectedReelIndex(null);
    setIsPlaying(true);
    if (onCloseExternalReel) {
      onCloseExternalReel();
    }
  };

  const nextReel = () => {
    if (selectedReelIndex === null) return;
    const nextIdx = (selectedReelIndex + 1) % filteredReels.length;
    setSelectedReelIndex(nextIdx);
    setProgress(0);
    setIsPlaying(true);
  };

  const prevReel = () => {
    if (selectedReelIndex === null) return;
    const prevIdx = (selectedReelIndex - 1 + filteredReels.length) % filteredReels.length;
    setSelectedReelIndex(prevIdx);
    setProgress(0);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!modalVideoRef.current) return;
    if (modalVideoRef.current.paused) {
      modalVideoRef.current.play();
      setIsPlaying(true);
      triggerFlash('play');
    } else {
      modalVideoRef.current.pause();
      setIsPlaying(false);
      triggerFlash('pause');
    }
  };

  const triggerFlash = (type) => {
    setPlayPauseFlash(type);
    setTimeout(() => setPlayPauseFlash(null), 600);
  };

  const toggleMute = () => {
    if (!modalVideoRef.current) return;
    modalVideoRef.current.muted = !modalVideoRef.current.muted;
    setIsMuted(modalVideoRef.current.muted);
  };

  const toggleLike = (reelId) => {
    setLikedReels(prev => ({
      ...prev,
      [reelId]: !prev[reelId]
    }));
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const handleProgressBarClick = (e) => {
    if (!modalVideoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    modalVideoRef.current.currentTime = clickPos * (modalVideoRef.current.duration || 0);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const currentReel = selectedReelIndex !== null ? filteredReels[selectedReelIndex] : null;

  return (
    <section className={styles.videoSection} aria-label="Watch Gifts in Action">
      <div className={styles.videoSectionBackground} />

      <div className={styles.headerContainer}>
        <div className={styles.badge}>
          <svg className={styles.badgeIcon} viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z"/>
          </svg>
          As Seen on TikTok &amp; Reels
        </div>
        <h2 className={styles.title}>
          Watch Us in <span className={styles.titleGold}>Action</span>
        </h2>
        <p className={styles.subtitle}>
          Step inside our studio — from artisanal crafting &amp; laser engraving to joyful gift unboxings. Tap any reel to watch and shop directly.
        </p>

        {/* Categories */}
        <div className={styles.filterTabs}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Scroll Controls */}
      <div className={styles.controlsBar}>
        <button
          className={styles.navBtn}
          onClick={scrollLeft}
          aria-label="Scroll left"
          title="Previous Reels"
        >
          ←
        </button>
        <button
          className={styles.navBtn}
          onClick={scrollRight}
          aria-label="Scroll right"
          title="Next Reels"
        >
          →
        </button>
      </div>

      {/* Marquee / Slider Track */}
      <div
        className={styles.carouselWrapper}
        onMouseEnter={() => { isAutoScrolling.current = false; }}
        onMouseLeave={() => { isAutoScrolling.current = true; }}
      >
        <div className={styles.edgeGradientLeft} />
        <div className={styles.edgeGradientRight} />

        <div className={styles.scrollContainer} ref={scrollRef}>
          {filteredReels.map((reel, idx) => {
            const isLiked = likedReels[reel.id];
            const likesCount = isLiked ? reel.likes + 1 : reel.likes;

            return (
              <div
                key={reel.id}
                className={styles.videoCard}
                onClick={() => openModal(idx)}
                onMouseEnter={(e) => {
                  const v = e.currentTarget.querySelector("video");
                  if (v) {
                    v.currentTime = 0;
                    v.play().catch(() => {});
                  }
                }}
                onMouseLeave={(e) => {
                  const v = e.currentTarget.querySelector("video");
                  if (v) {
                    v.pause();
                    v.currentTime = 0;
                  }
                }}
              >
                {/* Poster Background */}
                <img
                  src={reel.poster}
                  alt={reel.title}
                  className={styles.cardPoster}
                  loading="lazy"
                />

                {/* Live Preview on Hover */}
                <video
                  src={reel.videoUrl}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  className={styles.previewVideo}
                />

                {/* Dark Gradient Overlay */}
                <div className={styles.cardOverlay} />

                {/* Top Badges */}
                <div className={styles.cardTopBar}>
                  <span className={styles.tiktokPill}>
                    <svg className={styles.tiktokIcon} viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z"/>
                    </svg>
                    TikTok
                  </span>
                  <span className={styles.durationPill}>{reel.duration}</span>
                </div>

                {/* Center Glowing Play Button */}
                <div className={styles.centerPlayBtn}>
                  <svg className={styles.playIcon} viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className={styles.playText}>Play</span>
                </div>

                {/* Bottom Info */}
                <div className={styles.cardBottomInfo}>
                  <div className={styles.cardSinhala}>{reel.sinhalaTitle}</div>
                  <h3 className={styles.cardTitle}>{reel.title}</h3>
                  <div className={styles.cardMetaRow}>
                    <span className={styles.likesCount}>
                      <svg className={styles.heartIcon} viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      {likesCount.toLocaleString()}
                    </span>
                    <span className={styles.shopTag}>
                      Shop Gift →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Reels Modal Player */}
      {currentReel && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContentWrapper} onClick={(e) => e.stopPropagation()}>
            {/* Previous Video Button */}
            <button
              className={styles.modalNavBtn}
              onClick={prevReel}
              aria-label="Previous Video"
              title="Previous Reel (Left Arrow)"
            >
              ←
            </button>

            {/* Video Player Card */}
            <div className={styles.playerCard}>
              {/* Top Controls */}
              <div className={styles.modalTopBar}>
                <div className={styles.modalBrandBadge}>
                  <span>Viola Gifts Reels</span>
                </div>
                <button
                  className={styles.modalCloseBtn}
                  onClick={closeModal}
                  aria-label="Close Player"
                  title="Close (Esc)"
                >
                  ✕
                </button>
              </div>

              {/* Video Element */}
              <video
                ref={modalVideoRef}
                src={currentReel.videoUrl}
                poster={currentReel.poster}
                autoPlay
                loop
                playsInline
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                className={styles.videoElement}
              />

              {/* Play / Pause Flash Animation */}
              {playPauseFlash && (
                <div className={styles.playPauseFlash}>
                  {playPauseFlash === 'play' ? (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="#facc15">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="#ffffff">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  )}
                </div>
              )}

              {/* Floating Action Sidebar */}
              <div className={styles.actionSidebar}>
                {/* Like Button */}
                <button
                  className={styles.actionBtn}
                  onClick={() => toggleLike(currentReel.id)}
                  title="Like this video"
                >
                  <div className={styles.actionIconCircle}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={likedReels[currentReel.id] ? "#f43f5e" : "none"}
                      stroke={likedReels[currentReel.id] ? "#f43f5e" : "#ffffff"}
                      strokeWidth="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <span className={`${styles.actionLabel} ${likedReels[currentReel.id] ? styles.likedText : ""}`}>
                    {(likedReels[currentReel.id] ? currentReel.likes + 1 : currentReel.likes).toLocaleString()}
                  </span>
                </button>

                {/* Sound / Mute Toggle */}
                <button
                  className={styles.actionBtn}
                  onClick={toggleMute}
                  title={isMuted ? "Unmute sound" : "Mute sound"}
                >
                  <div className={styles.actionIconCircle}>
                    {isMuted ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                        <line x1="1" y1="1" x2="23" y2="23" />
                        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                      </svg>
                    )}
                  </div>
                  <span className={styles.actionLabel}>{isMuted ? "Muted" : "Sound"}</span>
                </button>

                {/* Share Button */}
                <button
                  className={styles.actionBtn}
                  onClick={handleShare}
                  title="Share / Copy Link"
                >
                  <div className={styles.actionIconCircle}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  </div>
                  <span className={styles.actionLabel}>{shareToast ? "Copied!" : "Share"}</span>
                </button>
              </div>

              {/* Bottom Video Details & Linked Product */}
              <div className={styles.modalBottomArea}>
                <div className={styles.modalVideoDetails}>
                  <div className={styles.modalSinhala}>{currentReel.sinhalaTitle}</div>
                  <h4 className={styles.modalVideoTitle}>{currentReel.title}</h4>
                  <p className={styles.modalCaption}>{currentReel.caption}</p>
                </div>

                {/* Linked Product Bar */}
                {currentReel.product && (
                  <div className={styles.linkedProductCard}>
                    <div className={styles.linkedProductLeft}>
                      <img
                        src={currentReel.product.image}
                        alt={currentReel.product.name}
                        className={styles.linkedProductImg}
                      />
                      <div className={styles.linkedProductMeta}>
                        <span className={styles.linkedProductName}>{currentReel.product.name}</span>
                        <span className={styles.linkedProductPrice}>Rs. {currentReel.product.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className={styles.linkedProductActions}>
                      <button
                        className={styles.modalAddCartBtn}
                        onClick={() => onAddToCart && onAddToCart(currentReel.product)}
                      >
                        🛒 Add
                      </button>
                      <button
                        className={styles.modalBuyBtn}
                        onClick={() => {
                          closeModal();
                          if (onBuyNow) onBuyNow(currentReel.product);
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Scrubber Bar */}
              <div className={styles.progressBarContainer} onClick={handleProgressBarClick}>
                <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Next Video Button */}
            <button
              className={styles.modalNavBtn}
              onClick={nextReel}
              aria-label="Next Video"
              title="Next Reel (Right Arrow)"
            >
              →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
