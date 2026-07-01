import { Suspense } from "react";
import { HomeJsonLd } from "./_components/home-json-ld";
import { HeroSection } from "./_components/hero-section";
import { ProjectCarouselSection } from "./_components/project-carousel-section";
import { ReviewCarouselSection } from "./_components/review-carousel-section";
import { ContactSection } from "./_components/contact-section";
import { ProjectCarouselSkeleton } from "./_components/project-carousel-skeleton";
import { ReviewCarouselSkeleton } from "./_components/review-carousel-skeleton";

export default function Home() {
  return (
    <>
      <HomeJsonLd />
      <HeroSection />

      <Suspense fallback={<ProjectCarouselSkeleton />}>
        <ProjectCarouselSection />
      </Suspense>

      <Suspense fallback={<ReviewCarouselSkeleton />}>
        <ReviewCarouselSection />
      </Suspense>

      <ContactSection />
    </>
  );
}
