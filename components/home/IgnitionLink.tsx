"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { vertexShader, fragmentShader } from "@/three/ignition/shaders";

/** Original ThreeUI Ignition shader in a native, accessible portfolio link. */
export default function IgnitionLink({
  href,
  children,
  paused = false,
}: {
  href: string;
  children: React.ReactNode;
  paused?: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const stopped = useRef(paused);
  const wake = useRef<(() => void) | null>(null);
  useEffect(() => {
    stopped.current = paused;
    wake.current?.();
  }, [paused]);
  useEffect(() => {
    const surface = canvas.current,
      anchor = link.current;
    if (!surface || !anchor) return;
    const gl = surface.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexShader),
      fragment = compile(gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return;
    }
    const program = gl.createProgram()!;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      return;
    }
    const buffer = gl.createBuffer();
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const location = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    const res = gl.getUniformLocation(program, "u_res"),
      time = gl.getUniformLocation(program, "u_time"),
      warpUniform = gl.getUniformLocation(program, "u_warp"),
      flashUniform = gl.getUniformLocation(program, "u_flash");
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = media.matches,
      visible = true,
      disposed = false,
      raf = 0,
      last = 0,
      warp = 0,
      target = 0,
      flash = 0,
      phase = 0;
    const draw = (now: number) => {
      raf = 0;
      if (disposed || !visible || document.hidden) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      warp += (target - warp) * Math.min(1, dt * 2.6);
      flash *= Math.exp(-4.5 * dt);
      phase += dt * (0.05 + warp * 1.35);
      const dpr = Math.min(devicePixelRatio, 1.5);
      const width = Math.max(1, Math.round(surface.clientWidth * dpr)),
        height = Math.max(1, Math.round(surface.clientHeight * dpr));
      if (surface.width !== width || surface.height !== height) {
        surface.width = width;
        surface.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform2f(res, width, height);
      gl.uniform1f(time, reduced ? 4 : phase);
      gl.uniform1f(warpUniform, reduced || stopped.current ? 0 : warp);
      gl.uniform1f(flashUniform, reduced || stopped.current ? 0 : flash);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced && !stopped.current) raf = requestAnimationFrame(draw);
    };
    const schedule = () => {
      if (!raf && !disposed) {
        last = 0;
        raf = requestAnimationFrame(draw);
      }
    };
    const over = () => {
        target = 1;
        schedule();
      },
      out = () => {
        target = 0;
        schedule();
      },
      click = () => {
        flash = 1;
        phase = 0;
        schedule();
      };
    const preference = () => {
      reduced = media.matches;
      cancelAnimationFrame(raf);
      raf = 0;
      schedule();
    };
    const visibility = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      schedule();
    };
    wake.current = visibility;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      raf = 0;
      schedule();
    });
    observer.observe(anchor);
    const resize = new ResizeObserver(schedule);
    resize.observe(surface);
    anchor.addEventListener("pointerenter", over);
    anchor.addEventListener("pointerleave", out);
    anchor.addEventListener("focus", over);
    anchor.addEventListener("blur", out);
    anchor.addEventListener("click", click);
    media.addEventListener("change", preference);
    document.addEventListener("visibilitychange", visibility);
    schedule();
    return () => {
      wake.current = null;
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      resize.disconnect();
      anchor.removeEventListener("pointerenter", over);
      anchor.removeEventListener("pointerleave", out);
      anchor.removeEventListener("focus", over);
      anchor.removeEventListener("blur", out);
      anchor.removeEventListener("click", click);
      media.removeEventListener("change", preference);
      document.removeEventListener("visibilitychange", visibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);
  return (
    <Link ref={link} href={href} className="real-ignition">
      <span className="real-ignition-well">
        <canvas
          ref={canvas}
          aria-hidden="true"
          data-threeui-effect="ignition-button"
        />
        <span>
          {children}
          <ArrowUpRight size={18} />
        </span>
      </span>
    </Link>
  );
}
