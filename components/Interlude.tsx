import { projects } from "@/data/projects";

export default function Interlude() {
  return (
    <section className="interlude" id="interlude">
      <div className="card" data-reveal>
        <div className="eyebrow">Entr&apos;acte</div>
        <h2>Every project began as a loose page</h2>
        <p>The stage breaks apart, and the pages drift down toward the library.</p>
        <div className="code">
          <u># choreography.py</u><br />
          <b>stage</b>.burst(force=<i>0.6</i>)<br />
          <b>pages</b> = particles.assemble(n=<i>{projects.length}</i>)<br />
          <b>shelf</b>.receive(pages)
        </div>
      </div>
    </section>
  );
}
