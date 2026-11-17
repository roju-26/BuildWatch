// Central place for demo data. Shape follows the shared data contract.
// [DECISION REQUIRED] detected_debris and image format are not defined yet.
// Assumed: detected_debris = array of category strings, image = URL string.
export const mockCases = [
  {
    case_id: "BW-2026-00001",
    reporter_role: "CITIZEN",
    description: "Pile of rubble blocking the footpath near the junction.",
    latitude: 12.9716,
    longitude: 77.5946,
    public_area_type: "FOOTPATH",
    image: "https://placehold.co/600x400?text=Rubble",
    detected_debris: ["RUBBLE"],
    severity: 2,
    status: "REPORTED",
    created_at: "2026-11-10T09:30:00Z",
    updated_at: "2026-11-10T09:30:00Z",
  },
  {
    case_id: "BW-2026-00002",
    reporter_role: "FIELD_WORKER",
    description: "Metal rods lying on the road.",
    latitude: 12.9352,
    longitude: 77.6245,
    public_area_type: "ROAD",
    image: "https://placehold.co/600x400?text=Metal+Rods",
    detected_debris: ["METAL_RODS"],
    severity: 3,
    status: "UNDER_REVIEW",
    created_at: "2026-11-12T14:10:00Z",
    updated_at: "2026-11-13T08:00:00Z",
  },
  {
    case_id: "BW-2026-00003",
    reporter_role: "CITIZEN",
    description: "Sand pile partly covering a roadside drain.",
    latitude: 12.9507,
    longitude: 77.5848,
    public_area_type: "DRAIN",
    image: "https://placehold.co/600x400?text=Sand",
    detected_debris: ["SAND"],
    severity: 4,
    status: "ASSIGNED",
    created_at: "2026-11-14T07:45:00Z",
    updated_at: "2026-11-15T10:20:00Z",
  },
];

// [DECISION REQUIRED] The history response format is not defined yet.
// Assumed: array of { status, changed_at, note }. Confirm with Member 2.
export const mockHistory = {
  "BW-2026-00001": [
    {
      status: "REPORTED",
      changed_at: "2026-11-10T09:30:00Z",
      note: "Report submitted",
    },
  ],
  "BW-2026-00002": [
    {
      status: "REPORTED",
      changed_at: "2026-11-12T14:10:00Z",
      note: "Report submitted",
    },
    {
      status: "UNDER_REVIEW",
      changed_at: "2026-11-13T08:00:00Z",
      note: "Admin started review",
    },
  ],
  "BW-2026-00003": [
    {
      status: "REPORTED",
      changed_at: "2026-11-14T07:45:00Z",
      note: "Report submitted",
    },
    {
      status: "UNDER_REVIEW",
      changed_at: "2026-11-14T12:00:00Z",
      note: "Admin started review",
    },
    {
      status: "ASSIGNED",
      changed_at: "2026-11-15T10:20:00Z",
      note: "Assigned to field team",
    },
  ],
};
