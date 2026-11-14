import Image from "next/image";
import { projectCovers, type ProjectCoverKind } from "@/lib/content/project-covers";
import styles from "./ProjectCover.module.css";

export default function ProjectCover({ kind }: { kind: ProjectCoverKind }) {
  const cover = projectCovers[kind];
  return <figure className={styles.figure}>
    <div className={styles.image}><Image src={cover.image} alt={cover.alt} fill sizes="(max-width: 900px) 90vw, 1280px" placeholder="blur" /></div>
    <figcaption>Concept artwork</figcaption>
  </figure>;
}
