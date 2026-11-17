import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReports, updateReportStatus, verifyReport } from "../services/api";
import { CASE_STATUSES } from "../constants";
import { StatusBadge, SeverityBadge } from "../components/Badge";

// Next step in the official status flow. The backend still validates the change.
function nextStatus(status) {
  const i = CASE_STATUSES.indexOf(status);
  return i >= 0 && i < CASE_STATUSES.length - 1 ? CASE_STATUSES[i + 1] : null;
}

export default function AdminDashboard() {
  // [DECISION REQUIRED] No login yet. Anyone can open /admin in this prototype.
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  function load() {
    return getReports()
      .then(setCases)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function runAction(caseId, action) {
    setError("");
    setBusyId(caseId);
    try {
      await action();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  const sorted = [...cases].sort((a, b) => b.severity - a.severity);

  const open = cases.filter(
    (c) => c.status !== "RESOLVED" && c.status !== "CLOSED",
  ).length;
  const critical = cases.filter((c) => c.severity === 4).length;
  const pending = cases.filter(
    (c) => c.status === "VERIFICATION_PENDING",
  ).length;

  return (
    <div>
      <h2 className="page-title">Admin Dashboard</h2>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{cases.length}</div>
          <div className="stat-label">Total cases</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{open}</div>
          <div className="stat-label">Open</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{critical}</div>
          <div className="stat-label">Critical</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{pending}</div>
          <div className="stat-label">To verify</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Cases by priority</h3>

        {loading && <p>Loading cases...</p>}
        {error && <div className="alert-error">{error}</div>}

        {sorted.map((c) => {
          const next = nextStatus(c.status);
          const busy = busyId === c.case_id;
          return (
            <div className="admin-row" key={c.case_id}>
              <div className="admin-main">
                <Link to={`/cases/${c.case_id}`}>
                  <strong>{c.case_id}</strong>
                </Link>
                <p>{c.description}</p>
                <div className="badges">
                  <StatusBadge status={c.status} />
                  <SeverityBadge severity={c.severity} />
                  <span className="badge area">{c.public_area_type}</span>
                </div>
              </div>

              <div className="admin-actions">
                {c.status === "VERIFICATION_PENDING" ? (
                  <button
                    className="btn btn-success"
                    disabled={busy}
                    onClick={() =>
                      runAction(c.case_id, () => verifyReport(c.case_id, true))
                    }
                  >
                    {busy ? "..." : "Verify & resolve"}
                  </button>
                ) : next ? (
                  <button
                    className="btn btn-secondary"
                    disabled={busy}
                    onClick={() =>
                      runAction(c.case_id, () =>
                        updateReportStatus(c.case_id, next),
                      )
                    }
                  >
                    {busy ? "..." : `Move to ${next.replaceAll("_", " ")}`}
                  </button>
                ) : (
                  <span className="done-text">Completed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
