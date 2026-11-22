import { useEffect, useRef, useState } from 'react'
import { breathAt } from './lib'
import { sound } from './sound'
import type { Breath, Step } from './content'

type Props = { breath: Breath; steps: Step[]; rounds: number; onDone: () => void; onExit: () => void }

export function Session({ breath, steps, rounds, onDone, onExit }: Props) {
  const [elapsed, setElapsed] = useState(-3)
  const [paused, setPaused] = useState(false)
  const [screenMayLock, setScreenMayLock] = useState(false)
  const time = useRef(-3)
  const total = steps.reduce((n, s) => n + s.seconds, 0) * rounds
  const done = elapsed >= total
  const now = breathAt(steps, Math.max(0, elapsed))
  const ready = elapsed < 0

  useEffect(() => {
    if (paused || done) return
    let frame = 0, last = performance.now()
    const tick = (at: number) => {
      time.current += Math.max(0, at - last) / 1000; last = at
      setElapsed(time.current); frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [paused, done])

  useEffect(() => {
    if (!ready && !done && !paused) sound.tone(now.label)
  }, [now.index, ready, done, paused])

  useEffect(() => { if (done) onDone() }, [done])

  useEffect(() => {
    const hide = () => { if (document.hidden) setPaused(true) }
    document.addEventListener('visibilitychange', hide)
    return () => document.removeEventListener('visibilitychange', hide)
  }, [])

  useEffect(() => {
    if (paused || done) return
    let lock: WakeLockSentinel | undefined, ended = false
    if (!('wakeLock' in navigator)) setScreenMayLock(true)
    else navigator.wakeLock.request('screen')
      .then(l => { if (ended) void l.release(); else { lock = l; setScreenMayLock(false) } })
      .catch(() => { if (!ended) setScreenMayLock(true) })
    return () => { ended = true; void lock?.release() }
  }, [paused, done])

  const size = ready || done ? 0 : now.size
  const left = done ? 0 : Math.ceil(total - Math.max(0, elapsed))
  const title = done ? 'Bien hecho' : paused ? 'En pausa' : ready ? 'Ponte cómodo' : now.label

  // la cuenta previa ya le avisa por dónde va a entrar el aire
  const guide = done || paused ? '' : ready ? 'Vas a inhalar por la nariz'
    : steps[now.index].via ? `por la ${steps[now.index].via}` : 'sin forzar'

  return <main className="screen session" aria-label={breath.name}>
    <h1 aria-live="polite"><span className="swap" key={title}>{title}</span></h1>
    <p className="via" aria-live="polite"><span className="swap" key={title + guide}>{guide}</span></p>
    <div className="orb">
      <i className="limit" />
      {/* vacío = 0,58 del borde; lleno = el borde */}
      <div className="ball" style={{ transform: `scale(${.58 + .42 * size})` }}>
        <div className="water" style={{ transform: `translateY(${(1 - size) * 62 + 12}%)` }}>
          {['behind', 'ahead'].map(c => <svg key={c} className={c} viewBox="0 0 400 200" preserveAspectRatio="none"><path d="M0 12Q25 0 50 12T100 12T150 12T200 12T250 12T300 12T350 12T400 12V200H0Z" /></svg>)}
        </div>
      </div>
      <span className={`count ${done ? 'gone' : ''}`}>
        {!done && <span className="tick" key={ready ? `r${Math.ceil(-elapsed)}` : `${now.index}-${now.count}`}>{ready ? Math.ceil(-elapsed) : now.count}</span>}
      </span>
    </div>
    <p className="left">{Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</p>
    {screenMayLock && !done && <p className="lock">Si la pantalla se atenúa, tócala suavecito.</p>}
    <footer className="controls">
      <button disabled={done} onClick={() => setPaused(!paused)}><span className="swap" key={String(paused)}>{paused ? 'Seguir' : 'Pausar'}</span></button>
      <button onClick={onExit}>Terminar</button>
    </footer>
  </main>
}
