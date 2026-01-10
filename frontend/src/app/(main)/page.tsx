"use client"

import { 
  HeroSection, 
  PartnersSection, 
  FeaturesSection, 
  PlatformSection, 
  TestimonialsPlaceholder, 
  CTASection 
} from "@/components/landing/LandingSections"

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <PartnersSection />
      <FeaturesSection />
      <PlatformSection />
      <TestimonialsPlaceholder />
      <CTASection />
    </div>
  )
}
