import type { Metadata } from "next";
import AboutExperience from "@/components/about/AboutExperience";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  profilePageJsonLd,
  serializeJsonLd,
} from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "About — Engineering Background, Systems & Capabilities",
  description:
    "Academic background at Dharmsinh Desai University (CGPA 8.99/10), GATE EC 2026 AIR 6,931, SVNIT AI Research Internship, hardware workbench, and engineering capabilities.",
  path: "/about",
  keywords: [
    "Vishva Patel",
    "Dharmsinh Desai University",
    "GATE EC 2026",
    "SVNIT Surat",
    "Systems Engineering",
  ],
});

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([
            profilePageJsonLd(),
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]),
          ]),
        }}
      />
      <AboutExperience />
    </>
  );
}
