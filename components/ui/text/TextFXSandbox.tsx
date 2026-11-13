"use client";

import { useState, useSyncExternalStore } from "react";
import {
  useTextFX,
  type HeadingTypographyStyle,
} from "./TextFXContext";
import styles from "./TextFXSandbox.module.css";

interface FontOption {
  key: HeadingTypographyStyle;
  name: string;
  tag: string;
  fontFamily: string;
}

const FONT_OPTIONS: FontOption[] = [
  {
    key: "zarathustra",
    name: "Zarathustra",
    tag: "Jugendstil",
    fontFamily: "'Zarathustra', serif",
  },
  {
    key: "cakra",
    name: "Cakra",
    tag: "Geometric",
    fontFamily: "'Cakra', sans-serif",
  },
  {
    key: "bluu-next",
    name: "Bluu Next",
    tag: "Sharp Serif",
    fontFamily: "'Bluu Next', serif",
  },
  {
    key: "geom",
    name: "Geom",
    tag: "Cedric Müller",
    fontFamily: "'Geom', sans-serif",
  },
  {
    key: "bagnard",
    name: "Bagnard",
    tag: "Prisoner Serif",
    fontFamily: "'Bagnard', serif",
  },
  {
    key: "nouveau",
    name: "Nouveau",
    tag: "Art Nouveau",
    fontFamily: "'Nouveau', serif",
  },
  {
    key: "getai-grotesk",
    name: "Getai Grotesk",
    tag: "Calligraphic",
    fontFamily: "'Getai Grotesk', sans-serif",
  },
  {
    key: "melete",
    name: "Melete",
    tag: "Sci-Fi Display",
    fontFamily: "'Melete', sans-serif",
  },
  {
    key: "texturina",
    name: "Texturina",
    tag: "Editorial Serif",
    fontFamily: "'Texturina Variable', serif",
  },
  {
    key: "fraunces",
    name: "Fraunces",
    tag: "Wonky Serif",
    fontFamily: "'Fraunces Variable', serif",
  },
  {
    key: "instrument",
    name: "Instrument",
    tag: "Italic Serif",
    fontFamily: "'Instrument Serif', serif",
  },
  {
    key: "syne",
    name: "Syne",
    tag: "Sculptural",
    fontFamily: "'Syne Variable', sans-serif",
  },
  {
    key: "anybody",
    name: "Anybody",
    tag: "Industrial",
    fontFamily: "'Anybody Variable', sans-serif",
  },
];

const PRESET_SIZES = [28, 32, 36, 42];

const emptySubscribe = () => () => { };

export default function TextFXSandbox() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [minimized, setMinimized] = useState(true);
  const {
    headingStyle,
    setHeadingStyle,
    headingSizePx,
    setHeadingSizePx,
  } = useTextFX();

  if (!mounted) return null;

  return (
    <aside
      className={`${styles.sandboxDrawer} ${minimized ? styles.minimized : ""}`}
      aria-label="Card Heading Typography & Sizing Studio"
    >
      <div className={styles.headerRow} onClick={() => setMinimized(!minimized)}>
        <div className={styles.titleArea}>
          <span className={styles.pillBadge}>Typography</span>
          <span className={styles.titleText}>
            {minimized ? "Fonts & Size" : "Card Heading Typography Studio"}
          </span>
        </div>
        <button
          type="button"
          className={styles.toggleBtn}
          aria-label={minimized ? "Expand typography studio" : "Minimize typography studio"}
          title={minimized ? "Expand" : "Minimize"}
        >
          {minimized ? "▲" : "▼"}
        </button>
      </div>

      {!minimized && (
        <div className={styles.contentBody}>
          <p className={styles.instructions}>
            Click any font button to switch headings instantly, and tune the size slider:
          </p>

          {/* Section 1: Typography Grid */}
          <div className={styles.groupHeader}>
            <span className={styles.groupTitle}>1. Typography Font</span>
            <span className={styles.groupBadge}>
              {FONT_OPTIONS.length} Styles
            </span>
          </div>

          <div className={styles.fontButtonsGrid} role="radiogroup" aria-label="Card heading fonts">
            {FONT_OPTIONS.map((font) => {
              const isSelected = headingStyle === font.key;
              return (
                <button
                  key={font.key}
                  type="button"
                  data-font-key={font.key}
                  className={`${styles.fontTile} ${isSelected ? styles.fontTileActive : ""
                    }`}
                  onClick={() => setHeadingStyle(font.key)}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <div className={styles.fontTileTop}>
                    <span
                      className={styles.fontTileName}
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.name}
                    </span>
                    <span className={styles.fontTileBadge}>
                      {isSelected ? "Active" : font.tag}
                    </span>
                  </div>
                  <span className={styles.fontTileCategory}>
                    {font.fontFamily.split(",")[0].replace(/['"]/g, "")}
                  </span>
                </button>
              );
            })}
          </div>

          <div className={styles.divider} />

          {/* Section 2: Heading Size Slider & Quick Presets */}
          <div className={styles.groupHeader}>
            <span className={styles.groupTitle}>2. Heading Size</span>
            <span className={styles.groupBadge}>Live Slider</span>
          </div>

          <div className={styles.sliderRow}>
            <input
              type="range"
              min="24"
              max="46"
              step="1"
              value={headingSizePx}
              onChange={(e) => setHeadingSizePx(Number(e.target.value))}
              className={styles.rangeSlider}
              aria-label="Adjust card heading font size in pixels"
            />
            <span className={styles.sizeValueBadge}>{headingSizePx}px</span>
          </div>

          <div className={styles.sizePresetsRow}>
            {PRESET_SIZES.map((px) => (
              <button
                key={px}
                type="button"
                className={`${styles.sizePresetBtn} ${headingSizePx === px ? styles.sizePresetActive : ""
                  }`}
                onClick={() => setHeadingSizePx(px)}
              >
                {px}px
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
