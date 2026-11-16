export const ROLES = {
  CITIZEN: "CITIZEN",
  FIELD_WORKER: "FIELD_WORKER",
  ADMINISTRATOR: "ADMINISTRATOR",
};

export const DEBRIS_CATEGORIES = [
  "RUBBLE",
  "SAND",
  "BRICKS",
  "CEMENT_BAGS",
  "METAL_RODS",
];

export const PUBLIC_AREA_TYPES = ["FOOTPATH", "ROAD", "DRAIN"];

export const CASE_STATUSES = [
  "REPORTED",
  "UNDER_REVIEW",
  "ASSIGNED",
  "IN_PROGRESS",
  "VERIFICATION_PENDING",
  "RESOLVED",
  "CLOSED",
];

// Display labels only. The backend calculates severity.
export const SEVERITY_LABELS = {
  1: "LOW",
  2: "MEDIUM",
  3: "HIGH",
  4: "CRITICAL",
};
