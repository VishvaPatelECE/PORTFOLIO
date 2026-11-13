"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Columns3, Film, CheckCircle2 } from "lucide-react";
import CandidateADeck from "@/components/demo/CandidateADeck";
import CandidateBStage from "@/components/demo/CandidateBStage";
import SignalTubes from "@/components/home/SignalTubes";

export default function MotionComparePage() {
  const [selectedCandidate, setSelectedCandidate] = useState<"A" | "B" | "BOTH">("A");

  return (
    <main
      id="main"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#08070b",
        color: "#e8e0d2",
        paddingBottom: "100px",
      }}
    >
      {/* Background Signal Tubes preserved intact */}
      <SignalTubes />

      {/* Top Header & Sticky Candidate Switcher */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 99,
          background: "rgba(8, 7, 11, 0.88)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "14px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1380,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "#afaea2",
                textDecoration: "none",
                fontSize: 13,
                fontFamily: "monospace",
              }}
            >
              <ArrowLeft size={15} />
              <span>Portfolio Home</span>
            </Link>
            <span
              style={{
                background: "rgba(185, 157, 115, 0.2)",
                color: "#ffdeab",
                fontSize: 11,
                fontFamily: "monospace",
                padding: "2px 8px",
                borderRadius: 4,
                border: "1px solid rgba(185, 157, 115, 0.4)",
                fontWeight: 700,
              }}
            >
              GATE 2 EXPERIMENT LAB
            </span>
          </div>

          {/* Toggle Switcher */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 999,
              padding: 3,
              gap: 4,
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedCandidate("A")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 999,
                border: "none",
                background: selectedCandidate === "A" ? "#00aebd" : "transparent",
                color: selectedCandidate === "A" ? "#08070b" : "#dcd7ce",
                fontWeight: selectedCandidate === "A" ? 700 : 500,
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <Columns3 size={14} />
              <span>Candidate A: Tactile Kinetic Deck</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCandidate("B")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 999,
                border: "none",
                background: selectedCandidate === "B" ? "#b99d73" : "transparent",
                color: selectedCandidate === "B" ? "#08070b" : "#dcd7ce",
                fontWeight: selectedCandidate === "B" ? 700 : 500,
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <Film size={14} />
              <span>Candidate B: Cinematic Stage</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCandidate("BOTH")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 999,
                border: "none",
                background: selectedCandidate === "BOTH" ? "rgba(255,255,255,0.18)" : "transparent",
                color: "#fff",
                fontWeight: selectedCandidate === "BOTH" ? 700 : 500,
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <span>Side-by-Side</span>
            </button>
          </div>
        </div>
      </header>

      {/* Compact Experiment Bar */}
      <div
        style={{
          maxWidth: 1380,
          margin: "0 auto",
          padding: "16px 24px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "monospace",
          fontSize: 12,
          color: "#8c8a82",
        }}
      >
        <span>EXPERIMENT: NORMAL DOCUMENT FLOW &amp; VERTICAL CENTERED LABELS</span>
        <span style={{ color: "#00aebd" }}>TEST KEYS: ARROWS / TAB / CLICK</span>
      </div>

      {/* Candidate A Showcase */}
      {(selectedCandidate === "A" || selectedCandidate === "BOTH") && (
        <section
          style={{
            borderBottom: selectedCandidate === "BOTH" ? "2px dashed rgba(255,255,255,0.12)" : "none",
            padding: "32px 0 48px",
          }}
        >
          <CandidateADeck />
        </section>
      )}

      {/* Candidate B Showcase */}
      {(selectedCandidate === "B" || selectedCandidate === "BOTH") && (
        <section style={{ padding: "32px 0 48px" }}>
          <CandidateBStage />
        </section>
      )}

      {/* Trailing Section to Verify Native Scroll Continuation */}
      <section
        style={{
          maxWidth: 1380,
          margin: "60px auto 0",
          padding: "36px 24px",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(255, 255, 255, 0.02)",
          borderRadius: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#b99d73", marginBottom: 8 }}>
          <CheckCircle2 size={18} />
          <strong style={{ fontFamily: "monospace", fontSize: 13 }}>NORMAL DOCUMENT FLOW VERIFIED</strong>
        </div>
        <p style={{ margin: 0, fontFamily: "monospace", fontSize: 13, color: "#8c8a82", lineHeight: 1.5 }}>
          You have scrolled smoothly past the gallery with zero scroll traps, zero dead zones, and zero card jumping.
        </p>
      </section>
    </main>
  );
}
