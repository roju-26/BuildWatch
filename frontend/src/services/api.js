import { API_BASE_URL, USE_MOCK } from "../config";
import { mockCases, mockHistory } from "../mocks/mockCases";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, options);
  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }
  return res.json();
}

function sendJson(path, method, body) {
  return request(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Mock helper: changes a case in memory and adds a history entry.
// Resets when you refresh the page.
function mockChangeStatus(caseId, status, note) {
  const found = mockCases.find((c) => c.case_id === caseId);
  if (!found) throw new Error("Case not found");
  const now = new Date().toISOString();
  found.status = status;
  found.updated_at = now;
  if (!mockHistory[caseId]) mockHistory[caseId] = [];
  mockHistory[caseId].push({ status, changed_at: now, note });
  return found;
}

// GET /reports
export async function getReports() {
  if (USE_MOCK) return [...mockCases];
  return request("/reports");
}

// GET /reports/{case_id}
export async function getReport(caseId) {
  if (USE_MOCK) return mockCases.find((c) => c.case_id === caseId);
  return request(`/reports/${caseId}`);
}

// POST /reports  (FormData: image, description, latitude, longitude, public_area_type, reporter_role)
export async function createReport(formData) {
  if (USE_MOCK)
    return { ...mockCases[0], description: formData.get("description") };
  return request("/reports", { method: "POST", body: formData });
}

// GET /reports/{case_id}/history
export async function getReportHistory(caseId) {
  if (USE_MOCK) return mockHistory[caseId] || [];
  return request(`/reports/${caseId}/history`);
}

// PUT /reports/{case_id}/status
// [DECISION REQUIRED] Assumed body: { status, note }
export async function updateReportStatus(caseId, status, note = "") {
  if (USE_MOCK) return mockChangeStatus(caseId, status, note);
  return sendJson(`/reports/${caseId}/status`, "PUT", { status, note });
}

// POST /reports/{case_id}/verify
// [DECISION REQUIRED] Assumed body: { verified, note }
export async function verifyReport(caseId, verified = true, note = "") {
  if (USE_MOCK) {
    return mockChangeStatus(
      caseId,
      "RESOLVED",
      note || "Verified by administrator",
    );
  }
  return sendJson(`/reports/${caseId}/verify`, "POST", { verified, note });
}

// GET /dashboard/hotspots
// [DECISION REQUIRED] Assumed response: array of
// { latitude, longitude, case_count, max_severity }
export async function getHotspots() {
  if (USE_MOCK) {
    return mockCases.map((c) => ({
      latitude: c.latitude,
      longitude: c.longitude,
      case_count: 1,
      max_severity: c.severity,
    }));
  }
  return request("/dashboard/hotspots");
}
