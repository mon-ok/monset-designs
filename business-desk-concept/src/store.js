import { create } from "zustand";

// Discrete UI state only (things React needs to re-render on). Continuous
// per-frame values (scroll progress, camera poses) live in rig.js so they can
// update every frame without triggering React renders.
export const useStore = create((set) => ({
  loaded: false, // glb + first frame ready
  posesReady: false, // bounding boxes measured, camera poses computed
  docked: false, // intro finished, we're parked at the monitor
  activeSection: null, // null | 0 | 1 | 2

  setLoaded: (v) => set({ loaded: v }),
  setPosesReady: (v) => set({ posesReady: v }),
  setDocked: (v) => set((s) => (s.docked === v ? s : { docked: v })),
  setActiveSection: (i) => set({ activeSection: i }),
}));
