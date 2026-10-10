"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { featuredProjects } from "@/lib/content/projects";
import { projectCovers } from "@/lib/content/project-covers";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import styles from "./Carousel3DDemo.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Draggable);
}

// 8 items by repeating the 4 featured projects for a continuous seamless loop
const LOOP_ITEMS = [...featuredProjects, ...featuredProjects];

export default function Carousel3DDemo() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const cardsListRef = useRef<HTMLUListElement>(null);
  const dragProxyRef = useRef<HTMLDivElement>(null);

  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    const cardsList = cardsListRef.current;
    const runway = runwayRef.current;
    const dragProxy = dragProxyRef.current;
    if (!gallery || !cardsList || !runway || !dragProxy) return;

    const cards = gsap.utils.toArray<HTMLElement>(cardsList.children);
    if (!cards.length) return;

    // Exact state initialization from reference
    gsap.set(cards, { xPercent: 400, opacity: 0, scale: 0 });

    const spacing = 0.125;
    const snapTime = gsap.utils.snap(spacing);

    const animateFunc = (element: HTMLElement) => {
      const tl = gsap.timeline();
      tl.fromTo(
        element,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          zIndex: 100,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: "power1.in",
          immediateRender: false,
        }
      ).fromTo(
        element,
        { xPercent: 400 },
        { xPercent: -400, duration: 1, ease: "none", immediateRender: false },
        0
      );
      return tl;
    };

    function buildSeamlessLoop(
      items: HTMLElement[],
      sp: number,
      animFn: (el: HTMLElement) => gsap.core.Timeline
    ) {
      const overlap = Math.ceil(1 / sp);
      const startTime = items.length * sp + 0.5;
      const loopTime = (items.length + overlap) * sp + 1;
      const rawSequence = gsap.timeline({ paused: true });
      const sLoop = gsap.timeline({
        paused: true,
        repeat: -1,
        onRepeat(this: gsap.core.Timeline) {
          if (this.time() === this.duration()) {
            this.totalTime(this.duration() - 0.01);
          }
        },
      });
      const l = items.length + overlap * 2;

      for (let i = 0; i < l; i++) {
        const index = i % items.length;
        const time = i * sp;
        rawSequence.add(animFn(items[index]), time);
        if (i <= items.length) sLoop.add("label" + i, time);
      }

      rawSequence.time(startTime);
      sLoop
        .to(rawSequence, {
          time: loopTime,
          duration: loopTime - startTime,
          ease: "none",
        })
        .fromTo(
          rawSequence,
          { time: overlap * sp + 1 },
          {
            time: startTime,
            duration: startTime - (overlap * sp + 1),
            immediateRender: false,
            ease: "none",
          }
        );

      return sLoop;
    }

    const seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc);
    const playhead = { offset: 0 };
    const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());

    const scrub = gsap.to(playhead, {
      offset: 0,
      onUpdate() {
        seamlessLoop.time(wrapTime(playhead.offset));
      },
      duration: 0.5,
      ease: "power3",
      paused: true,
    });

    let iteration = 0;

    const trigger = ScrollTrigger.create({
      trigger: runway,
      start: "top top",
      end: "+=2500",
      pin: gallery,
      onUpdate(self) {
        const scroll = self.scroll();
        if (scroll > self.end - 1) {
          wrap(1, 2);
        } else if (scroll < 1 && self.direction < 0) {
          wrap(-1, self.end - 2);
        } else {
          scrub.vars.offset = (iteration + self.progress) * seamlessLoop.duration();
          scrub.invalidate().restart();
        }
      },
    });

    const progressToScroll = (progress: number) =>
      gsap.utils.clamp(
        1,
        trigger.end - 1,
        gsap.utils.wrap(0, 1, progress) * trigger.end
      );

    const wrap = (iterationDelta: number, scrollTo: number) => {
      iteration += iterationDelta;
      trigger.scroll(scrollTo);
      trigger.update();
    };

    function scrollToOffset(offset: number) {
      const snappedTime = snapTime(offset);
      const progress =
        (snappedTime - seamlessLoop.duration() * iteration) /
        seamlessLoop.duration();
      const scroll = progressToScroll(progress);
      if (progress >= 1 || progress < 0) {
        return wrap(Math.floor(progress), scroll);
      }
      trigger.scroll(scroll);
    }

    const onScrollEnd = () => {
      if (scrub.vars.offset !== undefined) {
        scrollToOffset(Number(scrub.vars.offset));
      }
    };
    ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);

    const onNext = () => {
      if (scrub.vars.offset !== undefined) {
        scrollToOffset(Number(scrub.vars.offset) + spacing);
      }
    };
    const onPrev = () => {
      if (scrub.vars.offset !== undefined) {
        scrollToOffset(Number(scrub.vars.offset) - spacing);
      }
    };

    const nextBtn = nextBtnRef.current;
    const prevBtn = prevBtnRef.current;
    nextBtn?.addEventListener("click", onNext);
    prevBtn?.addEventListener("click", onPrev);

    let draggableInstance: globalThis.Draggable[] | null = null;
    try {
      draggableInstance = Draggable.create(dragProxy, {
        type: "x",
        trigger: cardsList,
        onPress(this: globalThis.Draggable) {
          (this as unknown as { startOffset: number }).startOffset = Number(scrub.vars.offset || 0);
        },
        onDrag(this: globalThis.Draggable) {
          const self = this as unknown as { startOffset: number; startX: number; x: number };
          scrub.vars.offset = self.startOffset + (self.startX - self.x) * 0.001;
          scrub.invalidate().restart();
        },
        onDragEnd() {
          scrollToOffset(Number(scrub.vars.offset || 0));
        },
      });
    } catch {
      // Fallback if Draggable context is not bound
    }

    return () => {
      ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
      nextBtn?.removeEventListener("click", onNext);
      prevBtn?.removeEventListener("click", onPrev);
      if (draggableInstance) draggableInstance.forEach((d) => d.kill());
      trigger.kill();
      scrub.kill();
      seamlessLoop.kill();
    };
  }, []);

  return (
    <div className={styles.runway} ref={runwayRef}>
      <div className={styles.gallery} ref={galleryRef}>
        <div className={styles.titleArea}>
          <span className={styles.tag}>GREENSOCK SEAMLESS COVER FLOW</span>
          <h1 className={styles.heading}>Infinite 3D Project Carousel</h1>
        </div>

        <ul className={styles.cards} ref={cardsListRef}>
          {LOOP_ITEMS.map((item, idx) => {
            const cover = projectCovers[item.kind];
            return (
              <li key={`${item.name}-${idx}`} className={styles.cardItem}>
                <div className={styles.cardInner}>
                  <div className={styles.cardImage}>
                    <Image
                      src={cover.image}
                      alt={cover.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                    />
                  </div>
                  <div className={styles.cardImageOverlay} />
                  <div className={styles.cardContent}>
                    <span className={styles.cardTag}>{item.field}</span>
                    <h3 className={styles.cardTitle}>{item.name}</h3>
                    <p className={styles.cardLine}>{item.line}</p>
                    <Link href={item.href} className={styles.cardLink}>
                      {item.action} <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className={styles.actions}>
          <button
            ref={prevBtnRef}
            type="button"
            className={styles.navBtn}
            aria-label="Previous card"
          >
            <ArrowLeft size={16} /> Prev
          </button>
          <button
            ref={nextBtnRef}
            type="button"
            className={styles.navBtn}
            aria-label="Next card"
          >
            Next <ArrowRight size={16} />
          </button>
        </div>

        <div className={styles.dragProxy} ref={dragProxyRef} />
      </div>
    </div>
  );
}
