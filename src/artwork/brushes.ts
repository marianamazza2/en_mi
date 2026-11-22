import { glow, random } from '../scene/paint'

// Pinceles de las portadas. Se trabaja sobre 400 de alto; sin ctx.filter, que Safari no siempre tiene.
export type G = CanvasRenderingContext2D
export type Point = [number, number]
export type Next = () => number
export type Painter = (g: G, w: number, h: number) => void
export { glow }

export const seeded = (seed: number): Next => {
  const next = random(seed * 48271 % 2147483647)
  next(); next()
  return next
}

export function gradient(g: G, x0: number, y0: number, x1: number, y1: number, colors: string[]) {
  const f = g.createLinearGradient(x0, y0, x1, y1)
  colors.forEach((c, i) => f.addColorStop(i / (colors.length - 1), c))
  return f
}

export function fill(g: G, w: number, top: number, bottom: number, colors: string[]) {
  g.fillStyle = gradient(g, 0, top, 0, bottom, colors); g.fillRect(0, top, w, bottom - top)
}

export function shape(g: G, points: Point[], style: string | CanvasGradient) {
  g.beginPath(); points.forEach(([x, y]) => g.lineTo(x, y)); g.closePath(); g.fillStyle = style; g.fill()
}

export function dot(g: G, x: number, y: number, rx: number, ry: number, style: string | CanvasGradient, angle = 0) {
  g.beginPath(); g.ellipse(x, y, rx, ry, angle, 0, Math.PI * 2); g.fillStyle = style; g.fill()
}

/** Curva suave que pasa por los puntos. */
export function spline(points: Point[], steps = 14) {
  const out: Point[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[Math.max(0, i - 1)], b = points[i], c = points[i + 1], d = points[Math.min(points.length - 1, i + 2)]
    for (let s = 0; s < steps; s++) {
      const t = s / steps
      out.push([0, 1].map(k => .5 * (2 * b[k] + (c[k] - a[k]) * t + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * t * t + (3 * b[k] - a[k] - 3 * c[k] + d[k]) * t * t * t)) as Point)
    }
  }
  out.push(points[points.length - 1])
  return out
}

/** Montaña con cresta quebrada, cara en sombra y vetas. */
export function mountain(g: G, next: Next, tops: Point[], bottom: number, colors: string[], shadow: string, snow?: { color: string; depth: number }) {
  let ridge = tops
  for (let pass = 0; pass < 5; pass++) ridge = ridge.flatMap((p, i): Point[] => {
    const q = ridge[i + 1]
    return q ? [p, [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2 + (next() - .5) * Math.abs(q[0] - p[0]) * .22]] : [p]
  })
  const high = Math.min(...ridge.map(p => p[1])), body: Point[] = [...ridge, [tops[tops.length - 1][0], bottom], [tops[0][0], bottom]]
  shape(g, body, gradient(g, 0, high, 0, bottom, colors))
  g.save(); g.clip()
  if (snow) {
    const edge = ridge.map(([x, y]): Point => [x, Math.max(y, high + snow.depth + Math.sin(x * .07) * 7 + (next() - .5) * 13)])
    shape(g, [...ridge, ...edge.reverse()], snow.color)
  }
  tops.forEach(([x, y], i) => {
    if (!i || i === tops.length - 1 || y >= tops[i - 1][1] || y >= tops[i + 1][1]) return
    const d = bottom - y, r = tops[i + 1]
    shape(g, [[x, y - 8], [x + d * .07, y + d * .22], [x + d * .01, y + d * .46], [x + d * .1, y + d * .7], [x - d * .03, bottom], [r[0] + 20, bottom], [r[0], r[1]]], `rgba(${shadow},.3)`)
  })
  for (let i = 0; i < 170; i++) {
    const [x, y] = ridge[Math.floor(next() * ridge.length)], d = (bottom - y) * (.1 + next() * .6), lean = (next() - .35) * d * .5
    shape(g, [[x, y], [x + lean * .5 + 2 + next() * 4, y + d * .5], [x + lean, y + d], [x + lean * .35, y + d * .45]], `rgba(${shadow},${.03 + next() * .08})`)
  }
  g.restore()
}

