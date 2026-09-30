import { useEffect, useState } from "react";

const RADIUS = 76;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProbabilityGauge({ probability }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    // Animate number
    let start = 0;
    const target = Math.round(probability * 100);
    const duration = 700;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setDisplayed(target);
        clearInterval(timer);
      } else {
        setDisplayed(Math.round(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [probability]);

  const pct = probability;
  const offset = CIRCUMFERENCE * (1 - pct);

  const color =
    pct >= 0.7
      ? "#ef4444"
      : pct >= 0.5
      ? "#f59e0b"
      : "#10b981";

  return (
    <div className="gauge-container">
      <svg
        className="gauge-svg"
        width="180"
        height="180"
        viewBox="0 0 180 180"
      >
        <circle
          className="gauge-track"
          cx="90"
          cy="90"
          r={RADIUS}
        />
        <circle
          className="gauge-fill"
          cx="90"
          cy="90"
          r={RADIUS}
          stroke={color}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-center">
        <span className="gauge-value" style={{ color }}>
          {displayed}
        </span>
        <span className="gauge-unit">% risk</span>
      </div>
    </div>
  );
}
