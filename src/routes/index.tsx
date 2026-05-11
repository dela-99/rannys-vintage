import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { DropBar } from "@/components/DropBar";
import { NewArrivals } from "@/components/NewArrivals";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FeaturedCollection } from "@/components/FeaturedCollection";
import { Trending } from "@/components/Trending";
import { Instagram } from "@/components/Instagram";
import { BrandStory } from "@/components/BrandStory";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ranny's Clothing — Chic & Stylishly Confident Fashion in Ghana" },
      { name: "description", content: "Handpicked dresses, shoes, jewelry & chains, flown in fresh from China to Accra. Shop the latest drop at Ranny's Clothing." },
      { property: "og:title", content: "Ranny's Clothing — Just Dropped" },
      { property: "og:description", content: "Chic, stylishly confident pieces — fresh drops from China, every few weeks." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <DropBar />
        <NewArrivals />
        <CategoryGrid />
        <FeaturedCollection />
        <Trending />
        <Instagram />
        <BrandStory />
        <Newsletter />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
