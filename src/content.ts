// Todos los textos de meditaciones y respiraciones se editan acá.
// Tono: suave y amoroso. Invitar en vez de ordenar ("deja", "permítete"), "te cuesta" en vez de "no puedes".
export type Via = 'nariz' | 'boca'
// via: por dónde va el aire; al mantener no lleva
export type Step = { label: string; seconds: number; to: number; via?: Via }
// use = para qué (concreto, distinto de las otras) · moment = cuándo, en una línea · does = qué hace · when = cuándo usarla
export type Breath = { id: string; name: string; use: string; moment: string; does: string; when: string; how: string; steps: Step[]; gentle?: Step[]; rounds?: number }
// siempre se inhala por la nariz; por dónde se exhala depende de cada técnica
const inhale = (seconds: number, to = 1): Step => ({ label: 'Inhala', seconds, to, via: 'nariz' })
const exhale = (seconds: number, via: Via): Step => ({ label: 'Exhala', seconds, to: 0, via })
const hold = (seconds: number, to: number) => ({ label: 'Mantén', seconds, to })

export const breaths: Breath[] = [
  { id: 'vaciarse', name: 'Vaciarse', use: 'Para calmarte', moment: 'Cuando todo va muy rápido', does: 'Soltar el aire el doble de lento de lo que entra le avisa a tu cuerpo que puede salir del estado de alerta.', when: 'Cuando tu cabeza va muy rápido, o sientes que algo te supera.', how: 'Deja entrar el aire por la nariz y suéltalo despacito por la boca, hasta vaciarte, sin forzar.', steps: [inhale(4), exhale(8, 'boca')], gentle: [inhale(3), exhale(6, 'boca')] },
  { id: 'suspiro', name: 'Suspiro doble', use: 'Para aflojar la tensión', moment: 'Cuando algo te puso nervioso', does: 'Es el suspiro de alivio, hecho a propósito: te llenas en dos tiempos y al soltar se afloja el cuerpo.', when: 'Cuando algo puntual te puso nervioso, o sientes que tienes el cuerpo tensionado.', how: 'Deja entrar el aire por la nariz, suma un poquito más también por la nariz y suéltalo lento por la boca.', steps: [inhale(3, .8), { label: 'Un poco más', seconds: 1, to: 1, via: 'nariz' }, exhale(6, 'boca')] },
  { id: 'pareja', name: 'Pareja', use: 'Para mantener la calma', moment: 'Cada día, aunque te sientas bien', does: 'Entra y sale en el mismo tiempo. Ese ritmo lento y regular te estabiliza, sin darte sueño.', when: 'Todos los días, al despertar o en una pausa. No hace falta sentirte mal para hacerla.', how: 'Deja que el aire entre y salga suave, siempre por la nariz, con la boca cerrada sin apretar.', steps: [inhale(5), exhale(5, 'nariz')] },
  { id: 'cuadrada', name: 'Cuadrada', use: 'Para concentrarte', moment: 'Antes de algo importante', does: 'Seguir cuatro pasos iguales ocupa tu mente en una sola cosa: te deja atento y tranquilo a la vez.', when: 'Antes de estudiar, trabajar, una entrevista o una charla que te importa.', how: 'Entra el aire por la nariz y sale por la boca. Entre uno y otro, mantenlo con suavidad. Si te incomoda, prueba “Pareja”.', steps: [inhale(4), hold(4, 1), exhale(4, 'boca'), hold(4, 0)] },
  { id: '478', name: '4-7-8', use: 'Para prepararte para dormir', moment: 'De noche, ya en la cama', does: 'La pausa y la salida muy lenta del aire te bajan el ritmo, y contar te distrae de los pensamientos.', when: 'En la cama, antes de dormirte, o si te despiertas de noche y te cuesta volver a dormir.', how: 'Deja entrar el aire por la nariz, mantenlo un momento y suéltalo por la boca. Si te cuesta, prueba “Vaciarse”.', steps: [inhale(4), hold(7, 1), exhale(8, 'boca')], rounds: 4 },
]

