export type Category = "Dresses" | "Footwear" | "Jewelry" | "Chains" | "Bags" | "Accessories";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  hoverImage?: string;
  images?: string[];
  gallery: string[];
  stock: number;
  createdAt: string;
  trending?: boolean;
  sizes?: string[];
  description: string;
}

export const products: Product[] = [];

export function getProductById(id: string): Product | undefined {
  return undefined;
}

export function getRelatedProducts(p: Product, limit = 4): Product[] {
  return [];
}

export const CATEGORIES: Category[] = [
  "Dresses",
  "Footwear",
  "Jewelry",
  "Chains",
  "Bags",
  "Accessories",
];

const SUB_CATEGORIES: Record<Category, string[]> = {
  Dresses: ["Dresses", "Jeans", "Tops", "Skirts"],
  Footwear: ["Heels", "Easy Wear", "Flats", "Sandals", "Sneakers"],
  Jewelry: ["Necklaces", "Chains", "Rings", "Earrings"],
  Chains: ["Chains"],
  Bags: ["Handbags", "Shoulder Bags", "Crossbody Bags", "Tote Bags"],
  Accessories: ["Body Splashes", "Leggings"],
};

export function getSubCategories(category: Category) {
  return SUB_CATEGORIES[category];
}
