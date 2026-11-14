/* eslint-disable */
// Cosmic BG with Interactive Liquid/Water Effect — Originkit (adapted for portfolio v3)

"use client";

import { useEffect, useRef } from "react";

// One place every control default lives, so props agree.
const DEFAULTS = {
  core: true,
  coreColor: "#00e5ff", // Website Cyan accent
  midColor: "#005288",  // Oceanic Deep Blue
  accentColor: "#d9a33d", // Laboratory Gold accent
  outerColor: "#e6f9ff", // Light Cyan/White stardust
  detail: 18,
  brightness: 32,
  speed: 15,
  rotation: 12,
  waterEffect: true,
  waterStrength: 1.0,
};

const BRIGHTNESS_MAX = 3;
const STATIC_TIME = 6;
const MAX_RIPPLES = 8;

function clamp(n: any, min: number, max: number, fallback: number) {
  const v = typeof n === "number" ? n : parseFloat(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.min(max, Math.max(min, v));
}

function rgbOf(value: any, fallback: string): [number, number, number] {
  const s = typeof value === "string" && value ? value.trim() : fallback;
  const hex = s.replace("#", "");
  if (/^[0-9a-f]{3}$/i.test(hex)) {
    return [
      parseInt(hex[0] + hex[0], 16) / 255,
      parseInt(hex[1] + hex[1], 16) / 255,
      parseInt(hex[2] + hex[2], 16) / 255,
    ];
  }
  if (/^[0-9a-f]{6,8}$/i.test(hex)) {
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
    ];
  }
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const parts = m[1].split(",").map((p) => parseFloat(p));
    if (parts.length >= 3) {
      return [parts[0] / 255, parts[1] / 255, parts[2] / 255];
    }
  }
  return rgbOf(null, fallback === s ? "#FFFFFF" : fallback);
}

function settingsFor(p: any) {
  return {
    core: p?.core !== false,
    coreColor: rgbOf(p?.coreColor, DEFAULTS.coreColor),
    midColor: rgbOf(p?.midColor, DEFAULTS.midColor),
    accentColor: rgbOf(p?.accentColor, DEFAULTS.accentColor),
    outerColor: rgbOf(p?.outerColor, DEFAULTS.outerColor),
    detail: 1 + (clamp(p?.detail, 1, 20, DEFAULTS.detail) / 20) * 4,
    brightness:
      (clamp(p?.brightness, 0, 100, DEFAULTS.brightness) / 100) *
      BRIGHTNESS_MAX,
    speed: clamp(p?.speed, 0, 30, DEFAULTS.speed) / 10,
    rotation: clamp(p?.rotation, 0, 20, DEFAULTS.rotation) / 20,
    waterEffect: p?.waterEffect !== false,
    waterStrength: clamp(p?.waterStrength, 0, 2, DEFAULTS.waterStrength),
  };
}

const VERT = `
attribute vec4 a_pos;
void main() {
    gl_Position = a_pos;
}
`;

const FRAG = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;
uniform vec3 u_core;
uniform bool u_showCore;
uniform vec3 u_mid;
uniform vec3 u_accent;
uniform vec3 u_outer;
uniform float u_complexity;
uniform float u_bright;
uniform float u_rotSpeed;

// Interactive Water Ripple System
#define MAX_RIPPLES 8
uniform vec3 u_ripples[MAX_RIPPLES]; // xy: position in p space, z: intensity
uniform float u_rippleTimes[MAX_RIPPLES]; // birth time in u_time units
uniform float u_waterStrength;

mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 7; i++) {
        v += a * noise(p); p *= rot(0.5); p *= 2.1; a *= 0.5;
    }
    return v;
}

