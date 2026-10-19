import { useCallback, useEffect, useState } from "react";
import { scrollToEl, startSmoothScroll } from "./lib/scroll.js";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import ElevationRuler from "./components/ElevationRuler.jsx";
import Problems from "./components/Problems.jsx";
import Method from "./components/Method.jsx";
import Fixes from "./components/Fixes.jsx";
import Questions from "./components/Questions.jsx";
import Start from "./components/Start.jsx";
import Work from "./components/Work.jsx";
import Assessment from "./components/Assessment.jsx";
import Footer from "./components/Footer.jsx";
import SurveyLoader from "./components/loaders/SurveyLoader.jsx";
import StrokesLoader from "./components/loaders/StrokesLoader.jsx";

// Two loaders to compare: "survey" (#1, the survey sets up) and "strokes" (#3, two strokes, one mountain).
// Change LOADER to switch. Adding ?loader=survey or ?loader=strokes to the address picks one and
// replays it on every reload, for side-by-side checks.
const LOADER = "strokes";
const LOADERS = { survey: SurveyLoader, strokes: StrokesLoader };
const forced = new URLSearchParams(window.location.search).get("loader");
const Loader = LOADERS[forced] ?? LOADERS[LOADER];

// the loader plays once per visit; returning in the same session goes straight to the page
const seen = () => {
  if (forced in LOADERS) return false;
  try {
    return sessionStorage.getItem("monset-loaded") === "1";
  } catch {
    return false;
  }
};

export default function App() {
  // which route the visitor picked in the hero; Problems and Start speak to that audience
  const [track, setTrack] = useState("established");
  const [picked, setPicked] = useState(false);
  const [ready, setReady] = useState(seen); // hero intro may start
  const [loading, setLoading] = useState(() => !seen());
  const reveal = useCallback(() => {
    setReady(true);
    try {
      sessionStorage.setItem("monset-loaded", "1");
    } catch {}
  }, []);
  const done = useCallback(() => setLoading(false), []);

  useEffect(startSmoothScroll, []);

  function pickRoute(id) {
    setTrack(id);
    setPicked(true);
    scrollToEl(document.getElementById("problems"));
  }

  return (
    <>
      {loading && <Loader onReveal={reveal} onDone={done} />}
      <ElevationRuler />
      <Nav />
      <main className="lg:pl-16">
        <Hero track={track} picked={picked} onPick={pickRoute} ready={ready} />
        <Problems track={track} onTrack={setTrack} />
        <Method />
        <Fixes />
        <Questions />
        <Start track={track} onTrack={setTrack} />
        <Work />
        <Assessment />
      </main>
      <div className="lg:pl-16">
        <Footer />
      </div>
    </>
  );
}
