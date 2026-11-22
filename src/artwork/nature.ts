import { branch, cloud, dot, fill, fir, glints, glow, gradient, grass, leaf, milkyWay, mountain, reflect, rock, seeded, shape, spline, stars, type G, type Painter, type Point } from './brushes'

/** Lluvia: gotas en el vidrio, luces tibias afuera. */
export const lluvia: Painter = (g, w, h) => {
  const n = seeded(41)
  fill(g, w, 0, h, ['#203f5a', '#416a7e', '#28495a', '#10283a'])
  for (let i = 0; i < 9; i++) cloud(g, n, n() * w, 30 + n() * 90, 140, '135,170,185', '20,45,65', .4, .3)
  for (let row = 0; row < 3; row++) for (let i = 0; i < 12; i++)
    fir(g, n, i * 38 + n() * 24 - 10, 290 + row * 38, 70 + row * 30 + n() * 40, ['rgba(45,86,100,.55)', 'rgba(27,62,78,.6)', 'rgba(12,38,52,.6)'][row])
  for (let i = 0; i < 38; i++) { // luces fuera de foco
    const x = n() * w, y = 215 + (n() + n() - 1) * 90, r = 6 + n() * 20, rgb = ['255,196,120', '255,160,110', '255,225,170', '140,205,220'][i % 4]
    glow(g, x, y, r * 2.2, r * 2.2, rgb, .3)
    dot(g, x, y, r, r, `rgba(${rgb},${.07 + n() * .17})`)
  }
  for (let i = 0; i < 150; i++) {
    const x = n() * w, y = n() * h, l = 10 + n() * 22
    g.strokeStyle = `rgba(210,232,240,${.05 + n() * .1})`; g.lineWidth = .8; g.beginPath(); g.moveTo(x, y); g.lineTo(x - l * .2, y + l); g.stroke()
  }
  const drop = (x: number, y: number, r: number) => {
    const f = g.createRadialGradient(x, y + r * .6, r * .1, x, y, r * 1.2)
    f.addColorStop(0, 'rgba(235,240,225,.6)'); f.addColorStop(.5, 'rgba(120,165,175,.15)'); f.addColorStop(1, 'rgba(5,22,35,.6)')
    dot(g, x, y, r * .88, r * 1.1, f)
    dot(g, x - r * .3, y - r * .45, r * .25, r * .2, 'rgba(255,255,255,.85)')
  }
  for (let i = 0; i < 420; i++) drop(n() * w, n() * h, .8 + n() ** 4 * 5)
  for (let i = 0; i < 11; i++) { // las que resbalan
    const x = n() * w, y = 90 + n() * 280, l = 50 + n() * 110, r = 5 + n() * 5
    const f = gradient(g, 0, y - l, 0, y, ['rgba(220,240,245,0)', 'rgba(220,240,245,.28)'])
    shape(g, spline([[x - 1, y - l], [x + 2, y - l * .6], [x - 2, y - l * .3], [x - r * .5, y]], 6).concat([[x + r * .5, y], [x + 2, y - l * .3], [x + 4, y - l * .6], [x + 1, y - l]]), f)
    drop(x, y, r)
  }
  shape(g, [[0, h], [0, h - 22], [w, h - 22], [w, h]], '#0b1c29')
  g.fillStyle = 'rgba(255,205,150,.35)'; g.fillRect(0, h - 22, w, 1.5)
}

