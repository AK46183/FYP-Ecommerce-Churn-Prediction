import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { SmartphoneStory } from "@/components/home/SmartphoneStory";
import { HeadphoneStory } from "@/components/home/HeadphoneStory";
import { CameraStory } from "@/components/home/CameraStory";
import { ComparisonTeaser } from "@/components/home/ComparisonTeaser";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { TrustSection } from "@/components/home/TrustSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <SmartphoneStory />
      <HeadphoneStory />
      <CameraStory />
      <ComparisonTeaser />
      <FeaturedProducts />
      <TrustSection />
      <ReviewsSection />
    </>
  );
}
