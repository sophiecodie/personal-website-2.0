import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "600"], variable: "--font-display", display: "swap" });
const body = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-body", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Sophie Shih",
  description: "Sophie Shih: Duke CS + Neuroscience. Projects, experience, books and writing, staged as a ballet in two acts.",
  openGraph: {
    title: "Sophie Shih",
    description: "Projects, experience, books and writing, staged as a ballet in two acts.",
    images: ["/assets/headshot.jpg"],
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23f3ece0'/%3E%3Ctext x='32' y='45' font-family='Georgia,serif' font-size='38' font-style='italic' text-anchor='middle' fill='%235b3a52'%3ES%3C/text%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f3ece0" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
