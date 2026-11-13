"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

const cloudShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    uniform vec3 goldColor;
    uniform vec3 ivoryColor;
    uniform vec3 shadowColor;
    uniform float time;
    varying vec2 vUv;

    void main() {
      float depth = gl_FragCoord.z / gl_FragCoord.w;
      float fogFactor = smoothstep( fogNear, fogFar, depth );

      vec4 tex = texture2D( map, vUv );
      float nearFade = pow( gl_FragCoord.z, 20.0 );
      float alpha = tex.a * nearFade * ( 1.0 - fogFactor * 0.96 );

      // Warm amber-gold pulse matching the hero flow field energy
      vec3 activeGold = goldColor * ( 1.0 + 0.06 * sin( time * 0.7 + vUv.x * 2.0 ) );

      // Multi-tonal cloud shading:
      // Wisps/shadows -> warm bronze umber
      // Midtones -> rich hero gold & amber (#d4a574, #b99d73)
      // Bright crests -> luminous ivory (#e8e0d2)
      float brightness = tex.r;
      vec3 cloudTone = mix( shadowColor, activeGold, smoothstep( 0.04, 0.52, brightness ) );
      cloudTone = mix( cloudTone, ivoryColor, smoothstep( 0.50, 0.94, brightness ) );

      // Dissolve smoothly into void background fog (#08070b)
      vec3 col = mix( cloudTone, fogColor, fogFactor );
      gl_FragColor = vec4( col, alpha * 0.92 );
    }
  `,
};

/**
 * Live Clouds with Three.js
 * Merged plane geometries with custom fog / depth shader.
 * Shaded in warm gold, amber, and ivory to seamlessly harmonize with the hero flow-field and dark void palette.
 *
 * Performance optimisations:
 * - IntersectionObserver pauses the render loop when the canvas is off-screen.
 * - visibilitychange pauses when the tab is hidden.
 * - WebGL context-loss is handled gracefully.
 * - Only one animation frame is ever queued at a time.
 */
export default function ThreeCloudCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId = 0;
    let disposed = false;
    /** True when the canvas is visible on-screen AND the tab is in the foreground. */
    let isVisible = false;
    /** True once the scene geometry is built and ready to render. */
    let sceneReady = false;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 500;
    let windowHalfX = width / 2;
    let windowHalfY = height / 2;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
    camera.position.z = 6000;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    const fog = new THREE.Fog(0x08070b, -100, 3000);
    scene.fog = fog;

    // Palette tokens matching the website and hero flow field
    const goldColor = new THREE.Color(0xd4a574);    // Hero amber-gold
    const ivoryColor = new THREE.Color(0xe8e0d2);   // Website ivory
    const shadowColor = new THREE.Color(0x1a1512);  // Deep warm bronze umber

    let mouseX = 0;
    let mouseY = 0;
    const start_time = Date.now();

    let mergedMesh1: THREE.Mesh | null = null;
    let mergedMesh2: THREE.Mesh | null = null;
    let mergedGeo: THREE.BufferGeometry | null = null;
    let shaderMat: THREE.ShaderMaterial | null = null;
    let loadedTexture: THREE.Texture | null = null;

    /* ------------------------------------------------------------------ */
    /*  Render-loop control: start / stop                                 */
    /* ------------------------------------------------------------------ */

    /** Start the render loop only if visible, scene is ready, and not already running. */
    function startLoop() {
      if (disposed || !isVisible || !sceneReady || animId !== 0) return;
      animate();
    }

    /** Stop the render loop by cancelling the queued frame. */
    function stopLoop() {
      if (animId !== 0) {
        cancelAnimationFrame(animId);
        animId = 0;
      }
    }

    /* ------------------------------------------------------------------ */
    /*  IntersectionObserver: off-screen → pause                          */
    /* ------------------------------------------------------------------ */

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        // Consider visible if any part intersects AND the document is visible
        isVisible = entry.isIntersecting && document.visibilityState === "visible";
        if (isVisible && !wasVisible) startLoop();
        else if (!isVisible && wasVisible) stopLoop();
      },
      { threshold: 0 }
    );
    observer.observe(container);

    /* ------------------------------------------------------------------ */
    /*  visibilitychange: tab hidden → pause                             */
    /* ------------------------------------------------------------------ */

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") {
        isVisible = false;
        stopLoop();
      } else {
        // Re-check intersection — the observer callback won't fire on its own
        // when the tab becomes visible again, so we optimistically resume
        // and let the observer correct if the element scrolled off-screen.
        isVisible = true;
        startLoop();
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    /* ------------------------------------------------------------------ */
    /*  WebGL context loss / restore                                      */
    /* ------------------------------------------------------------------ */

    function onContextLost(event: Event) {
      event.preventDefault();
      stopLoop();
    }

    function onContextRestored() {
      if (isVisible && sceneReady) startLoop();
    }

    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    renderer.domElement.addEventListener("webglcontextrestored", onContextRestored);

    /* ------------------------------------------------------------------ */
    /*  Texture load + scene build                                        */
    /* ------------------------------------------------------------------ */

    const tLoader = new THREE.TextureLoader();
    tLoader.load(
      "/cloud10.png",
      (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }

        loadedTexture = texture;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;

        shaderMat = new THREE.ShaderMaterial({
          uniforms: {
            map: { value: texture },
            fogColor: { value: fog.color },
            fogNear: { value: fog.near },
            fogFar: { value: fog.far },
            goldColor: { value: goldColor },
            ivoryColor: { value: ivoryColor },
            shadowColor: { value: shadowColor },
            time: { value: 0 },
          },
          vertexShader: cloudShader.vertexShader,
          fragmentShader: cloudShader.fragmentShader,
          depthWrite: false,
          depthTest: false,
          transparent: true,
        });

        const planeGeo = new THREE.PlaneGeometry(64, 64);
        const planeObj = new THREE.Object3D();
        const geometries: THREE.BufferGeometry[] = [];

        for (let i = 0; i < 8000; i++) {
          planeObj.position.x = Math.random() * 1000 - 500;
          planeObj.position.y = -Math.random() * Math.random() * 200 - 15;
          planeObj.position.z = i;
          planeObj.rotation.z = Math.random() * Math.PI;
          planeObj.scale.x = planeObj.scale.y =
            Math.random() * Math.random() * 1.5 + 0.5;
          planeObj.updateMatrix();

          const clonedPlaneGeo = planeGeo.clone();
          clonedPlaneGeo.applyMatrix4(planeObj.matrix);
          geometries.push(clonedPlaneGeo);
        }

        planeGeo.dispose();

        mergedGeo = BufferGeometryUtils.mergeGeometries(geometries);
        geometries.forEach((g) => g.dispose());

        if (!mergedGeo) return;

        mergedMesh1 = new THREE.Mesh(mergedGeo, shaderMat);
        mergedMesh1.renderOrder = 2;

        mergedMesh2 = mergedMesh1.clone();
        mergedMesh2.position.z = -8000;
        mergedMesh2.renderOrder = 1;

        scene.add(mergedMesh1);
        scene.add(mergedMesh2);

        sceneReady = true;
        startLoop();
      },
      undefined,
      (err) => {
        console.error("Failed to load /cloud10.png texture", err);
      }
    );

    /* ------------------------------------------------------------------ */
    /*  Input listeners                                                   */
    /* ------------------------------------------------------------------ */

    function onDocumentMouseMove(event: MouseEvent) {
      mouseX = (event.clientX - windowHalfX) * 0.25;
      mouseY = (event.clientY - windowHalfY) * 0.15;
    }

    function onWindowResize() {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 500;
      windowHalfX = width / 2;
      windowHalfY = height / 2;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    /* ------------------------------------------------------------------ */
    /*  Animation loop                                                    */
    /* ------------------------------------------------------------------ */

    function animate() {
      if (disposed || !isVisible) {
        animId = 0;
        return;
      }
      animId = requestAnimationFrame(animate);

      const elapsed = (Date.now() - start_time) * 0.001;
      if (shaderMat) {
        shaderMat.uniforms.time.value = elapsed;
      }

      const scrollOffset = (window.scrollY || 0) * 0.8;
      const position = (elapsed * 30 + scrollOffset) % 8000;

      camera.position.x += (mouseX - camera.position.x) * 0.01;
      camera.position.y += (-mouseY - camera.position.y) * 0.01;
      camera.position.z = -position + 8000;

      renderer.render(scene, camera);
    }

    window.addEventListener("mousemove", onDocumentMouseMove, false);
    window.addEventListener("resize", onWindowResize, false);

    /* ------------------------------------------------------------------ */
    /*  Cleanup                                                           */
    /* ------------------------------------------------------------------ */

    return () => {
      disposed = true;
      stopLoop();

      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onContextRestored);

      window.removeEventListener("mousemove", onDocumentMouseMove);
      window.removeEventListener("resize", onWindowResize);

      if (mergedMesh1) scene.remove(mergedMesh1);
      if (mergedMesh2) scene.remove(mergedMesh2);
      if (mergedGeo) mergedGeo.dispose();
      if (shaderMat) shaderMat.dispose();
      if (loadedTexture) loadedTexture.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
      aria-hidden="true"
    />
  );
}