/** Olas: rompe una ola con el sol bajo. */
export const olas: Painter = (g, w, h) => {
  const n = seeded(53), hz = 188
  fill(g, w, 0, hz, ['#5a5f9e', '#b684b1', '#f3aaa5', '#ffd9ad'])
  for (let i = 0; i < 4; i++) cloud(g, n, 30 + i * 115, 70 + n() * 70, 100, '255,200,190', '95,70,135', .45, .12)
  glow(g, 270, 176, 190, 120, '255,230,185', .85)
  dot(g, 270, 170, 21, 21, '#fff4d2')
  mountain(g, n, [[-20, 170], [22, 158], [62, 172], [100, 182], [130, 188]], hz + 1, ['#80689c', '#a583a8'], '50,30,80')
  reflect(g, w, hz, h, ['#d9a3ad', '#4f93a6', '#125a77', '#0a3552'], .25)
  for (let i = 0; i < 170; i++) {
    const k = n() ** 1.4, y = hz + 3 + k * 105, x = n() * w, r = 5 + k * 26
    g.strokeStyle = i % 2 ? `rgba(15,70,105,${.1 + k * .2})` : `rgba(255,225,210,${.1 + n() * .2})`
    g.lineWidth = .7 + k; g.beginPath(); g.moveTo(x - r, y); g.quadraticCurveTo(x, y - 2 - k * 3, x + r, y); g.stroke()
  }
  glints(g, n, 270, hz + 2, 300, 34, '255,235,195', 150)
  const crest = spline([[-20, 292], [40, 258], [92, 232], [140, 226], [176, 244], [206, 272], [262, 296], [340, 290], [420, 300]], 24)
  shape(g, [...crest, [420, 372], [-20, 380]], gradient(g, 0, 226, 0, 372, ['#b9f0dc', '#46b3b4', '#14708c', '#0c4668']))
  g.save(); g.clip()
  for (let i = 0; i < 90; i++) { // el agua que sube por la ola
    const p = crest[Math.floor(n() * crest.length)]
    g.strokeStyle = i % 2 ? 'rgba(220,255,245,.22)' : 'rgba(5,60,90,.2)'; g.lineWidth = .8 + n()
    g.beginPath(); g.moveTo(p[0] + 34, 382); g.quadraticCurveTo(p[0] + 26, p[1] + 50, p[0], p[1]); g.stroke()
  }
  g.restore()
  for (const [x, y] of crest) {
    const power = Math.max(.15, 1 - Math.abs(x - 160) / 170)
    for (let i = 0; i < 9; i++) {
      const s = n() * power, r = .7 + n() * 3 * power
      dot(g, x + (n() - .3) * 24 * power, y - s * 22 + n() * 11 * power, r, r * .8, `rgba(255,252,244,${.3 + n() * .55})`)
    }
    if (n() < .12) glow(g, x + 10, y - 8, 26 * power, 20 * power, '255,240,235', .4)
  }
  const shore = spline([[-20, 352], [70, 362], [150, 348], [240, 366], [330, 354], [420, 364]], 16)
  shape(g, [...shore, [420, 410], [-20, 410]], gradient(g, 0, 350, 0, 400, ['#78bfc0', '#c9a99c']))
  for (const [x, y] of shore) for (let i = 0; i < 18; i++) {
    const k = n()
    dot(g, x + (n() - .5) * 18, y + k * k * 34, .8 + n() * 2.6, .6 + n() * 1.3, `rgba(255,250,243,${(1 - k * .8) * .8})`)
  }
}

/** Río: baja del valle entre pinos y piedras. */
export const rio: Painter = (g, w, h) => {
  const n = seeded(67)
  fill(g, w, 0, 210, ['#336d8c', '#7fb2bb', '#e6eed5'])
  glow(g, 214, 150, 190, 130, '255,246,205', .7)
  cloud(g, n, 90, 60, 100, '240,248,245', '70,120,145', .4, .18)
  mountain(g, n, [[-20, 130], [40, 86], [74, 106], [104, 74], [160, 138], [206, 160], [250, 132], [300, 70], [342, 100], [420, 80]], 215, ['#7ba7b4', '#b5cdc6'], '25,70,100', { color: '#e8f2ee', depth: 30 })
  mountain(g, n, [[-20, 150], [50, 150], [130, 186], [214, 198], [290, 170], [420, 142]], 222, ['#467a78', '#6f9c8b'], '10,50,60')
  glow(g, 205, 196, 190, 24, '225,240,225', .7)
  fill(g, w, 208, h, ['#5d8d6c', '#2c6150', '#143d37'])
  for (let i = 0; i < 64; i++) { const x = i * 6.5; fir(g, n, x, 211 + n() * 5, 12 + n() * 18 + Math.abs(x - 210) * .12, '#376b62') }
  const left = spline([[206, 208], [176, 222], [186, 240], [214, 258], [150, 292], [58, 330], [26, 410]])
  const right = spline([[214, 208], [196, 222], [226, 240], [276, 262], [262, 296], [214, 336], [300, 410]])
  shape(g, [...left, ...right.slice().reverse()], gradient(g, 0, 208, 0, h, ['#eef3d6', '#86c5bd', '#2f8793', '#0e4c66']))
  g.save(); g.clip()
  for (let i = 0; i < 280; i++) { // corriente
    const k = Math.floor(n() * (left.length - 4)), t = n(), a = left[k], b = right[k], c = left[k + 3], d = right[k + 3]
    g.strokeStyle = i % 3 ? `rgba(235,255,245,${.12 + n() * .35})` : 'rgba(5,55,75,.25)'
    g.lineWidth = .5 + k / left.length * 1.8
    g.beginPath(); g.moveTo(a[0] + (b[0] - a[0]) * t, a[1]); g.lineTo(c[0] + (d[0] - c[0]) * t, c[1]); g.stroke()
  }
  glints(g, n, 208, 212, 260, 22, '255,250,215', 70)
  g.restore()
  for (const side of [left, right]) side.forEach(([x, y], i) => {
    const s = (y - 200) / 200, out = side === left ? -1 : 1
    if (i % 3 === 0) rock(g, x + out * n() * 8 * s, y, (3 + n() * 11) * s + 1, '#8ea99f', '#244b4b')
    grass(g, n, x + out * 4 - 8, x + out * 4 + 8, () => y, 4, 5 + s * 22, ['#80a96c', '#4d805a', '#235545'], 12)
  })
  rock(g, 176, 326, 16, '#9ab3a8', '#1d4248')
  g.strokeStyle = 'rgba(240,255,250,.7)'; g.lineWidth = 2; g.beginPath(); g.ellipse(176, 334, 21, 5, 0, 0, Math.PI); g.stroke()
  for (const [x, y, s] of [[26, 300, 130], [62, 270, 86], [94, 250, 54], [4, 372, 210], [336, 262, 80], [366, 292, 120], [400, 360, 200], [306, 242, 44]]) fir(g, n, x, y, s, y > 320 ? '#0c302f' : '#174640')
  for (let i = 0; i < 70; i++) dot(g, n() < .5 ? n() * 50 : 320 + n() * 80, 350 + n() * 50, 1.5, 1.5, i % 2 ? '#f0e6b4' : '#d7b5d6')
}

