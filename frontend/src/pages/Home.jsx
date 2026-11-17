import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReports } from "../services/api";

const STEPS = [
  {
    icon: "📷",
    title: "Capture",
    text: "Photograph debris blocking a footpath, road or drain.",
  },
  {
    icon: "📍",
    title: "Locate",
    text: "Pin the exact spot on the map in one tap.",
  },
  {
    icon: "🤖",
    title: "AI Analysis",
    text: "Debris is detected and the case is prioritised.",
  },
  {
    icon: "✅",
    title: "Track",
    text: "Follow your report from submission to resolution.",
  },
];

export default function Home() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    getReports()
      .then(setCases)
      .catch(() => setCases([]));
  }, []);

  // These numbers only count values returned by the backend.
  const total = cases.length;
  const urgent = cases.filter((c) => c.severity >= 3).length;
  const resolved = cases.filter(
    (c) => c.status === "RESOLVED" || c.status === "CLOSED",
  ).length;

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-emoji">🏗️</div>
          <div className="hero-badge">Hyper-local civic monitoring</div>
          <h1>
            Keep our public spaces <span>clear and safe</span>
          </h1>
          <p>
            Report construction debris blocking footpaths, roads and drains. Our
            AI helps prioritise every case so it gets fixed faster.
          </p>
          <div className="hero-actions">
            <Link to="/report" className="btn-hero">
              Report an obstruction
            </Link>
            <Link to="/cases" className="btn-ghost">
              View all cases
            </Link>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <div className="stat-number">{total}</div>
          <div className="stat-label">Total reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{urgent}</div>
          <div className="stat-label">High priority</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </section>

      <section className="section">
        <h2>How it works</h2>
        <p className="sub">From photo to resolution in four simple steps</p>
        <div className="steps">
          {STEPS.map((s) => (
            <div className="step" key={s.title}>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        BuildWatch is an educational prototype. Final enforcement decisions
        remain with authorised officials.
      </footer>
    </>
  );
}
