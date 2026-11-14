import type { Metadata } from "next";
import Link from "next/link";
import DemoNav from "@/components/demo/DemoNav";
import { motionDemos } from "@/lib/content/motion-demos";
import styles from "./motionHub.module.css";
import { ArrowUpRight, Box, Layers, Columns3, Disc3 } from "lucide-react";

const demoIcons = {
  "depth-gallery": Box,
  "blinds-reveal": Layers,
  "accordion-parallax": Columns3,
  "3d-carousel": Disc3,
} as const;

export const metadata: Metadata = {
  title: { absolute: "Vishva Patel | Systems & ECE" },
  robots: { index: false, follow: false },
};

export default function MotionLabHubPage() {
  return (
    <main id="main">
      <DemoNav />
      <div className={styles.hub}>
        <div className={styles.hero}>
          <span className={styles.tag}>RESEARCH PROTOTYPES</span>
          <h1 className={styles.heading}>Project Showcase Motion Lab</h1>
          <p className={styles.intro}>
            Four synchronized motion implementations evaluated for VishvaProjects V3. Compare
            depth physics, shutter reveals, responsive accordion disclosures, and 3D perspective carousels.
          </p>
        </div>

        <div className={styles.grid}>
          {motionDemos.map((demo, idx) => {
            const Icon = demoIcons[demo.id as keyof typeof demoIcons] || Box;
            return (
              <Link key={demo.id} href={demo.href} className={styles.demoCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardNum}>0{idx + 1}</span>
                  <div className={styles.iconBox}>
                    <Icon size={20} />
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{demo.title}</h2>
                  <p className={styles.cardDesc}>{demo.desc}</p>
                </div>

                <div className={styles.cardFoot}>
                  <span>Launch Demo</span>
                  <ArrowUpRight size={17} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
