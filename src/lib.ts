import { useEffect, useState } from 'react'
import type { Step } from './content'

export type Theme = 'dia' | 'atardecer' | 'noche'
export const themeAt = (hour: number): Theme => hour >= 6 && hour < 18 ? 'dia' : hour >= 18 && hour < 21 ? 'atardecer' : 'noche'

export const load = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(`enmi:${key}`) ?? '') } catch { return fallback }
}
export const save = (key: string, value: unknown) => {
  try { localStorage.setItem(`enmi:${key}`, JSON.stringify(value)) } catch { /* navegación privada */ }
}
export function useSaved<T>(key: string, fallback: T) {
  const [value, set] = useState<T>(() => load(key, fallback))
  useEffect(() => save(key, value), [key, value])
  return [value, set] as const
}

export function breathAt(steps: Step[], elapsed: number) {
  let t = elapsed % steps.reduce((sum, s) => sum + s.seconds, 0)
  let from = steps[steps.length - 1].to
  for (let index = 0; index < steps.length; index++) {
    const s = steps[index]
    if (t < s.seconds) return { index, label: s.label, count: Math.floor(t) + 1, size: from + (s.to - from) * (1 - Math.cos(Math.PI * t / s.seconds)) / 2 }
    t -= s.seconds; from = s.to
  }
  return { index: 0, label: steps[0].label, count: 1, size: from }
}
