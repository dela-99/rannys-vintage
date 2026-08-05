export const categories = [
  {
    name: "Jewellery",
    subcategories: ["Earrings", "Necklaces", "Chains", "Rings", "Bracelets"],
  },
  {
    name: "Footwear",
    subcategories: ["Sneakers", "Heels", "Flats", "Sandals", "Easy Wear"],
  },
  {
    name: "Dresses",
    subcategories: ["Dresses", "Jeans", "Tops", "Skirts"],
  },
  {
    name: "Bags",
    subcategories: ["Handbags", "Crossbody", "Travel Bags", "Tote Bags"],
  },
  {
    name: "Accessories",
    subcategories: ["Leggings", "Body Splash"],
  },
] as const;

export type Category = (typeof categories)[number]["name"];

export type Subcategory<T extends Category = Category> = Extract<
  (typeof categories)[number],
  { name: T }
>["subcategories"][number];

export const CATEGORIES = categories.map((category) => category.name) as [Category, ...Category[]];
export const categoryNames = CATEGORIES;

export type ProductStatus = "draft" | "published" | "archived";

export interface Product {
  id: string;
  documentId: string;
  productId: string;
  slug: string;
  name: string;
  category: Category;
  subcategory: string;
  price: number;
  oldPrice?: number;
  image: string;
  hoverImage?: string;
  images: string[];
  gallery: string[];
  stock: number;
  createdAt: string;
  updatedAt: string;
  trending: boolean;
  featured: boolean;
  visible: boolean;
  status: ProductStatus;
  sizes: string[];
  colors: string[];
  description: string;
}

export interface ProductInput {
  name: string;
  category: Category;
  subcategory: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  images: string[];
  sizes: string[];
  colors: string[];
  featured: boolean;
  trending: boolean;
  visible: boolean;
  status: ProductStatus;
  slug?: string;
}

export interface ProductListFilters {
  category?: Category | "all";
  status?: ProductStatus | "all";
  search?: string;
  limit?: number;
  offset?: number;
}

export function getSubCategories<T extends Category>(category: T): Subcategory<T>[] {
  const selectedCategory = categories.find((item) => item.name === category);
  return (selectedCategory?.subcategories as readonly Subcategory<T>[] | undefined)?.slice() ?? [];
}

export const getSubcategories = getSubCategories;

export function slugifyProductName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function ensureProductGallery(images: string[]) {
  return images.map((image) => image.trim()).filter(Boolean);
}
