import { createRoot } from 'react-dom/client'
import '@fontsource/fraunces/latin-300.css'
import '@fontsource/nunito-sans/latin-300.css'
import '@fontsource/nunito-sans/latin-400.css'
import './style.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(<App />)