// Cuándo se sugiere cada tipo, en una línea. El orden de acá es el orden en pantalla.
export const groups = [
  { name: 'Comenzar y cerrar el día', when: 'Para despertar suave y despedir el día' },
  { name: 'Relajar el cuerpo', when: 'Si sientes tensión o quieres preparar el cuerpo para descansar y dormir' },
  { name: 'Calmar la ansiedad', when: 'Si te cuesta dejar de pensar' },
  { name: 'Acompañar lo que sientes', when: 'Si una emoción necesita un abrazo' },
  { name: 'Volver al presente', when: 'Si tu mente anda un poquito lejos' },
  { name: 'Dormir', when: 'Si te cuesta entregarte al sueño' },
]

// minutes = duración real del episodio en Spotify
export const meditations = [
  { id: '1vHDiNysMjT2ztLfDlno2g', group: 'Calmar la ansiedad', name: 'Calma rápida', about: 'Para cuando tus pensamientos necesitan ir más despacio.', by: 'Meditaciones guiadas · Sesión30', minutes: 3 },
  { id: '0T4twGUozUiRCccU1NM0VR', group: 'Calmar la ansiedad', name: 'Aflojar el estrés', about: 'Para soltar, de a poquito, lo que vienes cargando.', by: 'Medita con Inma', minutes: 12 },
  { id: '3FXa79LYzNMnEJoOSkSIe8', group: 'Calmar la ansiedad', name: 'Calma con mindfulness', about: 'Para volver con suavidad a este momento.', by: 'Kaixin Project', minutes: 15 },
  { id: '3LN53ET6kKhcK7xmOz2RTt', group: 'Volver al presente', name: 'Una pausa', about: 'Para regalarte unos minutos solo para ti.', by: 'Iciar Burgos', minutes: 6 },
  { id: '4mVlLqlnNO0YrKCiMYwwaR', group: 'Volver al presente', name: 'Cuenta regresiva', about: 'Para que tu mente descanse, número a número.', by: 'Medita Paso a Paso', minutes: 8 },
  { id: '7E7uMVBml0AoCNEefeAysi', group: 'Volver al presente', name: 'Primeros pasos', about: 'Para empezar a tu ritmo, sin exigirte nada.', by: 'Medita Podcast', minutes: 12 },
  { id: '23MmYpS7EWomFhkVlSOx67', group: 'Acompañar lo que sientes', name: 'Para el enojo', about: 'Para darle lugar a tu enojo y, de a poco, soltarlo.', by: 'Medita Podcast', minutes: 22 },
  { id: '60muXfIUWUJNkNopQct9lN', group: 'Acompañar lo que sientes', name: 'Para la tristeza', about: 'Para abrazar tu tristeza, sin apuro.', by: 'Medita Podcast', minutes: 22 },
  { id: '1fo9WxehAyM3jgxxVaKoJ3', group: 'Acompañar lo que sientes', name: 'Tratarte bien', about: 'Para hablarte con el cariño que mereces.', by: 'Regálate Pausa', minutes: 15 },
  { id: '05Z3yGsLmALh4VBR9Mt1Za', group: 'Relajar el cuerpo', name: 'Recorrido corporal', about: 'Para aflojar cada parte de ti antes de descansar.', by: 'Iciar Burgos', minutes: 25 },
  { id: '6hMqPIZfgz3aNWYelVQ4XX', group: 'Relajar el cuerpo', name: 'Escáner corporal', about: 'Para que tu cuerpo suelte el peso del día.', by: 'Mindful Science', minutes: 23 },
  { id: '1Vmm5W189CAXj3q8M03DD1', group: 'Dormir', name: 'Dormir profundo', about: 'Para entregarte al descanso, sin esfuerzo.', by: 'Cuerpomente · Vilma Montoliu', minutes: 13 },
  { id: '0nAe2CFCxzEgLievn2u7ra', group: 'Dormir', name: 'El jardinero de las nubes', about: 'Para dejarte llevar por una historia hasta dormirte.', by: 'Medita con Calma', minutes: 44 },
  { id: '79UeEZoUiCBk4ORQJCxyuq', group: 'Comenzar y cerrar el día', name: 'Empezar con energía', moment: 'Al despertar', about: 'Para recibir el día con ganas y con calma.', by: 'Relajación Guiada', minutes: 6 },
  { id: '0FPDAIiwfswNE4fFo0PX6W', group: 'Comenzar y cerrar el día', name: 'Gratitud', moment: 'Al cerrar el día', about: 'Para despedir el día agradeciendo lo vivido.', by: 'Yazmín López', minutes: 9 },
]
export type Meditation = (typeof meditations)[number]
