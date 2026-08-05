import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  CATEGORIES,
  getSubCategories,
  slugifyProductName,
  type Category,
  type Product,
  type ProductInput,
  type ProductStatus,
} from "@/data/products";
import { uploadProductImages, validateImageFiles } from "@/services/cloudinaryService";
import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface AddProductModalProps {
  isOpen: boolean;
  product?: Product | null;
  onClose: () => void;
  onSubmit: (product: ProductInput, documentId?: string) => Promise<void>;
}

type DraftImage =
  | {
      id: string;
      kind: "existing";
      url: string;
    }
  | {
      id: string;
      kind: "file";
      file: File;
      url: string;
    };

const defaultCategory = CATEGORIES[0];

function splitTokens(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function createInitialForm(product?: Product | null) {
  return {
    name: product?.name ?? "",
    category: product?.category ?? defaultCategory,
    subcategory: product?.subcategory ?? "",
    description: product?.description ?? "",
    price: product?.price ? String(product.price) : "",
    oldPrice: product?.oldPrice ? String(product.oldPrice) : "",
    stock: product?.stock !== undefined ? String(product.stock) : "0",
    sizes: product?.sizes.join(", ") ?? "",
    colors: product?.colors.join(", ") ?? "",
    featured: product?.featured ?? false,
    trending: product?.trending ?? false,
    visible: product?.visible ?? true,
  };
}

export function AddProductModal({ isOpen, product, onClose, onSubmit }: AddProductModalProps) {
  const [form, setForm] = useState(createInitialForm(product));
  const [images, setImages] = useState<DraftImage[]>([]);
  const [savingStatus, setSavingStatus] = useState<ProductStatus | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm(createInitialForm(product));
    setImages(
      product?.images.map((url) => ({
        id: url,
        kind: "existing",
        url,
      })) ?? [],
    );
    setError("");
    setUploadProgress(0);
  }, [isOpen, product]);

  const subcategories = useMemo(() => getSubCategories(form.category), [form.category]);
  const isEditing = Boolean(product);
  const isSaving = Boolean(savingStatus);

  const updateField = <Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const addFiles = (files: FileList | null) => {
    const nextFiles = Array.from(files ?? []);

    if (nextFiles.length === 0) {
      return;
    }

    try {
      validateImageFiles(nextFiles);
      setImages((current) => [
        ...current,
        ...nextFiles.map((file) => ({
          id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
          kind: "file" as const,
          file,
          url: URL.createObjectURL(file),
        })),
      ]);
      setError("");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Invalid image file.");
    }
  };

  const removeImage = (imageId: string) => {
    setImages((current) => {
      const selected = current.find((image) => image.id === imageId);

      if (selected?.kind === "file") {
        URL.revokeObjectURL(selected.url);
      }

      return current.filter((image) => image.id !== imageId);
    });
  };

  const moveImage = (fromIndex: number, direction: -1 | 1) => {
    setImages((current) => {
      const nextIndex = fromIndex + direction;

      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [selected] = next.splice(fromIndex, 1);
      next.splice(nextIndex, 0, selected);
      return next;
    });
  };

  const handleSave = async (status: ProductStatus) => {
    setSavingStatus(status);
    setError("");
    setUploadProgress(0);

    try {
      const files = images.filter((image) => image.kind === "file").map((image) => image.file);
      const uploadedImages = await uploadProductImages(files, setUploadProgress);
      const uploadedUrls = uploadedImages.map((image) => image.optimizedUrl || image.url);
      let uploadedIndex = 0;
      const imageUrls = images.map((image) => {
        if (image.kind === "existing") {
          return image.url;
        }

        const uploadedUrl = uploadedUrls[uploadedIndex];
        uploadedIndex += 1;
        return uploadedUrl;
      });

      if (imageUrls.length === 0) {
        throw new Error("Add at least one product image before saving.");
      }

      await onSubmit(
        {
          name: form.name,
          category: form.category,
          subcategory: form.subcategory,
          description: form.description,
          price: Number(form.price),
          oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
          stock: Number(form.stock),
          images: imageUrls,
          sizes: splitTokens(form.sizes),
          colors: splitTokens(form.colors),
          featured: form.featured,
          trending: form.trending,
          visible: status === "published" ? form.visible : false,
          status,
          slug: product?.slug || slugifyProductName(form.name),
        },
        product?.documentId,
      );

      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Product could not be saved.");
    } finally {
      setSavingStatus(null);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-8 p-1 md:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Product Name" htmlFor="product-name">
                <Input
                  id="product-name"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="e.g. Vintage Silk Blouse"
                />
              </Field>
              <Field label="Stock" htmlFor="stock">
                <Input
                  id="stock"
                  min={0}
                  type="number"
                  value={form.stock}
                  onChange={(event) => updateField("stock", event.target.value)}
                />
              </Field>
            </div>

            <Field label="Description" htmlFor="description">
              <Textarea
                id="description"
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Describe fit, fabric, condition, and styling notes."
                rows={5}
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Category" htmlFor="category">
                <Select
                  value={form.category}
                  onValueChange={(value) => {
                    const category = value as Category;
                    updateField("category", category);
                    updateField("subcategory", getSubCategories(category)[0] ?? "");
                  }}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Subcategory" htmlFor="subcategory">
                <Select
                  value={form.subcategory}
                  onValueChange={(value) => updateField("subcategory", value)}
                >
                  <SelectTrigger id="subcategory">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {subcategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Price (GH₵)" htmlFor="price">
                <Input
                  id="price"
                  min={0}
                  type="number"
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                />
              </Field>
              <Field label="Old Price (GH₵)" htmlFor="old-price">
                <Input
                  id="old-price"
                  min={0}
                  type="number"
                  value={form.oldPrice}
                  onChange={(event) => updateField("oldPrice", event.target.value)}
                  placeholder="Optional"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Sizes" htmlFor="sizes">
                <Input
                  id="sizes"
                  value={form.sizes}
                  onChange={(event) => updateField("sizes", event.target.value)}
                  placeholder="XS, S, M, L"
                />
              </Field>
              <Field label="Colors" htmlFor="colors">
                <Input
                  id="colors"
                  value={form.colors}
                  onChange={(event) => updateField("colors", event.target.value)}
                  placeholder="Black, Ivory"
                />
              </Field>
            </div>

            <div className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-3">
              <ToggleField
                label="Featured"
                checked={form.featured}
                onCheckedChange={(checked) => updateField("featured", checked)}
              />
              <ToggleField
                label="Trending"
                checked={form.trending}
                onCheckedChange={(checked) => updateField("trending", checked)}
              />
              <ToggleField
                label="Visible"
                checked={form.visible}
                onCheckedChange={(checked) => updateField("visible", checked)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div
              onDrop={(event) => {
                event.preventDefault();
                addFiles(event.dataTransfer.files);
              }}
              onDragOver={(event) => event.preventDefault()}
              className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-center"
            >
              <ImagePlus className="mx-auto h-9 w-9 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">Drag images here</p>
              <p className="mt-1 text-xs text-muted-foreground">Images upload to Cloudinary.</p>
              <Label className="mt-4 inline-flex cursor-pointer rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
                Choose Images
                <Input
                  multiple
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => addFiles(event.target.files)}
                />
              </Label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {images.map((image, index) => (
                  <div key={image.id} className="group overflow-hidden rounded-xl border bg-white">
                    <img src={image.url} alt="" className="aspect-4/5 w-full object-cover" />
                    <div className="flex items-center justify-between gap-1 p-2">
                      <span className="text-[10px] text-muted-foreground">
                        {index === 0 ? "Main" : `Image ${index + 1}`}
                      </span>
                      <div className="flex gap-1">
                        <IconButton
                          label="Move image up"
                          disabled={index === 0}
                          onClick={() => moveImage(index, -1)}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </IconButton>
                        <IconButton
                          label="Move image down"
                          disabled={index === images.length - 1}
                          onClick={() => moveImage(index, 1)}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </IconButton>
                        <IconButton label="Remove image" onClick={() => removeImage(image.id)}>
                          <Trash2 className="h-3 w-3" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {uploadProgress > 0 && (
              <div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Uploading {uploadProgress}%</p>
              </div>
            )}

            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => handleSave("draft")}
          >
            {savingStatus === "draft" ? "Saving..." : "Save Draft"}
          </Button>
          <Button type="button" disabled={isSaving} onClick={() => handleSave("published")}>
            {savingStatus === "published" ? "Publishing..." : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function ToggleField({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span>{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}

function IconButton({
  label,
  children,
  disabled,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-7 w-7 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary disabled:opacity-40"
    >
      {children}
    </button>
  );
}
