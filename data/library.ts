import type { Book, Writing } from "./types";
import { ARXIV, THESIS } from "./projects";

export const favoriteBooks: Book[] = [
  { title: "Jane Eyre", author: "Charlotte Brontë", cover: "/assets/covers/jane-eyre.jpg" },
  { title: "The Covenant of Water", author: "Abraham Verghese", cover: "/assets/covers/covenant-of-water.jpg" },
  { title: "The Unbearable Lightness of Being", author: "Milan Kundera", cover: "/assets/covers/unbearable-lightness.jpg" },
  { title: "My Brilliant Friend", author: "Elena Ferrante", cover: "/assets/covers/my-brilliant-friend.jpg" },
  { title: "Identity", author: "Milan Kundera", cover: "/assets/covers/identity.jpg" },
  { title: "The Nightingale", author: "Kristin Hannah", cover: "/assets/covers/nightingale.jpg" },
  { title: "Pachinko", author: "Min Jin Lee", cover: "/assets/covers/pachinko.jpg" },
  { title: "The Bluest Eye", author: "Toni Morrison", cover: "/assets/covers/bluest-eye.jpg" },
  { title: "The Story of a New Name", author: "Elena Ferrante", cover: "/assets/covers/story-of-a-new-name.jpg" },
];

export const writing: Writing[] = [
  {
    title: "A guide to reporting sexual assault and finding support at Duke and in Durham",
    meta: "The Duke Chronicle · Oct 2026",
    href: "https://dukechronicle.com/article/duke-university-chronicle-guide-sexual-harm-violence-report-assault-support-care-durham-cornell-20261020",
  },
  { title: "Using AI to translate complex biomedical findings into accessible educational tools", meta: "Thesis · medRxiv · 2025", href: THESIS },
  { title: "LLM agents for patient-friendly radiology letters (Agent00HL7)", meta: "arXiv · 2024 · co-author", href: ARXIV },
];