void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * u_res.xy) / min(u_res.y, u_res.x);
    float t = u_time * 0.1;

    // Water ripple fluid displacement & surface reflections
    float rippleGleam = 0.0;
    if (u_waterStrength > 0.01) {
        vec2 rippleDisp = vec2(0.0);
        for (int i = 0; i < MAX_RIPPLES; i++) {
            float intensity = u_ripples[i].z;
            if (intensity > 0.001) {
                float age = u_time - u_rippleTimes[i];
                if (age >= 0.0 && age < 3.2) {
                    vec2 rPos = u_ripples[i].xy;
                    float d = length(p - rPos);
                    float radius = age * 0.55; // ripple wavefront velocity
                    float distFromFront = abs(d - radius);
                    if (distFromFront < 0.22) {
                        float wave = sin((d - radius) * 35.0);
                        float decay = exp(-age * 1.35) * exp(-distFromFront * 15.0);
                        vec2 dir = normalize(p - rPos + vec2(0.0001));
                        float amt = wave * decay * intensity;
                        rippleDisp += dir * amt * 0.055 * u_waterStrength;
                        rippleGleam += amt * decay;
                    }
                }
            }
        }

        // Ambient micro-undulation for living liquid surface
        vec2 ambientLiquid = vec2(
            sin(p.y * 6.5 + u_time * 1.3) * 0.0035,
            cos(p.x * 6.5 + u_time * 1.3) * 0.0035
        ) * u_waterStrength;

        p += rippleDisp + ambientLiquid;
    }

    p *= rot(u_time * u_rotSpeed * 0.05);

    float dist = length(p);

    float angleNoise = fbm(p * 3.0 + t * 0.5) * 0.3;
    float distortedDist = dist + angleNoise * smoothstep(0.5, 0.0, dist);

    vec2 nebP = p * u_complexity;

    vec2 q = vec2(fbm(nebP + vec2(cos(t), sin(t))), fbm(nebP + 1.2));
    vec2 r = vec2(fbm(nebP + 4.0 * q + t), fbm(nebP + 4.0 * q + 2.8));
    float f = fbm(nebP + 4.0 * r);

    float coreMask = smoothstep(0.8, 0.0, distortedDist) * (0.5 + 0.5 * smoothstep(0.1, 0.9, f));
    float coreGlow = exp(-3.0 * distortedDist);

    vec3 colCore = u_showCore ? u_core * (coreMask * 2.0 + coreGlow * 1.5) : vec3(0.0);

    float ring = smoothstep(0.05, 0.35, dist) * smoothstep(0.9, 0.3, dist);
    float filament = pow(f, 1.2);

    vec3 colMix = mix(u_mid, u_accent, smoothstep(0.2, 0.6, f));
    colMix = mix(colMix, u_outer, smoothstep(0.4, 0.9, f));
    vec3 colOuter = colMix * ring * filament * 2.0;

    float dust = smoothstep(0.3, 0.9, fbm(nebP * 1.5 + r));
    dust = mix(1.0, dust, smoothstep(0.0, 0.3, dist));

    vec3 finalCol = (colCore + colOuter) * dust * u_bright;
    finalCol += u_showCore ? u_mid * coreMask * ring * 0.8 : vec3(0.0);

    // Liquid specular highlight and caustic gleam over the nebula
    if (u_waterStrength > 0.01) {
        float gleam = clamp(rippleGleam * 2.2, 0.0, 1.0);
        finalCol += vec3(0.0, 0.85, 1.0) * gleam * 0.28 + vec3(1.0, 0.88, 0.5) * pow(gleam, 2.5) * 0.35;
    }

    float lum = max(finalCol.r, max(finalCol.g, finalCol.b));
    gl_FragColor = vec4(finalCol, clamp(lum, 0.0, 1.0));
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("CosmicBG shader:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function buildProgram(gl: WebGLRenderingContext) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("CosmicBG link:", gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

export interface CosmicBGProps {
  core?: boolean;
  coreColor?: string;
  midColor?: string;
  accentColor?: string;
  outerColor?: string;
  detail?: number;
  brightness?: number;
  speed?: number;
  rotation?: number;
  waterEffect?: boolean;
  waterStrength?: number;
  style?: React.CSSProperties;
  className?: string;
}

export default function CosmicBG(props: CosmicBGProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      depth: false,
      premultipliedAlpha: true,
    });
    if (!gl) return;

    const program = buildProgram(gl);
    if (!program) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    const u = {
      time: gl.getUniformLocation(program, "u_time"),
      res: gl.getUniformLocation(program, "u_res"),
      core: gl.getUniformLocation(program, "u_core"),
      showCore: gl.getUniformLocation(program, "u_showCore"),
      mid: gl.getUniformLocation(program, "u_mid"),
      accent: gl.getUniformLocation(program, "u_accent"),
      outer: gl.getUniformLocation(program, "u_outer"),
      complexity: gl.getUniformLocation(program, "u_complexity"),
      bright: gl.getUniformLocation(program, "u_bright"),
      rotSpeed: gl.getUniformLocation(program, "u_rotSpeed"),
      ripples: gl.getUniformLocation(program, "u_ripples"),
      rippleTimes: gl.getUniformLocation(program, "u_rippleTimes"),
      waterStrength: gl.getUniformLocation(program, "u_waterStrength"),
    };
    const aPos = gl.getAttribLocation(program, "a_pos");

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, 1, 1, 1, -1, -1, 1, -1]),
      gl.STATIC_DRAW
    );

    // Ripple state management
    const rippleData = new Float32Array(MAX_RIPPLES * 3);
    const rippleTimes = new Float32Array(MAX_RIPPLES);
    let rippleIdx = 0;
    const start = performance.now();

    function addRipple(clientX: number, clientY: number, intensity = 1.0) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const screenX = (clientX - rect.left) * (canvas.width / rect.width);
      const screenY = (rect.bottom - clientY) * (canvas.height / rect.height);
      const minRes = Math.min(canvas.width, canvas.height);
      const px = (screenX - 0.5 * canvas.width) / minRes;
      const py = (screenY - 0.5 * canvas.height) / minRes;

      const S = settingsFor(propsRef.current);
      const idx = rippleIdx;
      rippleIdx = (rippleIdx + 1) % MAX_RIPPLES;

      rippleData[idx * 3] = px;
      rippleData[idx * 3 + 1] = py;
      rippleData[idx * 3 + 2] = intensity;
      // Timestamp in shader u_time units
      rippleTimes[idx] = ((performance.now() - start) / 1000) * S.speed;
    }

    // Pointer interactivity across the contact section
    let lastX = 0;
    let lastY = 0;
    let lastMoveTime = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastMoveTime < 75) return;
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left - 50 &&
        e.clientX <= rect.right + 50 &&
        e.clientY >= rect.top - 50 &&
        e.clientY <= rect.bottom + 50
      ) {
        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        if (dist > 18) {
          addRipple(e.clientX, e.clientY, 0.75);
          lastX = e.clientX;
          lastY = e.clientY;
          lastMoveTime = now;
        }
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left - 50 &&
        e.clientX <= rect.right + 50 &&
        e.clientY >= rect.top - 50 &&
        e.clientY <= rect.bottom + 50
      ) {
        addRipple(e.clientX, e.clientY, 1.8);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    // Periodic gentle ambient droplet so the water surface stays alive
    let ambientDropTimer: any = null;
    ambientDropTimer = setInterval(() => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      // Gentle drop around center/mid area of nebula
      const rx = rect.left + rect.width * (0.32 + Math.random() * 0.36);
      const ry = rect.top + rect.height * (0.32 + Math.random() * 0.36);
      addRipple(rx, ry, 0.45);
    }, 2500);

    // Initial greeting ripple
    setTimeout(() => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      addRipple(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5, 1.2);
    }, 300);

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.round(canvas!.clientWidth * dpr);
      const h = Math.round(canvas!.clientHeight * dpr);
      if (!w || !h) return false;
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }
      return true;
    }

    function draw(time: number) {
      if (!resize()) return;
      const S = settingsFor(propsRef.current);

      gl!.viewport(0, 0, gl!.canvas.width, gl!.canvas.height);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.useProgram(program!);

      gl!.uniform1f(u.time, time * S.speed);
      gl!.uniform2f(u.res, gl!.canvas.width, gl!.canvas.height);
      gl!.uniform3fv(u.core, S.coreColor);
      gl!.uniform1i(u.showCore, S.core ? 1 : 0);
      gl!.uniform3fv(u.mid, S.midColor);
      gl!.uniform3fv(u.accent, S.accentColor);
      gl!.uniform3fv(u.outer, S.outerColor);
      gl!.uniform1f(u.complexity, S.detail);
      gl!.uniform1f(u.bright, S.brightness);
      gl!.uniform1f(u.rotSpeed, S.rotation);

      if (u.ripples) gl!.uniform3fv(u.ripples, rippleData);
      if (u.rippleTimes) gl!.uniform1fv(u.rippleTimes, rippleTimes);
      if (u.waterStrength) gl!.uniform1f(u.waterStrength, S.waterEffect ? S.waterStrength : 0.0);

      gl!.bindBuffer(gl!.ARRAY_BUFFER, quadBuffer);
      gl!.vertexAttribPointer(aPos, 2, gl!.FLOAT, false, 0, 0);
      gl!.enableVertexAttribArray(aPos);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    const cleanupGL = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      if (ambientDropTimer) clearInterval(ambientDropTimer);
      gl.deleteBuffer(quadBuffer);
      gl.deleteProgram(program);
    };

    let raf = 0;
    let isVisible = true;
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      draw(STATIC_TIME);
      return cleanupGL;
    }

    function loop(now: number) {
      if (isVisible) {
        draw((now - start) / 1000);
      }
      raf = window.requestAnimationFrame(loop);
    }

    // Optimization: Pause animation loop when off-screen to preserve RAM & GPU
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(([entry]) => {
        isVisible = entry?.isIntersecting ?? true;
      });
      observer.observe(canvas);
    }

    raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(raf);
      if (observer) observer.disconnect();
      cleanupGL();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={props.className}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
        ...(props.style || {}),
      }}
    />
  );
}

CosmicBG.displayName = "Cosmic Background with Liquid Ripples";
