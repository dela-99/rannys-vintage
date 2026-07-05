/* eslint-disable prettier/prettier */
import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Button } from "./ui/button";

const PROMOTION_SEEN_KEY = "ranny_promo_seen";

export function PromotionPopup() {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Check if the promotion has been seen in this session
    const hasSeenPromo = sessionStorage.getItem(PROMOTION_SEEN_KEY);
    if (!hasSeenPromo) {
      // Show the popup after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000); // 3-second delay

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(PROMOTION_SEEN_KEY, "true");
    setIsOpen(false);
  };

  const handleShopNow = () => {
    handleClose();
    navigate({ to: "/shop" });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-99 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed top-1/2 left-1/2 z-100 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background p-8 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          aria-label="Close promotion"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          {/* This content would be driven by the Promotions Management system */}
          <h2 className="font-display text-3xl font-bold text-primary">Black Friday Sale!</h2>
          <p className="mt-2 text-5xl font-bold">50% OFF</p>
          <p className="mt-4 text-muted-foreground">
            Our biggest sale of the year is here. Get 50% off on all items for a limited time.
          </p>
          <Button size="lg" className="mt-6 w-full" onClick={handleShopNow}>
            Shop Now
          </Button>
        </div>
      </div>
    </>
  );
}
