import { cloud, dot, fill, glints, glow, gradient, grass, leaf, mountain, reflect, seeded, shape, spline, branch, type Painter, type Point } from './brushes'

/** Blanco: amanecer sobre un mar de nubes. */
export const blanco: Painter = (g, w, h) => {
  const n = seeded(11)
  fill(g, w, 0, h, ['#7f9fbd', '#b9cad8', '#f3e9e2', '#dce5ea'])
  glow(g, 262, 148, 260, 190, '255,244,222', .9)
  dot(g, 262, 150, 22, 22, '#fffaf0')
  for (let i = 0; i < 5; i++) cloud(g, n, n() * w, 35 + i * 22, 90 + n() * 70, '255,250,247', '150,165,190', .3, .16)
  mountain(g, n, [[-20, 226], [40, 196], [92, 210], [150, 176], [206, 214], [280, 190], [350, 204], [420, 186]], 290, ['#b6c4d3', '#d8e0e6'], '90,115,145')
  for (let i = 0; i < 8; i++) cloud(g, n, i * 60 - 10, 246 + n() * 18, 120, '255,252,248', '165,182,203', .5)
  mountain(g, n, [[-20, 300], [28, 262], [78, 206], [104, 224], [128, 190], [176, 258], [230, 312]], 370, ['#7890a8', '#aebfcd'], '35,60,95', { color: '#f6f7f7', depth: 46 })
  mountain(g, n, [[245, 330], [298, 270], [330, 238], [356, 262], [420, 300]], 380, ['#6f89a3', '#a9bbca'], '35,60,95', { color: '#eef2f4', depth: 34 })
  for (let row = 0; row < 4; row++) for (let i = 0; i < 7; i++)
    cloud(g, n, i * 72 + n() * 30 - 30, 312 + row * 32 + n() * 12, 130 + row * 25, '255,251,247', '150,172,197', .55, .26)
  g.strokeStyle = '#657f99'; g.lineWidth = 1.5
  for (const [x, y] of [[158, 112], [176, 104], [192, 116]]) {
    g.beginPath(); g.moveTo(x - 6, y - 2); g.quadraticCurveTo(x - 2, y - 4, x, y); g.quadraticCurveTo(x + 2, y - 4, x + 6, y - 2); g.stroke()
  }
}

/** Rosa: un cerezo en flor sobre un lago rosado. */
export const rosa: Painter = (g, w, h) => {
  const n = seeded(23), hz = 262
  fill(g, w, 0, hz, ['#5a3b7c', '#b8699c', '#f0a3ad', '#ffd8c6'])
  glow(g, 190, 232, 220, 150, '255,232,205', .8)
  dot(g, 190, 226, 20, 20, '#fff2dc')
  cloud(g, n, 90, 170, 110, '255,205,205', '120,65,130', .4, .13)
  cloud(g, n, 300, 200, 120, '255,215,205', '140,75,130', .4, .12)
  mountain(g, n, [[-20, 226], [46, 196], [100, 218], [150, 246], [236, 244], [300, 200], [350, 214], [420, 190]], hz, ['#a56a9c', '#d796aa'], '70,30,90')
  mountain(g, n, [[-20, 240], [40, 234], [110, 256], [250, 258], [330, 236], [420, 240]], hz, ['#70477f', '#9c6390'], '50,20,70')
  reflect(g, w, hz, h, ['#f2b3b4', '#a8628f', '#4b2b64'])
  glints(g, n, 190, hz + 2, h, 45, '255,235,215')
  glow(g, w / 2, hz, 260, 16, '255,220,215', .6)
  const tips: Point[] = []
  branch(g, n, 452, 44, 88, 2.8, 12, '#3b2043', tips)
  branch(g, n, 448, -10, 92, 2.75, 10, '#3b2043', tips)
  branch(g, n, 250, -24, 56, 2.5, 6, '#3b2043', tips)
  for (const [x, y] of tips) {
    glow(g, x, y, 30, 26, '255,170,205', .25)
    for (let i = 0; i < 4; i++) {
      const cx = x + (n() - .5) * 28, cy = y + (n() - .5) * 24, r = 4 + n() * 5, color = ['#ffd9e4', '#f7b3cc', '#e98fb5', '#fff0f2'][i]
      for (let p = 0; p < 5; p++) leaf(g, cx, cy, r, p * 1.256 + i, color, undefined, .5)
      dot(g, cx, cy, 1.2, 1.2, '#a84c7c')
    }
  }
  for (let i = 0; i < 34; i++) leaf(g, n() * w, 90 + n() * 300, 4 + n() * 7, n() * 6, `rgba(255,205,222,${.4 + n() * .5})`, undefined, .42)
}

