// ============================================================
// products.js — Viola Gifts Showcase Catalogue
// ============================================================
// Expanded product data structure for the showcase.
//
// Field reference:
//   id           {string}   — unique identifier
//   title        {string}   — display name
//   category     {string}   — e.g. "Gift Boxes", "Mugs"
//   badge        {string?}  — optional pill: "Best Seller", "Trending" …
//   image        {string}   — primary image (local /public path or https URL)
//   description  {string}   — 1–2 sentences shown on the card
//   videoUrl     {string?}  — TikTok embed URL (null = no video preview)
//                             Format: "https://www.tiktok.com/embed/v2/{VIDEO_ID}"
//   whatsappNumber {string} — digits only, e.g. "94770000000"
// ============================================================

const WHATSAPP = "94770000000"; // ← Replace with your real WhatsApp number

export const products = [
  // ─── Gift Boxes ───────────────────────────────────────────
  {
    id: "gb-1",
    title: "Luxury Rose Gold Gift Box",
    category: "Gift Boxes",
    badge: "Best Seller",
    image: "/gift_box_luxury.png",
    description:
      "An exquisite rose gold box filled with artisan chocolates, a scented soy candle, and bath essentials — tied with a silky satin ribbon.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },
  {
    id: "gb-2",
    title: "Birthday Surprise Box",
    category: "Gift Boxes",
    badge: "Trending",
    image:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=600&auto=format&fit=crop",
    description:
      "A vibrant birthday box packed with treats, confetti, a personalized card, and a mini balloon bouquet — pure joy in a box.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },
  {
    id: "gb-3",
    title: "Wedding Hamper Box",
    category: "Gift Boxes",
    badge: "Luxury",
    image:
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=600&auto=format&fit=crop",
    description:
      "An elegant white & gold bridal hamper with champagne, artisan chocolates, candles, and lace ribbon — perfect for the happy couple.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },
  {
    id: "gb-4",
    title: "Grand Royal Celebration Hamper",
    category: "Gift Boxes",
    badge: "Luxury",
    image: "/hamper_collection.png",
    description:
      "The ultimate celebration hamper complete with sparkling juice, luxury chocolates, an aromatic candle, and a keepsake gift box.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },
  {
    id: "gb-5",
    title: "Self-Care Gift Box",
    category: "Gift Boxes",
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop",
    description:
      "A wellness box with premium skincare products, a scented candle, herbal tea, and a cozy eye mask — for the one who deserves it.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },
  {
    id: "gb-6",
    title: "Gourmet Chocolate Box",
    category: "Gift Boxes",
    badge: null,
    image:
      "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=600&auto=format&fit=crop",
    description:
      "Handcrafted artisan chocolates — dark, milk, and white varieties with premium fillings in a gorgeous keepsake box.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },

  // ─── Mugs ─────────────────────────────────────────────────
  {
    id: "mug-1",
    title: "Floral Personalized Couple Mug",
    category: "Mugs",
    badge: "Best Seller",
    image: "/personalized_mug.png",
    description:
      "Premium glossy ceramic mug custom-printed with delicate watercolor florals and personalized calligraphy names — a beautiful pair.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },
  {
    id: "mug-2",
    title: "Photo Print Mug",
    category: "Mugs",
    badge: null,
    image:
      "https://images.unsplash.com/photo-1572119865084-43c285814d63?q=80&w=600&auto=format&fit=crop",
    description:
      "Turn your favorite memory into a stunning full-wrap photo print mug. Food-safe, dishwasher-safe coating inside and out.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },
  {
    id: "mug-3",
    title: "Minimalist Matte Black Mug",
    category: "Mugs",
    badge: "Trending",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop",
    description:
      "Sleek matte-finish ceramic with customized initial monograms in metallic gold luster. Modern, elegant, dishwasher safe.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },
  {
    id: "mug-4",
    title: "Birthday Surprise Colour-Change Mug",
    category: "Mugs",
    badge: "Trending",
    image:
      "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=600&auto=format&fit=crop",
    description:
      "A heat-sensitive mug that reveals your custom message or photo when filled with a hot drink — the perfect surprise gift.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },

  // ─── Photo Frames ─────────────────────────────────────────
  {
    id: "pf-1",
    title: "Golden Vintage Photo Frame",
    category: "Photo Frames",
    badge: "Popular",
    image: "/photo_frame_gift.png",
    description:
      "Luxurious metallic gold frame with ornate border detailing and crystal clarity glass to showcase your dearest memories.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },
  {
    id: "pf-2",
    title: "Couple Collage Memory Frame",
    category: "Photo Frames",
    badge: null,
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop",
    description:
      "Multi-aperture collage frame with personalized date plaque, finished in polished natural teak wood. Holds 4 treasured photos.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },
  {
    id: "pf-3",
    title: "Engraved Name Frame",
    category: "Photo Frames",
    badge: "Trending",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
    description:
      "Premium MDF frame with laser-engraved personal name or quote along the border — a truly unique keepsake piece.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },

  // ─── Key Tags ─────────────────────────────────────────────
  {
    id: "kt-1",
    title: "Handcrafted Wooden Keg Tag",
    category: "Key Tags",
    badge: "Handmade",
    image: "/keg_tag_wooden.png",
    description:
      "Natural mahogany key tag precision laser-engraved with custom initials, coordinates, or anniversary dates — beautifully rustic.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },
  {
    id: "kt-2",
    title: "Custom Acrylic Pastel Name Tag",
    category: "Key Tags",
    badge: "New",
    image: "/name_key_tag.png",
    description:
      "Chic modern acrylic keychain with 3D raised custom lettering in pastel hues and a durable gold-tone lobster clasp.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },
  {
    id: "kt-3",
    title: "Animal Key Tags",
    category: "Key Tags",
    badge: null,
    image:
      "https://plus.unsplash.com/premium_photo-1663839539442-48e90e4810b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    description:
      "Adorable animal-shaped key tags — cats, dogs, birds, and more. Perfect for kids, pet lovers, and anyone who loves a smile.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },

  // ─── Customized Gifts ─────────────────────────────────────
  {
    id: "cg-1",
    title: "Rose Gold Executive Gift Set",
    category: "Customized Gifts",
    badge: "Best Seller",
    image: "/customized_gift_set.png",
    description:
      "A refined gift set featuring an engraved metallic pen, custom key ring, and monogrammed leatherette card case — corporate elegance.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },
  {
    id: "cg-2",
    title: "Celestial Custom Star Map Frame",
    category: "Customized Gifts",
    badge: "Unique",
    image:
      "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=600&auto=format&fit=crop",
    description:
      "Accurate astronomical star map capturing the night sky of your most cherished date, beautifully framed in gold or black.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },
  {
    id: "cg-3",
    title: "Engraved Jewellery Box",
    category: "Customized Gifts",
    badge: "Popular",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
    description:
      "A gorgeous wooden jewellery box with your name or initials laser-engraved on the lid and lined with soft velvet inside.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },
  {
    id: "cg-4",
    title: "Custom Portrait Illustration",
    category: "Customized Gifts",
    badge: "Fan Favourite",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop",
    description:
      "A stunning hand-drawn digital portrait of you, your partner, or your family — printed on premium art paper and framed.",
    videoUrl: null,
    whatsappNumber: WHATSAPP,
  },
];

// ── Backwards-compatible alias for pages still importing mockProducts ──
export const mockProducts = products;
