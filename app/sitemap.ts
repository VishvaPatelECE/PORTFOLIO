import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/site";

const LAST_MODIFIED = new Date("2026-11-12T00:00:00Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/about", changeFrequency: "monthly", priority: 0.9 },
    { path: "/rangraph", changeFrequency: "monthly", priority: 0.9 },
    { path: "/graphmarl", changeFrequency: "monthly", priority: 0.9 },
    { path: "/darvs", changeFrequency: "monthly", priority: 0.9 },
    { path: "/darvs/demo", changeFrequency: "monthly", priority: 0.7 },
    { path: "/usmhacs", changeFrequency: "monthly", priority: 0.8 },
    { path: "/usmhacs/full", changeFrequency: "monthly", priority: 0.6 },
    { path: "/experience/svnit", changeFrequency: "monthly", priority: 0.85 },
    { path: "/credits", changeFrequency: "yearly", priority: 0.4 },
  ];

  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: LAST_MODIFIED,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