/** Pino con ramas caídas, una por una. */
export function fir(g: G, next: Next, x: number, base: number, size: number, color: string) {
  g.fillStyle = color; g.fillRect(x - size * .012, base - size * .8, size * .024, size * .8)
  const levels = Math.round(Math.min(30, 8 + size * .16))
  for (let i = 0; i < levels; i++) {
    const k = i / levels, y = base - size + k * size * .88
    for (const side of [-1, 1]) {
      const reach = side * size * (.025 + k * .19) * (.6 + next() * .6), drop = size * (.035 + next() * .035)
      g.beginPath(); g.moveTo(x, y - size * .035)
      g.quadraticCurveTo(x + reach * .4, y + drop * .5, x + reach, y + drop + size * .02)
      g.quadraticCurveTo(x + reach * .65, y + drop * .85, x + reach * .5, y + drop * 1.3)
      g.quadraticCurveTo(x + reach * .2, y + drop * .7, x, y + size * .07)
      g.closePath(); g.fill()
    }
  }
}

/** Nube: sombra abajo, volumen al medio, luz arriba. */
export function cloud(g: G, next: Next, x: number, y: number, span: number, light: string, shade: string, a = .5, flat = .22) {
  for (let i = 0; i < 24; i++) {
    const k = i / 23 - .5, r = span * (.12 + next() * .16) * (1 - Math.abs(k) * .7)
    glow(g, x + k * span * 1.5, y + r * flat * .7, r * 1.5, r * flat * 2, shade, a * .45)
    glow(g, x + k * span * 1.5, y - r * flat * next(), r * 1.2, r * flat * 1.6, light, a * .7)
  }
}

export function stars(g: G, next: Next, w: number, bottom: number, count: number) {
  for (let i = 0; i < count; i++) {
    const x = next() * w, y = next() * bottom, r = .3 + next() ** 5 * 1.7
    if (r > 1.2) glow(g, x, y, r * 5, r * 5, '190,215,255', .3)
    dot(g, x, y, r, r, `rgba(240,246,255,${(.35 + next() * .65) * (1 - y / bottom * .6)})`)
  }
}

export function milkyWay(g: G, next: Next, from: Point, to: Point, width: number) {
  for (let i = 0; i < 70; i++) {
    const k = next()
    glow(g, from[0] + (to[0] - from[0]) * k + (next() - .5) * width, from[1] + (to[1] - from[1]) * k + (next() - .5) * width, width, width * .7, i % 4 ? '115,145,215' : '190,145,205', .07)
  }
  for (let i = 0; i < 700; i++) {
    const k = next(), s = (next() + next() + next() - 1.5) * width * 1.3
    dot(g, from[0] + (to[0] - from[0]) * k + s, from[1] + (to[1] - from[1]) * k + s * .6, .55, .55, `rgba(230,236,255,${next() * .7})`)
  }
}

/** Refleja lo que ya está pintado arriba del horizonte, con ondas. */
export function reflect(g: G, w: number, horizon: number, bottom: number, tint: string[], strength = .5) {
  fill(g, w, horizon, bottom, tint)
  const source = g.canvas, scale = source.width / w, copy = document.createElement('canvas')
  copy.width = source.width; copy.height = Math.ceil(horizon * scale)
  copy.getContext('2d')!.drawImage(source, 0, 0)
  for (let y = 0; y < bottom - horizon; y += 2) {
    const from = horizon - 2 - y * 1.1
    if (from < 0) break
    g.globalAlpha = strength * (1 - y / (bottom - horizon) * .7)
    g.drawImage(copy, 0, from * scale, source.width, 2 * scale, Math.sin(y * .33) * (1 + y * .035) - 3, horizon + y, w + 6, 2.2)
  }
  g.globalAlpha = 1
}

