import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './OurBrand.css'

const STORIES = [
  { eyebrow:'OUR BRAND', titleStrong:'Beauty Confidence', titleLight:'& You', text:'Beauty, made personal', cta:'Discover Our Story', link:'/our-brand', images:['/images/brand/story1-main.jpg','/images/brand/story1-a.jpg','/images/brand/story1-b.jpg'] },
  { eyebrow:'SKIN CARE', titleStrong:'Skin First', titleLight:'Rituals', text:'Gentle formulas for real routines', cta:'Shop Skin Care', link:'/skincare', images:['/images/brand/story2-main.jpg','/images/brand/story2-a.jpg','/images/brand/story2-b.jpg'] },
  { eyebrow:'MAKEUP', titleStrong:'Colour That', titleLight:'Moves With You', text:'Everyday essentials to bold looks', cta:'Shop Makeup', link:'/makeup', images:['/images/brand/story3-main.jpg','/images/brand/story3-a.jpg','/images/brand/story3-b.jpg'] },
]

// story changes while the visitor scrolls: 1st part -> 2nd part -> 3rd part
export default function OurBrand() {
  const sectionRef = useRef(null)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const story = STORIES[active]

  useEffect(() => {
    let frame = 0
    function update() {
      frame = 0
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const travel = el.offsetHeight - window.innerHeight
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0
      setProgress(p)
      setActive(Math.min(STORIES.length - 1, Math.floor(p * STORIES.length)))
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // clicking a round photo scrolls to that part of the story
  function goTo(i) {
    const el = sectionRef.current
    if (!el) return
    const travel = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + travel * ((i + 0.5) / STORIES.length), behavior: 'smooth' })
  }

  return (
    <section className="our-brand our-brand--scroll" ref={sectionRef}>
      <div className="our-brand__sticky">
        <div className="container our-brand__grid">
          <div className="our-brand__content">
            <p className="our-brand__eyebrow">{story.eyebrow}</p>
            <div className="our-brand__thumbs" role="tablist" aria-label="Brand stories">
              {STORIES.map((s, i) => (
                <button key={s.titleStrong} type="button" role="tab" aria-selected={i === active}
                  aria-label={`${s.titleStrong} ${s.titleLight}`}
                  className={`our-brand__thumb ${i === active ? 'is-active' : ''}`} onClick={() => goTo(i)}>
                  <img src={s.images[0]} alt="" loading="lazy" />
                </button>
              ))}
            </div>
            <div className="our-brand__copy" key={active}>
              <h2 className="our-brand__title">
                <span className="our-brand__title-strong">{story.titleStrong}</span>
                <span className="our-brand__title-light">{story.titleLight}</span>
              </h2>
              <p className="our-brand__text">{story.text}</p>
              <Link to={story.link} className="our-brand__cta">{story.cta}</Link>
            </div>
            <div className="our-brand__progress" aria-hidden="true">
              <span style={{ transform: `scaleX(${progress})` }} />
            </div>
          </div>
          <div className="our-brand__collage" key={`img-${active}`}>
            <div className="our-brand__photo our-brand__photo--main"><img src={story.images[0]} alt={`${story.titleStrong} ${story.titleLight}`} /></div>
            <div className="our-brand__photo"><img src={story.images[1]} alt="" loading="lazy" /></div>
            <div className="our-brand__photo"><img src={story.images[2]} alt="" loading="lazy" /></div>
          </div>
        </div>
      </div>
    </section>
  )
}
