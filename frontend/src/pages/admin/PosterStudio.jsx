import { useEffect, useRef, useState } from 'react'
import { X, Download, Save, LayoutTemplate } from 'lucide-react'
import { eventImages } from '../../data/saleEvents.js'

// Poster ka size (3:4)
const W = 600
const H = 800

const templates = [
  { key: 'photo', label: 'Full photo' },
  { key: 'split', label: 'Photo + panel' },
  { key: 'circle', label: 'Minimal circle' },
]

const palettes = [
  { bg: '#0f3d3a', bg2: '#2e8b7a', text: '#ffffff', accent: '#7cc9b8' },
  { bg: '#eef8f5', bg2: '#a8e0d2', text: '#0b2f2c', accent: '#1f7a6e' },
  { bg: '#2a1a14', bg2: '#e0793a', text: '#ffffff', accent: '#f4a46a' },
  { bg: '#ffffff', bg2: '#f6d3e4', text: '#5b1e45', accent: '#c2417f' },
]

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

// picture ko jagah mein "cover" kar ke draw karo
function drawCover(ctx, img, x, y, w, h) {
  const r = Math.max(w / img.width, h / img.height)
  const iw = img.width * r
  const ih = img.height * r
  ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih)
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  let yy = y
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy)
      line = word
      yy += lineHeight
    } else {
      line = test
    }
  }
  ctx.fillText(line, x, yy)
  return yy
}

