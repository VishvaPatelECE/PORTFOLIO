"use client";

import styles from "./ShimmerText.module.css";

interface ShimmerTextProps {
  text: string;
  theme?: "cyan" | "gold" | "silver";
  className?: string;
  as?: "span" | "div" | "h2" | "h3" | "p";
}

export default function ShimmerText({
  text,
  theme = "gold",
  className = "",
  as: Component = "span",
}: ShimmerTextProps) {
  const themeClass =
    theme === "cyan" ? styles.cyan : theme === "gold" ? styles.gold : styles.silver;

  return (
    <Component className={`${styles.shimmerBase} ${themeClass} ${className}`}>
      {text}
    </Component>
  );
}

