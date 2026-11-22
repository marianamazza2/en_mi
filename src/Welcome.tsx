import { Logo } from './Brand'

// El toque para entrar es también el que habilita el sonido de agua.
export const Welcome = ({ onEnter }: { onEnter: () => void }) =>
  <main className="welcome">
    <button className="enter" onClick={onEnter} aria-label="en mí. Un momento para volver a ti. Toca para entrar" autoFocus>
      <Logo className="welcome-logo" />
      <span className="tagline">Un momento para volver a ti</span>
      <span className="hint">Toca para entrar</span>
    </button>
  </main>
