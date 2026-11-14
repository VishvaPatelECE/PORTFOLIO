"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import styles from "./ExperienceDetail.module.css";

export default function CertificateViewer() {
  const [isZoomed, setIsZoomed] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isZoomed) return;
    const preview = previewRef.current;
    const covered = [...document.body.children].filter((element): element is HTMLElement =>
      element instanceof HTMLElement && !element.contains(modalRef.current));
    const previous = covered.map(element => element.inert);
    covered.forEach(element => { element.inert = true; });
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsZoomed(false);
      } else if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      covered.forEach((element, index) => { element.inert = previous[index]; });
      document.body.style.overflow = overflow;
      preview?.focus({ preventScroll: true });
    };
  }, [isZoomed]);

  return (
    <div className={styles.certDisplayCard}>
      {/* Visual Preview */}
      <div className={styles.certPreviewWrap}>
        <div
          ref={previewRef}
          className={styles.certImageZoomable}
          onClick={() => setIsZoomed(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsZoomed(true);
            }
          }}
          aria-label="Enlarge internship certificate preview"
        >
          <Image
            src="/certificates/svnit_internship_certificate.png"
            alt="Official SVNIT Summer Internship Certificate awarded to Vishva Niral Patel by Department of Artificial Intelligence, SVNIT Surat"
            width={1579}
            height={2376}
            className={styles.certImage}
          />
          <div
            style={{
              position: "absolute",
              bottom: 24,
              right: 24,
              background: "rgba(0, 0, 0, 0.75)",
              color: "#ffffff",
              padding: "6px 12px",
              borderRadius: 6,
              fontSize: 11,
              fontFamily: "var(--font-mono, monospace)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              pointerEvents: "none",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <ZoomIn size={13} />
            <span>Click to Enlarge</span>
          </div>
        </div>
      </div>

      {/* Official Credential Metadata Bar */}
      <div className={styles.certMetaBar}>
        <div className={styles.certMetaCol}>
          <span className={styles.certMetaColLabel}>Institution</span>
          <span className={styles.certMetaColValue}>
            Sardar Vallabhbhai National Institute of Technology (SVNIT), Surat
          </span>
        </div>
        <div className={styles.certMetaCol}>
          <span className={styles.certMetaColLabel}>Programme</span>
          <span className={styles.certMetaColValue}>
            SVNIT Summer Internship Programme (SSIP) 2026
          </span>
        </div>
        <div className={styles.certMetaCol}>
          <span className={styles.certMetaColLabel}>Signatories</span>
          <span className={styles.certMetaColValue}>
            Dr. Nitesh A. Funde (Mentor) &amp; Dr. Tanmoy Hazra (HOD, DoAI)
          </span>
        </div>
        <div className={styles.certMetaCol}>
          <span className={styles.certMetaColLabel}>Award Date &amp; Status</span>
          <span className={styles.certMetaColValue}>
            17th July 2026 · Official Sealed Credential
          </span>
        </div>
      </div>

      {/* Interactive Lightbox Modal */}
      {isZoomed && createPortal(
        <div
          ref={modalRef}
          className={styles.lightboxModal}
          onClick={() => setIsZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged Internship Certificate"
        >
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              className={styles.lightboxClose}
              onClick={() => setIsZoomed(false)}
              aria-label="Close enlarged certificate"
            >
              <X size={14} />
              <span>CLOSE</span>
            </button>
            <Image
              src="/certificates/svnit_internship_certificate.png"
              alt="Official SVNIT Summer Internship Certificate (Enlarged View)"
              width={1579}
              height={2376}
              className={styles.lightboxImg}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

