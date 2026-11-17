import { useState } from "react";
import { downloadEvidenceReport } from "../services/api";

export default function EvidenceReportButton({ caseId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    try {
      setLoading(true);
      await downloadEvidenceReport(caseId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="evidence-box">
      <h3>Evidence report</h3>
      <p className="sub-text">
        This case is closed. Download the evidence report with the photos,
        location and full status history.
      </p>
      <button
        className="btn btn-primary"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Preparing report..." : "📄 Download evidence report"}
      </button>
      {error && (
        <div className="alert-error" style={{ marginTop: 12 }}>
          {error}
        </div>
      )}
    </div>
  );
}
