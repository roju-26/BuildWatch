import { SEVERITY_LABELS } from "../constants";

export function StatusBadge({ status }) {
  return (
    <span className={`badge status-${status}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

// Severity comes from the backend. The frontend only displays it.
export function SeverityBadge({ severity }) {
  return (
    <span className={`badge severity-${severity}`}>
      {SEVERITY_LABELS[severity] || "UNKNOWN"}
    </span>
  );
}
