import { useLayoutEffect, useRef, useState } from 'react'
import { artwork, ready, type CoverName } from './artwork'

export type { CoverName }

// Se pintan de a una por cuadro, para no trabar nada.
let queue = Promise.resolve()
const inTurn = (job: () => void) => {
  queue = queue.then(() => new Promise<void>(next => setTimeout(() => { try { job() } finally { next() } }, 16)))
}

export function prepaint(list: { name: CoverName; ratio: number }[]) {
  const timers = list.map(({ name, ratio }, i) => setTimeout(() => artwork(name, ratio), i * 90))
  return () => timers.forEach(clearTimeout)
}

export function Cover({ name, ratio }: { name: CoverName; ratio: number }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [shown, setShown] = useState(() => ready(name, ratio))
  useLayoutEffect(() => {
    let alive = true
    const show = () => {
      if (!alive || !canvas.current) return
      canvas.current.getContext('2d')!.drawImage(artwork(name, ratio), 0, 0)
      setShown(true)
    }
    if (ready(name, ratio)) show()
    else inTurn(show)
    return () => { alive = false }
  }, [name, ratio])
  return <canvas ref={canvas} className="cover-art" data-shown={shown} width={Math.round(480 * ratio)} height={480} aria-hidden="true" />
}
