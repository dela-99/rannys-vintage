import dress1 from "@/assets/product-dress-1.jpg";
import dress2 from "@/assets/product-dress-2.jpg";
import dress3 from "@/assets/product-dress-3.jpg";
import heels from "@/assets/product-heels.jpg";
import chains from "@/assets/product-chains.jpg";
import bag from "@/assets/product-bag.jpg";

export type Category = "Dresses" | "Shoes" | "Jewelry" | "Chains" | "Accessories";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  hoverImage?: string;
  gallery: string[];
  stock: number;
  createdAt: string;
  trending?: boolean;
  sizes?: string[];
  description: string;
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

const dressSizes = ["XS", "S", "M", "L", "XL"];
const shoeSizes = ["36", "37", "38", "39", "40", "41"];

export const products: Product[] = [
  {
    id: "amethyst-drape-gown",
    name: "Amethyst Drape Gown",
    category: "Dresses",
    price: 650,
    image: dress1,
    hoverImage: dress2,
    gallery: [dress1, dress2, dress3],
    stock: 3,
    createdAt: daysAgo(2),
    trending: true,
    sizes: dressSizes,
    description:
      "A floor-grazing satin gown with a sculpted drape neckline. Tailored in Accra from imported Italian satin — designed to move with you.",
  },
  {
    id: "ivory-power-blazer",
    name: "Ivory Power Blazer",
    category: "Dresses",
    price: 480,
    image: dress2,
    hoverImage: dress3,
    gallery: [dress2, dress3, dress1],
    stock: 8,
    createdAt: daysAgo(5),
    sizes: dressSizes,
    description:
      "Sharp shoulders, soft lining. The ivory power blazer is your go-to for boardroom-to-brunch confidence.",
  },
  {
    id: "emerald-silk-midi",
    name: "Emerald Silk Midi",
    category: "Dresses",
    price: 520,
    image: dress3,
    hoverImage: dress1,
    gallery: [dress3, dress1, dress2],
    stock: 6,
    createdAt: daysAgo(14),
    trending: true,
    sizes: dressSizes,
    description: "Liquid-silk midi in deep emerald. Bias-cut for a flattering, fluid silhouette.",
  },
  {
    id: "rose-gold-strap-heels",
    name: "Rose Gold Strap Heels",
    category: "Shoes",
    price: 380,
    image: heels,
    gallery: [heels],
    stock: 2,
    createdAt: daysAgo(4),
    sizes: shoeSizes,
    description:
      "Hand-finished metallic straps on a 95mm stiletto. Pairs effortlessly with everything in your closet.",
  },
  {
    id: "layered-curb-chains",
    name: "Layered Curb Chains",
    category: "Chains",
    price: 220,
    image: chains,
    gallery: [chains],
    stock: 12,
    createdAt: daysAgo(18),
    trending: true,
    description:
      "Three-tier 18k gold-plated curb chain set. Wear stacked or solo — both feel iconic.",
  },
  {
    id: "lilac-top-handle-bag",
    name: "Lilac Top Handle Bag",
    category: "Accessories",
    price: 420,
    image: bag,
    gallery: [bag],
    stock: 5,
    createdAt: daysAgo(9),
    description:
      "Structured top-handle bag in soft lilac vegan leather. Just enough room for the essentials.",
  },
  {
    id: "noir-velvet-mini",
    name: "Noir Velvet Mini",
    category: "Dresses",
    price: 390,
    image: dress2,
    hoverImage: dress1,
    gallery: [dress2, dress1],
    stock: 7,
    createdAt: daysAgo(28),
    sizes: dressSizes,
    description: "Plush velvet mini with a deep cowl back. Designed for nights you'll remember.",
  },
  {
    id: "obsidian-pump",
    name: "Obsidian Patent Pump",
    category: "Shoes",
    price: 340,
    image: heels,
    gallery: [heels],
    stock: 4,
    createdAt: daysAgo(11),
    trending: true,
    sizes: shoeSizes,
    description:
      "Glossy patent pumps with a comfort-padded insole. The wardrobe staple, perfected.",
  },
  {
    id: "celeste-pearl-drops",
    name: "Celeste Pearl Drops",
    category: "Jewelry",
    price: 180,
    image: chains,
    gallery: [chains],
    stock: 9,
    createdAt: daysAgo(3),
    description: "Freshwater pearl drop earrings on hypoallergenic gold-plated posts.",
  },
  {
    id: "ruby-statement-cuff",
    name: "Ruby Statement Cuff",
    category: "Jewelry",
    price: 260,
    image: chains,
    gallery: [chains],
    stock: 6,
    createdAt: daysAgo(35),
    description: "Hand-set ruby-toned crystals on a sculpted cuff. Make a quiet statement.",
  },
  {
    id: "gilded-rope-chain",
    name: "Gilded Rope Chain",
    category: "Chains",
    price: 290,
    image: chains,
    gallery: [chains],
    stock: 10,
    createdAt: daysAgo(40),
    description: "Heavy-gauge rope chain in 18k gold plating. Old-money energy in modern weight.",
  },
  {
    id: "blush-mule-sandal",
    name: "Blush Mule Sandal",
    category: "Shoes",
    price: 310,
    image: heels,
    gallery: [heels],
    stock: 0,
    createdAt: daysAgo(22),
    sizes: shoeSizes,
    description: "A 70mm mule in blush nappa with a sculpted block heel. Effortless, elevated.",
  },
];

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(p: Product, limit = 4) {
  return products.filter((x) => x.id !== p.id && x.category === p.category).slice(0, limit);
}

export const CATEGORIES: Category[] = ["Dresses", "Shoes", "Jewelry", "Chains", "Accessories"];
