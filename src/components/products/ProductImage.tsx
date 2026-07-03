import { useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";

type ProductImageProps = {
  src?: string;
  alt: string;
  className?: string;
};

export function ProductImage({ src, alt, className = "" }: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(Boolean(src));
  const [hasError, setHasError] = useState(false);

  const fallback = !src || hasError;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-muted/40 ${className}`.trim()}>
      {isLoading && !fallback ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/40">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : null}

      {fallback ? (
        <div className="flex min-h-[180px] flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted/70 to-background text-muted-foreground">
          <ImageIcon className="h-8 w-8" />
          <span className="text-sm">Image preview unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </div>
  );
}
