import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { breaths, groups, meditations, type Breath, type Meditation } from './content'
import { themeAt, useSaved, type Theme } from './lib'
import { Emblem, Icon, NavIcon, RhythmChart, RhythmIcon } from './Art'
import { Logo } from './Brand'
import { Welcome } from './Welcome'
import { Guide } from './Guide'
import { MusicList, prepareMusic } from './MusicList'
import { Scene } from './Scene'
import { Session } from './Session'
import { sound } from './sound'
import { crossfade } from './transition'

const go = (path: string) => { location.hash = path }
const route = () => location.hash.slice(1) || 'inicio'
const testing = import.meta.env.DEV || new URLSearchParams(location.search).has('prueba')
const apple = /iPhone|iPad|iPod/.test(navigator.userAgent)
const FAVORITES = 'Favoritas'
// los tres caminos del inicio; desde cada uno se vuelve tocando el logo
const PATHS = [
  ['meditar', 'Meditar', 'Meditaciones guiadas para acompañarte'],
  ['respirar', 'Respirar', 'Un círculo que marca el ritmo'],
  ['musica', 'Música', 'Sonidos y melodías para relajarte'],
] as const

function Speaker() {
  const on = useSyncExternalStore(sound.subscribe, sound.get) === 'on'
  return <div className="speaker">
    {on && apple && <small className="brief">¿No lo oyes? Revisa el modo silencio</small>}
    <button className="tool" data-sound onClick={sound.toggle} aria-label={on ? 'Silenciar' : 'Activar sonido'}><Icon key={String(on)} name={on ? 'sound' : 'muted'} /></button>
  </div>
}

const Back = ({ onClick }: { onClick: () => void }) =>
  <button className="tool start" onClick={onClick} aria-label="Volver"><Icon name="back" /></button>

const BreathItem = ({ breath }: { breath: Breath }) =>
  <button className="breath" data-id={breath.id} onClick={() => go(`respirar/${breath.id}`)}>
    <RhythmIcon steps={breath.steps} />
    <span><b>{breath.name}</b><span className="purpose">{breath.use}</span><span className="use">{breath.moment}</span></span>
  </button>

const Practice = ({ item }: { item: Meditation }) =>
  <button className="practice" onClick={() => go(`meditar/${item.id}`)}>
    <span>{item.moment && <span className="moment">{item.moment}</span>}<b>{item.name}</b></span>
    <span className="minutes">{item.minutes} min</span>
  </button>

