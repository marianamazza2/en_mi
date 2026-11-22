import { branch, cloud, dot, fill, fir, glints, glow, gradient, grass, leaf, milkyWay, mountain, reflect, seeded, shape, spline, stars, type Painter, type Point } from './brushes'

/** Piano: de cola, frente a un ventanal con luna. */
export const piano: Painter = (g, w, h) => {
  const n = seeded(101)
  fill(g, w, 0, h, ['#17142f', '#2c2348', '#1a1430'])
  const arch = () => { g.beginPath(); g.moveTo(92, 290); g.lineTo(92, 130); g.arc(200, 130, 108, Math.PI, 0); g.lineTo(308, 290); g.closePath() }
  g.save(); arch(); g.clip()
  fill(g, w, 0, 290, ['#101c4b', '#3b4f8a', '#8c83b5'])
  stars(g, n, w, 250, 150)
  glow(g, 244, 100, 110, 110, '215,225,255', .7)
  dot(g, 244, 100, 25, 25, '#f6f4ff'); glow(g, 236, 94, 9, 8, '150,160,205', .5); glow(g, 251, 108, 7, 6, '150,160,205', .5)
  mountain(g, n, [[80, 240], [130, 206], [170, 236], [220, 246], [270, 214], [320, 232]], 292, ['#47558a', '#6a6a9c'], '15,15,50', { color: '#8f9cc6', depth: 18 })
  for (let i = 0; i < 24; i++) fir(g, n, 90 + i * 10, 294, 16 + n() * 24, '#25285a')
  g.restore()
  g.strokeStyle = '#100d26'; g.lineWidth = 9; arch(); g.stroke()
  g.lineWidth = 3; g.beginPath(); g.moveTo(200, 22); g.lineTo(200, 290); g.moveTo(92, 136); g.lineTo(308, 136); g.moveTo(92, 214); g.lineTo(308, 214); g.stroke()
  fill(g, w, 290, h, ['#2b2140', '#100c22'])
  shape(g, [[104, 294], [296, 294], [372, 400], [20, 400]], gradient(g, 0, 294, 0, 400, ['rgba(170,180,235,.34)', 'rgba(170,180,235,.04)']))
  for (const side of [0, 1]) for (let i = 0; i < 7; i++) { // cortinas
    const x = side ? 400 - i * 11 : i * 11, curve = side ? -1 : 1
    shape(g, spline([[x - 8, -5], [x + curve * 10, 90], [x - curve * 12, 200], [x, 350]]).concat(spline([[x + 14, 350], [x + 14 - curve * 12, 200], [x + 14 + curve * 12, 90], [x + 10, -5]])), i % 2 ? '#2c2045' : '#43305d')
  }
  const black = '#0b0919', shine = 'rgba(200,210,255,.75)'
  shape(g, [...spline([[132, 238], [172, 190], [222, 168], [262, 186], [284, 226]]), [284, 244], [132, 262]], gradient(g, 140, 180, 280, 250, ['#1c1936', black])) // tapa
  g.strokeStyle = shine; g.lineWidth = 1.5; g.beginPath(); spline([[132, 238], [172, 190], [222, 168], [262, 186], [284, 226]]).forEach(([x, y]) => g.lineTo(x, y)); g.stroke()
  g.strokeStyle = black; g.lineWidth = 3; g.beginPath(); g.moveTo(258, 264); g.lineTo(236, 190); g.stroke()
  shape(g, [[112, 262], [264, 252], ...spline([[264, 252], [300, 258], [306, 280], [286, 296]]), [286, 300], [262, 306], [112, 306]], gradient(g, 0, 250, 0, 306, ['#2a2550', black]))
  g.strokeStyle = shine; g.beginPath(); g.moveTo(112, 262); g.lineTo(264, 252); g.quadraticCurveTo(300, 254, 305, 276); g.stroke()
  g.fillStyle = '#f1e9f2'; g.fillRect(110, 281, 106, 11)
  g.fillStyle = black
  for (let i = 0; i < 24; i++) { if (![2, 6].includes(i % 7)) g.fillRect(113 + i * 4.3, 281, 2.2, 6.5) }
  g.fillRect(106, 292, 114, 8)
  for (const [x, l] of [[120, 70], [214, 74], [282, 52]]) shape(g, [[x - 7, 300], [x + 7, 300], [x + 3, 300 + l], [x - 3, 300 + l]], black)
  shape(g, [[134, 330], [194, 330], [194, 341], [134, 341]], '#17132b')
  for (const x of [142, 186]) shape(g, [[x - 2, 341], [x + 2, 341], [x + 3, 382], [x - 3, 382]], black)
  shape(g, [[150, 258], [152, 236], [192, 233], [194, 256]], '#d9d3ea')
  for (let i = 0; i < 24; i++) glow(g, 110 + n() * 180, 100 + n() * 250, 3, 3, '215,225,255', .6)
}

