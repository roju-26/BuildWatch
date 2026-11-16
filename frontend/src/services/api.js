import { API_BASE_URL, USE_MOCK } from "../config";
import { mockCases } from "../mocks/mockCases";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, options);
  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }
  return res.json();
}

// GET /reports
export async function getReports() {
  if (USE_MOCK) return mockCases;
  return request("/reports");
}

// GET /reports/{case_id}
export async function getReport(caseId) {
  if (USE_MOCK) return mockCases.find((c) => c.case_id === caseId);
  return request(`/reports/${caseId}`);
}

// POST /reports  (formData contains the image, description, latitude, longitude, public_area_type)
export async function createReport(formData) {
  if (USE_MOCK)
    return { ...mockCases[0], description: formData.get("description") };
  return request("/reports", { method: "POST", body: formData });
}
