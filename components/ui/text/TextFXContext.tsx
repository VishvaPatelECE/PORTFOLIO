"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type HeadingTypographyStyle =
  | "zarathustra"    // Zarathustra (Ornate Jugendstil / Art Nouveau revival serif)
  | "cakra"          // Cakra (Experimental geometric display with dramatic alternates)
  | "bluu-next"      // Bluu Next (Sharp, heavy, high-flavor blackletter-infused serif)
  | "geom"           // Geom (Cedric Müller / BestFreeFonts geometric display)
  | "bagnard"        // Bagnard (Napoleonic prisoner graffiti-inspired historic serif)
  | "nouveau"        // Nouveau (Death of Typography Art Nouveau display)
  | "getai-grotesk"  // Getai Grotesk (Death of Typography Chinese calligraphic stage grotesque)
  | "melete"         // Melete (Sora Sagano futuristic sci-fi bank-grotesk display)
  | "texturina"      // Texturina (Sharp contemporary editorial serif)
  | "fraunces"       // Fraunces (Wonky Old-Style Display Serif with dramatic curves)
  | "instrument"     // Instrument Serif (Sleek High-Fashion Contemporary Editorial)
  | "syne"           // Syne (Sculptural Avant-Garde Modern Display)
  | "anybody";       // Anybody (Heavy Industrial Geometric Display)

export const ALL_HEADING_STYLES: HeadingTypographyStyle[] = [
  "zarathustra",
  "cakra",
  "bluu-next",
  "geom",
  "bagnard",
  "nouveau",
  "getai-grotesk",
  "melete",
  "texturina",
  "fraunces",
  "instrument",
  "syne",
  "anybody",
];

export interface TextFXConfig {
  scramble: boolean;          // Cyber Scramble on Eyebrows & Badges
  variableProximity: boolean; // Variable Font Weight Morph on Titles
  scrollReveal: boolean;      // Linear Scroll Scrub Light-Up on Paragraphs
  textRoll3D: boolean;        // 3D Character Roll on Card Titles
  shimmer: boolean;           // Metallic Gradient Shimmer on Numbers
}

const DEFAULT_CONFIG: TextFXConfig = {
  scramble: true,
  variableProximity: true,
  scrollReveal: true,
  textRoll3D: true,
  shimmer: true,
};

interface TextFXContextValue {
  config: TextFXConfig;
  toggleEffect: (key: keyof TextFXConfig) => void;
  enableAll: () => void;
  disableAll: () => void;
  headingStyle: HeadingTypographyStyle;
  setHeadingStyle: (style: HeadingTypographyStyle) => void;
  headingSizePx: number;
  setHeadingSizePx: (size: number) => void;
}

const TextFXContext = createContext<TextFXContextValue>({
  config: DEFAULT_CONFIG,
  toggleEffect: () => { },
  enableAll: () => { },
  disableAll: () => { },
  headingStyle: "cakra",
  setHeadingStyle: () => { },
  headingSizePx: 36,
  setHeadingSizePx: () => { },
});

export function TextFXProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<TextFXConfig>(DEFAULT_CONFIG);
  const [headingStyle, setHeadingStyle] = useState<HeadingTypographyStyle>("cakra");
  const [headingSizePx, setHeadingSizePx] = useState<number>(36);

  // Sync from sessionStorage strictly after mount to prevent hydration mismatch
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const saved = sessionStorage.getItem("darvs_text_fx");
        if (saved) setConfig(JSON.parse(saved));
      } catch { }

      try {
        const savedStyle = sessionStorage.getItem("darvs_heading_style");
        if (savedStyle && ALL_HEADING_STYLES.includes(savedStyle as HeadingTypographyStyle)) {
          setHeadingStyle(savedStyle as HeadingTypographyStyle);
        }
      } catch { }

      try {
        const savedSize = sessionStorage.getItem("darvs_heading_size_px");
        if (savedSize) {
          const num = parseInt(savedSize, 10);
          if (!isNaN(num) && num >= 22 && num <= 54) setHeadingSizePx(num);
        }
      } catch { }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem("darvs_text_fx", JSON.stringify(config));
    } catch { }
  }, [config]);

  useEffect(() => {
    try {
      sessionStorage.setItem("darvs_heading_style", headingStyle);
    } catch { }
  }, [headingStyle]);

  useEffect(() => {
    try {
      sessionStorage.setItem("darvs_heading_size_px", String(headingSizePx));
    } catch { }
  }, [headingSizePx]);

  const toggleEffect = (key: keyof TextFXConfig) => {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const enableAll = () => {
    setConfig({
      scramble: true,
      variableProximity: true,
      scrollReveal: true,
      textRoll3D: true,
      shimmer: true,
    });
  };

  const disableAll = () => {
    setConfig({
      scramble: false,
      variableProximity: false,
      scrollReveal: false,
      textRoll3D: false,
      shimmer: false,
    });
  };

  return (
    <TextFXContext.Provider
      value={{
        config,
        toggleEffect,
        enableAll,
        disableAll,
        headingStyle,
        setHeadingStyle,
        headingSizePx,
        setHeadingSizePx,
      }}
    >
      {children}
    </TextFXContext.Provider>
  );
}

export function useTextFX() {
  return useContext(TextFXContext);
}
