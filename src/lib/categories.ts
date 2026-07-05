export const categories = [
  {
    name: "Jewelry",
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
    subcategories: ["Handbags", "Shoulder Bags", "Crossbody Bags", "Tote Bags", "Travel Bags"],
  },
  {
    name: "Accessories",
    subcategories: ["Leggings", "Body Splash"],
  },
] as const;

export type Category = (typeof categories)[number]["name"];

export type Subcategory<T extends Category> = Extract<
  (typeof categories)[number],
  { name: T }
>["subcategories"][number];

export const categoryNames = categories.map((category) => category.name) as [
  Category,
  ...Category[],
];

export function getSubcategories<T extends Category>(category: T): Subcategory<T>[] {
  const selectedCategory = categories.find((item) => item.name === category);
  return (selectedCategory?.subcategories as readonly Subcategory<T>[] | undefined)?.slice() ?? [];
}

export type Product = {
  id: string;
  name: string;
  category: Category;
  subcategory: Subcategory<Category>;
  price: number;
  previousPrice?: number;
  description: string;
  stock: number;
  images: string[];
  sizes?: string[];
  colors?: string[];
  featured: boolean;
  newArrival: boolean;
  trending: boolean;
  isVisible: boolean;
  createdAt: Date;
};

export const allProducts: Product[] = [
  {
    id: "1",
    name: "Vintage Gold Hoops",
    category: "Jewelry",
    subcategory: "Earrings",
    price: 150,
    isVisible: true,
    description: "...",
    stock: 5,
    images: [],
    featured: true,
    newArrival: true,
    trending: false,
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Classic Leather Tote",
    category: "Bags",
    subcategory: "Tote Bags",
    price: 350,
    isVisible: true,
    description: "...",
    stock: 2,
    images: [],
    featured: false,
    newArrival: true,
    trending: true,
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Platform Sneakers",
    category: "Footwear",
    subcategory: "Sneakers",
    price: 220,
    isVisible: true,
    description: "...",
    stock: 8,
    images: [],
    featured: true,
    newArrival: false,
    trending: true,
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "Denim Jeans",
    category: "Dresses",
    subcategory: "Jeans",
    price: 180,
    isVisible: true,
    description: "...",
    stock: 10,
    images: [],
    featured: false,
    newArrival: false,
    trending: false,
    createdAt: new Date(),
  },
];