function frond(g: G, x: number, y: number, angle: number, length: number, color: string) {
  g.save(); g.translate(x, y); g.rotate(angle)
  for (let i = 1; i < 26; i++) {
    const k = i / 26, size = length * .3 * Math.sin(Math.PI * Math.min(1, k * .9 + .1))
    for (const side of [-1, 1]) leaf(g, k * length, k * k * length * .16, size, side * (1.05 - k * .5) + .2, color, undefined, .13)
  }
  g.strokeStyle = color; g.lineWidth = 2.5; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(length * .5, 0, length, length * .16); g.stroke()
  g.restore()
}

/** Selva: una cascada al fondo, rayos entre las hojas. */
export const selva: Painter = (g, w, h) => {
  const n = seeded(79)
  fill(g, w, 0, h, ['#cfe6b4', '#8dbf9a', '#3d8070', '#0f3f3b'])
  glow(g, 210, 90, 220, 190, '250,255,215', .8)
  for (let i = 0; i < 110; i++) glow(g, n() * w, n() * 230, 16 + n() * 32, 14 + n() * 22, '70,135,105', .2)
  mountain(g, n, [[-20, 110], [80, 126], [150, 150], [178, 150], [186, 300]], 300, ['#62997f', '#386f62'], '10,55,45')
  mountain(g, n, [[222, 300], [226, 150], [262, 140], [340, 118], [420, 100]], 300, ['#5b9078', '#30655a'], '10,55,45')
  shape(g, [[180, 150], [224, 150], [236, 300], [170, 300]], gradient(g, 0, 150, 0, 300, ['#f4fbe9', '#b7dfd2', '#e8f7ef']))
  for (let i = 0; i < 90; i++) {
    const x = 182 + n() * 40, y = 150 + n() * 90
    g.strokeStyle = i % 3 ? 'rgba(255,255,255,.55)' : 'rgba(50,120,115,.3)'; g.lineWidth = .6 + n()
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + (x - 202) * .3, y + 30 + n() * 40); g.stroke()
  }
  reflect(g, w, 300, h, ['#a6d5c4', '#256a68', '#0b3a3c'], .35)
  for (let i = 0; i < 18; i++) glow(g, 160 + n() * 86, 290 + n() * 18, 34, 22, '240,255,248', .35)
  for (const [x, width, color] of [[70, 12, '#3f7765'], [330, 14, '#3f7765'], [28, 26, '#143f37'], [376, 30, '#113a34'], [104, 7, '#4c8670']] as const) {
    shape(g, [[x - width * .9, 340], [x - width * .4, 180], [x - width * .6, 0], [x + width * .5, 0], [x + width * .3, 190], [x + width, 340]], color)
    g.strokeStyle = '#164a3c'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x + width, 0); g.bezierCurveTo(x - 10, 90, x + 24, 160, x + 4, 240); g.stroke()
  }
  for (let i = 0; i < 7; i++) {
    const x = 150 + i * 24, spread = 10 + n() * 24
    shape(g, [[x, 0], [x + 8, 0], [x - 130 + spread, 330], [x - 130 - spread, 330]], gradient(g, x, 0, x - 130, 330, ['rgba(255,255,220,.22)', 'rgba(255,255,220,0)']))
  }
  for (let i = 0; i < 240; i++) {
    const x = n() * w, y = (Math.abs(x - 200) / 200) * 90 * n() + n() * 26
    leaf(g, x, y, 14 + n() * 20, n() * 6.3, ['#0d3a31', '#17503f', '#2a6c4c', '#4e8f5c'][Math.floor(n() * 4)])
  }
  for (const side of [0, 1]) for (let i = 0; i < 9; i++) {
    const x = side ? w + 14 : -14, a = -1.25 + i * .22 + n() * .1
    frond(g, x, 300 + (i % 3) * 42, side ? Math.PI - a : a, 80 + n() * 70, ['#0a302b', '#14493c', '#25654a', '#3f8257'][i % 4])
  }
  for (let i = 0; i < 30; i++) glow(g, 90 + n() * 220, 60 + n() * 270, 4, 4, '255,255,215', .8)
}

