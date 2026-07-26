import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { UploadCloud } from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <div className="grid max-h-[70vh] grid-cols-1 gap-8 overflow-y-auto p-1 pr-6 md:grid-cols-3">
          {/* Left Column */}
          <div className="col-span-1 space-y-6 md:col-span-2">
            <div className="space-y-2">
              <Label htmlFor="product-name">Product Name</Label>
              <Input id="product-name" placeholder="e.g. Vintage Silk Blouse" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the product..." rows={5} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dresses">Dresses</SelectItem>
                    <SelectItem value="footwear">Footwear</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select>
                  <SelectTrigger id="subcategory">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heels">Heels</SelectItem>
                    <SelectItem value="tops">Tops</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (GH₵)</Label>
                <Input id="price" type="number" placeholder="250.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="old-price">Old Price (GH₵)</Label>
                <Input id="old-price" type="number" placeholder="300.00 (Optional)" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Image Upload</Label>
              <div className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-primary-soft/40 text-center">
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag & drop images here, or click to browse
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-1 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" placeholder="10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sizes">Sizes</Label>
              <Input id="sizes" placeholder="S, M, L (comma separated)" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="colours">Colours</Label>
              <Input id="colours" placeholder="Red, Blue (comma separated)" />
            </div>
            <div className="space-y-4 rounded-lg border border-border p-4">
              <h4 className="font-medium">Visibility</h4>
              <div className="flex items-center justify-between">
                <Label htmlFor="visible">Visible</Label>
                <input type="checkbox" id="visible" className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured</Label>
                <input type="checkbox" id="featured" className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="trending">Trending</Label>
                <input type="checkbox" id="trending" className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" className="bg-primary-soft">
            Save Draft
          </Button>
          <Button>Publish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
