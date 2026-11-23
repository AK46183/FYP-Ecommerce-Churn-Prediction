import ContentPage from './ContentPage.jsx'
import BrandStory from '../../components/brand/BrandStory.jsx'

// Our Brand: sirf story video (text story ke captions mein hai)
export default function OurBrandPage() {
  return <ContentPage title="Our Brand" subtitle="Beauty, made personal." wide={<BrandStory />} />
}
