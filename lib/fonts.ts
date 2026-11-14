import { Cormorant_Garamond, Martian_Mono } from "next/font/google";

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "500",
  style: "italic",
  display: "swap",
  variable: "--font-cormorant",
});

export const martianMono = Martian_Mono({
  subsets: ["latin"],
  weight: "500",
  display: "swap",
  variable: "--font-martian-mono",
});

