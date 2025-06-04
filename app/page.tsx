import { HeroSection } from "@/components/hero-section"
import { TxmChallenge } from "@/components/txm-challenge"
import { ProductSection } from "@/components/product-section"
import { SaasCommercial } from "@/components/saas-commercial"
import { UsageGuide } from "@/components/usage-guide"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TxmChallenge />
      <ProductSection />
      <SaasCommercial />
      <UsageGuide />
      <Footer />
    </div>
  )
}
