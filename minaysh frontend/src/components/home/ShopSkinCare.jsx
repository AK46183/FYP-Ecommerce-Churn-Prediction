import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { skinCareProducts } from '../../data/products.js'
import ProductCard from '../products/ProductCard.jsx'
import './ShopSkinCare.css'

export default function ShopSkinCare() {
  const trackRef = useRef(null)
  const videoRef = useRef(null)

  // MINAYSH_LAZY_SEA_VIDEO: the top of the page loads first, then the sea video
  // starts loading right after (or straight away if you scroll near it first)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let timer = 0
    const start = () => {
      if (video.getAttribute('src')) return
      video.setAttribute('src', '/videos/sea-bg.mp4')
      video.play().catch(() => {})
    }
    const afterLoad = () => { timer = window.setTimeout(start, 300) }
    if (document.readyState === 'complete') afterLoad()
    else window.addEventListener('load', afterLoad, { once: true })
    let io = null
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { start(); if (video.paused) video.play().catch(() => {}) }
      }, { rootMargin: '800px 0px' })
      io.observe(video)
    }
    return () => {
      window.removeEventListener('load', afterLoad)
      window.clearTimeout(timer)
      if (io) io.disconnect()
    }
  }, [])

  function scrollByCard(direction) {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('.shop-skincare__card')
    const amount = card ? card.offsetWidth + 32 : 320
    track.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <section className="shop-skincare">
      {/* moving sunset sea behind the section */}
      <video
        ref={videoRef}
        className="shop-skincare__video"
        poster="/videos/sea-bg-poster.jpg"
        preload="none"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      <div className="container">
        <h2 className="shop-skincare__heading">Shop Skin Care</h2>

        <div className="shop-skincare__carousel">
          <button
            className="shop-skincare__arrow shop-skincare__arrow--left"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous products"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>

          <div className="shop-skincare__track" ref={trackRef}>
            {skinCareProducts.map((product) => (
              <div className="shop-skincare__card" key={product.id}>
                <ProductCard product={product} editorial />
              </div>
            ))}
          </div>

          <button
            className="shop-skincare__arrow shop-skincare__arrow--right"
            onClick={() => scrollByCard(1)}
            aria-label="Next products"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="shop-skincare__viewall">
          <Link to="/skincare">View All <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  )
}