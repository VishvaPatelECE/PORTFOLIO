import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export type ProjectCardMotion = { dispose: () => void };

/** Native covers travel through ordinary document flow; scrolling never waits for a handoff. */
export async function createProjectCardMotion(root: HTMLElement, cancelled = () => false): Promise<ProjectCardMotion> {
  await document.fonts.ready;
  if (cancelled() || !root.isConnected) return { dispose() {} };
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add("(min-width: 900px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)", () => {
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".project-card-chapter"));
    root.dataset.projectMotion = "true";
    cards.forEach(card => {
      const body = card.querySelector<HTMLElement>(".project-card-body");
      if (!body) return;
      const side = card.dataset.side === "left" ? -1 : 1;
      const sequence = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
          onToggle: self => {
            if (self.isActive) body.style.willChange = "transform";
            else body.style.removeProperty("will-change");
          },
        },
      });
      sequence.fromTo(body,
        { xPercent: side * 16, y: 84, rotation: side * 6, scale: .94 },
        { xPercent: 0, y: 0, rotation: 0, scale: 1, duration: .36, ease: "power2.out" }, 0)
        .to(body, { xPercent: side * 5, y: -36, rotation: side * -2, scale: .975, duration: .3, ease: "power2.in" }, .7);
    });
    return () => {
      delete root.dataset.projectMotion;
      cards.forEach(card => card.querySelector<HTMLElement>(".project-card-body")?.style.removeProperty("will-change"));
    };
  }, root);
  return { dispose() { media.revert(); } };
}
