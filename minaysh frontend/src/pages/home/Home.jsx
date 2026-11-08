import Hero from '../../components/home/Hero.jsx'
import TipsTrends from '../../components/home/TipsTrends.jsx'
import CategoriesAndSkinCare from '../../components/home/CategoriesAndSkinCare.jsx'
import OurBrand from '../../components/home/OurBrand.jsx'
import TrustStrip from '../../components/home/TrustStrip.jsx'

// Homepage section order: Hero -> Story -> Tips & Trends -> Categories & Skin Care -> Our Brand -> Trust strip
export default function Home() {
  return (
    <>
      <Hero />
      <TipsTrends />
      <CategoriesAndSkinCare />
      <OurBrand />
      <TrustStrip />
    </>
  )
}