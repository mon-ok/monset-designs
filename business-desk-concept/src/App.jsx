import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { CONFIG } from "./config.js";
import { scroll } from "./rig.js";
import { useStore } from "./store.js";
import Experience from "./components/Experience.jsx";
import Hero from "./components/Hero.jsx";
import Loader from "./components/Loader.jsx";

export default function App() {
  const spacerRef = useRef(null);
  const activeSection = useStore((s) => s.activeSection);

  // Window scroll -> normalized progress (0..1). Smoothing happens per-frame in
  // the Ticker (rig.scroll.smooth); here we only set the raw target.
  useEffect(() => {
    const maxScroll = () =>
      Math.max(1, (spacerRef.current?.offsetHeight || 0) - window.innerHeight);
    const onScroll = () => {
      scroll.target = Math.min(1, Math.max(0, window.scrollY / maxScroll()));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Lock page scroll while a tech panel is open, so the only way back to the
  // monitor is the panel's close control (keeps the camera parked).
  useEffect(() => {
    document.body.classList.toggle("locked", activeSection !== null);
  }, [activeSection]);

  const scrollToMonitor = () =>
    window.scrollTo({
      top: (spacerRef.current?.offsetHeight || 0) - window.innerHeight,
      behavior: "smooth",
    });

  return (
    <>
      <div className="bg" />

      <div className="canvas-fixed">
        <Canvas
          camera={{
            fov: CONFIG.camera.fov,
            near: CONFIG.camera.near,
            far: CONFIG.camera.far,
            position: [0, 1.4, -3],
          }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 2]}
        >
          <Experience />
        </Canvas>
      </div>

      {/* Gives the document its scroll range; invisible + non-interactive. */}
      <div
        ref={spacerRef}
        className="scroll-length"
        style={{ height: `${CONFIG.scrollLengthVh}vh` }}
      />

      <Hero onStart={scrollToMonitor} />
      <Loader />
    </>
  );
}
