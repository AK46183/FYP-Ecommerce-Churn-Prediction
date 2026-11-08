import TopCategories from './TopCategories.jsx'
import ShopSkinCare from './ShopSkinCare.jsx'
import './CategoriesAndSkinCare.css'

// Top Categories and Shop Skin Care share one continuous pale-blush
// background, per the brand brief, so they're composed together here.
export default function CategoriesAndSkinCare() {
  return (
    <div className="categories-skincare-band">
      <TopCategories />
      <ShopSkinCare />
    </div>
  )
}
