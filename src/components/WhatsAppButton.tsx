import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/233248333294"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order via WhatsApp"
      className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-success text-white shadow-hover transition hover:scale-110 animate-pulse-glow"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
