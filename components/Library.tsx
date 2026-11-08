"use client";
import { CSSProperties, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { recordSort, type SortMethod } from "@/lib/sorting";
import { useReducedMotion } from "@/lib/useReducedMotion";
import BookDetail from "./BookDetail";
import { scrollToEl } from "./SmoothScroll";

// Spine sizes [width, height] in px before scaling, the order the pages "landed" in, and their resting tilt.
const DIMS: [number, number][] = [[48, 200], [44, 176], [52, 212], [40, 184], [50, 196], [46, 170], [42, 188], [60, 222]];
const LANDED = [3, 7, 0, 5, 2, 6, 1, 4];
const TILT = [-4, 3, -2, 6, -5, 2, -3, 4];
const METHODS: { id: SortMethod; label: string }[] = [
  { id: "insertion", label: "Insertion" }, { id: "merge", label: "Merge" }, { id: "quick", label: "Quick" }, { id: "bubble", label: "Bubble" },
];
const N = projects.length;
const dims = (i: number) => DIMS[i % DIMS.length];
const landed = LANDED.length === N ? LANDED : projects.map((_, i) => i);
const key = (i: number) => projects[i].sort * 100 + i;
const LIGHT = new Set(["#d9c7a8", "#c9a3a6"]);

/** Act II: projects as books. Pick a sort; the shelf replays it once, then rests. */
export default function Library() {
  const reduce = useReducedMotion();
  const shelfRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);
  const [order, setOrder] = useState<number[]>(landed);
  const [hi, setHi] = useState<number[]>([]);
  const [sorted, setSorted] = useState(false);
  const [running, setRunning] = useState(false);
  const [method, setMethod] = useState<SortMethod>("insertion");
  const [status, setStatus] = useState(`unsorted · ${N} books`);
  const [sel, setSel] = useState(0);

  useLayoutEffect(() => {
    const el = shelfRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // #book-<id> links (contents page, experience list) open that book.
  const openHash = useCallback(() => {
    const m = location.hash.match(/^#book-(.+)$/);
    if (!m) return;
    const i = projects.findIndex((p) => p.id === m[1]);
    if (i < 0) return;
    setSel(i);
    const lib = document.getElementById("library");
    if (lib) scrollToEl(lib);
  }, []);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#book-"]');
      if (!a) return;
      e.preventDefault();
      history.replaceState(null, "", a.getAttribute("href"));
      openHash();
    };
    document.addEventListener("click", onClick);
    addEventListener("hashchange", openHash);
    if (location.hash.startsWith("#book-")) setTimeout(openHash, 120);
    return () => { document.removeEventListener("click", onClick); removeEventListener("hashchange", openHash); };
  }, [openHash]);

  const shelve = () => {
    if (running) return;
    setRunning(true);
    setSorted(true);
    setHi([]);
    setOrder(landed);
    const { frames, comparisons, sorted: final } = recordSort(method, landed, key);
    const step = reduce ? 0 : Math.max(70, Math.min(300, 3600 / frames.length));
    setStatus(`${method} sort · running…`);
    const t0 = performance.now();
    let k = 0;
    const tick = () => {
      if (k >= frames.length || reduce) {
        setOrder(final); setHi([]); setRunning(false);
        setStatus(`${method} sort · ${comparisons} comparisons · ${((performance.now() - t0) / 1000).toFixed(1)} s · at rest`);
        return;
      }
      const fr = frames[k++];
      setOrder(fr.order); setHi(fr.highlight);
      setTimeout(tick, step);
    };
    setTimeout(tick, reduce ? 0 : 500);
  };

  // Shelf geometry
  const gap = 4;
  const raw = order.reduce((a, i) => a + dims(i)[0] + gap, 0) + 30;
  const sc = Math.min(1.25, width / raw);
  const maxH = Math.max(...projects.map((_, i) => dims(i)[1])) * sc;
  const pos: { left: number; slot: number }[] = [];
  let x = Math.max(0, (width - raw * sc) / 2);
  order.forEach((bi, slot) => { pos[bi] = { left: x, slot }; x += (dims(bi)[0] + gap) * sc; });

  return (
    <section className="act" id="library">
      <div className="in">
        <div className="libhead">
          <div data-reveal>
            <div className="eyebrow">Act II</div>
            <h2>The Project Library</h2>
            <p className="note" style={{ marginBottom: 0 }}>
              Seven projects and one reading list, landed in no particular order. Pick a sorting method and they will shelve
              themselves once, then stay put. Open any book to read it; the last one holds my favorite books and writing.
            </p>
          </div>
          <div className="sorter">
            <div className="seg" role="radiogroup" aria-label="Sorting method">
              {METHODS.map((m) => (
                <span key={m.id} style={{ display: "contents" }}>
                  <input type="radio" name="m" id={`m-${m.id}`} value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} />
                  <label htmlFor={`m-${m.id}`}>{m.label}</label>
                </span>
              ))}
            </div>
            <button className="go" type="button" onClick={shelve} disabled={running}>{sorted && !running ? "Shelve again" : "Shelve by year"}</button>
            <div className="tech status">{status}</div>
          </div>
        </div>

        <div className="shelf" ref={shelfRef} style={{ height: maxH + 40 }}>
          <div className="board" />
          {projects.map((p, i) => {
            const [w, h] = dims(i);
            const { left, slot } = pos[i];
            const light = LIGHT.has(p.color);
            const tilt = TILT[slot % TILT.length];
            const short = w * sc < 34 && /^\d{4}$/.test(p.year);
            const style = {
              background: p.color, color: light ? "#3a2b30" : "#f5ead6",
              "--foil": light ? "#8a6a3a" : "#d4b77c", "--fs": `${Math.max(9, Math.min(15, w * sc * 0.32))}px`,
              width: w * sc, height: h * sc, left,
              transform: sorted ? "none" : `rotate(${tilt}deg) translateY(${Math.abs(tilt) * 0.6}px)`,
            } as CSSProperties;
            return (
              <button key={p.id} type="button" data-i={i} data-slot={slot} data-color={p.color} aria-label={`${p.title}, ${p.year}`}
                className={`book${hi.includes(i) ? " hi" : ""}${i === sel && sorted ? " sel" : ""}`} style={style} onClick={() => setSel(i)}>
                <span className="band" />
                <span className="t">{p.spine}</span>
                <span className="y">{short ? `’${p.year.slice(2)}` : p.year}</span>
              </button>
            );
          })}
          <div className="bookend" id="bookend" style={{ left: x, height: 70 * sc }} />
        </div>

        <BookDetail key={sel} project={projects[sel]} number={sel + 1} />
      </div>
    </section>
  );
}
