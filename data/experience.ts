import type { Role } from "./types";
import { ARXIV, NEUROBIOME_DEMO, THESIS } from "./projects";

// Most recent first. x/y place each spike mark on the stage plan (percent of the plan box).
export const roles: Role[] = [
  {
    title: "AI Research Intern", org: "Mass General Brigham · PI Dr. Synho Do", dates: "Jun – Sep 2025", mark: "downstage center", x: 50, y: 67,
    summary: "Built Neurobiome Navigator: an AI agent over the MINERVA knowledge graph (66,000+ microbe–disease links) with semantic paper search, plus a thesis on turning biomedical findings into accessible teaching tools.",
    links: [{ label: "Demo", href: NEUROBIOME_DEMO }, { label: "Thesis", href: THESIS }, { label: "Open the book", href: "#book-neurobiome" }],
  },
  {
    title: "Code Coach", org: "TheCoderSchool", dates: "Nov 2024 – Jun 2025", mark: "stage left", x: 78, y: 44,
    summary: "Coached five students, ages 7 to 10, one-on-one in Scratch, and designed 15+ projects, including games that teach gravity, acceleration and collisions.",
    links: [],
  },
  {
    title: "Radiology AI Research Intern", org: "Weill Cornell Medicine · PI Dr. Martin Prince", dates: "Jul 2024 – Jun 2025", mark: "stage right", x: 22, y: 44,
    summary: "Annotated 500+ abdominal MRIs for kidney-disease segmentation, contributed to TraceOrg (0.97 Dice), and used few-shot LLM prompting to explain incidental findings to patients (RSNA abstract).",
    links: [
      { label: "TraceOrg", href: "https://doi.org/10.1681/ASN.0000000904" },
      { label: "RSNA abstract", href: "https://www.abstractsonline.com/cSubmit/SubmitPrinterFriendlyVersion.asp?ControlKey=04D1C787-1416-45E8-AB29-01EA1A1CC037&MeetingActivityKey=%7B0712BBAB-1834-45C3-8260-BE6A74329DFF%7D&AKey=%7BF0B259F7-CDCA-40A7-8C67-CFA766FF507C%7D&MKey=%7B5C313CD7-2ECC-4193-86C7-E7746A9512E6%7D" },
    ],
  },
  {
    title: "Volunteer", org: "Believers · Tokyo", dates: "Summers 2024 & 2025", mark: "upstage left", x: 78, y: 21,
    summary: "Led crafts, geography, cooking and music with elementary students at a “third space” for kids who struggle in traditional school.",
    links: [],
  },
  {
    title: "Healthcare AI Intern", org: "MD.ai", dates: "Jun – Jul 2023", mark: "upstage center", x: 50, y: 21,
    summary: "Engineered an LLM-agent framework that turns radiology reports into patient-friendly letters, co-authored an arXiv paper, and took 2nd place at the SIIM Hackathon.",
    links: [{ label: "arXiv paper", href: ARXIV }, { label: "Hackathon video", href: "https://youtu.be/Je5GMelw1-Q?t=4542" }, { label: "Open the book", href: "#book-agent00hl7" }],
  },
];
