import { site } from "@/data/site";

export default function Curtain() {
  return (
    <div className="in">
      <section className="curtain" id="curtain">
        <div data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="headshot" src={site.headshot} alt={site.name} width={112} height={112} loading="lazy" />
          <div className="eyebrow">Curtain call</div>
          <h2>Thank you for <em>staying</em> to the end</h2>
          <div className="contact">
            <span>Email</span><a href={`mailto:${site.email}`}>{site.email}</a>
            <span>LinkedIn</span><a href={site.linkedin} target="_blank" rel="noopener">linkedin.com/in/sophie-suzuki-shih</a>
            <span>GitHub</span><a href={site.github} target="_blank" rel="noopener">github.com/sophiecodie</a>
            <span>Résumé</span><a href={site.resume} target="_blank" rel="noopener">Fall 2026 résumé (PDF)</a>
          </div>
        </div>
        <div id="bow" />
      </section>
    </div>
  );
}
