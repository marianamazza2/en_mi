import { Cover, prepaint } from './Covers'
import { music } from './music'
import { sound } from './sound'

const WIDE = 2.1 // la impar del final, igual que en style.css

const ratioOf = (i: number, count: number) => i === count - 1 && i % 2 === 0 ? WIDE : 1

/** Deja las portadas listas antes de que toque Música, para que la transición no tenga tirones. */
export const prepareMusic = () =>
  prepaint(music.flatMap(s => s.items.map((item, i) => ({ name: item.cover, ratio: ratioOf(i, s.items.length) }))))

export const MusicList = () => <div className="music">{music.map(section =>
  <section key={section.name} aria-label={section.name}>
    <h2>{section.name}</h2>
    <p className="use">{section.about}</p>
    <div className="covers">{section.items.map((item, i) =>
      <a className="track" key={item.id} href={`https://open.spotify.com/playlist/${item.id}`} target="_blank" rel="noopener noreferrer" onClick={sound.toSpotify}>
        <span className="cover"><Cover name={item.cover} ratio={ratioOf(i, section.items.length)} /><i className="play"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 2v8L10 6Z" /></svg></i></span>
        <b>{item.name}</b>
        <span className="about-track">{item.about}</span>
      </a>)}
    </div>
  </section>)}
</div>
