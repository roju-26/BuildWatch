import { API_BASE_URL, USE_MOCK } from "../config";
import { mockCases, mockHistory, mockFollowUps } from "../mocks/mockCases";

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
// [DECISION REQUIRED] Assumed: the response also contains follow_ups (see submitFollowUp).
export async function getReport(caseId) {
  if (USE_MOCK) {
    const found = mockCases.find((c) => c.case_id === caseId);
    return found
      ? { ...found, follow_ups: mockFollowUps[caseId] || [] }
      : undefined;
  }
  return request(`/reports/${caseId}`);
}

// POST /reports  (FormData: image, description, latitude, longitude, public_area_type, reporter_role)
export async function createReport(formData) {
  if (USE_MOCK) {
    // MOCK ONLY: this stands in for the backend. In the real system, only the
    // backend generates case IDs, severity and detected debris.
    const now = new Date().toISOString();
    const newCase = {
      case_id: `BW-2026-${String(mockCases.length + 1).padStart(5, "0")}`,
      reporter_role: formData.get("reporter_role"),
      description: formData.get("description"),
      latitude: parseFloat(formData.get("latitude")),
      longitude: parseFloat(formData.get("longitude")),
      public_area_type: formData.get("public_area_type"),
      image: URL.createObjectURL(formData.get("image")),
      detected_debris: [], // the AI module has not analysed it yet
      severity: 1, // placeholder: the backend calculates the real severity
      status: "REPORTED",
      created_at: now,
      updated_at: now,
    };
    mockCases.push(newCase);
    mockHistory[newCase.case_id] = [
      { status: "REPORTED", changed_at: now, note: "Report submitted" },
    ];
    return newCase;
  }
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

// POST /reports/{case_id}/follow-up   (FormData: image, note)
// [DECISION REQUIRED] Assumed response: the new follow-up object
// { image, created_at, note, removal_status, image_similarity }
// removal_status is REMAINS, EXPANDED or REMOVED (an AI suggestion, not a final decision).
// The field names removal_status and image_similarity come from the AI result contract.
export async function submitFollowUp(caseId, formData) {
  if (USE_MOCK) {
    const file = formData.get("image");
    const followUp = {
      image: URL.createObjectURL(file),
      created_at: new Date().toISOString(),
      note: formData.get("note") || "",
      // Fixed demo values only. These are NOT real AI results.
      removal_status: "REMAINS",
      image_similarity: 0.82,
    };
    if (!mockFollowUps[caseId]) mockFollowUps[caseId] = [];
    mockFollowUps[caseId].push(followUp);
    return followUp;
  }
  return request(`/reports/${caseId}/follow-up`, {
    method: "POST",
    body: formData,
  });
}
