"use client";

export default function ShaderGradientContact() {
  return (
    <div
      className="contact-halo-band"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* 2D Halo Gradient in website accent colours (Cyan & Warm Gold) matching ShaderGradient "00 Halo" */}
      <div className="contact-halo-gradient" />
      {/* Tactile Dither Grain Texture */}
      <div className="contact-halo-grain" />
      {/* Soft top and bottom edge fades */}
      <div className="contact-halo-fade" />
    </div>
  );
}
