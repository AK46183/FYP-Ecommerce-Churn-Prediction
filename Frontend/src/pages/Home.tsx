import { Hero } from "@/components/home/Hero";
import { CategoryIconRow } from "@/components/home/CategoryIconRow";
import { DealsBanner } from "@/components/home/DealsBanner";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { TrustSection } from "@/components/home/TrustSection";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryIconRow />
      <DealsBanner />
      <FeaturedProducts />
      <TrustSection />
      <NewsletterBanner />
    </>
  );
}
