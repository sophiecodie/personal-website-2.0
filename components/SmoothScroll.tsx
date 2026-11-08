"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window { __lenis?: Lenis | null }
}

/** Scrolls an element into view, through Lenis when it is running. */
export function scrollToEl(el: Element) {
  if (window.__lenis) window.__lenis.scrollTo(el as HTMLElement, { duration: 1.4, offset: -60 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/**
 * Lenis smooth scrolling driven by the GSAP ticker, plus the page-wide GSAP touches:
 * the headline line reveal, scroll-triggered fade-ups ([data-reveal]), the progress bar and the sticky nav.
 */
export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    const tick = (t: number) => lenis?.raf(t * 1000);
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    window.__lenis = lenis;

    // In-page anchors glide through Lenis. #book-… links are handled by the library.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      const id = a?.getAttribute("href");
      if (!id || id === "#" || id.startsWith("#book-")) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      scrollToEl(el);
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onClick);

    const ctx = gsap.context(() => {
      gsap.to(".scrollbar", {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: true },
      });
      if (reduce) return;
      gsap.from(".split-line > span", { yPercent: 115, duration: 1.3, ease: "expo.out", stagger: 0.09, delay: 0.1 });
      gsap.from(".hero [data-hero]", { y: 24, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.1, delay: 0.45 });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, { y: 44, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });
    });

    const nav = document.querySelector(".navbar");
    const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 40);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      ctx.revert();
      document.removeEventListener("click", onClick);
      removeEventListener("scroll", onScroll);
      gsap.ticker.remove(tick);
      lenis?.destroy();
      window.__lenis = null;
    };
  }, []);
  return null;
}
