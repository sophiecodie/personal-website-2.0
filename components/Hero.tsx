import { site } from "@/data/site";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div>
        <div className="eyebrow" data-hero>Overture</div>
        <h1 aria-label={site.name}>
          <span className="split-line"><span>Sophie</span></span>
          <span className="split-line"><span><em>Suzuki Shih</em></span></span>
        </h1>
        <p className="lede" data-hero>{site.lede}</p>
        <div className="cue" data-hero>Scroll to begin ↓</div>
      </div>
      <div className="fig" id="fig">
        <div className="tech" id="hud">pose · arabesque<br />confidence 0.97</div>
      </div>
    </section>
  );
}
