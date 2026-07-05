import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { categoryNames, getSubcategories } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.enum(categoryNames),
  subcategory: z.string().min(1, "Subcategory is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  previousPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  description: z.string().min(1, "Description is required"),
  // TODO: Add proper validation for sizes and colors
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  featured: z.boolean(),
  trending: z.boolean(),
  isVisible: z.boolean(),
});

type ProductFormValues = z.input<typeof productFormSchema>;
type ProductFormSubmitValues = z.output<typeof productFormSchema>;

function ImageUploadPlaceholder() {
  return (
    <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center">
      <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
      <p className="mt-4 font-semibold">Drag & drop images here</p>
      <p className="text-sm text-muted-foreground">or click to browse</p>
      <p className="mt-4 text-xs text-muted-foreground">
        (Image upload UI placeholder for Phase 2)
      </p>
    </div>
  );
}

export function AddProductComponent() {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      category: categoryNames[0],
      subcategory: "",
      price: 0,
      previousPrice: undefined,
      stock: 0,
      description: "",
      sizes: [],
      colors: [],
      featured: false,
      trending: false,
      isVisible: true,
    },
  });

  const selectedCategory = form.watch("category");
  const subcategories = React.useMemo(
    () => (selectedCategory ? getSubcategories(selectedCategory) : []),
    [selectedCategory],
  );

  React.useEffect(() => {
    form.resetField("subcategory"); // This line is correct.
  }, [selectedCategory, form]);

  function onSubmit(data: ProductFormSubmitValues) {
    console.log("Form submitted:", data);
    // TODO: PHASE 2 - Connect to backend endpoint
    // 1. Upload images to Cloudinary, get URLs.
    // 2. Add image URLs to the `values` object.
    // 3. Send the complete product data to the create product endpoint.
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={(
              { field }, // This line is correct.
            ) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Vintage Leather Jacket" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Images</FormLabel>
            <div className="mt-2">
              <ImageUploadPlaceholder />
            </div>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={(
              { field }, // This line is correct.
            ) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a rich description for the product..."
                    className="min-h-37.5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryNames.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger disabled={!selectedCategory}>
                        <SelectValue placeholder="Select a subcategory" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcategories.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 150.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="previousPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous Price (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 200.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* TODO: Implement multi-select for Sizes and Colors */}

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Settings</h3>
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Featured Product</FormLabel>
                    <p className="text-[0.8rem] text-muted-foreground">
                      Display this product on the homepage.
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trending"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Trending Product</FormLabel>
                    <p className="text-[0.8rem] text-muted-foreground">
                      Mark this product as a trending item.
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Visible</FormLabel>
                    <p className="text-[0.8rem] text-muted-foreground">
                      Make this product visible on the storefront.
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" size="lg">
            Publish Product
          </Button>
        </form>
      </Form>
    </div>
  );
}
