// Genera el loop de agua sin cortes, sin material de terceros: node scripts/assets.mjs
import { writeFileSync } from 'node:fs'

let seed = 7
const random = () => (seed = seed * 16807 % 2147483647) / 2147483647
const rate = 22050, N = rate * 24, F = rate * 2, raw = new Float32Array(N + F)
// Agua mansa, sin burbujas: un rumor grave y parejo que sube y baja muy despacio, como un lago.
// Los vaivenes duran 6 y 8 segundos, así entran justos en el loop de 24 y no se nota el corte.
let low = 0, mid = 0, soft = 0
for (let i = 0; i < raw.length; i++) {
  const t = i / rate, w = random() * 2 - 1
  low += .02 * (w - low); mid += .07 * (w - mid); soft += .3 * (mid - soft)
  const breath = .78 + .14 * Math.sin(2 * Math.PI * t / 6) + .08 * Math.sin(2 * Math.PI * t / 8 + 1)
  raw[i] = (low * .36 + (soft - low) * .045) * breath
}
const out = raw.slice(0, N)
for (let i = 0; i < F; i++) { const k = i / F * Math.PI / 2; out[i] = raw[i] * Math.sin(k) + raw[N + i] * Math.cos(k) }
const peak = out.reduce((m, x) => Math.max(m, Math.abs(x)), 0), wav = Buffer.alloc(44 + N * 2)
wav.write('RIFF'); wav.writeUInt32LE(36 + N * 2, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22)
wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 2, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(N * 2, 40)
out.forEach((x, i) => wav.writeInt16LE(Math.round(x / peak * .65 * 32767), 44 + i * 2))
writeFileSync('public/agua.wav', wav)
