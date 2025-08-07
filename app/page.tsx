import { ModernHero } from "@/components/modern-hero"
import { PromotionSection } from "@/components/promotion-section"
import { ModernBestSellers } from "@/components/modern-best-sellers"
import { ModernContact } from "@/components/modern-contact"
import { ModernFooter } from "@/components/modern-footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ModernCategories } from "@/components/modern-categories"

export default function HomePage() {
  return (
    <main>
      <ModernHero />
      <ModernCategories />
      <PromotionSection />
      
      <ModernBestSellers />
      
      <ModernContact />
      
      <WhatsAppButton />
    </main>
  )
}
