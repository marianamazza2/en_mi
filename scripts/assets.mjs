// Genera el loop de agua sin cortes, sin material de terceros: node scripts/assets.mjs
import { writeFileSync } from 'node:fs'

let seed = 7
const random = () => (seed = seed * 16807 % 2147483647) / 2147483647
const rate = 22050, N = rate * 24, F = rate * 2, raw = new Float32Array(N + F)
let low = 0, mid = 0
for (let i = 0; i < raw.length; i++) {
  const t = i / rate, w = random() * 2 - 1
  low += .025 * (w - low); mid += .12 * (w - mid)
  raw[i] = low * (.32 + .09 * Math.sin(t * 1.3)) + (mid - low) * (.07 + .025 * Math.sin(t * 2.1))
}
const out = raw.slice(0, N)
for (let i = 0; i < F; i++) { const k = i / F * Math.PI / 2; out[i] = raw[i] * Math.sin(k) + raw[N + i] * Math.cos(k) }
// burbujitas de arroyo
for (let j = 0; j < 1000; j++) {
  const at = Math.floor(random() * N), len = Math.floor(rate * (.025 + random() * .07)), f = 260 + random() ** 2 * 850, amp = .008 + random() ** 3 * .045
  let phase = 0
  for (let i = 0; i < len; i++) {
    phase += 2 * Math.PI * f * (1 + .6 * i / len) / rate
    out[(at + i) % N] += amp * Math.sin(phase) * Math.sin(Math.PI * i / len) ** 2
  }
}
const peak = out.reduce((m, x) => Math.max(m, Math.abs(x)), 0), wav = Buffer.alloc(44 + N * 2)
wav.write('RIFF'); wav.writeUInt32LE(36 + N * 2, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22)
wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 2, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(N * 2, 40)
out.forEach((x, i) => wav.writeInt16LE(Math.round(x / peak * .65 * 32767), 44 + i * 2))
writeFileSync('public/agua.wav', wav)
