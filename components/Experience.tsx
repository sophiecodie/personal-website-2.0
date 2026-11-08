"use client";
import { useState } from "react";
import { roles } from "@/data/experience";
import ExtLink from "./ExtLink";

const AREAS: [string, number, number][] = [
  ["USR", 22, 13], ["USC", 50, 13], ["USL", 78, 13],
  ["SR", 22, 36], ["C", 50, 36], ["SL", 78, 36],
  ["DSR", 22, 59], ["DSC", 50, 59], ["DSL", 78, 59],
];

/** Act I: each role is a spike mark on a stage plan. Hovering either side lights both. */
export default function Experience() {
  const [active, setActive] = useState(0);
  return (
    <section className="stagewrap" id="experience">
      <div className="stagepanel">
        <div className="in" style={{ width: "100%" }}>
          <div className="stagegrid">
            <div>
              <div className="eyebrow">Act I</div>
              <h2>Experience</h2>
              <p className="note">Each role has a spike mark on the stage. Downstage is the most recent. The further upstage, the further back in time.</p>
              <ol className="exp">
                {roles.map((r, i) => (
                  <li key={r.title} className={i === active ? "on" : ""} onPointerEnter={() => setActive(i)} onClick={() => setActive(i)}>
                    <span className="pin">{i + 1}</span>
                    <div>
                      <h3>{r.title}</h3>
                      <div className="org">{r.org}</div>
                      <div className="meta">{r.dates} · {r.mark}</div>
                      <div className="more">
                        <div>
                          <p>{r.summary}</p>
                          {r.links.length > 0 && <p>{r.links.map((l) => <ExtLink key={l.label} {...l} />)}</p>}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="plan" id="plan">
              <span className="lab big" style={{ left: "50%", top: "3%" }}>Upstage</span>
              <span className="lab big" style={{ left: "50%", top: "84%" }}>Downstage</span>
              <span className="lab" style={{ left: "50%", top: "97%" }}>Audience</span>
              <span className="lab big" style={{ left: "2.5%", top: "43%", transform: "translate(-50%,-50%) rotate(-90deg)" }}>Stage right</span>
              <span className="lab big" style={{ left: "97.5%", top: "43%", transform: "translate(-50%,-50%) rotate(90deg)" }}>Stage left</span>
              {AREAS.map(([n, x, y]) => <span key={n} className="area" style={{ left: `${x}%`, top: `${y}%` }}>{n}</span>)}
              {roles.map((r, i) => (
                <span key={r.title} className={`spike${i === active ? " on" : ""}`} style={{ left: `${r.x}%`, top: `${r.y}%` }} onPointerEnter={() => setActive(i)}>{i + 1}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
