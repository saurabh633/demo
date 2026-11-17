import { Hero } from "@/components/sections/Hero";
import { FeaturedDesigns } from "@/components/sections/FeaturedDesigns";
import { ServicesStrip } from "@/components/sections/ServicesStrip";
import { WhyUs } from "@/components/sections/WhyUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { InstagramGallery } from "@/components/sections/InstagramGallery";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedDesigns />
      <ServicesStrip />
      <WhyUs />
      <Testimonials />
      <InstagramGallery />
      <FinalCTA />
    </>
  );
}
