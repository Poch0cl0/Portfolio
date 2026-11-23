import { Geist, Inter, JetBrains_Mono, Manrope } from "next/font/google";

export const fontSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const portfolioInter = Inter({
  variable: "--font-portfolio-inter",
  subsets: ["latin"],
  display: "swap",
});

const portfolioManrope = Manrope({
  variable: "--font-portfolio-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const portfolioFontVariables = `${portfolioInter.variable} ${portfolioManrope.variable}`;

export const fontVariables = `${fontSans.variable} ${fontMono.variable}`;
