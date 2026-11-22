import type { Step } from './content'

const glyphs: Record<string, string> = {
  'Calmar la ansiedad': 'M7 20.5q6.5-7 13 0t13 0M7 26.5q6.5-7 13 0t13 0M13.5 15q6.5-7 13 0',
  'Volver al presente': 'M20 7a13 13 0 1 0 .1 0M20 13a7 7 0 1 0 .1 0M20 19a1 1 0 1 0 .1 0',
  'Acompañar lo que sientes': 'M20 29c-7-5-7-13 0-20 7 7 7 15 0 20M20 29C9 30 5 23 6 16c6 0 11 4 14 13M20 29c11 1 15-6 14-13-6 0-11 4-14 13',
  'Relajar el cuerpo': 'M10 31C6 15 17 7 32 8c1 16-8 25-22 23M7 34 24 17M16 25v-8M16 25h8',
  Dormir: 'M24 7a14 14 0 1 0 9 22A13 13 0 0 1 24 7M31 11v5M28.5 13.5h5',
  'Comenzar y cerrar el día': 'M11 27a9 9 0 0 1 18 0M6 27h28M12 32h16M20 8v5M8 15l3 3M32 15l-3 3',
}
export const Emblem = ({ group, large }: { group: string; large?: boolean }) =>
  <span className={`emblem ${large ? 'large' : ''}`} data-group={group} aria-hidden="true"><svg viewBox="0 0 40 40"><path d={glyphs[group]} /></svg></span>

/** El dibujo real de cada ritmo: sube al inhalar, queda plano al retener, baja al exhalar. */
function curve(steps: Step[], left: number, right: number, top: number, bottom: number) {
  const total = steps.reduce((n, s) => n + s.seconds, 0), marks: number[] = []
  let x = left, y = bottom, d = `M${x} ${y}`
  for (const step of steps) {
    const nx = x + step.seconds / total * (right - left), ny = bottom - step.to * (bottom - top), m = (x + nx) / 2
    d += `C${m} ${y} ${m} ${ny} ${nx} ${ny}`; x = nx; y = ny
    marks.push(nx)
  }
  return { d, marks: marks.slice(0, -1) }
}

export const RhythmIcon = ({ steps }: { steps: Step[] }) =>
  <span className="ring" aria-hidden="true"><svg viewBox="0 0 56 56"><path d={curve(steps, 15, 41, 20, 36).d} /></svg></span>

export function RhythmChart({ steps }: { steps: Step[] }) {
  const { d, marks } = curve(steps, 1, 333, 8, 88)
  return <div className="chart">
    <svg viewBox="0 0 334 96" preserveAspectRatio="none" aria-hidden="true">
      {marks.map(x => <path className="tick" key={x} d={`M${x} 18V92`} />)}<path d={d} />
    </svg>
    <div className="labels">{steps.map((s, i) =>
      <span key={i} style={{ flexGrow: s.seconds }}>{s.seconds === 1 ? '+1' : `${s.label} ${s.seconds}`}<small>{s.via}</small></span>)}</div>
  </div>
}

export function Icon({ name }: { name: 'back' | 'chevron' | 'heart' | 'sound' | 'muted' }) {
  const d = { chevron: 'm5 9 7 7 7-7', back: 'M16 4.5 8 12l8 7.5', heart: 'M12 20C6 15.5 2.5 12 2.5 8a4.7 4.7 0 0 1 9.5-1.5A4.7 4.7 0 0 1 21.5 8c0 4-3.5 7.5-9.5 12z', sound: 'M4 9h4l5-4v14l-5-4H4zM16 8q4 4 0 8M19 5q6 7 0 14', muted: 'M4 9h4l5-4v14l-5-4H4zM17 9l5 6m0-6-5 6' }[name]
  return <svg className={`icon ${name}`} viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>
}

export function NavIcon({ name }: { name: string }) {
  const d = name === 'musica' ? 'M9 18V6l11-2v12M9 10l11-2M9 18a3 2.5 0 1 1-6 0 3 2.5 0 1 1 6 0M20 16a3 2.5 0 1 1-6 0 3 2.5 0 1 1 6 0'
    : name === 'meditar' ? 'M12 19c-5-4-5-9 0-14 5 5 5 10 0 14M12 19c-8 1-10-5-9-9 4 0 7 3 9 9M12 19c8 1 10-5 9-9-4 0-7 3-9 9'
    : 'M12 3a9 9 0 1 0 .1 0M12 8a4 4 0 1 0 .1 0'
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>
}
