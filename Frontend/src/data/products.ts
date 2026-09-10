export type Category = "smartphones" | "headphones" | "cameras";

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  category: Category;
  name: string;
  tagline: string;
  description: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  colors: ColorOption[];
  badge?: string;
  featured?: boolean;
}

export const products: Product[] = [
  // Smartphones
  {
    id: "sp-1",
    slug: "nexora-x1-pro",
    category: "smartphones",
    name: "Nexora X1 Pro",
    tagline: "The flagship, reconsidered.",
    description:
      "A titanium frame, an edge-to-edge display, and a camera system built for detail most phones miss.",
    price: 1199,
    rating: 4.8,
    reviewCount: 342,
    colors: [
      { name: "Graphite", hex: "#2b2d33" },
      { name: "Arctic", hex: "#e7e9ec" },
      { name: "Signal Blue", hex: "#5bc8ff" },
    ],
    badge: "New",
    featured: true,
  },
  {
    id: "sp-2",
    slug: "nexora-x1",
    category: "smartphones",
    name: "Nexora X1",
    tagline: "Everything that matters, nothing that doesn't.",
    description:
      "The core X1 experience — fast, fluid, and built to keep pace with a full day.",
    price: 899,
    rating: 4.6,
    reviewCount: 210,
    colors: [
      { name: "Graphite", hex: "#2b2d33" },
      { name: "Pearl", hex: "#f5f6f7" },
    ],
  },
  {
    id: "sp-3",
    slug: "nexora-edge",
    category: "smartphones",
    name: "Nexora Edge",
    tagline: "Curved where it counts.",
    description: "A sculpted edge display and a lighter frame for an easier hold.",
    price: 749,
    rating: 4.5,
    reviewCount: 128,
    colors: [
      { name: "Midnight", hex: "#111318" },
      { name: "Sage", hex: "#a7b3a3" },
    ],
  },
  {
    id: "sp-4",
    slug: "nexora-lite",
    category: "smartphones",
    name: "Nexora Lite",
    tagline: "Essential, done properly.",
    description: "A dependable everyday phone with the essentials refined, not stripped.",
    price: 499,
    discountPrice: 449,
    rating: 4.3,
    reviewCount: 96,
    colors: [
      { name: "Slate", hex: "#6b7078" },
      { name: "Pearl", hex: "#f5f6f7" },
    ],
  },
  // Headphones
  {
    id: "hp-1",
    slug: "nexora-air-pro",
    category: "headphones",
    name: "Nexora Air Pro",
    tagline: "Silence, on command.",
    description:
      "Adaptive noise cancellation and a spatial soundstage tuned for long, focused listening.",
    price: 279,
    rating: 4.9,
    reviewCount: 501,
    colors: [
      { name: "Onyx", hex: "#111318" },
      { name: "Cloud", hex: "#f5f6f7" },
    ],
    badge: "Best Seller",
    featured: true,
  },
  {
    id: "hp-2",
    slug: "nexora-studio",
    category: "headphones",
    name: "Nexora Studio",
    tagline: "Reference sound, everyday comfort.",
    description: "Over-ear precision tuning with memory-foam cushions for all-day wear.",
    price: 349,
    rating: 4.7,
    reviewCount: 187,
    colors: [
      { name: "Onyx", hex: "#111318" },
      { name: "Walnut", hex: "#6f4e37" },
    ],
  },
  {
    id: "hp-3",
    slug: "nexora-buds-x",
    category: "headphones",
    name: "Nexora Buds X",
    tagline: "Small case. Big sound.",
    description: "True wireless earbuds with active noise cancellation in a pocketable case.",
    price: 179,
    rating: 4.6,
    reviewCount: 312,
    colors: [
      { name: "Onyx", hex: "#111318" },
      { name: "Cloud", hex: "#f5f6f7" },
      { name: "Signal Blue", hex: "#5bc8ff" },
    ],
  },
  {
    id: "hp-4",
    slug: "nexora-buds-lite",
    category: "headphones",
    name: "Nexora Buds Lite",
    tagline: "Light, in every sense.",
    description: "A dependable everyday earbud built for calls, commutes, and workouts.",
    price: 99,
    rating: 4.4,
    reviewCount: 154,
    colors: [
      { name: "Onyx", hex: "#111318" },
      { name: "Cloud", hex: "#f5f6f7" },
    ],
  },
  // Cameras
  {
    id: "cm-1",
    slug: "nexora-vision-c1",
    category: "cameras",
    name: "Nexora Vision C1",
    tagline: "See it before you shoot it.",
    description:
      "A full-frame sensor and a redesigned autofocus system built for decisive moments.",
    price: 2199,
    rating: 4.8,
    reviewCount: 89,
    colors: [
      { name: "Graphite", hex: "#2b2d33" },
      { name: "Onyx", hex: "#111318" },
    ],
    badge: "New",
    featured: true,
  },
  {
    id: "cm-2",
    slug: "nexora-vision-pro",
    category: "cameras",
    name: "Nexora Vision Pro",
    tagline: "Built for the professional loop.",
    description: "Higher resolution, deeper buffers, and a body built for long sessions.",
    price: 3299,
    rating: 4.9,
    reviewCount: 61,
    colors: [{ name: "Graphite", hex: "#2b2d33" }],
  },
  {
    id: "cm-3",
    slug: "nexora-compact-c",
    category: "cameras",
    name: "Nexora Compact C",
    tagline: "Pocketable. Not compromised.",
    description: "A large sensor in a body small enough to carry everywhere.",
    price: 899,
    rating: 4.5,
    reviewCount: 142,
    colors: [
      { name: "Graphite", hex: "#2b2d33" },
      { name: "Silver", hex: "#c7c9cc" },
    ],
  },
  {
    id: "cm-4",
    slug: "nexora-cinema-x",
    category: "cameras",
    name: "Nexora Cinema X",
    tagline: "Motion, without compromise.",
    description: "A video-first body built for filmmakers who need clarity in motion.",
    price: 4499,
    rating: 4.7,
    reviewCount: 38,
    colors: [{ name: "Onyx", hex: "#111318" }],
  },
];

export const categoryCopy: Record<
  Category,
  { label: string; headline: string; description: string }
> = {
  smartphones: {
    label: "Smartphones",
    headline: "Power that fits your everyday.",
    description: "Considered performance, built to disappear into your day.",
  },
  headphones: {
    label: "Headphones",
    headline: "Sound, without the noise.",
    description: "Wireless audio tuned for clarity, not spectacle.",
  },
  cameras: {
    label: "Cameras",
    headline: "Capture beyond the obvious.",
    description: "Precision optics for people who notice detail.",
  },
};

export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}

export function getProductsByCategory(category: Category) {
  return products.filter((p) => p.category === category);
}
