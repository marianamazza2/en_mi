import { useEffect, useRef } from 'react'
import type { Theme } from './lib'
import { glow, HORIZON, layer, paint, random } from './scene/paint'
import { palettes } from './scene/palette'

type Props = { theme: Theme; calm: boolean; shade: 'none' | 'home' | 'soft' | 'deep'; earned: number }
const order: Theme[] = ['dia', 'atardecer', 'noche']
const r = random(4567)
const specks = Array.from({ length: 260 }, () => [r(), r(), r(), r()])

export function Scene(props: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const latest = useRef(props)
  latest.current = props

  useEffect(() => {
    const el = canvas.current!, main = el.getContext('2d')!
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const weight = order.map(t => t === latest.current.theme ? 1 : 0)
    let w = 0, h = 0, dpr = 1, frame = 0, last = performance.now(), time = 0, speed = 1, orbLight = 1
    let painted: Partial<Record<Theme, ReturnType<typeof paint>>> = {}
    let buffer: ReturnType<typeof layer>

    const render = (g: CanvasRenderingContext2D, theme: Theme) => {
      const art = (painted[theme] ??= paint(theme, w, h, dpr)), p = palettes[theme], night = theme === 'noche'
      const hz = Math.round(h * HORIZON * dpr) / dpr, u = Math.min(w, h * .65), ox = p.orb.x * w, oy = p.orb.y * h
      g.drawImage(art.back, 0, 0, w, h)

      if (night) {
        for (let i = 0; i < 65 + Math.min(latest.current.earned, 100); i++) {
          const [a, b, c, d] = specks[i], mine = i >= 65, x = a * w, y = b * hz * .88, s = mine ? 1.7 : .7 + c * .8
          const shine = .55 + .45 * Math.sin(time * (.4 + d) + i)
          glow(g, x, y, s * 6, s * 6, mine ? '255,214,140' : '180,210,255', .3 * shine)
          g.globalAlpha = .35 + .65 * shine; g.fillStyle = mine ? '#ffe0a3' : '#f2f7ff'
          g.beginPath(); g.arc(x, y, s, 0, 7); g.fill()
        }
        g.globalAlpha = 1
        const fall = time % 19 / 1.3 // una estrella fugaz cada tanto
        if (fall < 1) {
          const x = w * (.9 - fall * .55), y = hz * (.08 + fall * .2), f = g.createLinearGradient(x, y, x + 70, y - 28)
          f.addColorStop(0, `rgba(230,242,255,${Math.sin(fall * Math.PI)})`); f.addColorStop(1, 'rgba(230,242,255,0)')
          g.strokeStyle = f; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 70, y - 28); g.stroke()
        }
      }

      glow(g, ox, oy, u * .75, u * .6, p.orb.glow, p.orb.glowAlpha)
      if (p.orb.r) {
        const radius = p.orb.r * u, f = g.createRadialGradient(ox - radius * .3, oy - radius * .3, 0, ox, oy, radius)
        f.addColorStop(0, night ? '#fbfdff' : '#fff8dc'); f.addColorStop(1, night ? '#bfd2ee' : '#ffd29a')
        if (night) g.globalAlpha = orbLight
        g.fillStyle = f; g.beginPath(); g.arc(ox, oy, radius, 0, 7); g.fill()
        if (night) for (const [dx, dy, s] of [[-.3, -.1, .24], [.25, .3, .18], [.2, -.4, .12]])
          glow(g, ox + dx * radius, oy + dy * radius, s * radius * 1.6, s * radius * 1.4, '100,130,175', .3)
        g.globalAlpha = 1
      }

      // nubes
      for (let i = 0; i < 6; i++) {
        const [a, b, c] = specks[i + 200], span = u * (.2 + c * .22)
        const x = (a * (w + span * 2) + time * (1.5 + c * 2.5)) % (w + span * 2) - span
        const y = hz * [.1, .25, .5, .68, .77, .84][i] + b * 10, faint = i < 2 ? .35 : 1
        glow(g, x, y + span * .05, span, span * .15, p.cloudShade, p.cloudAlpha * faint * .7)
        for (let j = 0; j < 11; j++) {
          const [m, n, o] = specks[i * 11 + j], k = j / 10 - .5
          glow(g, x + k * span * 1.3, y - (1 - Math.abs(k) * 2) * span * .06 * m, span * (.16 + n * .17), span * (.035 + o * .045), p.cloud, p.cloudAlpha * faint)
        }
      }

      g.drawImage(art.land, 0, 0, w, h)

      // lago: degradé, reflejo ondulado y brillos
      const lake = g.createLinearGradient(0, hz, 0, h)
      p.lake.forEach((color, i) => lake.addColorStop([0, .4, 1][i], color))
      g.fillStyle = lake; g.fillRect(0, hz, w, h - hz)
      const step = Math.round(2 * dpr) / dpr
      for (let y = 0; y < h - hz; y += step) {
        const from = hz - y * 1.15 - step
        if (from < hz - h * .23) break
        g.globalAlpha = .48 * (1 - y / (h - hz))
        g.drawImage(art.land, 0, from * dpr, w * dpr, step * dpr, Math.sin(y * .22 - time * 1.4) * (1 + y * .022), hz + y, w, step)
      }
      g.globalAlpha = 1
      glow(g, ox, hz + h * .015, u * .2, h * .13, p.orb.glow, p.orb.glowAlpha * .6)
      g.fillStyle = `rgb(${p.glint})`
      for (let i = 0; i < 190; i++) {
        const [a, b, c, d] = specks[i], k = b * b, path = i < 120
        const x = path ? ox + (a - .5) * u * (.08 + k * .32) : a * w
        const width = 2 + c * (4 + k * 16)
        g.globalAlpha = Math.max(0, Math.sin(time * (.5 + d * .8) + i)) * (path ? .55 : .2) * (1 - k * .55)
        g.fillRect(x + Math.sin(time * .5 + i) * 3 - width / 2, hz + 2 + k * (h - hz), width, 1)
      }
      g.globalAlpha = 1

      for (let i = 0; i < 3; i++) // bruma
        glow(g, w * (.2 + i * .33) + Math.sin(time * .07 + i * 2) * u * .15, hz, w * .4, h * .022, p.mist, .2)

      if (!night) {
        g.strokeStyle = theme === 'dia' ? '#d8eeee99' : '#2b173f99'; g.lineWidth = 1.1
        for (let i = 0; i < 5; i++) {
          const x = (time * 5 + i * 17 + (i % 2) * 9 + w * .25) % (w + 160) - 60, y = hz * .72 + Math.abs(i - 2) * 8, flap = Math.sin(time * 2.6 + i) * 2.5
          g.beginPath(); g.moveTo(x - 5, y - flap); g.quadraticCurveTo(x - 2, y - 2, x, y); g.quadraticCurveTo(x + 2, y - 2, x + 5, y - flap); g.stroke()
        }
      }

      g.drawImage(art.front, 0, 0, w, h)
      // luciérnagas de noche, polen de día
      for (let i = 0; i < (night ? 22 : 12); i++) {
        const [a, b, c] = specks[i + 120], x = a * w + Math.sin(time * .25 + i) * 22, y = h * (.78 + b * .2) + Math.cos(time * .33 + i) * 14
        const shine = Math.max(0, Math.sin(time * (.45 + c * .4) + i * 2))
        glow(g, x, y, 8, 8, night ? '224,239,160' : p.glint, shine * .5)
        glow(g, x, y, 2, 2, night ? '250,255,215' : p.glint, shine)
      }
    }

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw)
      if (now - last < 40 && w) return
      const dt = Math.max(0, Math.min((now - last) / 1000, .1)), state = latest.current
      // detrás de una lista la luna casi se apaga: si no, cae justo bajo los minutos
      orbLight += ((state.shade === 'deep' ? .12 : 1) - orbLight) * Math.min(1, dt * 2.5)
      last = now; speed += ((state.calm ? .4 : 1) - speed) * dt * .15
      if (!still) time += dt * speed
      if (w !== el.clientWidth || h !== el.clientHeight) {
        w = el.clientWidth; h = el.clientHeight; dpr = Math.min(devicePixelRatio, 1.75)
        if (!w || !h) return
        el.width = Math.round(w * dpr); el.height = Math.round(h * dpr)
        buffer = layer(w, h, dpr); painted = {}
      }
      main.setTransform(dpr, 0, 0, dpr, 0, 0)
      let total = 0
      order.forEach((theme, i) => {
        weight[i] += ((theme === state.theme ? 1 : 0) - weight[i]) * dt * 2
        if (weight[i] < .004) return
        if (weight[i] > .996) { render(main, theme); total = 1; return }
        render(buffer.g, theme); total += weight[i]
        main.globalAlpha = weight[i] / total; main.drawImage(buffer.c, 0, 0, w, h); main.globalAlpha = 1
      })
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [])

  return <>
    <canvas className="scene" ref={canvas} aria-hidden="true" />
    <div className={`veil ${props.shade}`} aria-hidden="true" />
  </>
}
