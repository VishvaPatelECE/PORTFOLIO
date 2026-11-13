export interface MotionDemoItem {
  id: string;
  title: string;
  desc: string;
  href: string;
  technique: string;
}

export const motionDemos: readonly MotionDemoItem[] = [
  {
    id: "depth-gallery",
    title: "1. 3D Depth Gallery",
    desc: "Codrops Three.js Z-axis + Velocity + Mood Background",
    href: "/demo/motion/depth-gallery",
    technique: "Three.js WebGL & GLSL Shader",
  },
  {
    id: "blinds-reveal",
    title: "2. Blinds Reveal",
    desc: "GSAP Staggered Slats & Venetian Shutter Transition",
    href: "/demo/motion/blinds-reveal",
    technique: "GSAP 3D Transform Stagger",
  },
  {
    id: "accordion-parallax",
    title: "3. Accordion Parallax",
    desc: "Jhey Tompkins Responsive Accordion + Parallax Depth",
    href: "/demo/motion/accordion-parallax",
    technique: "CSS Flex & Interactive Parallax",
  },
  {
    id: "3d-carousel",
    title: "4. 3D Cover Flow",
    desc: "Seamless Infinite Scroll Perspective 3D Carousel",
    href: "/demo/motion/3d-carousel",
    technique: "CSS 3D Perspective & Modulo Loop",
  },
] as const;
