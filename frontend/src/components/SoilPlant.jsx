import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// The 3D wheat in its soil profile. Loaded only on wide screens with WebGL and motion
// allowed; everywhere else the season's photograph carries the hero on its own.
function canRun() {
  if (typeof window === "undefined") return false;
  if (!window.matchMedia("(min-width: 60rem)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function SoilPlant({ month, pointerTarget }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const [enabled] = useState(canRun);
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;
    import("../three/wheatScene").then(({ createWheatScene }) => {
      if (cancelled || !canvasRef.current) return;
      sceneRef.current = createWheatScene(canvasRef.current, { month });
      setReady(true);
    });
    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [enabled, month]);

  useEffect(() => {
    const el = pointerTarget?.current;
    if (!enabled || !el) return undefined;
    const onMove = (event) => {
      const box = el.getBoundingClientRect();
      sceneRef.current?.setPointer(((event.clientX - box.left) / box.width) * 2 - 1, ((event.clientY - box.top) / box.height) * 2 - 1);
    };
    const onLeave = () => sceneRef.current?.setPointer(0, 0);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, pointerTarget]);

  if (!enabled) return null;

  return (
    <div className={`soilplant ${ready ? "is-ready" : ""}`}>
      <canvas
        ref={canvasRef}
        className="soilplant__canvas"
        role="img"
        aria-label="Diagram of a wheat crop rooted in three soil layers, topsoil, subsoil and parent rock, with a ring of the twelve months and this month lit"
      />
      <button
        type="button"
        className="soilplant__toggle"
        onClick={() => {
          const next = !running;
          setRunning(next);
          sceneRef.current?.setRunning(next);
        }}
        aria-pressed={!running}
      >
        {running ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
        {running ? "Pause motion" : "Play motion"}
      </button>
    </div>
  );
}

export default SoilPlant;
