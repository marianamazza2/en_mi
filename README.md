# en mí

Web app para meditar y respirar, para Android y iPhone.

- `npm install` y `npm run dev`: abrirla
- `npm run build`: versión para publicar, en `dist/`
- `?prueba` al final de la dirección: botones para ver día, atardecer y noche

## Dónde se cambia cada cosa
- Textos, meditaciones, respiraciones y tiempos: `src/content.ts`
- Horarios de cada estilo: `themeAt` en `src/lib.ts`
- Colores: `src/style.css` (textos y botones) y `src/scene/palette.ts` (paisaje)
- Sonido de agua: `node scripts/assets.mjs` lo genera. Para usar una grabación, reemplazar `public/agua.wav`.

## Marca
- `marca/`: logo e isotipo con fondo transparente (SVG; el logo también en PNG).
- En la app: `src/Brand.tsx`. Íconos del celu y favicon: `public/`.

## Tono
- El inicio pregunta qué necesita, no qué le pasa. No usar nombres de malestares como botones, ni guardar historial de ánimo.
- Suave y amoroso: invitar en vez de ordenar, "te cuesta" en vez de "no puedes".

## Música
- Secciones, textos y playlists: `src/music.ts`. Portadas: `src/artwork/` (una función por portada).

## Guía de primera vez
- Los cuatro cartelitos están en `src/Guide.tsx`. Se ven una sola vez por celu; con `?prueba`, "ver guía" los repite.

## Transiciones
- Fundido cruzado: tiempos y curvas en `src/transition.ts`.
- Toda navegación nueva tiene que pasar por `crossfade()`.

## Diseño
- Medidas tomadas del rediseño a 390 × 844. Una letra para títulos (Fraunces 300) y una para textos (Nunito Sans 300 y 400).
- Tres colores de texto por horario: `--ink`, `--soft`, `--accent`. Botón principal: `--cta`.

## Antes de regalarla
- Escuchar cada meditación entera (contenido, voz, publicidad). Solo se verificaron título, duración y link.
- Probar en un Android y un iPhone reales: sonido, modo silencio, pantalla encendida, salto a Spotify e instalación.