/** Guitarra: apoyada en la hora dorada. */
export const guitarra: Painter = (g, w, h) => {
  const n = seeded(113)
  fill(g, w, 0, 300, ['#503061', '#b35f70', '#f2a673', '#ffd9a0'])
  glow(g, 290, 210, 200, 170, '255,230,170', .8)
  dot(g, 300, 214, 24, 24, '#fff1c8')
  cloud(g, n, 110, 90, 120, '255,185,160', '90,45,95', .4, .14)
  mountain(g, n, [[-20, 232], [50, 206], [120, 240], [250, 250], [350, 222], [420, 236]], 282, ['#a5607a', '#cc8580'], '70,30,70')
  fill(g, w, 276, h, ['#b06b58', '#532c43', '#24152c'])
  for (let i = 0; i < 26; i++) glow(g, n() * w, 250 + n() * 100, 12 + n() * 16, 12 + n() * 16, '255,205,130', .3)
  grass(g, n, -10, 410, () => 290, 110, 30, ['#d58f5e', '#8a4b4b', '#4d2940', '#edb176'], 700)
  const tips: Point[] = []
  g.fillStyle = gradient(g, 0, 0, 110, 0, ['#241329', '#4c2a3b', '#86504a'])
  g.beginPath(); g.moveTo(-20, 400); g.lineTo(-20, -10); g.lineTo(64, -10); g.bezierCurveTo(46, 120, 60, 280, 116, 400); g.fill() // tronco
  for (let i = 0; i < 44; i++) {
    const x = n() * 78 - 12, y = n() * 340
    g.strokeStyle = i % 3 ? 'rgba(20,8,25,.4)' : 'rgba(255,180,120,.25)'; g.lineWidth = 1 + n() * 2
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x - 4, y + 30, x + 5, y + 60); g.stroke()
  }
  branch(g, n, 40, 24, 78, .1, 9, '#33192c', tips)
  for (const [x, y] of tips) for (let i = 0; i < 10; i++) leaf(g, x + (n() - .5) * 38, y + (n() - .5) * 30, 10 + n() * 10, n() * 6, ['#51293b', '#8f4a48', '#d88a5c', '#efb473'][i % 4])

  g.save(); g.translate(172, 250); g.rotate(-.27)
  g.fillStyle = gradient(g, -8, 0, 8, 0, ['#281326', '#5b3039', '#331a2b']); g.fillRect(-9, -190, 18, 190) // mástil
  g.fillStyle = 'rgba(255,220,170,.5)'
  for (let i = 0; i < 12; i++) g.fillRect(-9, -184 + i * (17 - i * .5), 18, 1)
  shape(g, [[-12, -184], [-14, -226], [0, -230], [14, -226], [12, -184]], '#341829')
  for (let i = 0; i < 3; i++) for (const s of [-1, 1]) { g.fillStyle = '#e9c390'; g.fillRect(s * 15 - 3, -220 + i * 13, 6, 4) }
  const body = () => {
    g.beginPath(); g.moveTo(0, -96)
    g.bezierCurveTo(54, -100, 76, -54, 54, -14); g.bezierCurveTo(44, 8, 60, 20, 74, 48)
    g.bezierCurveTo(104, 108, 58, 144, 0, 144); g.bezierCurveTo(-58, 144, -104, 108, -74, 48)
    g.bezierCurveTo(-60, 20, -44, 8, -54, -14); g.bezierCurveTo(-76, -54, -54, -100, 0, -96); g.closePath()
  }
  g.save(); g.translate(-9, 3); body(); g.fillStyle = '#3a1a28'; g.fill(); g.restore() // costado
  body()
  const wood = g.createRadialGradient(34, 20, 8, 0, 30, 170)
  wood.addColorStop(0, '#f6c37c'); wood.addColorStop(.4, '#cf8148'); wood.addColorStop(.75, '#8c4232'); wood.addColorStop(1, '#4a1f2b')
  g.fillStyle = wood; g.fill()
  g.save(); g.clip()
  for (let x = -90; x < 90; x += 2.6) { // veta
    g.strokeStyle = `rgba(80,25,20,${.05 + n() * .12})`; g.lineWidth = .5 + n()
    g.beginPath(); g.moveTo(x, -100); g.bezierCurveTo(x + 4, -20, x - 4, 70, x + 2, 144); g.stroke()
  }
  glow(g, 44, -44, 40, 70, '255,235,190', .45)
  g.restore()
  g.strokeStyle = '#f0c690'; g.lineWidth = 2.5; body(); g.stroke()
  g.fillStyle = '#3a1b2a'; g.fillRect(-9, -100, 18, 64)
  dot(g, 0, -8, 27, 27, '#2a1120'); dot(g, 3, -4, 21, 21, '#170916')
  for (const [r, c, l] of [[30, '#f0c690', 1.5], [33.5, '#5b2530', 2.5], [36.5, '#f0c690', .8]] as const) { g.strokeStyle = c; g.lineWidth = l; g.beginPath(); g.arc(0, -8, r, 0, 7); g.stroke() }
  shape(g, [[-34, 74], [-22, 70], [22, 70], [34, 74], [22, 82], [-22, 82]], '#2c1222')
  for (let i = 0; i < 6; i++) { g.strokeStyle = 'rgba(255,240,210,.85)'; g.lineWidth = .55 + (5 - i) * .12; g.beginPath(); g.moveTo(-6 + i * 2.4, -186); g.lineTo(-10 + i * 4, 74); g.stroke() }
  g.restore()
  grass(g, n, 80, 270, () => 384, 24, 36, ['#4d2940', '#7a4148', '#c07a56'], 170)
}

