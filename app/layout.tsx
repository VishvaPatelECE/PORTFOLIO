import type { Metadata } from "next";
import "@fontsource-variable/anybody/standard.css";
import "@fontsource-variable/recursive/full.css";
import "./globals.css";
import "./laboratory.css";
import "./signal.css";
import "./v1-simulator.css";
import "./scan-entry.css";
import "./project-showcase.css";
import "./project-cards.css";
import { Footer, Header, MotionProvider } from "@/components/Shell";
export const metadata: Metadata = {
  title: {
    default: "Vishva Patel — Embedded & Intelligent Systems",
    template: "%s · VishvaProjects",
  },
  description:
    "Explore the engineering of computer vision, hardware access control and wireless data representation. An interactive portfolio by Vishva Patel.",
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body id="top">
        <MotionProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Header />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
