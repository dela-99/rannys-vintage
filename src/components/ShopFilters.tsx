import { CATEGORIES, type Category } from "@/data/products";
import { X } from "lucide-react";

export type SortOption = "featured" | "newest" | "price-asc" | "price-desc";

export interface ShopFilterState {
  categories: Category[];
  search: string;
  sort: SortOption;
  priceMax: number;
  newOnly: boolean;
  trendingOnly: boolean;
  inStockOnly: boolean;
}

export const DEFAULT_FILTERS: ShopFilterState = {
  categories: [],
  search: "",
  sort: "featured",
  priceMax: 800,
  newOnly: false,
  trendingOnly: false,
  inStockOnly: false,
};

interface Props {
  filters: ShopFilterState;
  onChange: (next: ShopFilterState) => void;
  maxPrice: number;
}

export function ShopFilters({ filters, onChange, maxPrice }: Props) {
  const toggleCategory = (c: Category) => {
    const next = filters.categories.includes(c)
      ? filters.categories.filter((x) => x !== c)
      : [...filters.categories, c];
    onChange({ ...filters, categories: next });
  };

  const reset = () => onChange({ ...DEFAULT_FILTERS, priceMax: maxPrice });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg">Filters</h3>
        <button
          onClick={reset}
          className="font-accent flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary"
        >
          <X className="h-3 w-3" /> Clear
        </button>
      </div>

      <Group label="Category">
        <div className="space-y-2">
          {CATEGORIES.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                checked={filters.categories.includes(c)}
                onChange={() => toggleCategory(c)}
              />
              <span
                className={
                  filters.categories.includes(c) ? "text-foreground" : "text-muted-foreground"
                }
              >
                {c}
              </span>
            </label>
          ))}
        </div>
      </Group>

      <Group label="Drop">
        <div className="space-y-2">
          <Toggle
            label="New arrivals"
            checked={filters.newOnly}
            onChange={(v) => onChange({ ...filters, newOnly: v })}
          />
          <Toggle
            label="Trending"
            checked={filters.trendingOnly}
            onChange={(v) => onChange({ ...filters, trendingOnly: v })}
          />
          <Toggle
            label="In stock only"
            checked={filters.inStockOnly}
            onChange={(v) => onChange({ ...filters, inStockOnly: v })}
          />
        </div>
      </Group>

      <Group label={`Price up to GH₵ ${filters.priceMax}`}>
        <input
          type="range"
          min={50}
          max={maxPrice}
          step={10}
          value={filters.priceMax}
          onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
          className="w-full accent-primary"
        />
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>GH₵ 50</span>
          <span>GH₵ {maxPrice}</span>
        </div>
      </Group>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-accent mb-3 text-[10px] text-foreground">{label}</p>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between text-sm">
      <span className={checked ? "text-foreground" : "text-muted-foreground"}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition ${checked ? "bg-primary" : "bg-border"}`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-all ${
            checked ? "left-4.5" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}
