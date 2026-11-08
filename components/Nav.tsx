import { site } from "@/data/site";

export default function Nav() {
  return (
    <header className="navbar">
      <nav className="top in">
        <a href="#top" className="nav-name">{site.name}</a>
        <div className="links">
          <a className="nav-u" href="#experience">Experience</a>
          <a className="nav-u" href="#contents">Projects</a>
          <a className="nav-u" href={site.resume} target="_blank" rel="noopener">Résumé</a>
          <a className="nav-u" href="#curtain">Contact</a>
        </div>
      </nav>
    </header>
  );
}