/** Flotar: farolitos que suben sobre el agua. */
export const flotar: Painter = (g, w, h) => {
  const n = seeded(127), hz = 270
  fill(g, w, 0, hz, ['#0e1740', '#2c3a78', '#70649c', '#c78f9f'])
  stars(g, n, w, 190, 120)
  cloud(g, n, 120, 200, 120, '190,150,190', '40,40,95', .4, .14)
  mountain(g, n, [[-20, 226], [50, 200], [110, 236], [190, 254], [270, 240], [340, 206], [420, 222]], hz, ['#38396f', '#58507f'], '10,10,45')
  for (let i = 0; i < 70; i++) { const x = i * 6; fir(g, n, x, hz + 1, 7 + n() * 10 + Math.abs(x - 200) * .07, '#222450') }
  const lantern = (x: number, y: number, s: number) => {
    glow(g, x, y, s * 2.8, s * 2.8, '255,175,95', .4)
    g.beginPath(); g.moveTo(x - s * .28, y + s * .55)
    g.bezierCurveTo(x - s * .55, y, x - s * .62, y - s * .65, x, y - s * .68)
    g.bezierCurveTo(x + s * .62, y - s * .65, x + s * .55, y, x + s * .28, y + s * .55); g.closePath()
    g.fillStyle = gradient(g, 0, y - s * .7, 0, y + s * .55, ['#c9645c', '#f6a65f', '#ffe9a8']); g.fill()
    g.strokeStyle = 'rgba(120,45,55,.35)'; g.lineWidth = Math.max(.4, s * .025)
    for (const k of [-.3, .3]) { g.beginPath(); g.moveTo(x, y - s * .66); g.quadraticCurveTo(x + k * s * 1.4, y - s * .3, x + k * s * .5, y + s * .54); g.stroke() }
    glow(g, x, y + s * .34, s * .4, s * .4, '255,255,220', .95)
    dot(g, x, y + s * .55, s * .28, s * .06, '#a3503f')
  }
  for (let i = 0; i < 46; i++) { const k = n(); lantern(170 + (n() - .5) * (90 + k * 280), 246 - k * 230, 4 + n() * 7) }
  for (const [x, y, s] of [[286, 120, 26], [106, 156, 22], [226, 190, 17], [154, 80, 15], [342, 206, 14]]) lantern(x, y, s)
  lantern(196, 130, 36)
  reflect(g, w, hz, h, ['#8d6f95', '#2a2b62', '#0b1235'], .65)
  for (const x of [112, 198, 288]) glints(g, n, x, hz + 3, h, 20, '255,195,125', 45)
  for (const [x, y, s] of [[70, 326, 17], [300, 346, 20], [236, 306, 10]]) { glow(g, x, y + s * .9, s * 2, s * .5, '255,190,110', .7); lantern(x, y, s) }
}

