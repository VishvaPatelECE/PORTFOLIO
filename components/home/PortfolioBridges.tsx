import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./PortfolioBridges.module.css";

export function PortfolioInterests() {
  return <section className={`${styles.interests} wrap`} aria-labelledby="interests-title">
    <h2 id="interests-title">What I explore<span>.</span></h2>
    <p><span>Embedded systems</span><span>Computer vision</span><span>Wireless research</span></p>
  </section>;
}

export function EngineeringNotes() {
  return <section className={`${styles.notes} wrap`} aria-labelledby="notes-title">
    <h2 id="notes-title">Inside the work<span>.</span></h2>
    <div>
      <Link href="/rangraph#engineering-notes" prefetch={false}><span>Every edge needs a reason.</span><ArrowUpRight size={23} /></Link>
      <Link href="/darvs#engineering-notes" prefetch={false}><span>Identity and presence.</span><ArrowUpRight size={23} /></Link>
      <Link href="/usmhacs#engineering-notes" prefetch={false}><span>Remembering a fault.</span><ArrowUpRight size={23} /></Link>
    </div>
  </section>;
}
