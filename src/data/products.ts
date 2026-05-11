import dress1 from "@/assets/product-dress-1.jpg";
import dress2 from "@/assets/product-dress-2.jpg";
import dress3 from "@/assets/product-dress-3.jpg";
import heels from "@/assets/product-heels.jpg";
import chains from "@/assets/product-chains.jpg";
import bag from "@/assets/product-bag.jpg";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  stock: number;
  createdAt: string;
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

export const products: Product[] = [
  { id: "1", name: "Amethyst Drape Gown", category: "Dresses", price: 650, image: dress1, stock: 3, createdAt: daysAgo(2) },
  { id: "2", name: "Ivory Power Blazer", category: "Dresses", price: 480, image: dress2, stock: 8, createdAt: daysAgo(5) },
  { id: "3", name: "Emerald Silk Midi", category: "Dresses", price: 520, image: dress3, stock: 6, createdAt: daysAgo(14) },
  { id: "4", name: "Rose Gold Strap Heels", category: "Shoes", price: 380, image: heels, stock: 2, createdAt: daysAgo(4) },
  { id: "5", name: "Layered Curb Chains", category: "Chains", price: 220, image: chains, stock: 12, createdAt: daysAgo(18) },
  { id: "6", name: "Lilac Top Handle Bag", category: "Accessories", price: 420, image: bag, stock: 5, createdAt: daysAgo(9) },
];