/** Para dormir: una cabañita con la luz prendida. */
export const dormir: Painter = (g, w, h) => {
  const n = seeded(139)
  fill(g, w, 0, 300, ['#050b25', '#18295a', '#52649a'])
  milkyWay(g, n, [60, -20], [250, 250], 40)
  stars(g, n, w, 280, 200)
  glow(g, 296, 92, 120, 120, '200,218,255', .5)
  g.beginPath(); g.arc(296, 92, 36, .72, 4.25); g.bezierCurveTo(250, 78, 264, 130, 296 + Math.cos(.72) * 36, 92 + Math.sin(.72) * 36)
  g.fillStyle = gradient(g, 260, 60, 320, 125, ['#fffdf0', '#cbd8f2']); g.fill()
  cloud(g, n, 330, 136, 80, '130,150,200', '20,30,75', .4, .14)
  mountain(g, n, [[-20, 230], [44, 176], [86, 206], [128, 162], [196, 240], [262, 214], [326, 180], [420, 226]], 310, ['#2b3e70', '#425584'], '3,10,40', { color: '#8ea3cc', depth: 34 })
  for (let i = 0; i < 46; i++) fir(g, n, i * 9, 292 + n() * 10, 18 + n() * 30, '#1a2a55')
  glow(g, 200, 292, 240, 26, '130,155,210', .4)
  shape(g, [...spline([[-20, 306], [80, 292], [170, 312], [260, 300], [420, 316]]), [420, 410], [-20, 410]], gradient(g, 0, 294, 0, h, ['#8299c4', '#40568a', '#22305f']))
  for (let i = 0; i < 500; i++) dot(g, n() * w, 316 + n() * 84, .8, .6, `rgba(225,238,255,${n() * .6})`)
  for (const [x, y, s] of [[26, 356, 220], [72, 330, 110], [112, 316, 60], [378, 360, 250], [336, 330, 120], [298, 318, 66]]) fir(g, n, x, y, s, s > 200 ? '#071030' : '#10204a')
  shape(g, [[146, 284], [186, 250], [226, 284], [226, 330], [146, 330]], '#352c45')
  shape(g, [[226, 284], [266, 276], [266, 320], [226, 330]], '#211d3a')
  for (let y = 288; y < 328; y += 7) { g.fillStyle = 'rgba(8,5,25,.4)'; g.fillRect(146, y, 80, 1.5) }
  g.fillStyle = '#28233d'; g.fillRect(244, 244, 12, 26)
  shape(g, [[186, 242], [228, 236], [274, 278], [232, 287]], gradient(g, 200, 240, 250, 290, ['#c8d8f0', '#7188b6']))
  shape(g, [[138, 284], [186, 242], [232, 286], [224, 288], [186, 254], [146, 291]], '#dce8f8')
  for (let i = 0; i < 12; i++) glow(g, 252 + i * 2 + Math.sin(i * .8) * 5, 240 - i * 8, 5 + i * 1.5, 5 + i, '175,188,220', .3)
  for (const [x, y, ww, hh] of [[160, 294, 20, 18], [239, 290, 12, 13]]) {
    glow(g, x + ww / 2, y + hh / 2, 44, 40, '255,185,105', .7)
    g.fillStyle = gradient(g, 0, y, 0, y + hh, ['#ffe9ae', '#f3a35c']); g.fillRect(x, y, ww, hh)
    g.fillStyle = '#5a3a3c'; g.fillRect(x + ww / 2 - .8, y, 1.6, hh); g.fillRect(x, y + hh / 2 - .8, ww, 1.6)
  }
  g.fillStyle = '#17132c'; g.fillRect(194, 298, 18, 32)
  glow(g, 172, 340, 70, 20, '255,190,120', .4)
}