/** Marrón: dunas con la última luz. Es la apaisada. */
export const marron: Painter = (g, w, h) => {
  const n = seeded(37), sx = w * .69
  fill(g, w, 0, 270, ['#49304f', '#93566a', '#dc9670', '#f7cf98'])
  glow(g, sx, 192, 280, 170, '255,220,160', .85)
  dot(g, sx, 190, 30, 30, '#fff0c9')
  cloud(g, n, w * .22, 90, 170, '240,170,145', '85,45,80', .4, .12)
  cloud(g, n, w * .8, 120, 150, '255,200,160', '110,55,80', .4, .1)
  mountain(g, n, [[-20, 216], [w * .12, 198], [w * .25, 214], [w * .38, 194], [w * .5, 222], [w * .62, 226], [w * .8, 204], [w + 20, 210]], 270, ['#b2766b', '#d29a7e'], '90,40,60')
  glow(g, w / 2, 236, w * .6, 26, '250,200,160', .7)
  const dune = (crest: Point[], lit: string[], dark: string[], spine: Point[] | null, ripple: string) => {
    const top = spline(crest, 24)
    shape(g, [...top, [w + 30, h + 10], [-30, h + 10]], gradient(g, 0, Math.min(...top.map(p => p[1])), 0, h, lit))
    g.save(); g.clip()
    for (let k = 1; k < 26; k++) {
      g.strokeStyle = ripple; g.lineWidth = .7 + k * .035; g.beginPath()
      top.forEach(([x, y], i) => g.lineTo(x, y + k * (5 + k * .22) + Math.sin(i * .5 + k * 1.9) * 2.2))
      g.stroke()
    }
    if (spine) {
      const ridge = spline(spine, 20), start = ridge[0][0]
      shape(g, [...top.filter(p => p[0] <= start), ...ridge, [-30, h + 10]], gradient(g, 0, spine[0][1], 0, h, dark))
    }
    for (let i = 0; i < 900; i++) dot(g, n() * w, 230 + n() * 170, .7, .7, `rgba(255,225,185,${n() * .25})`)
    g.restore()
    g.strokeStyle = 'rgba(255,226,180,.65)'; g.lineWidth = 1.5; g.beginPath(); top.forEach(([x, y]) => g.lineTo(x, y)); g.stroke()
  }
  dune([[-30, 262], [w * .2, 244], [w * .4, 264], [w * .6, 238], [w * .8, 256], [w + 30, 240]], ['#d99a70', '#a96552'], ['#925650', '#70404a'], [[w * .6, 238], [w * .56, 258], [w * .5, 290], [w * .52, h + 10]], 'rgba(110,55,55,.14)')
  dune([[-30, 310], [w * .13, 276], [w * .27, 262], [w * .46, 302], [w * .72, 336], [w + 30, 318]], ['#e3a474', '#94533f'], ['#7d4446', '#4d2938'], [[w * .27, 262], [w * .31, 290], [w * .26, 326], [w * .36, h + 10]], 'rgba(95,40,40,.18)')
  dune([[-30, 400], [w * .3, 392], [w * .62, 356], [w * .84, 332], [w + 30, 348]], ['#b96f50', '#5e3037'], ['#633440', '#3c1f30'], [[w * .84, 332], [w * .8, 356], [w * .86, 380], [w * .8, h + 10]], 'rgba(60,20,30,.2)')
  for (const x of [w * .09, w * .13, w * .93]) grass(g, n, x - 8, x + 8, () => h - 22, 26, 42, ['#3c1f30', '#6b3a3c'], 40)
}
