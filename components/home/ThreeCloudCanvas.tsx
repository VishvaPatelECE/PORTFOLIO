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
    varying vec2 vUv;

    void main() {
      float depth = gl_FragCoord.z / gl_FragCoord.w;
      float fogFactor = smoothstep( fogNear, fogFar, depth );

      gl_FragColor = texture2D( map, vUv );
      gl_FragColor.w *= pow( gl_FragCoord.z, 20.0 );
      gl_FragColor = mix( gl_FragColor, vec4( fogColor , gl_FragColor.w ), fogFactor );
    }
  `,
};

/**
 * Live Clouds with Three.js
 * Merged plane geometries with custom fog / depth shader.
 * Source: DenDionigi / Mr.doob / FreeFrontend
 */
export default function ThreeCloudCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId = 0;
    let disposed = false;

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
    renderer.setClearColor(0x08070b, 1);
    container.appendChild(renderer.domElement);

    const fog = new THREE.Fog(0x08070b, -100, 3000);
    scene.fog = fog;

    let mouseX = 0;
    let mouseY = 0;
    const start_time = Date.now();

    let mergedMesh1: THREE.Mesh | null = null;
    let mergedMesh2: THREE.Mesh | null = null;
    let mergedGeo: THREE.BufferGeometry | null = null;
    let shaderMat: THREE.ShaderMaterial | null = null;
    let loadedTexture: THREE.Texture | null = null;

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

        animate();
      },
      undefined,
      (err) => {
        console.error("Failed to load /cloud10.png texture", err);
      }
    );

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

    function animate() {
      if (disposed) return;
      animId = requestAnimationFrame(animate);

      const scrollOffset = (window.scrollY || 0) * 0.8;
      const position = ((Date.now() - start_time) * 0.03 + scrollOffset) % 8000;

      camera.position.x += (mouseX - camera.position.x) * 0.01;
      camera.position.y += (-mouseY - camera.position.y) * 0.01;
      camera.position.z = -position + 8000;

      renderer.render(scene, camera);
    }

    window.addEventListener("mousemove", onDocumentMouseMove, false);
    window.addEventListener("resize", onWindowResize, false);

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
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
