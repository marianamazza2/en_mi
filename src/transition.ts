import { flushSync } from 'react-dom'

/*
  Fundido cruzado. Toda navegación pasa por crossfade():
  1. se saca una copia de lo que está en pantalla,
  2. se cambia la pantalla al instante,
  3. la copia se va desenfocándose mientras lo nuevo llega enfocándose. Nunca queda vacío,
     y no se leen dos textos encimados.

  Solo se funde lo que cambia: si el logo o el menú son los mismos, no parpadean.
  No usa View Transitions porque congela el paisaje y falta en iPhones con iOS anterior a 18.
*/
const TIMING = {
  welcome: { out: 1300, wait: 120, in: 2100 },
  screen: { out: 900, wait: 40, in: 1600 },
}
// el menú solo se funde; el contenido y lo de arriba además cambian de foco
const look = (key: string, opacity: number, blur: number): Keyframe =>
  key !== 'nav' ? { opacity, filter: `blur(${blur}px)` } : { opacity }
/*
  Las curvas son estos puntos: momento (0 a 1), opacidad, desenfoque en px.
  En el medio las dos opacidades suman cerca de 0,7: presente, sin doble lectura.
*/
const LEAVES = [[0, 1, 0], [.2, .86, 2.5], [.45, .48, 5], [.75, .1, 7], [1, 0, 7]]
const ARRIVES = [[0, 0, 6], [.15, .16, 4.5], [.3, .4, 2.6], [.5, .7, .9], [.72, .92, 0], [1, 1, 0]]

type Part = { el: HTMLElement; signature: string; ghost: HTMLElement; opacity: number }
const SELECTORS = { main: '.stage main', header: '.stage header', nav: '.stage nav' }
const arriving = new WeakMap<Element, Animation>()

function snapshot(el: HTMLElement): Part {
  const ghost = el.cloneNode(true) as HTMLElement
  const box = el.getBoundingClientRect(), opacity = +getComputedStyle(el).opacity

  ghost.classList.add('ghost')
  ghost.setAttribute('aria-hidden', 'true')
  ghost.inert = true
  Object.assign(ghost.style, {
    position: 'fixed', left: `${box.left}px`, top: `${box.top}px`, width: `${box.width}px`, height: `${box.height}px`, margin: '0',
  })
  ghost.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'))
  ghost.querySelectorAll('[aria-live]').forEach(node => node.removeAttribute('aria-live'))

  // cloneNode no copia lo pintado en los canvas
  const painted = el.querySelectorAll('canvas')
  ghost.querySelectorAll('canvas').forEach((copy, i) => {
    if (painted[i].width) copy.getContext('2d')?.drawImage(painted[i], 0, 0)
  })
  return { el, signature: el.className + el.innerHTML, ghost, opacity }
}

export function crossfade(update: () => void, pace: keyof typeof TIMING = 'screen') {
  const time = TIMING[pace], before = new Map<string, Part>(), scrolls = new Map<string, number>()
  for (const [key, selector] of Object.entries(SELECTORS)) {
    const el = document.querySelector<HTMLElement>(selector)
    if (!el) continue
    before.set(key, snapshot(el))
    scrolls.set(key, el.querySelector('.scroll')?.scrollTop ?? 0)
  }

  flushSync(update)

  for (const [key, selector] of Object.entries(SELECTORS)) {
    const old = before.get(key), el = document.querySelector<HTMLElement>(selector)
    if (!old && !el) continue
    if (old && el) {
      // el menú solo cambia de pestaña marcada, y eso ya se funde por CSS
      if (key === 'nav') continue
      if (old.signature === el.className + el.innerHTML) continue
    }

    if (old && old.opacity > .01) {
      document.body.append(old.ghost)
      const scroll = old.ghost.querySelector('.scroll')
      if (scroll) scroll.scrollTop = scrolls.get(key)!
      const out = old.ghost.animate(LEAVES.map(([offset, o, blur]) => ({ ...look(key, o * old.opacity, blur), offset })), { duration: time.out, fill: 'forwards' })
      out.onfinish = out.oncancel = () => old.ghost.remove()
    }

    if (el) {
      arriving.get(el)?.cancel()
      arriving.set(el, el.animate(ARRIVES.map(([offset, o, blur]) => ({ ...look(key, o, blur), offset })), { duration: time.in, delay: time.wait, fill: 'backwards' }))
    }
  }
}
