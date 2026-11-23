import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// Los cartelitos de la primera vez. `target` es lo que queda iluminado.
const steps = [
  { target: '[data-sound]', shape: 'circle', pad: 4, title: 'El sonido del agua',
    text: 'Está para acompañarte. Con este parlantito puedes apagarlo o volver a encenderlo cuando quieras.' },
  { target: '.paths', shape: 'area', pad: 10, title: 'Tú eliges',
    text: 'Puedes meditar, respirar o escuchar música, lo que más te guste.' },
  { target: '.brand', shape: 'area', pad: 8, title: 'Siempre puedes volver',
    text: 'Cuando quieras regresar al inicio, toca el logo.' },
]
const FADE = 750
const GAP = 16

type Box = { top: number; left: number; width: number; height: number; radius: string }

export function Guide({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const [box, setBox] = useState<Box>()
  const [top, setTop] = useState(0)
  const [closing, setClosing] = useState(false)
  const card = useRef<HTMLDivElement>(null)
  const current = steps[step]

  useLayoutEffect(() => {
    const measure = () => {
      const el = document.querySelector(current.target)
      if (!el || !card.current) return
      const r = el.getBoundingClientRect(), p = current.pad
      const circle = current.shape === 'circle', width = r.width + p * 2, h = circle ? width : r.height + p * 2
      const next = {
        top: r.top + (r.height - h) / 2, left: r.left - p, width, height: h,
        radius: circle ? '50%' : current.shape === 'bar' ? '26px 26px 0 0' : '28px',
      }
      const height = card.current.offsetHeight, below = next.top + next.height + GAP, above = next.top - GAP - height
      setBox(next)
      // abajo de lo iluminado; si no entra, arriba; si tampoco, pegado al borde de abajo
      setTop(below + height <= innerHeight - 8 ? below : above >= 8 ? above : innerHeight - 8 - height)
    }
    measure()
    addEventListener('resize', measure)
    return () => removeEventListener('resize', measure)
  }, [current])

  useEffect(() => { card.current?.focus({ preventScroll: true }) }, [step])

  useEffect(() => {
    if (!closing) return
    const timer = setTimeout(onDone, FADE)
    return () => clearTimeout(timer)
  }, [closing])

  const last = step === steps.length - 1

  return <div className="guide" data-closing={closing} onKeyDown={e => { if (e.key === 'Escape') setClosing(true) }}>
    {box && <i className="spot" style={{ top: box.top, left: box.left, width: box.width, height: box.height, borderRadius: box.radius }} />}
    <div className="note" ref={card} role="dialog" aria-modal="true" aria-labelledby="guide-title" aria-describedby="guide-text" tabIndex={-1} style={{ top }}>
      <div className="note-text" key={step}>
        <h2 id="guide-title">{current.title}</h2>
        <p id="guide-text">{current.text}</p>
      </div>
      <div className="note-foot">
        <span className="progress" aria-label={`${step + 1} de ${steps.length}`}>{steps.map((_, i) => <i key={i} data-active={i === step} />)}</span>
        {!last && <button className="skip" onClick={() => setClosing(true)}>Saltar</button>}
        <button className="ok" onClick={() => last ? setClosing(true) : setStep(step + 1)}>Ok</button>
      </div>
    </div>
  </div>
}
