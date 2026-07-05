import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://spike.land"),
  title: {
    default: "spike.land — Digital transformation for the agentic era",
    template: "%s · spike.land",
  },
  description:
    "We design, ship, and embed agentic AI systems — helping companies orchestrate software, not operate it. AI transformation agency, Brighton / London, UK.",
  keywords: [
    "AI transformation agency UK",
    "agentic AI consultancy",
    "AI agent development agency",
    "digital transformation AI Brighton",
    "digital transformation AI London",
  ],
  openGraph: {
    type: "website",
    siteName: "spike.land",
    title: "spike.land — Digital transformation for the agentic era",
    description:
      "We design, ship, and embed agentic AI systems — so your company orchestrates software instead of operating it.",
    url: "https://spike.land",
  },
  twitter: {
    card: "summary_large_image",
    title: "spike.land — Digital transformation for the agentic era",
    description:
      "We design, ship, and embed agentic AI systems — so your company orchestrates software instead of operating it.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