export function App() {
  const [entered, setEntered] = useState(false)
  const [path, setPath] = useState(route)
  const [hourTheme, setHourTheme] = useState(() => themeAt(new Date().getHours()))
  const [testTheme, setTestTheme] = useState<Theme>()
  const [open, setOpen] = useState('') // entra con todo cerrado
  const [favorites, setFavorites] = useSaved<string[]>('favorites', [])
  const [stars, setStars] = useSaved('stars', 0)
  const [installSeen, setInstallSeen] = useSaved('installSeen', false)
  const [guided, setGuided] = useSaved('guided', false)
  const [showGuide, setShowGuide] = useState(false)
  const [minutes, setMinutes] = useState(3)
  const [gentle, setGentle] = useState(false)
  const [running, setRunning] = useState<{ breath: Breath; rounds: number; gentle: boolean }>()
  const theme = testTheme ?? hourTheme

  const scroller = useRef<HTMLDivElement>(null)
  const current = useRef(path)
  const from = useRef('') // de dónde entró al detalle, para volver ahí
  const scrolled = useRef<Record<string, number>>({})

  useEffect(() => {
    const change = () => {
      const last = current.current, next = route()
      if (scroller.current) scrolled.current[last] = scroller.current.scrollTop
      if (!last.includes('/')) from.current = last
      // solo conserva el lugar al volver de un detalle
      if (!next.includes('/') && !last.includes('/')) scrolled.current[next] = 0
      current.current = next
      crossfade(() => {
        setPath(next); setRunning(undefined)
        // al llegar a Meditar, todo cerrado; al volver de una meditación, como lo dejó
        if (next === 'meditar' && !last.startsWith('meditar/')) setOpen('')
      })
    }
    addEventListener('hashchange', change)
    return () => removeEventListener('hashchange', change)
  }, [])

  useLayoutEffect(() => {
    scroller.current?.scrollTo(0, path.includes('/') ? 0 : scrolled.current[path] ?? 0)
  }, [path, running])

  useEffect(() => {
    if (running) return // nunca cambia en medio de una respiración
    const update = () => setHourTheme(themeAt(new Date().getHours()))
    update()
    const timer = setInterval(update, 30000)
    return () => clearInterval(timer)
  }, [running])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', { dia: '#124f70', atardecer: '#1d1945', noche: '#030818' }[theme])
  }, [theme])

  useEffect(() => {
    const touch = (e: MouseEvent) => { if (!(e.target as Element).closest('a,[data-sound]')) sound.firstTouch() }
    const hide = () => { if (document.hidden) sound.hidden() }
    document.addEventListener('click', touch, true); document.addEventListener('visibilitychange', hide)
    return () => { document.removeEventListener('click', touch, true); document.removeEventListener('visibilitychange', hide) }
  }, [])

  // apenas abre, mientras él mira la bienvenida
  useEffect(() => {
    let cancel = () => {}
    const timer = setTimeout(() => { cancel = prepareMusic() }, 2400)
    return () => { clearTimeout(timer); cancel() }
  }, [])

  const start = (breath: Breath, min: number, soft = false) => {
    const steps = soft && breath.gentle ? breath.gentle : breath.steps
    const rounds = breath.rounds ?? Math.ceil(min * 60 / steps.reduce((n, s) => n + s.seconds, 0))
    crossfade(() => setRunning({ breath, gentle: soft, rounds }))
  }

  const toggleGroup = (name: string, header: HTMLElement) => {
    setOpen(open === name ? '' : name)
    // si se cerró uno de más arriba, el que tocó no se pierde de vista
    setTimeout(() => header.parentElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 770)
  }

  const [section, id] = path.split('/')
  const breath = section === 'respirar' ? breaths.find(b => b.id === id) : undefined
  const item = section === 'meditar' ? meditations.find(m => m.id === id) : undefined
  const atHome = !PATHS.some(([key]) => key === section)
  const installed = matchMedia('(display-mode: standalone)').matches
  const back = () => go(from.current || section)
  const tabs = !running && !breath && !item
  const onHome = entered && tabs && atHome

  useEffect(() => {
    if (!onHome || guided) return setShowGuide(false)
    // espera a que el inicio termine de llegar, para iluminar en el lugar justo
    const timer = setTimeout(() => setShowGuide(true), 2600)
    return () => clearTimeout(timer)
  }, [onHome, guided])

  const sections = favorites.some(f => meditations.some(m => m.id === f))
    ? [...groups, { name: FAVORITES, when: 'Las que te hacen bien' }] : groups

  return <>
    <Scene theme={theme} calm={!!running} shade={!entered ? 'none' : running || breath || item ? 'soft' : !atHome ? 'deep' : 'home'} earned={stars} />

    <div className="stage" inert={showGuide}>
    {!entered ? <Welcome onEnter={() => crossfade(() => setEntered(true), 'welcome')} /> : <div className="app">
      <header>
        {running ? <span />
          : breath || item ? <Back onClick={back} />
          // el logo siempre lleva al inicio
          : <button className="brand" aria-label="Volver al inicio" onClick={() => go('inicio')}><Logo /></button>}
        {item
          ? <button className="tool end favorite" aria-label="Favorita" aria-pressed={favorites.includes(item.id)}
              onClick={() => setFavorites(f => f.includes(item.id) ? f.filter(x => x !== item.id) : [...f, item.id])}><Icon name="heart" /></button>
          : !breath || running ? <Speaker /> : null}
      </header>

      {running ? <Session breath={running.breath} rounds={running.rounds}
        steps={running.gentle && running.breath.gentle ? running.breath.gentle : running.breath.steps}
        onDone={() => setStars(n => n + 1)} onExit={() => crossfade(() => setRunning(undefined))} />

      : item ? <main className="screen" key={path}>
        <div className="scroll meditation" ref={scroller}>
          <Emblem group={item.group} />
          <h1>{item.name}</h1>
          <p className="lead">{item.about}</p>
          <p className="length">{item.minutes} minutos</p>
        </div>
        <footer className="listen">
          <p className="aside">Ponte cómodo y, si quieres, cierra los ojos.</p>
          <a className="primary" href={`https://open.spotify.com/episode/${item.id}`} target="_blank" rel="noopener noreferrer" onClick={sound.toSpotify}>Escuchar en Spotify</a>
          <p className="by">{item.by}</p>
        </footer>
      </main>

      : breath ? <main className="screen" key={path}>
        <div className="scroll technique" ref={scroller}>
          <h1>{breath.name}</h1>
          <p className="aim">{breath.use}</p>
          <dl className="explain">
            <dt>Qué hace</dt><dd>{breath.does}</dd>
            <dt>Cuándo usarla</dt><dd>{breath.when}</dd>
            <dt>Cómo se hace</dt><dd>{breath.how}</dd>
          </dl>
          <RhythmChart key={String(gentle)} steps={gentle && breath.gentle ? breath.gentle : breath.steps} />
          <div className="options">
            {breath.rounds ? <p className="rounds">{breath.rounds} vueltas</p>
              : <div className="durations">{[1, 3, 5].map(n =>
                <button key={n} className="duration" aria-pressed={minutes === n} onClick={() => setMinutes(n)}>{n} min</button>)}</div>}
            {breath.gentle && <button className="toggle" role="switch" aria-checked={gentle} onClick={() => setGentle(!gentle)}>Más suave (3 y 6)<i /></button>}
            <p className="caution">Si te mareas, vuelve a tu ritmo natural.<br />Evita hacerlo al manejar o en el agua.</p>
          </div>
        </div>
        <footer className="launch"><button className="primary" onClick={() => start(breath, minutes, gentle)}>Empezar</button></footer>
      </main>

      : section === 'meditar' ? <main className="screen" key={path}>
        <div className="scroll listing" ref={scroller}>
          <h1>Meditar</h1>
          <p className="subtitle">Elige a tu ritmo</p>
          <div className="accordion">{sections.map(({ name, when }) =>
            <div className="group" data-group={name} key={name}>
              <h2><button className="group-head" aria-expanded={open === name} onClick={e => toggleGroup(name, e.currentTarget.parentElement!)}>
                <i className="dot" /><span>{name}<span className="use">{when}</span></span><Icon name="chevron" />
              </button></h2>
              {/* siempre está, para que pueda abrir y cerrar deslizando */}
              <div className="fold" data-open={open === name} inert={open !== name}><div>
                <div className="practices">
                  {meditations.filter(m => name === FAVORITES ? favorites.includes(m.id) : m.group === name).map(m => <Practice key={m.id} item={m} />)}
                </div>
              </div></div>
            </div>)}
          </div>
        </div>
      </main>

      : section === 'respirar' ? <main className="screen" key={path}>
        <div className="scroll listing" ref={scroller}>
          <h1>Respirar</h1>
          <p className="subtitle">Déjate llevar por el círculo</p>
          <div className="breaths">{breaths.map(b => <BreathItem key={b.id} breath={b} />)}</div>
          {!installed && !installSeen && <div className="install">
            <span>{apple ? 'Para tenerla siempre cerca, en Safari: Compartir → Agregar a inicio.' : 'Para tenerla siempre cerca, en Chrome: menú ⋮ → Instalar.'}</span>
            <button className="tool end" aria-label="Cerrar aviso" onClick={() => crossfade(() => setInstallSeen(true))}>×</button>
          </div>}
        </div>
      </main>

      : section === 'musica' ? <main className="screen" key={path}>
        <div className="scroll listing" ref={scroller}>
          <h1>Música</h1>
          <p className="subtitle">Elige un sonido y se abre en Spotify</p>
          <MusicList />
        </div>
      </main>

      : <main className="screen" key="inicio">
        <div className="scroll home" ref={scroller}>
          <h1>¿Qué te haría<br /><span>bien ahora?</span></h1>
          <p className="subtitle">Un momento para volver a ti</p>
          <div className="paths">{PATHS.map(([key, label, about]) =>
            <button key={key} className="path" data-path={key} onClick={() => go(key)}>
              <span className="ring"><NavIcon name={key} /></span>
              <span><b>{label}</b><span className="use">{about}</span></span>
              <Icon name="chevron" />
            </button>)}
          </div>
        </div>
      </main>}

    </div>}
    </div>

    {showGuide && <Guide onDone={() => setGuided(true)} />}

    {testing && !running && <div className="test">{(['dia', 'atardecer', 'noche'] as Theme[]).map(t =>
      <button key={t} aria-pressed={theme === t} onClick={() => setTestTheme(t)}>{t === 'dia' ? 'día' : t}</button>)}
      <button onClick={() => { setGuided(false); if (path !== 'inicio') go('inicio') }}>ver guía</button></div>}
  </>
}
