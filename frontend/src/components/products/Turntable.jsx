// Turns a real product photo set with scroll.
//  - "tint" products (one photo set): the liquid is re-coloured per shade with a multiply mask
//  - "shades" products: a ready photo set per shade
// Two layers (this shade / next shade) fade into each other while the product is side-on.
// The shade number is printed back onto the label in the site font.

function Layer({ config, frames, masks, tint, code, view, opacity }) {
  const n = frames.length
  const p = Math.min(n - 1, Math.max(0, view))
  const i0 = Math.floor(p)
  const i1 = Math.min(n - 1, i0 + 1)
  const t = p - i0
  const [vw, vh] = config.size
  return (
    <div className="tt__layer" style={{ opacity }}>
      {frames.map((src, i) => {
        const o = i === i0 ? 1 : i === i1 ? t : 0
        const labels = config.labels?.[i]
        return (
          <div className="tt__frame" key={src} style={{ opacity: o, zIndex: i === i1 ? 2 : 1 }}>
            <img src={src} alt="" draggable="false" />
            {tint && masks?.[i] && (
              <span
                className="tt__tint"
                style={{ background: tint, WebkitMaskImage: `url("${masks[i]}")`, maskImage: `url("${masks[i]}")` }}
              />
            )}
            {labels && (
              <svg className="tt__label" viewBox={`0 0 ${vw} ${vh}`} preserveAspectRatio="none">
                {labels.map((l) => (
                  <text
                    key={l.text || 'code'}
                    x={l.x}
                    y={l.y}
                    fontSize={l.size}
                    textLength={l.text ? l.len : l.len * Math.min(1.2, String(code).length / 3)}
                    lengthAdjust="spacingAndGlyphs"
                    className={l.className}
                  >
                    {l.text || code}
                  </text>
                ))}
              </svg>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Turntable({ config, view, layers, tilt, lift }) {
  const [vw, vh] = config.size
  return (
    <div className="tt" style={{ aspectRatio: `${vw} / ${vh}` }} aria-hidden="true">
      <div className="tt__obj" style={{ transform: `translateY(${lift}px) rotate(${tilt}deg)` }}>
        {layers.map((l, k) =>
          l.opacity > 0.001 ? (
            <Layer
              key={`${l.code}-${k}`}
              config={config}
              frames={config.shadeFrames?.[l.code] || config.frames}
              masks={config.masks}
              tint={l.tint}
              code={l.code}
              view={view}
              opacity={l.opacity}
            />
          ) : null
        )}
      </div>
      <div className="tt__shadow" />
    </div>
  )
}
