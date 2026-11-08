import { projects } from "@/data/projects";

/** A plain table of contents, newest first, with the reading shelf last. The particles stack up around it. */
export default function Contents() {
  const list = projects
    .map((p, i) => ({ p, i }))
    .sort((a, b) => (a.p.isReadingShelf ? 1 : b.p.isReadingShelf ? -1 : b.p.sort - a.p.sort) || a.i - b.i);
  return (
    <section className="contents in" id="contents">
      <div className="toc" id="toc">
        <div className="eyebrow">Contents</div>
        <h2>Projects, at a glance</h2>
        <ol>
          {list.map(({ p }, n) => (
            <li key={p.id}>
              <a href={`#book-${p.id}`}>
                <span className="n">{String(n + 1).padStart(2, "0")}</span>
                <span className="tt">{p.title}<small>{p.tech.split(" · ")[0]}</small></span>
                <span className="lead" />
                <span className="yr">{p.year}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="foot">Keep scrolling to browse them as books ↓</div>
      </div>
    </section>
  );
}