/** Fogata: junto al lago, bajo la Vía Láctea. */
export const fuego: Painter = (g, w, h) => {
  const n = seeded(83), hz = 238
  fill(g, w, 0, hz, ['#050a22', '#14214b', '#42395f'])
  milkyWay(g, n, [330, -20], [90, 240], 46)
  stars(g, n, w, hz, 220)
  mountain(g, n, [[-20, 196], [60, 170], [120, 206], [190, 214], [250, 180], [300, 198], [360, 160], [420, 184]], hz, ['#1d294f', '#2b3157'], '3,6,25', { color: '#46527c', depth: 22 })
  reflect(g, w, hz, 296, ['#2c3157', '#0d1633'], .4)
  shape(g, [...spline([[-20, 300], [90, 282], [200, 290], [300, 280], [420, 298]]), [420, 410], [-20, 410]], gradient(g, 0, 280, 0, h, ['#2c2036', '#0d0b1c']))
  glow(g, 200, 340, 210, 90, '255,135,60', .5)
  for (let i = 0; i < 500; i++) {
    const x = n() * w, y = 296 + n() * 104, near = Math.max(0, 1 - Math.hypot((x - 200) / 200, (y - 340) / 100))
    dot(g, x, y, 1.5, .8, `rgba(255,170,100,${near * n() * .5})`)
  }
  for (const [x, y, s] of [[18, 338, 230], [58, 314, 130], [86, 300, 70], [384, 344, 260], [346, 316, 140], [316, 298, 64]]) fir(g, n, x, y, s, s > 200 ? '#050817' : '#0b1128')
  for (let i = -3; i <= 3; i++) rock(g, 200 + i * 23, 350 - (3 - Math.abs(i)) * 4, 14, '#7a4b4b', '#1a1225')
  glow(g, 200, 286, 130, 140, '255,120,45', .45)
  for (const [x1, y1, x2, y2] of [[150, 356, 232, 326], [250, 356, 166, 324], [198, 364, 204, 318]]) {
    g.lineCap = 'round'; g.strokeStyle = '#2b1522'; g.lineWidth = 15; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke()
    g.strokeStyle = 'rgba(255,145,70,.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x1, y1 - 5); g.lineTo(x2, y2 - 5); g.stroke()
  }
  const flame = (x: number, height: number, width: number, lean: number, colors: string[]) => {
    g.beginPath(); g.moveTo(x, 338)
    g.bezierCurveTo(x - width * 1.3, 338 - height * .1, x - width * .5, 338 - height * .55, x + lean, 338 - height)
    g.bezierCurveTo(x + lean - width * .2, 338 - height * .6, x + width * 1.4, 338 - height * .3, x, 338)
    g.fillStyle = gradient(g, 0, 338 - height, 0, 338, colors); g.fill()
  }
  g.globalCompositeOperation = 'lighter'
  for (let i = 0; i < 16; i++) {
    const k = (n() + n()) / 2 - .5
    flame(200 + k * 62, (45 + n() * 95) * (1 - Math.abs(k) * .8), 9 + n() * 13, (n() - .35) * 24, ['rgba(120,20,20,0)', 'rgba(190,65,22,.38)', 'rgba(235,135,50,.4)'])
  }
  for (let i = 0; i < 6; i++) flame(186 + i * 6, 28 + n() * 36, 8, (n() - .5) * 10, ['rgba(255,190,80,0)', 'rgba(255,225,140,.45)'])
  g.globalCompositeOperation = 'source-over'
  glow(g, 200, 326, 30, 20, '255,245,200', .8)
  for (let i = 0; i < 26; i++) {
    const k = n() * n(), x = 204 + (n() - .4) * (30 + 120 * k), y = 280 - k * 170, r = .5 + n() * .8
    glow(g, x, y, r * 4, r * 4, '255,150,70', .5); dot(g, x, y, r, r, '#ffd79a')
  }
}

