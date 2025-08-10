import { ModernHero } from "@/components/modern-hero"
import { PromotionSection } from "@/components/promotion-section"
import { ModernBestSellers } from "@/components/modern-best-sellers"
import { ModernContact } from "@/components/modern-contact"
import { ModernFooter } from "@/components/modern-footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ModernCategories } from "@/components/modern-categories"
import { VintageCollectionSection } from "@/components/vintage-collection-section"

export default function HomePage() {
  return (
    <main>
      <ModernHero />
      <ModernBestSellers />
      <ModernCategories />
      <VintageCollectionSection />
      
      
      
      <ModernContact />
      
      <WhatsAppButton />
    </main>
  )
}
