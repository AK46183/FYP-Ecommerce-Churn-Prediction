import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './FaceCapture.css'

// Live face scan: QR scanner jaisa. Camera khulta hai, oval frame mein chehra aaye, roshni theek ho,
// chehra na hile -> 3-2-1 countdown -> tasveer khud kheench leta hai.
// Chehra dhoondne ke liye Google MediaPipe (browser ke andar chalta hai, tasveer bahar nahi jati).
// MediaPipe load na ho to "Take photo" button se haath se tasveer.

const MP_VERSION = '0.10.14'
const MP_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/vision_bundle.mjs`
const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite'

let detectorPromise = null
function loadDetector() {
  if (!detectorPromise) {
    detectorPromise = (async () => {
      const vision = await import(/* @vite-ignore */ MP_URL)
      const fileset = await vision.FilesetResolver.forVisionTasks(WASM_URL)
      return vision.FaceDetector.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'CPU' },
        runningMode: 'VIDEO',
        minDetectionConfidence: 0.6,
      })
    })().catch((err) => {
      detectorPromise = null
      throw err
    })
  }
  return detectorPromise
}

const CHECK_EVERY_MS = 120
const COUNTDOWN_STEP_MS = 700

// video ka frame -> chhota JPEG (max 1024px) base64
function grabFrame(video, max = 1024) {
  const scale = Math.min(1, max / Math.max(video.videoWidth, video.videoHeight))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(video.videoWidth * scale)
  canvas.height = Math.round(video.videoHeight * scale)
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
  const dataUrl = canvas.toDataURL('image/jpeg', 0.88)
  return { base64: dataUrl.split(',')[1], preview: dataUrl }
}

// chehre wale hisse ki ausat roshni (0-255)
function faceBrightness(video, box, sampler) {
  const ctx = sampler.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(video, box.originX, box.originY, box.width, box.height, 0, 0, 24, 24)
  const px = ctx.getImageData(0, 0, 24, 24).data
  let sum = 0
  for (let i = 0; i < px.length; i += 4) sum += 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]
  return sum / (px.length / 4)
}

// chehre ke baayen aur daayen hisse ki roshni alag alag (ek taraf se roshni / saaya)
function sideLight(video, box, sampler) {
  const ctx = sampler.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(video, box.originX, box.originY, box.width, box.height, 0, 0, 24, 24)
  const px = ctx.getImageData(0, 0, 24, 24).data
  let l = 0
  let r = 0
  for (let y = 0; y < 24; y++) {
    for (let x = 0; x < 24; x++) {
      const i = (y * 24 + x) * 4
      const v = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]
      if (x < 12) l += v
      else r += v
    }
  }
  return { left: l / 288, right: r / 288 }
}

// poore frame ki roshni (chehra na mile to pata chale ke andhera to nahi)
function frameBrightness(video, sampler) {
  const ctx = sampler.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(video, 0, 0, 24, 24)
  const px = ctx.getImageData(0, 0, 24, 24).data
  let sum = 0
  for (let i = 0; i < px.length; i += 4) sum += 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]
  return sum / (px.length / 4)
}

// MediaPipe ke 6 points (0 right eye, 1 left eye, 2 nose, 3 mouth, 4 right ear, 5 left ear; 0-1 mein)
// -> sar tircha / mura hua / upar-neeche to nahi
function pose(keypoints, vw, vh) {
  if (!keypoints || keypoints.length < 4) return null
  const P = (k) => ({ x: k.x * vw, y: k.y * vh })
  const [e1, e2, nose, mouth] = keypoints.slice(0, 4).map(P)
  const eyeDist = Math.hypot(e2.x - e1.x, e2.y - e1.y) || 1
  let roll = (Math.atan2(e2.y - e1.y, e2.x - e1.x) * 180) / Math.PI
  if (roll > 90) roll -= 180
  if (roll < -90) roll += 180
  const mid = { x: (e1.x + e2.x) / 2, y: (e1.y + e2.y) / 2 }
  const yaw = (nose.x - mid.x) / eyeDist // + : naak tasveer mein daayen (insaan apne baayen mura hua)
  const pitch = (nose.y - mid.y) / Math.max(1, mouth.y - mid.y) // aam taur par ~0.45-0.7
  return { roll, yaw, pitch }
}

// ek frame ka faisla: { ok, hint, tone }  tone: 'light' | 'angle' | 'place' (UI icon ke liye)
function judge(detections, video, sampler, last) {
  if (!detections.length) {
    const dark = frameBrightness(video, sampler) < 50
    return dark
      ? { ok: false, hint: 'It is too dark. Move to a brighter place or turn on a light', tone: 'light' }
      : { ok: false, hint: 'Bring your face inside the oval', tone: 'place' }
  }
  if (detections.length > 1) return { ok: false, hint: 'Only one face, please', tone: 'place' }
  const box = detections[0].boundingBox
  const vw = video.videoWidth
  const vh = video.videoHeight
  const size = box.width / Math.min(vw, vh)
  const cx = (box.originX + box.width / 2) / vw
  const cy = (box.originY + box.height / 2) / vh
  if (size < 0.32) return { ok: false, hint: 'Move a little closer', tone: 'place' }
  if (size > 0.85) return { ok: false, hint: 'Move back a little', tone: 'place' }
  if (Math.abs(cx - 0.5) > 0.12 || Math.abs(cy - 0.5) > 0.15) return { ok: false, hint: 'Center your face in the oval', tone: 'place' }

  // roshni
  const light = faceBrightness(video, box, sampler)
  if (light < 60) return { ok: false, hint: 'Your face is too dark. Face a window or a lamp', tone: 'light' }
  if (light > 225) return { ok: false, hint: 'Too bright. Step away from direct light', tone: 'light' }
  const sides = sideLight(video, box, sampler)
  if (Math.abs(sides.left - sides.right) > 55) {
    return { ok: false, hint: 'Light is only on one side of your face. Turn to face the light', tone: 'light' }
  }

  // angle (video aaine jaisa dikhta hai, is liye left/right insaan ke hisaab se)
  const p = pose(detections[0].keypoints, vw, vh)
  if (p) {
    if (Math.abs(p.roll) > 12) return { ok: false, hint: 'Keep your head straight, don\u2019t tilt it', tone: 'angle' }
    if (p.yaw > 0.22) return { ok: false, hint: 'Turn your face a little to your right', tone: 'angle' }
    if (p.yaw < -0.22) return { ok: false, hint: 'Turn your face a little to your left', tone: 'angle' }
    if (p.pitch < 0.3) return { ok: false, hint: 'Lower your chin a little', tone: 'angle' }
    if (p.pitch > 0.85) return { ok: false, hint: 'Lift your chin a little', tone: 'angle' }
  }
  const moved = last.cx === undefined ? 1 : Math.hypot(cx - last.cx, cy - last.cy)
  last.cx = cx
  last.cy = cy
  if (moved > 0.02) return { ok: false, hint: 'Hold still…', tone: 'place', near: true }
  return { ok: true, hint: 'Perfect, hold still', tone: 'good' }
}

export default function FaceCapture({ onCapture, onClose, onUpload }) {
  const videoRef = useRef(null)
  const [stage, setStage] = useState('starting') // starting | scanning | manual | error
  const [hint, setHint] = useState('Starting camera…')
  const [tone, setTone] = useState('place')
  const [count, setCount] = useState(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [aspect, setAspect] = useState(3 / 4)

  useEffect(() => {
    let alive = true
    let stream = null
    let raf = 0
    let lastCheck = 0
    let countdown = null // { start }
    const last = {}
    const sampler = document.createElement('canvas')
    sampler.width = 24
    sampler.height = 24

    const stop = () => {
      cancelAnimationFrame(raf)
      stream?.getTracks().forEach((t) => t.stop())
    }

    const finish = () => {
      const video = videoRef.current
      if (!video || !alive) return
      const shot = grabFrame(video)
      alive = false
      stop()
      onCapture(shot)
    }

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStage('error')
        setError('The camera only works on a secure (https) page. Please upload a photo instead.')
        return
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false,
        })
      } catch (err) {
        if (!alive) return
        setStage('error')
        setError(
          err?.name === 'NotAllowedError'
            ? 'Camera permission was blocked. Allow the camera in your browser settings, or upload a photo instead.'
            : err?.name === 'NotFoundError'
              ? 'No camera was found on this device. Please upload a photo instead.'
              : 'The camera could not be started. Please upload a photo instead.',
        )
        return
      }
      if (!alive) return stop()
      const video = videoRef.current
      video.srcObject = stream
      await video.play().catch(() => {})
      await new Promise((r) => (video.videoWidth ? r() : video.addEventListener('loadedmetadata', r, { once: true })))
      if (!alive) return
      setAspect(video.videoWidth / video.videoHeight)
      setReady(true)

      let detector = null
      try {
        detector = await loadDetector()
      } catch {
        if (!alive) return
        setStage('manual')
        setHint('Center your face in the oval, then tap "Take photo"')
        return
      }
      if (!alive) return
      setStage('scanning')
      setHint('Bring your face inside the oval')

      const loop = (now) => {
        if (!alive) return
        raf = requestAnimationFrame(loop)
        if (now - lastCheck < CHECK_EVERY_MS || video.readyState < 2) return
        lastCheck = now
        let verdict
        try {
          verdict = judge(detector.detectForVideo(video, now).detections || [], video, sampler, last)
        } catch {
          return
        }
        if (!verdict.ok) {
          if (countdown) {
            countdown = null
            setCount(null)
          }
          setHint(verdict.hint)
          setTone(verdict.tone || 'place')
          return
        }
        setHint(verdict.hint)
        setTone('good')
        if (!countdown) countdown = { start: now }
        const left = 3 - Math.floor((now - countdown.start) / COUNTDOWN_STEP_MS)
        if (left <= 0) {
          setCount(null)
          finish()
        } else {
          setCount(left)
        }
      }
      raf = requestAnimationFrame(loop)
    }

    start()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      alive = false
      stop()
      window.removeEventListener('keydown', onKey)
    }
    // onCapture / onClose parent se aate hain; camera sirf ek dafa shuru ho
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const takeNow = () => {
    const video = videoRef.current
    if (!video?.videoWidth) return
    const shot = grabFrame(video)
    video.srcObject?.getTracks().forEach((t) => t.stop())
    onCapture(shot)
  }

  // body mein render: chat widget ke z-index se bahar, poori screen par
  return createPortal(
    <div className="face-capture" role="dialog" aria-modal="true" aria-label="Live skin scan">
      <div className="face-capture__box">
        <header>
          <strong>Live skin scan</strong>
          <button type="button" onClick={onClose} aria-label="Close camera">×</button>
        </header>

        {stage === 'error' ? (
          <p className="face-capture__error">{error}</p>
        ) : (
          <div className="face-capture__stage" style={{ aspectRatio: aspect }}>
            <video ref={videoRef} playsInline muted autoPlay />
            <svg className={`face-capture__oval${count ? ' is-good' : ''}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <mask id="face-capture-hole">
                  <rect width="100" height="100" fill="white" />
                  <ellipse cx="50" cy="50" rx={aspect > 1 ? 21 : 32} ry="36" fill="black" />
                </mask>
              </defs>
              <rect width="100" height="100" mask="url(#face-capture-hole)" className="face-capture__shade" />
              <ellipse cx="50" cy="50" rx={aspect > 1 ? 21 : 32} ry="36" className="face-capture__ring" vectorEffect="non-scaling-stroke" />
            </svg>
            {count && <span className="face-capture__count" aria-live="assertive">{count}</span>}
            {!ready && <span className="face-capture__loading">Starting camera…</span>}
          </div>
        )}

        {stage !== 'error' && (
          <p className={`face-capture__hint is-${stage === 'scanning' ? tone : 'place'}`} aria-live="polite">
            <span className="face-capture__hint-icon" aria-hidden="true">
              {stage !== 'scanning' ? '📷' : tone === 'light' ? '💡' : tone === 'angle' ? '↻' : tone === 'good' ? '✓' : '◎'}
            </span>
            {hint}
          </p>
        )}

        <footer>
          {stage === 'error' ? (
            <button type="button" className="is-primary" onClick={onUpload || onClose}>Upload a photo instead</button>
          ) : (
            <>
              <button type="button" className={stage === 'manual' ? 'is-primary' : ''} onClick={takeNow} disabled={!ready}>
                Take photo
              </button>
              <button type="button" className="is-quiet" onClick={onClose}>Cancel</button>
            </>
          )}
        </footer>
        <small>Tips: stand facing a window or a lamp, look straight at the camera, no filters or heavy makeup. Photos are never saved.</small>
      </div>
    </div>,
    document.body,
  )
}