export default function PosterStudio({ event, onClose, onSave }) {
  const canvasRef = useRef(null)
  const [template, setTemplate] = useState('photo')
  const [palette, setPalette] = useState(0)
  const [image, setImage] = useState(event.images?.[0] || eventImages[0])
  const [title, setTitle] = useState(event.name)
  const [subtitle, setSubtitle] = useState(event.tagline || '')
  const [offer, setOffer] = useState(event.discount ? `UP TO ${event.discount}% OFF` : 'COMING SOON')
  const [dateText, setDateText] = useState(
    new Date(`${event.start}T00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // har tabdeeli pe poster dobara draw karo
  useEffect(() => {
    let cancelled = false
    const draw = async () => {
      await document.fonts?.ready
      const img = await loadImage(image)
      if (cancelled) return
      const ctx = canvasRef.current.getContext('2d')
      const p = palettes[palette]
      ctx.clearRect(0, 0, W, H)
      ctx.textBaseline = 'alphabetic'

      if (template === 'photo') {
        if (img) drawCover(ctx, img, 0, 0, W, H)
        const g = ctx.createLinearGradient(0, 0, 0, H)
        g.addColorStop(0, 'rgba(0,0,0,0.35)')
        g.addColorStop(0.45, 'rgba(0,0,0,0)')
        g.addColorStop(1, p.bg)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
        // offer upar
        ctx.fillStyle = p.accent
        ctx.font = '700 22px Inter, sans-serif'
        ctx.fillText(offer, 44, 76)
        // title neeche
        ctx.fillStyle = p.text === '#0b2f2c' ? '#ffffff' : p.text
        ctx.font = '800 58px Inter, sans-serif'
        const last = wrapText(ctx, title.toUpperCase(), 44, H - 210, W - 88, 62)
        ctx.font = '400 30px "Great Vibes", cursive'
        ctx.fillText(subtitle, 44, last + 50)
        ctx.font = '600 18px Inter, sans-serif'
        ctx.fillText(dateText, 44, H - 44)
      }

      if (template === 'split') {
        const split = H * 0.58
        if (img) drawCover(ctx, img, 0, 0, W, split)
        ctx.fillStyle = p.bg
        ctx.fillRect(0, split, W, H - split)
        // offer badge
        ctx.fillStyle = p.accent
        ctx.beginPath()
        ctx.roundRect(40, split - 34, 300, 68, 34)
        ctx.fill()
        ctx.fillStyle = p.bg
        ctx.font = '800 24px Inter, sans-serif'
        ctx.fillText(offer, 62, split + 8)
        ctx.fillStyle = p.text
        ctx.font = '800 50px Inter, sans-serif'
        const last = wrapText(ctx, title.toUpperCase(), 44, split + 100, W - 88, 54)
        ctx.font = '400 32px "Great Vibes", cursive'
        ctx.fillText(subtitle, 44, last + 48)
        ctx.font = '600 18px Inter, sans-serif'
        ctx.globalAlpha = 0.8
        ctx.fillText(dateText, 44, H - 40)
        ctx.globalAlpha = 1
      }

      if (template === 'circle') {
        const g = ctx.createLinearGradient(0, 0, W, H)
        g.addColorStop(0, p.bg)
        g.addColorStop(1, p.bg2)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
        // gol picture
        ctx.save()
        ctx.beginPath()
        ctx.arc(W / 2, 280, 190, 0, Math.PI * 2)
        ctx.clip()
        if (img) drawCover(ctx, img, W / 2 - 190, 90, 380, 380)
        ctx.restore()
        ctx.strokeStyle = p.accent
        ctx.lineWidth = 6
        ctx.beginPath()
        ctx.arc(W / 2, 280, 196, 0, Math.PI * 2)
        ctx.stroke()
        ctx.textAlign = 'center'
        ctx.fillStyle = p.text
        ctx.font = '800 46px Inter, sans-serif'
        const last = wrapText(ctx, title.toUpperCase(), W / 2, 545, W - 80, 50)
        ctx.font = '400 34px "Great Vibes", cursive'
        ctx.fillText(subtitle, W / 2, last + 48)
        ctx.fillStyle = p.accent
        ctx.font = '800 26px Inter, sans-serif'
        ctx.fillText(offer, W / 2, H - 82)
        ctx.fillStyle = p.text
        ctx.font = '600 17px Inter, sans-serif'
        ctx.fillText(dateText, W / 2, H - 44)
        ctx.textAlign = 'left'
      }

      // chhota brand naam
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      if (template === 'circle' && palettes[palette].text !== '#ffffff') ctx.fillStyle = p.text
      ctx.font = '700 15px Inter, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText('MINAYSH', W - 40, 44)
      ctx.textAlign = 'left'
    }
    draw()
    return () => {
      cancelled = true
    }
  }, [template, palette, image, title, subtitle, offer, dateText])

  // Esc se band
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const url = canvasRef.current.toDataURL('image/jpeg', 0.82)
      await onSave(url)
    } catch (e) {
      setError(e.message || 'Poster save nahi hua')
      setSaving(false)
    }
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = canvasRef.current.toDataURL('image/png')
    a.download = `${event.name.replace(/\s+/g, '-').toLowerCase()}-poster.png`
    a.click()
  }

  return (
    <div className="ps" role="dialog" aria-modal="true" aria-label="Poster designer">
      <header className="ps-top">
        <div>
          <span className="sl-eyebrow">Poster designer</span>
          <h2>{event.name}</h2>
        </div>
        <button type="button" className="ps-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </header>

      <div className="ps-body">
        <div className="ps-canvas">
          <canvas ref={canvasRef} width={W} height={H} />
        </div>

        <div className="ps-tools">
          <div className="ps-group">
            <span className="ps-label"><LayoutTemplate size={13} /> Layout</span>
            <div className="ps-chips">
              {templates.map((t) => (
                <button key={t.key} type="button" className={template === t.key ? 'is-active' : ''} onClick={() => setTemplate(t.key)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ps-group">
            <span className="ps-label">Colours</span>
            <div className="ps-swatches">
              {palettes.map((p, i) => (
                <button
                  key={p.bg + p.accent}
                  type="button"
                  className={palette === i ? 'is-active' : ''}
                  style={{ background: `linear-gradient(135deg, ${p.bg} 50%, ${p.accent} 50%)` }}
                  onClick={() => setPalette(i)}
                  aria-label={`Colour ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="ps-group">
            <span className="ps-label">Picture</span>
            <div className="ps-images">
              {eventImages.map((src) => (
                <button
                  key={src}
                  type="button"
                  className={image === src ? 'is-active' : ''}
                  style={{ backgroundImage: `url(${src})` }}
                  onClick={() => setImage(src)}
                  aria-label="Use this picture"
                />
              ))}
            </div>
          </div>

          <label className="ps-group">
            <span className="ps-label">Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={40} />
          </label>
          <label className="ps-group">
            <span className="ps-label">Tagline</span>
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} maxLength={40} />
          </label>
          <div className="ps-row">
            <label className="ps-group">
              <span className="ps-label">Offer</span>
              <input value={offer} onChange={(e) => setOffer(e.target.value)} maxLength={22} />
            </label>
            <label className="ps-group">
              <span className="ps-label">Date</span>
              <input value={dateText} onChange={(e) => setDateText(e.target.value)} maxLength={30} />
            </label>
          </div>

          {error && <p className="sl-error">{error}</p>}

          <div className="ps-actions">
            <button type="button" className="sl-btn sl-btn--ghost" onClick={handleDownload}>
              <Download size={15} /> Download
            </button>
            <button type="button" className="sl-btn" onClick={handleSave} disabled={saving}>
              <Save size={15} /> {saving ? 'Saving…' : 'Save to event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}