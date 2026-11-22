import { load, save } from './lib'

// off = lo apagó; waiting = volvió de Spotify u otra app y no lo queremos interrumpir
export type SoundState = 'idle' | 'on' | 'off' | 'waiting'
let state: SoundState = load('muted', false) ? 'off' : load('away', false) ? 'waiting' : 'idle'
let ctx: AudioContext | undefined
let loaded: Promise<void> | undefined
const listeners = new Set<() => void>()
const set = (next: SoundState) => { state = next; listeners.forEach(f => f()) }

async function play() {
  set('on'); save('muted', false); save('away', false)
  try {
    ctx ??= new AudioContext()
    const c = ctx
    const resumed = c.resume() // tiene que salir dentro del toque, por iPhone
    loaded ??= (async () => {
      const buffer = await c.decodeAudioData(await (await fetch('/agua.wav')).arrayBuffer())
      const source = c.createBufferSource(), gain = c.createGain()
      source.buffer = buffer; source.loop = true
      gain.gain.setValueAtTime(0, c.currentTime); gain.gain.linearRampToValueAtTime(.5, c.currentTime + 3)
      source.connect(gain).connect(c.destination); source.start()
    })().catch(error => { loaded = undefined; throw error })
    await Promise.all([resumed, loaded])
    if (state !== 'on') await c.suspend()
  } catch (error) {
    console.error('No se pudo iniciar el sonido', error)
    if (state === 'on') set('waiting')
  }
}

export const sound = {
  get: () => state,
  subscribe: (f: () => void) => { listeners.add(f); return () => { listeners.delete(f) } },
  firstTouch() { if (state === 'idle') void play() },
  toggle() {
    if (state !== 'on') return void play()
    set('off'); save('muted', true); void ctx?.suspend()
  },
  toSpotify() {
    save('away', true)
    if (state !== 'off') set('waiting')
    void ctx?.suspend()
  },
  hidden() {
    if (state === 'on') set('waiting')
    void ctx?.suspend()
  },
  tone(label: string) {
    if (state !== 'on' || !ctx) return
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime
    o.frequency.value = label === 'Exhala' ? 329.63 : label === 'Mantén' ? 392 : 493.88
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.09, t + .12); g.gain.exponentialRampToValueAtTime(.001, t + 1.5)
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 1.55)
  },
}
