import type { Theme } from '../lib'
import { palettes } from './palette'

type G = CanvasRenderingContext2D
type Point = [number, number]
export const HORIZON = .72

export const random = (seed: number) => () => (seed = (seed * 16807) % 2147483647) / 2147483647

export function layer(w: number, h: number, dpr: number) {
  const c = document.createElement('canvas')
  c.width = Math.round(w * dpr); c.height = Math.round(h * dpr)
  const g = c.getContext('2d')!
  g.scale(dpr, dpr)
  return { c, g }
}

export function glow(g: G, x: number, y: number, rx: number, ry: number, rgb: string, a: number) {
  if (rx <= 0 || ry <= 0) return
  g.save(); g.translate(x, y); g.scale(rx, ry)
  const f = g.createRadialGradient(0, 0, 0, 0, 0, 1)
  f.addColorStop(0, `rgba(${rgb},${a})`); f.addColorStop(.45, `rgba(${rgb},${a * .4})`); f.addColorStop(1, `rgba(${rgb},0)`)
  g.fillStyle = f; g.fillRect(-1, -1, 2, 2); g.restore()
}

function vertical(g: G, top: number, bottom: number, colors: string[]) {
  const f = g.createLinearGradient(0, top, 0, bottom)
  colors.forEach((c, i) => f.addColorStop(i / (colors.length - 1), c))
  return f
}

function polygon(g: G, points: Point[]) {
  g.beginPath(); points.forEach(([x, y]) => g.lineTo(x, y)); g.closePath()
}

/** Parte cada tramo al medio varias veces para que la cresta no sea recta. */
function rugged(points: Point[], next: () => number) {
  let out = points
  for (let pass = 0; pass < 4; pass++) out = out.flatMap((p, i): Point[] => {
    const q = out[i + 1]
    return q ? [p, [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + (next() - .5) * Math.abs(q[0] - p[0]) * .23]] : [p]
  })
  return out
}

function pine(g: G, x: number, base: number, size: number, next: () => number) {
  g.fillRect(x - size * .012, base - size * .8, size * .024, size * .8)
  for (let i = 0; i < 17; i++) {
    const k = i / 17, y = base - size + k * size * .87, half = size * (.025 + k * .17) * (.75 + next() * .4)
    polygon(g, [[x, y - size * .035], [x + half * .45, y + size * .035], [x + half, y + size * .085], [x, y + size * .06], [x - half, y + size * .085], [x - half * .45, y + size * .035]])
    g.fill()
  }
}