/** Aire libre: pradera, un árbol, pájaros. */
export const paseo: Painter = (g, w, h) => {
  const n = seeded(97)
  fill(g, w, 0, 260, ['#4b8fc0', '#9fcbd8', '#eef1d8'])
  glow(g, 300, 150, 200, 160, '255,247,200', .7)
  for (let i = 0; i < 5; i++) cloud(g, n, n() * w, 46 + i * 28, 70 + n() * 60, '255,255,250', '110,150,185', .55, .3)
  mountain(g, n, [[-20, 210], [60, 176], [130, 206], [200, 186], [270, 210], [350, 172], [420, 196]], 256, ['#8fb5b9', '#bdd2c4'], '30,80,100')
  for (const [y, top, bottom] of [[238, '#9dbf93', '#79a67c'], [266, '#86b374', '#4e8659'], [304, '#6c9f55', '#24583c']] as const) {
    const hill = spline([[-20, y + 8], [70, y - 14], [170, y + 10], [280, y - 8], [420, y - 18]])
    shape(g, [...hill, [420, 410], [-20, 410]], gradient(g, 0, y - 18, 0, h, [top, bottom]))
    if (y < 300) for (let i = 0; i < 22; i++) {
      const p = hill[Math.floor(n() * hill.length)]
      const r = 3 + n() * 5
      for (let j = 0; j < 16; j++) dot(g, p[0] + (n() - .5) * r * 2, p[1] - r * n(), r * .45, r * .45, j % 4 ? '#5c9068' : '#7aa877')
    }
  }
  shape(g, [...spline([[150, 410], [178, 368], [244, 342], [210, 318], [236, 302]]), ...spline([[240, 302], [220, 318], [268, 342], [222, 372], [240, 410]])], gradient(g, 0, 300, 0, h, ['#e9e3b8', '#b7a97c']))
  const tips: Point[] = []
  branch(g, n, 76, 330, 66, -1.45, 14, '#3a4034', tips)
  branch(g, n, 78, 280, 52, -.8, 7, '#3a4034', tips)
  for (const [x, y] of tips) for (let i = 0; i < 16; i++) {
    const ox = (n() - .5) * 44, oy = (n() - .5) * 38
    leaf(g, x + ox, y + oy, 6 + n() * 7, n() * 6.3, ox - oy > 12 ? '#a8c873' : ox - oy > -10 ? '#5f9150' : '#2f6041')
  }
  grass(g, n, -10, w + 10, x => 318 + Math.sin(x * .02) * 8 + (Math.abs(x - 212) < 28 ? 78 : 0), 92, 24, ['#93bd66', '#5c914e', '#2d6440', '#b8cf86'], 1300)
  for (let i = 0; i < 170; i++) {
    const x = n() * w, k = n(), r = 1 + k * 2.4
    if (Math.abs(x - 208) < 34) continue
    dot(g, x, 326 + k * 74, r, r * .8, ['#fff6dc', '#f2c14e', '#e79bb5', '#b9a6de'][i % 4])
  }
  g.strokeStyle = '#2d5a70'; g.lineWidth = 1.7
  for (const [x, y, s] of [[214, 108, 9], [242, 94, 7], [262, 116, 6], [300, 88, 5], [190, 134, 5]]) {
    g.beginPath(); g.moveTo(x - s, y - s * .3); g.quadraticCurveTo(x - s * .4, y - s * .6, x, y); g.quadraticCurveTo(x + s * .4, y - s * .6, x + s, y - s * .3); g.stroke()
  }
}
