import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  Box,
  LayoutDashboard,
  Mail,
  MessageSquare,
  PlusCircle,
  ShoppingBag,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import { ProductImage } from "@/components/products/ProductImage";
import { CATEGORIES } from "@/data/products";
import { normalizeImageList } from "@/lib/cloudinary";

const stats = [
  { label: "Orders", value: "124", icon: ShoppingBag, trend: "+12%" },
  { label: "Customers", value: "892", icon: Users, trend: "+5%" },
  { label: "Complaints", value: "2", icon: AlertCircle, trend: "Stable" },
  { label: "Requests", value: "15", icon: MessageSquare, trend: "+2" },
  { label: "Products", value: "450", icon: Box, trend: "Restocking" },
  { label: "Subscribers", value: "2.4k", icon: Mail, trend: "+18%" },
];

function AdminDashboard() {
  const [productName, setProductName] = useState("The Velvet Edit");
  const [productCategory, setProductCategory] = useState<(typeof CATEGORIES)[number]>("Dresses");
  const [price, setPrice] = useState("650");
  const [description, setDescription] = useState(
    "A sculpted evening piece designed for editorial layering and premium retail launches.",
  );
  const [imageUrls, setImageUrls] = useState(["", ""]);

  const previewImages = normalizeImageList(imageUrls);

  const updateImageValue = (index: number, value: string) => {
    setImageUrls((current) =>
      current.map((image, imageIndex) => (imageIndex === index ? value : image)),
    );
  };

  const addImageField = () => {
    setImageUrls((current) => [...current, ""]);
  };

  const removeImageField = (index: number) => {
    setImageUrls((current) => current.filter((_, imageIndex) => imageIndex !== index));
  };

  return (
    <div className="flex min-h-screen bg-slate-50 pt-20">
      <aside className="hidden w-64 border-r border-border bg-white p-6 md:block">
        <nav className="space-y-2">
          <SidebarLink icon={LayoutDashboard} label="Dashboard" active />
          <SidebarLink icon={ShoppingBag} label="Orders" />
          <SidebarLink icon={AlertCircle} label="Complaints" />
          <SidebarLink icon={MessageSquare} label="Requests" />
          <SidebarLink icon={Box} label="Products" />
          <SidebarLink icon={Mail} label="Messages" />
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-accent text-xs uppercase tracking-widest text-primary">Overview</p>
            <h1 className="mt-2 font-display text-4xl">Studio Control</h1>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 shadow-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
            <span className="text-[10px] font-accent font-semibold uppercase">System Live</span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group rounded-2xl border border-border bg-white p-6 shadow-card transition-all hover:shadow-hover"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <s.icon className="h-6 w-6" />
                </div>
                <span className="rounded-md bg-success/10 px-2 py-1 text-[10px] font-accent font-bold text-success">
                  {s.trend}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-accent uppercase tracking-tighter text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-1 font-display text-3xl">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-2xl border border-border bg-white p-8 shadow-card">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-accent text-xs uppercase tracking-[0.2em] text-primary">
                  Product Studio
                </p>
                <h3 className="mt-2 font-display text-xl">Cloudinary-ready product editor</h3>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-accent font-semibold uppercase text-primary">
                Draft
              </span>
            </div>

            <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="ml-4 text-[10px] font-accent uppercase tracking-[0.2em] text-muted-foreground">
                    Product name
                  </span>
                  <input
                    value={productName}
                    onChange={(event) => setProductName(event.target.value)}
                    className="h-12 w-full rounded-full border border-border bg-[#f7f3ff] px-4 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </label>

                <label className="space-y-2">
                  <span className="ml-4 text-[10px] font-accent uppercase tracking-[0.2em] text-muted-foreground">
                    Category
                  </span>
                  <select
                    value={productCategory}
                    onChange={(event) =>
                      setProductCategory(event.target.value as (typeof CATEGORIES)[number])
                    }
                    className="h-12 w-full rounded-full border border-border bg-[#f7f3ff] px-4 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="space-y-2">
                <span className="ml-4 text-[10px] font-accent uppercase tracking-[0.2em] text-muted-foreground">
                  Price
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  className="h-12 w-full rounded-full border border-border bg-[#f7f3ff] px-4 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>

              <label className="space-y-2">
                <span className="ml-4 text-[10px] font-accent uppercase tracking-[0.2em] text-muted-foreground">
                  Description
                </span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  className="w-full rounded-3xl border border-border bg-[#f7f3ff] px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="ml-4 text-[10px] font-accent uppercase tracking-[0.2em] text-muted-foreground">
                    Image URLs
                  </span>
                  <button
                    type="button"
                    onClick={addImageField}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add image
                  </button>
                </div>

                {imageUrls.map((imageUrl, index) => (
                  <div key={`${imageUrl}-${index}`} className="flex items-center gap-3">
                    <input
                      value={imageUrl}
                      onChange={(event) => updateImageValue(index, event.target.value)}
                      placeholder="https://res.cloudinary.com/..."
                      className="h-12 flex-1 rounded-full border border-border bg-[#f7f3ff] px-4 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    {imageUrls.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="rounded-full border border-border p-3 text-muted-foreground transition hover:border-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-foreground px-4 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-primary"
              >
                Save draft
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-border bg-white p-8 shadow-card">
            <div className="mb-6">
              <p className="font-accent text-xs uppercase tracking-[0.2em] text-primary">
                Live preview
              </p>
              <h3 className="mt-2 font-display text-xl">Featured product card</h3>
            </div>

            <div className="rounded-[24px] border border-border bg-gradient-to-br from-[#f7f3ff] to-white p-4">
              <ProductImage
                src={previewImages[0] ?? ""}
                alt={productName}
                className="h-56 w-full"
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-display text-xl">{productName}</p>
                  <span className="text-sm font-semibold text-primary">GHS {price}</span>
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {previewImages.slice(0, 3).map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="h-14 w-14 overflow-hidden rounded-xl border border-border"
                    >
                      <ProductImage
                        src={image}
                        alt={`${productName} preview ${index + 1}`}
                        className="h-full w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-white p-8 shadow-card">
          <h3 className="mb-4 font-display text-xl">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-border py-3 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New collection drop scheduled</p>
                    <p className="text-[10px] font-accent text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <button className="text-[10px] font-accent font-bold text-primary hover:underline">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({
  icon: Icon,
  label,
  active = false,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${active ? "bg-primary text-white shadow-glow" : "text-muted-foreground hover:bg-primary-soft hover:text-primary"}`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs font-accent font-semibold">{label}</span>
    </a>
  );
}

export const Route = createFileRoute("/dashboard")({
  component: () => <AdminDashboard />,
});
