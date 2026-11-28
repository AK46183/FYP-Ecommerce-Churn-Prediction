import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { tryOnLook } from '../../utils/tryOnLooks.js'
import { drawFrame } from './makeupDraw.js'
import './VirtualTryOn.css'

// Virtual try-on: camera khulta hai, MediaPipe chehre ke 478 points dhoondta hai,
// aur product ka rang live chehre par lagta hai. Sab kuch browser ke andar: video kahin nahi jati.
const MP_VERSION = '0.10.14' // FaceCapture.jsx wala version
const MP_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/vision_bundle.mjs`
const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

let landmarkerPromise = null
function loadLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const vision = await import(/* @vite-ignore */ MP_URL)
      const fileset = await vision.FilesetResolver.forVisionTasks(WASM_URL)
      const make = (delegate) => vision.FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate },
        runningMode: 'VIDEO',
        numFaces: 1,
      })
      try {
        return await make('GPU')
      } catch {
        return make('CPU') // GPU na chale to CPU
      }
    })().catch((err) => {
      landmarkerPromise = null
      throw err
    })
  }
  return landmarkerPromise
}

const EFFECT_HINT = {
  mascara: 'Look straight at the camera to see your lashes.',
  lashes: 'Look straight at the camera to see your lashes.',
  liner: 'Look straight at the camera to see the liner.',
  shadow: 'Close your eyes slowly to see the shadow on your lids.',
  palette: 'Close your eyes slowly to see the shadow on your lids.',
}

export default function VirtualTryOn({ product, onClose }) {
  const look = tryOnLook(product)
  const [shade, setShade] = useState(0)
  const [status, setStatus] = useState('loading') // loading | live | noface | error
  const [error, setError] = useState('')
  const [bare, setBare] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const optsRef = useRef({})

  const color = look?.shades[shade]?.color
  const color2 = look?.effect === 'palette' ? look.shades[(shade + 1) % look.shades.length]?.color : undefined
  optsRef.current = { effect: look?.effect, color, color2, bare }

  // Esc se band, aur peeche page scroll na ho
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  useEffect(() => {
    let stream = null
    let raf = 0
    let stopped = false
    let lastFace = 0

    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('Your browser cannot open the camera. Please try Chrome or Safari.')
        const [landmarker, media] = await Promise.all([
          loadLandmarker(),
          navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 960 }, height: { ideal: 720 } }, audio: false }),
        ])
        stream = media
        if (stopped) return
        const video = videoRef.current
        video.srcObject = stream
        await video.play()
        const canvas = canvasRef.current
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        setStatus('live')

        let shown = 'live'
        let lastTime = -1
        const loop = () => {
          if (stopped) return
          let lm = null
          if (video.readyState >= 2 && video.currentTime !== lastTime) {
            lastTime = video.currentTime
            const res = landmarker.detectForVideo(video, performance.now())
            lm = res.faceLandmarks?.[0] || null
            const now = performance.now()
            if (lm) lastFace = now
            // state sirf badalne par set karo (har frame par nahi)
            const next = lm ? 'live' : now - lastFace > 800 ? 'noface' : shown
            if (next !== shown) {
              shown = next
              setStatus(next)
            }
            drawFrame(ctx, video, lm, optsRef.current)
          }
          raf = requestAnimationFrame(loop)
        }
        loop()
      } catch (err) {
        if (stopped) return
        const denied = err?.name === 'NotAllowedError' || err?.name === 'SecurityError'
        setError(denied
          ? 'Camera permission was blocked. Please allow the camera in your browser settings and try again.'
          : err?.name === 'NotFoundError'
            ? 'No camera was found on this device.'
            : err?.message?.startsWith('Your browser') ? err.message : 'The try-on could not start. Please check your internet and try again.')
        setStatus('error')
      }
    }
    start()
    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  function savePhoto() {
    const canvas = canvasRef.current
    if (!canvas || status === 'error') return
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `minaysh-try-on-${product.subCategory.replace(/\W+/g, '-').toLowerCase()}.png`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }, 'image/png')
  }

  if (!look) return null

  return createPortal(
    <div className="vto" role="dialog" aria-modal="true" aria-label={`Virtual try-on: ${product.name}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="vto__box">
        <header className="vto__head">
          <div>
            <span className="vto__eyebrow">Virtual try-on</span>
            <strong>{product.name}</strong>
          </div>
          <button type="button" className="vto__close" onClick={onClose} aria-label="Close try-on">×</button>
        </header>

        <div className="vto__stage">
          <video ref={videoRef} playsInline muted className="vto__video" />
          <canvas ref={canvasRef} className="vto__canvas" />
          {status === 'loading' && <p className="vto__msg">Opening camera…</p>}
          {status === 'noface' && <p className="vto__msg vto__msg--soft">Move your face into the frame</p>}
          {status === 'error' && <p className="vto__msg vto__msg--error">{error}</p>}
          {status === 'live' && EFFECT_HINT[look.effect] && <p className="vto__hint">{EFFECT_HINT[look.effect]}</p>}
        </div>

        <div className="vto__controls">
          <div className="vto__shades" role="radiogroup" aria-label="Shade">
            {look.shades.map((s, i) => (
              <button
                key={`${s.label}-${i}`}
                type="button"
                role="radio"
                aria-checked={i === shade}
                title={s.label}
                className={`vto__swatch${i === shade ? ' is-selected' : ''}`}
                style={{ '--swatch': s.color }}
                onClick={() => setShade(i)}
              />
            ))}
          </div>
          {look.sample && <p className="vto__note">Sample colours: the real shade may look a little different.</p>}

          <div className="vto__actions">
            <button
              type="button"
              className="vto__btn"
              onPointerDown={() => setBare(true)}
              onPointerUp={() => setBare(false)}
              onPointerLeave={() => setBare(false)}
              onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setBare(true)}
              onKeyUp={() => setBare(false)}
              disabled={status !== 'live' && status !== 'noface'}
            >
              Hold to compare
            </button>
            <button type="button" className="vto__btn" onClick={savePhoto} disabled={status !== 'live' && status !== 'noface'}>
              Save photo
            </button>
            <Link to={`/product/${product.id}`} className="vto__btn vto__btn--dark" onClick={onClose}>
              View product
            </Link>
          </div>
          <p className="vto__privacy">Runs in your browser. Your camera video is not saved or sent anywhere.</p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
