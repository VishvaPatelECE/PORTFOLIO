"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motionDemos } from "@/lib/content/motion-demos";
import styles from "./DemoNav.module.css";
import { ArrowLeft, Box, Layers, Columns3, Disc3 } from "lucide-react";

const demoIcons = {
  "depth-gallery": Box,
  "blinds-reveal": Layers,
  "accordion-parallax": Columns3,
  "3d-carousel": Disc3,
} as const;

export default function DemoNav() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.lead}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Portfolio</span>
          </Link>
          <span className={styles.badge}>MOTION LAB</span>
        </div>
        <nav className={styles.nav} aria-label="Motion Demos">
          {motionDemos.map((demo) => {
            const Icon = demoIcons[demo.id as keyof typeof demoIcons] || Box;
            const active = pathname === demo.href;
            return (
              <Link
                key={demo.id}
                href={demo.href}
                className={`${styles.tab} ${active ? styles.tabActive : ""}`}
                title={demo.desc}
              >
                <Icon size={15} />
                <span>{demo.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
