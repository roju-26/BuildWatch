import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getHotspots } from "../services/api";
import { DEFAULT_MAP_CENTER } from "../config";
import { SEVERITY_LABELS } from "../constants";

const SEVERITY_COLORS = {
  1: "#16a34a",
  2: "#eab308",
  3: "#f97316",
  4: "#dc2626",
};

export default function Hotspots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getHotspots()
      .then(setSpots)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card">
      <h2>Hotspot Map</h2>
      <p className="sub-text">
        Larger circles mean more cases. Colour shows the highest severity.
      </p>

      {loading && <p>Loading map data...</p>}
      {error && <div className="alert-error">{error}</div>}

      <div className="legend">
        {Object.entries(SEVERITY_LABELS).map(([level, label]) => (
          <span key={level}>
            <i style={{ background: SEVERITY_COLORS[level] }} /> {label}
          </span>
        ))}
      </div>

      <div className="map-wrap">
        <MapContainer
          center={DEFAULT_MAP_CENTER}
          zoom={12}
          style={{ height: "420px", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {spots.map((s, i) => (
            <CircleMarker
              key={i}
              center={[s.latitude, s.longitude]}
              radius={10 + s.case_count * 4}
              pathOptions={{
                color: SEVERITY_COLORS[s.max_severity],
                fillColor: SEVERITY_COLORS[s.max_severity],
                fillOpacity: 0.5,
              }}
            >
              <Popup>
                <b>{s.case_count}</b> case(s)
                <br />
                Highest severity: {SEVERITY_LABELS[s.max_severity]}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
