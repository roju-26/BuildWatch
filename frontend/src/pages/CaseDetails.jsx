import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getReport, getReportHistory } from "../services/api";
import { StatusBadge, SeverityBadge } from "../components/Badge";
import LocationPicker from "../components/LocationPicker";

function formatDate(value) {
  return new Date(value).toLocaleString();
}

export default function CaseDetails() {
  const { caseId } = useParams();
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getReport(caseId), getReportHistory(caseId)])
      .then(([r, h]) => {
        setReport(r);
        setHistory(h);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [caseId]);

  if (loading) return <div className="card">Loading...</div>;
  if (error)
    return (
      <div className="card">
        <div className="alert-error">{error}</div>
      </div>
    );
  if (!report) return <div className="card">Case not found.</div>;

  return (
    <div className="card">
      <Link to="/cases" className="back-link">
        ← Back to cases
      </Link>
      <h2>{report.case_id}</h2>

      <div className="badges">
        <StatusBadge status={report.status} />
        <SeverityBadge severity={report.severity} />
        <span className="badge area">{report.public_area_type}</span>
      </div>

      <img className="preview" src={report.image} alt="Obstruction" />

      <p>{report.description}</p>

      <div className="detail-grid">
        <div>
          <span className="label">Debris detected</span>
          {report.detected_debris.join(", ")}
        </div>
        <div>
          <span className="label">Reported by</span>
          {report.reporter_role}
        </div>
        <div>
          <span className="label">Created</span>
          {formatDate(report.created_at)}
        </div>
        <div>
          <span className="label">Last updated</span>
          {formatDate(report.updated_at)}
        </div>
      </div>

      <span className="label">Location</span>
      <div className="map-wrap">
        <LocationPicker
          latitude={report.latitude}
          longitude={report.longitude}
          onPick={() => {}}
        />
      </div>

      <h3>Status history</h3>
      <ul className="timeline">
        {history.map((h, i) => (
          <li key={i}>
            <StatusBadge status={h.status} />
            <span className="time">{formatDate(h.changed_at)}</span>
            {h.note && <p>{h.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
