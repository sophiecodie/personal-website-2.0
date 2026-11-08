import Choreography from "@/components/Choreography";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Interlude from "@/components/Interlude";
import Contents from "@/components/Contents";
import Library from "@/components/Library";
import Curtain from "@/components/Curtain";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Choreography />
      <div className="scrollbar" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <div className="in"><Hero /></div>
        <Experience />
        <Interlude />
        <Contents />
        <Library />
        <Curtain />
        <div className="in">
          <footer>
            <p className="theme-note">
              The theme of this site is inspired by my love for dancing, reading, and building.
            </p>
            © 2026 Sophie Shih · Particles, poses and sorting written by hand. New York · Durham.
          </footer>
        </div>
      </main>
    </>
  );
}
