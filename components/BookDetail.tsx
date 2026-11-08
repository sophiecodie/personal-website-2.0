/* eslint-disable @next/next/no-img-element */
import type { Project } from "@/data/types";
import { favoriteBooks, writing } from "@/data/library";
import ExtLink from "./ExtLink";

export default function BookDetail({ project: p, number }: { project: Project; number: number }) {
  const num = <div className="num">{String(number).padStart(2, "0")}</div>;

  if (p.isReadingShelf) {
    return (
      <div className="detail detail-anim" aria-live="polite">
        {num}
        <div>
          <h3>{p.title}</h3>
          <div className="meta">the last book · open shelf</div>
          <div className="reads">
            <div>
              <h4>Favorite books</h4>
              <div className="minishelf">
                {favoriteBooks.map((b) => (
                  <a key={b.title} href={`https://www.google.com/search?tbm=bks&q=${encodeURIComponent(`${b.title} ${b.author}`)}`}
                     target="_blank" rel="noopener" title={`${b.title} · ${b.author}`}>
                    <img src={b.cover} alt={`${b.title} by ${b.author}`} loading="lazy" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4>Written works</h4>
              <ul className="works">
                {writing.map((w) => (
                  <li key={w.href}>
                    <a href={w.href} target="_blank" rel="noopener">
                      <span className="wt">{w.title} ↗</span>
                      <span className="wm">{w.meta}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail detail-anim" aria-live="polite">
      {num}
      <div className={`body${p.image ? "" : " noimg"}`}>
        <div>
          <h3>{p.title}</h3>
          <div className="meta">{p.year} · {p.tech}</div>
          {p.context && <div className="ctx">{p.context}</div>}
          <p>{p.summary}</p>
          <ul className="hl">{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
          {p.links.length > 0 && <div className="links">{p.links.map((l) => <ExtLink key={l.label} {...l} />)}</div>}
        </div>
        {p.image && <figure><img src={p.image} alt={p.title} loading="lazy" /></figure>}
      </div>
    </div>
  );
}