/** Brillos en el agua, más largos cuanto más cerca. */
export function glints(g: G, next: Next, x: number, top: number, bottom: number, spread: number, color: string, count = 120) {
  for (let i = 0; i < count; i++) {
    const k = next() ** 1.7, half = (1 + next() * 5) * (1 + k * 2)
    const cx = x + (next() + next() - 1) * spread * (.3 + k)
    dot(g, cx, top + k * (bottom - top), half, .6 + k * .7, `rgba(${color},${(.25 + next() * .6) * (1 - k * .5)})`)
  }
}

export function grass(g: G, next: Next, from: number, to: number, y: (x: number) => number, depth: number, size: number, colors: string[], count: number) {
  g.lineCap = 'round'
  for (let i = 0; i < count; i++) {
    const x = from + next() * (to - from), k = next(), base = y(x) + k * depth, s = size * (.3 + k * .7) * (.5 + next() * .7)
    g.strokeStyle = colors[Math.floor(next() * colors.length)]; g.lineWidth = .6 + k
    g.beginPath(); g.moveTo(x, base); g.quadraticCurveTo(x, base - s * .7, x + (next() - .4) * s * .7, base - s); g.stroke()
  }
}

export function rock(g: G, x: number, y: number, r: number, light: string, dark: string) {
  shape(g, [[x - r, y + r * .5], [x - r * .95, y - r * .1], [x - r * .5, y - r * .6], [x + r * .2, y - r * .7], [x + r * .8, y - r * .3], [x + r, y + r * .5]], gradient(g, x - r * .5, y - r, x + r * .5, y + r * .5, [light, dark]))
}

export function leaf(g: G, x: number, y: number, length: number, angle: number, color: string | CanvasGradient, vein?: string, width = .3) {
  g.save(); g.translate(x, y); g.rotate(angle)
  g.beginPath(); g.moveTo(0, 0)
  g.bezierCurveTo(length * .25, -length * width, length * .75, -length * width, length, 0)
  g.bezierCurveTo(length * .7, length * width, length * .3, length * width, 0, 0)
  g.fillStyle = color; g.fill()
  if (vein) { g.strokeStyle = vein; g.lineWidth = .8; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(length * .5, -length * .03, length * .95, 0); g.stroke() }
  g.restore()
}

/** Rama que se va partiendo; devuelve las puntas para ponerles hojas o flores. */
export function branch(g: G, next: Next, x: number, y: number, length: number, angle: number, width: number, color: string, tips: Point[]) {
  const ex = x + Math.cos(angle) * length, ey = y + Math.sin(angle) * length
  g.strokeStyle = color; g.lineWidth = width; g.lineCap = 'round'
  g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo((x + ex) / 2 + (next() - .5) * length * .3, (y + ey) / 2 + (next() - .5) * length * .3, ex, ey); g.stroke()
  if (length < 38) tips.push([ex, ey])
  if (length < 16) return
  branch(g, next, ex, ey, length * (.68 + next() * .14), angle - .15 - next() * .35, width * .67, color, tips)
  branch(g, next, ex, ey, length * (.55 + next() * .16), angle + .2 + next() * .45, width * .58, color, tips)
}

/** Grano muy fino y viñeta: lo que le quita lo plástico. */
export function finish(g: G, w: number, h: number, next: Next) {
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = i % 2 ? 'rgba(255,255,255,.045)' : 'rgba(10,5,25,.05)'
    g.fillRect(next() * w, next() * h, 1.2, 1.2)
  }
  const v = g.createRadialGradient(w / 2, h * .45, h * .3, w / 2, h * .5, Math.max(w, h) * .8)
  v.addColorStop(0, 'rgba(10,8,30,0)'); v.addColorStop(1, 'rgba(10,8,30,.28)')
  g.fillStyle = v; g.fillRect(0, 0, w, h)
}