export function paint(theme: Theme, w: number, h: number, dpr: number) {
  const p = palettes[theme], hz = h * HORIZON, u = Math.min(w, h * .65)
  const back = layer(w, h, dpr), land = layer(w, h, dpr), front = layer(w, h, dpr)
  let g = back.g, next = random(91)

  g.fillStyle = vertical(g, 0, hz, p.sky); g.fillRect(0, 0, w, hz + 2)
  if (theme === 'noche') {
    // Vía Láctea
    for (let i = 0; i < 95; i++) {
      const k = next()
      glow(g, w * (-.1 + k * 1.15) + (next() - .5) * u * .16, hz * (.82 - k * .85) + (next() - .5) * u * .16, u * (.07 + next() * .12), u * .06, i % 4 ? '110,145,205' : '160,135,200', .07)
    }
    for (let i = 0; i < 1300; i++) {
      const band = i < 700, k = next(), spread = (next() + next() + next() - 1.5) * u * .22
      g.globalAlpha = .12 + next() * .5; g.fillStyle = i % 7 ? '#dce9ff' : '#ffe6c4'
      const r = band ? .3 + next() * .4 : .3 + next() ** 4 * .9
      g.beginPath(); g.arc(band ? w * (-.1 + k * 1.15) : next() * w, band ? hz * (.82 - k * .85) + spread : next() * hz, r, 0, 7); g.fill()
    }
    g.globalAlpha = 1
  }

  g = land.g
  const ranges: { points: Point[]; colors: string[]; snow: number }[] = [
    { colors: p.far, snow: 0, points: [[-.08, .09], [.1, .14], [.22, .1], [.38, .175], [.5, .1], [.63, .13], [.78, .085], [.94, .15], [1.08, .09]] },
    { colors: p.mid, snow: .105, points: [[-.08, .12], [.05, .15], [.19, .205], [.3, .11], [.39, .075], [.49, .035], [.62, .03], [.72, .085], [.87, .165], [.96, .12], [1.08, .15]] },
    { colors: p.near, snow: 0, points: [[-.08, .085], [.06, .09], [.17, .06], [.31, .035], [.44, .012], [.6, .008], [.75, .03], [.88, .075], [1.08, .06]] },
  ]
  ranges.forEach((range, index) => {
    next = random(301 + index * 73)
    const tops = range.points.map(([x, y]): Point => [x * w, hz - y * h])
    const ridge = rugged(tops, next)
    g.save(); polygon(g, [...ridge, [w * 1.1, hz + 2], [-w * .1, hz + 2]])
    g.fillStyle = vertical(g, hz - h * .2, hz, range.colors); g.fill(); g.clip()
    if (range.snow) {
      const line: Point[] = []
      for (let x = -u * .1; x < w + u * .1; x += 4) line.push([x, hz - range.snow * h + Math.sin(x * .05) * 7 + Math.sin(x * .17) * 3 + (next() - .5) * 5])
      polygon(g, [[-u * .1, 0], [w + u * .1, 0], ...line.reverse()])
      g.fillStyle = p.snow; g.globalAlpha = .78; g.fill(); g.globalAlpha = 1
    }
    tops.forEach(([x, y], i) => {
      if (!i || i === tops.length - 1 || y >= tops[i - 1][1] || y >= tops[i + 1][1]) return
      const spine = rugged([[x, y], [x + u * .025, y + (hz - y) * .4], [x - u * .02, hz]], next)
      polygon(g, [...spine, [tops[i + 1][0] + u * .08, hz], [tops[i + 1][0], tops[i + 1][1]], [x + 2, y - 10]])
      g.fillStyle = `rgba(${p.face},${index ? .34 : .14})`; g.fill()
    })
    // vetas en la roca y la nieve
    for (let i = 0; i < 150; i++) {
      const [x, y] = ridge[Math.floor(next() * ridge.length)], length = (hz - y) * (.15 + next() * .65), lean = (next() - .3) * length * .45
      polygon(g, [[x, y], [x + lean * .55 + 2 + next() * 4, y + length * .5], [x + lean, y + length], [x + lean * .4, y + length * .45]])
      g.fillStyle = `rgba(${p.face},${.035 + next() * .07})`; g.fill()
    }
    g.restore()
    glow(g, w * (.3 + index * .22), hz - h * .012, w * .7, h * .035, p.mist, index === 2 ? .14 : .3)
  })
  next = random(777); g.fillStyle = p.shore
  for (let x = -4; x < w + 4; x += 3) {
    const edge = Math.abs(x / w - .56)
    pine(g, x + next() * 3, hz + 2, h * (.005 + next() * .014 + edge * .025), next)
  }

  g = front.g; next = random(1234)
  for (const side of [0, 1]) {
    const X = (k: number) => side ? w - k * u * .72 : k * u
    g.beginPath(); g.moveTo(X(-.05), h * .845)
    g.bezierCurveTo(X(.12), h * .85, X(.1), h * .91, X(.27), h * .93)
    g.bezierCurveTo(X(.4), h * .95, X(.36), h * .98, X(.55), h + 4)
    g.lineTo(X(-.05), h + 4); g.closePath()
    g.fillStyle = vertical(g, h * .84, h, p.bank); g.fill()
    for (let i = 0; i < 14; i++) {
      const k = next() * .3, r = u * (.008 + next() * .02)
      g.fillStyle = p.bank[1]; g.beginPath(); g.ellipse(X(k), h * (.875 + k * .3) + next() * 8, r * 1.7, r, 0, 0, 7); g.fill()
    }
    for (let i = 0; i < 280; i++) {
      const k = next() * .45, x = X(k), y = h * (.86 + k * .25 + next() * .035), s = u * (.012 + next() * .03)
      g.strokeStyle = p.grass; g.lineWidth = .8; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x, y - s * .7, x + (next() - .45) * s, y - s); g.stroke()
      if (i % 19 === 0) { g.fillStyle = p.flower; g.beginPath(); g.arc(x, y - s, 1.4, 0, 7); g.fill() }
    }
    g.fillStyle = p.tree
    const trees = side ? [[-.005, .22], [.06, .14], [.11, .075]] : [[.005, .27], [.07, .17], [.115, .1], [.16, .055]]
    trees.forEach(([k, size]) => pine(g, X(k), h * (.9 + k * .5), h * size, next))
  }

  return { back: back.c, land: land.c, front: front.c }
}
