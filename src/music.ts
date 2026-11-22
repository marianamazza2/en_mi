import type { CoverName } from './Covers'

// Todo lo de Música se edita acá. `id` es el de la playlist en Spotify.
type Track = { id: string; cover: CoverName; name: string; about: string }

export const music: { name: string; about: string; items: Track[] }[] = [
  { name: 'Sonido blanco', about: 'Para concentrarte y dejar afuera las distracciones.', items: [
    { id: '37i9dQZF1DWUZ5bk6qqDSy', cover: 'blanco', name: 'Blanco', about: 'Parejito, como una brisa que tapa el ruido.' },
    { id: '37i9dQZF1DX5NgkFTxJ4Wv', cover: 'rosa', name: 'Rosa', about: 'Más suave, como una lluvia a lo lejos.' },
    { id: '37i9dQZF1DX4hpot8sYudB', cover: 'marron', name: 'Marrón', about: 'Grave y profundo, te envuelve como una manta.' },
  ] },
  { name: 'Sonidos de la naturaleza', about: 'Para sentirte lejos, sin moverte de donde estás.', items: [
    { id: '37i9dQZF1DX8ymr6UES7vc', cover: 'lluvia', name: 'Lluvia', about: 'Para sentirte a resguardo.' },
    { id: '37i9dQZF1DWV90ZWj21ygB', cover: 'olas', name: 'Olas del mar', about: 'Un vaivén que te va aflojando.' },
    { id: '3O6FrC3UssgIHgY07vxpeL', cover: 'rio', name: 'Río', about: 'Para que los pensamientos sigan su curso.' },
    { id: '37i9dQZF1DXaw68inx4UiN', cover: 'selva', name: 'Selva', about: 'Hojas, gotas y vida a tu alrededor.' },
    { id: '37i9dQZF1DXaa8UmWJHYTU', cover: 'fuego', name: 'Fogata', about: 'Un crepitar cálido que te acompaña.' },
    { id: '37i9dQZF1DX4PP3DA4J0N8', cover: 'paseo', name: 'Aire libre', about: 'Pájaros, viento y lluvia, como en un paseo.' },
  ] },
  { name: 'Música para relajar', about: 'Melodías suaves para bajar el ritmo.', items: [
    { id: '37i9dQZF1DX4sWSpwq3LiO', cover: 'piano', name: 'Piano', about: 'Notas lentas que te dan espacio.' },
    { id: '37i9dQZF1DX0jgyAiPl8Af', cover: 'guitarra', name: 'Guitarra', about: 'Cuerdas suaves, como una caricia.' },
    { id: '37i9dQZF1DX3Ogo9pFvBkY', cover: 'flotar', name: 'Flotar', about: 'Sonidos amplios para soltarte.' },
    { id: '37i9dQZF1DWZd79rJ6a7lp', cover: 'dormir', name: 'Para dormir', about: 'Para despedir el día sin apuro.' },
  ] },
]
