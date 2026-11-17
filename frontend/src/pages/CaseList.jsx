import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReports } from "../services/api";
import { CASE_STATUSES } from "../constants";
import { StatusBadge, SeverityBadge } from "../components/Badge";

export default function CaseList() {
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getReports()
      .then(setCases)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const visible =
    filter === "ALL" ? cases : cases.filter((c) => c.status === filter);

  return (
    <div className="card">
      <h2>All Cases</h2>

      <div className="field">
        <label>Filter by status</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All</option>
          {CASE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading cases...</p>}
      {error && <div className="alert-error">{error}</div>}
      {!loading && !error && visible.length === 0 && <p>No cases found.</p>}

      {visible.map((c) => (
        <Link to={`/cases/${c.case_id}`} key={c.case_id} className="case-item">
          <img src={c.image} alt="" className="case-thumb" />
          <div className="case-info">
            <strong>{c.case_id}</strong>
            <p>{c.description}</p>
            <div className="badges">
              <StatusBadge status={c.status} />
              <SeverityBadge severity={c.severity} />
              <span className="badge area">{c.public_area_type}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
