import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { categoryNames, getSubcategories, allProducts, Product } from "@/lib/categories";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const shopSearchSchema = z.object({
  category: z.enum(categoryNames).optional(),
  subcategory: z.string().optional(),
  // Add other filters here
  // price: z.number().optional(),
  // sort: z.enum(['newest', 'trending']).optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: shopSearchSchema,
  component: ShopComponent,
});

function ProductCard({ product }: { product: Product }) {
  // A placeholder for your product card UI
  return (
    <div className="border rounded-lg p-4">
      <div className="w-full h-48 bg-muted mb-2"></div>
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-muted-foreground">
        {product.category} &gt; {product.subcategory}
      </p>
      <p className="font-bold mt-2">${product.price}</p>
    </div>
  );
}

function ShopComponent() {
  const { category, subcategory } = Route.useSearch();

  const filteredProducts = allProducts.filter((product) => {
    if (category && product.category !== category) {
      return false;
    }
    if (subcategory && product.subcategory !== subcategory) {
      return false;
    }
    // Add other filter logic here
    return true;
  });

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/shop" search={{}}>
                Shop
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {category && <BreadcrumbSeparator />}
          {category && (
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/shop" search={{ category }}>
                  {category}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
          {subcategory && <BreadcrumbSeparator />}
          {subcategory && (
            <BreadcrumbItem>
              <BreadcrumbPage>{subcategory}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filtering UI would go here */}
        <aside className="md:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          {/* Your existing filter UI will be integrated here */}
        </aside>

        <main className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </main>
      </div>
    </div>
  );
}
