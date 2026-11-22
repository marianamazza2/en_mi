import { finish, seeded, type Painter } from './brushes'
import * as noise from './noise'
import * as nature from './nature'
import * as melodies from './melodies'

export const painters = { ...noise, ...nature, ...melodies } satisfies Record<string, Painter>
export type CoverName = keyof typeof painters

const done = new Map<string, HTMLCanvasElement>()

/** Cada portada se pinta una sola vez por sesión. */
export function artwork(name: CoverName, ratio: number) {
  const key = `${name}:${ratio}`
  let canvas = done.get(key)
  if (canvas) return canvas
  canvas = document.createElement('canvas')
  canvas.width = Math.round(480 * ratio); canvas.height = 480
  const g = canvas.getContext('2d')!, w = 400 * ratio
  g.scale(480 / 400, 480 / 400)
  painters[name](g, w, 400)
  finish(g, w, 400, seeded(name.length * 17 + 5))
  done.set(key, canvas)
  return canvas
}

export const ready = (name: CoverName, ratio: number) => done.has(`${name}:${ratio}`)
