import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.enum(categoryNames),
  subcategory: z.string().min(1, "Subcategory is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
});

export function AddProductComponent() {
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
  });

  const selectedCategory = form.watch("category");
  const subcategories = React.useMemo(
    () => (selectedCategory ? getSubcategories(selectedCategory) : []),
    [selectedCategory],
  );

  React.useEffect(() => {
    form.resetField("subcategory");
  }, [selectedCategory, form]);

  function onSubmit(values: z.infer<typeof productFormSchema>) {
    console.log("Form submitted:", values);
    // Handle product creation logic here
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Vintage Leather Jacket" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Other form fields like description, stock, etc. would go here */}

          <Button type="submit">Add Product</Button>
        </form>
      </Form>
    </div>
  );
}
