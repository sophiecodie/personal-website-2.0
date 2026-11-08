import type { Project } from "./types";

const SIIM24_SLIDES = "https://docs.google.com/presentation/d/1NYz9PMY-VRUH5TXXdrn-F39_1K8a4C-nPN4Km93GL4g/edit?usp=sharing";
const SIIM24_VIDEO = "https://youtu.be/Je5GMelw1-Q?t=4542";
const SIIM25_SLIDES = "https://docs.google.com/presentation/d/1HsQiOYT7-UfFO6YSU_EJYOC7zDnYghLq0JbolNES2Q8/edit?usp=sharing";
const SIIM25_VIDEO = "https://youtu.be/laua1kZ5_RA?t=2573";
export const ARXIV = "https://arxiv.org/abs/2408.01112";
export const THESIS = "https://www.medrxiv.org/content/10.1101/2025.09.18.25335721v1";
export const NEUROBIOME_DEMO = "https://www.youtube.com/watch?v=CgUKoGj21uI";

// Order here is the order the books are created in; the shelf sorts them by `sort`.
// The reading shelf must stay last.
export const projects: Project[] = [
  {
    id: "college-app-atlas", spine: "College App Atlas", title: "College App Atlas", year: "2026", sort: 2026.04, color: "#5b3a52",
    tech: "web · Next.js, TypeScript, PostgreSQL, Claude & OpenAI APIs", context: "Personal project · launched April 2026",
    summary: "A full-stack web app where students brainstorm, draft and track their college applications and essays in one cozy place.",
    highlights: [
      "An “Idea Garden” where students plant memories and quirks, then grow them into their own essay threads",
      "A 5,700+ college database (IPEDS + College Scorecard) with prompts verified word-for-word against official sites",
      "AI feedback that asks questions instead of rewriting you, plus AI-assisted research tailored to each student",
    ],
    image: "/assets/projects/college-app-atlas.svg",
    links: [
      { label: "Live site", href: "https://collegeappatlas.sophieshih.com" },
      { label: "Source", href: "https://github.com/sophiecodie/college-app-atlas" },
    ],
  },
  {
    id: "purchase-intent", spine: "Shopping Intent ML", title: "Online Purchase Intent Prediction", year: "2026", sort: 2026.09, color: "#2f3a56",
    tech: "ml · Python, scikit-learn, pandas", context: "Catalyst Tech Society · team of 4 · Fall 2026",
    summary: "A Random Forest classifier that predicts whether an online shopping session ends in a purchase, trained on 12,000+ sessions.",
    highlights: [
      "0.92 ROC-AUC and 90% accuracy",
      "A leakage-safe pipeline: deduplication, one-hot encoding and a stratified 80/20 split",
      "Precision–recall trade-offs analyzed under heavy class imbalance (15.6% buyers)",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/michellezuo/CatalystHW2" },
      { label: "Slides", href: "https://docs.google.com/presentation/d/1IcGCdOQA_b73L34f3LCFRIVFyDsM7_fd/edit?usp=sharing" },
    ],
  },
  {
    id: "new-york-census", spine: "NY Census Line", title: "The New York Census Line", year: "2026", sort: 2026.10, color: "#8c3f45",
    tech: "data · Python, JavaScript, D3, Census API, NYC Open Data", context: "Personal project · data visualization",
    summary: "New York City told through Census data on a subway map: each line is a topic, and each stop is one of the city’s 55 neighborhoods.",
    highlights: [
      "Housing, immigration and economy lines, ending at a last stop of my own photos of the city",
      "2020–2024 Census, NYC Open Data and BLS data, inflation-adjusted, with margins of error kept",
      "Findings computed from the data, like rent burden vs. income (r = −0.79)",
    ],
    image: "/assets/projects/new-york-census.jpg",
    links: [
      { label: "Live site", href: "https://new-york-census.sophieshih.com" },
      { label: "Source", href: "https://github.com/sophiecodie/New-York-Census" },
    ],
  },
  {
    id: "folio", spine: "Folio", title: "Folio", year: "2026", sort: 2026.11, color: "#b08a4f",
    tech: "web · Next.js, TypeScript, Tailwind", context: "Personal project",
    summary: "Pinterest for all kinds of literature: news from across the political spectrum, fresh science preprints and pop culture in one visual feed.",
    highlights: [
      "Headlines from 12 outlets, each card marked with where its outlet leans",
      "New preprints straight from the arXiv, medRxiv and bioRxiv APIs",
      "A “Brain Bulletin” board to pin stories, jot notes and link ideas together",
    ],
    links: [
      { label: "Live site", href: "https://folio-ivory-mu.vercel.app" },
      { label: "Source", href: "https://github.com/sophiecodie/folio" },
    ],
  },
  {
    id: "agent00hl7", spine: "Agent00HL7", title: "Agent00HL7", year: "2024", sort: 2024.06, color: "#3f5246",
    tech: "ai · LLM agents, Reflexion, ICD-10", context: "SIIM Hackathon · 2nd place · with Alina Yang and Estella Yee",
    summary: "LLM agents rewrite radiology reports as patient-friendly letters, then check each letter against the original report’s ICD-10 codes.",
    highlights: [
      "A self-refining agent loop based on the Reflexion framework, checked for accuracy and Flesch-Kincaid readability",
      "94.94% ICD-10 verification accuracy vs. 68.23% with zero-shot prompting",
      "81.25% of final letters needed no corrections, vs. 25% of zero-shot letters",
    ],
    image: "/assets/projects/agent00hl7.jpg",
    links: [
      { label: "Paper (arXiv)", href: ARXIV },
      { label: "Slides", href: SIIM24_SLIDES },
      { label: "Video", href: SIIM24_VIDEO },
    ],
  },
  {
    id: "dream-team", spine: "Dream Team", title: "Dream Team", year: "2025", sort: 2025.06, color: "#9c5a43",
    tech: "ai · LLM agents, Model Context Protocol, DICOM MCP", context: "SIIM Hackathon · 2nd place · with Joey Hentel and Kurt Teichman",
    summary: "A team of LLM agents that reads a radiology report, finds the right specialist, and books the consultation.",
    highlights: [
      "Diagnosis, referral, secretary and research agents covering the whole journey from report to booked consult",
      "Imaging access through DICOM MCP, so agents can query studies and analyze clinical metadata",
      "Built for the 100 million+ Americans who face barriers to reaching a specialist",
    ],
    image: "/assets/projects/dream-team.jpg",
    links: [
      { label: "Slides", href: SIIM25_SLIDES },
      { label: "Video", href: SIIM25_VIDEO },
    ],
  },
  {
    id: "neurobiome", spine: "Neurobiome", title: "Neurobiome Navigator", year: "2025", sort: 2025.07, color: "#4f5d6b",
    tech: "ai · Streamlit, Pydantic AI, LangChain, MINERVA", context: "Mass General Brigham · research internship",
    summary: "An app that teaches patients and students how the gut and oral microbiome relate to Parkinson’s disease.",
    highlights: [
      "An AI agent that answers questions using the MINERVA knowledge graph (66,000+ microbe–disease associations)",
      "Semantic search over selected research papers",
      "Interactive visualizations of microbe and food data that users can sort and view their own way",
    ],
    image: "/assets/projects/neurobiome.jpg",
    links: [
      { label: "Demo", href: NEUROBIOME_DEMO },
      { label: "Thesis (medRxiv)", href: THESIS },
    ],
  },
  {
    id: "reading", spine: "Reading & Writing", title: "Reading & Writing", year: "∞", sort: 9999, color: "#c9a3a6",
    tech: "shelf · favorite books and written works", summary: "", highlights: [], links: [], isReadingShelf: true,
  },
];
