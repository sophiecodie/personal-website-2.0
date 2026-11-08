import type { Link } from "@/data/types";

/** External links open in a new tab with a ↗; in-page (#…) links stay put. */
export default function ExtLink({ label, href }: Link) {
  const external = /^https?:/.test(href);
  return external
    ? <a href={href} target="_blank" rel="noopener">{label} ↗</a>
    : <a href={href}>{label}</a>;
}
