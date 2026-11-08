export type Link = { label: string; href: string };

export type Project = {
  id: string; // used for #book-<id> deep links
  spine: string; // short title printed on the book spine
  title: string;
  year: string;
  sort: number; // year.month, used by the shelf sort
  color: string; // spine color (hex)
  tech: string;
  context?: string;
  summary: string;
  highlights: string[];
  image?: string; // path under /public
  links: Link[];
  /** The reading-and-writing book: always shelved last, opens the mini shelf. */
  isReadingShelf?: boolean;
};

export type Role = {
  title: string;
  org: string;
  dates: string;
  mark: string; // stage position label
  x: number; // spike mark position on the stage plan, percent
  y: number;
  summary: string;
  links: Link[];
};

export type Book = { title: string; author: string; cover: string };
export type Writing = { title: string; meta: string; href: string };
