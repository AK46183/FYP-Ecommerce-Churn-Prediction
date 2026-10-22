import { useParams, Navigate } from 'react-router-dom'
import { tipsTrends } from '../../data/tipsTrends.js'
import { allProducts } from '../../data/products.js'
import ProductCard from '../../components/products/ProductCard.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
import BeautyQuiz from '../../components/common/BeautyQuiz.jsx'
import { isPurchasable } from '../../services/product.js'
import './TipsDetail.css'

const copy = {
  eye: {
    subtitle: 'Eyeshadow blending, liner precision and lash tips from the MINAYSH artistry team.',
    tutorials: [
      'The 3-shade eyeshadow blend everyone can master',
      'How to get a sharp winged liner every time',
      'Layering mascara for fuller-looking lashes',
    ],
  },
  face: {
    subtitle: 'Base, contour and glow techniques for a skin-like finish that lasts.',
    tutorials: [
      'Foundation matching for your undertone',
      'Soft contour for beginners',
      'The 60-second no-makeup makeup routine',
    ],
  },
  lip: {
    subtitle: 'From bold mattes to your-lips-but-better tints — our favorite lip techniques.',
    tutorials: [
      'How to make matte lipstick last through dinner',
      'Overlining without looking overdone',
      'Building an ombré lip in under a minute',
    ],
  },
  looks: {
    subtitle: 'Full looks for every occasion, from office days to golden-hour events.',
    tutorials: [
      'A 10-minute everyday office look',
      'Date-night glam with products you own',
      'Festival-ready color for beginners',
    ],
  },
}

export default function TipsDetail() {
  const { category } = useParams()
  const tip = tipsTrends.find((t) => t.key === category)
  const content = copy[category]

  if (!tip || !content) {
    return <Navigate to="/" replace />
  }

  // products that belong to this page (eye page -> eye products, etc.)
  const types = {
    eye: ['Mascara', 'Eyeliner', 'Eyeshadow Palettes', 'False Lashes', 'Brow Products', 'Eyeshadow'],
    face: ['Foundations', 'Face Highlighters', 'Blush', 'Concealers', 'Face Powders', 'Bronzers & Contours'],
    lip: ['Lipstick', 'Lip Gloss', 'Lip Tints', 'Lip Liner', 'Lip Care'],
    looks: ['Mascara', 'Lipstick', 'Face Highlighters', 'Eyeshadow Palettes'],
  }[category] || []
  const relatedProducts = types
    .map((t) => allProducts.find((p) => p.subCategory === t && isPurchasable(p)))
    .filter(Boolean)
    .slice(0, 4)

  return (
    <>
      <PageHeader title={tip.title} subtitle={content.subtitle} />

      <section className="tips-detail">
        <div className="container tips-detail__grid">
          <div className="tips-detail__video-wrap">
            <video muted loop playsInline autoPlay preload="metadata" poster={tip.poster}>
              <source src={tip.video} type="video/mp4" />
            </video>
          </div>

          <div className="tips-detail__tutorials">
            <BeautyQuiz key={category} category={category} />
          </div>
        </div>
      </section>

      <section className="tips-detail__products">
        <div className="container">
          <h2>Shop The Look</h2>
          <div className="tips-detail__products-grid">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}